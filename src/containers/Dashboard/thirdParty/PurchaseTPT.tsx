import { useState, useEffect } from 'react'
import DataTable from '../../../components/Dashboard/DataTable';
import { formatToEth } from '../../../utils/function/format';
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import StateProduct from '../../../utils/data/statesProduct';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { ethers } from 'ethers';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading';
import SellProductModal from '../../../components/Dashboard/thirdparty/SellProductModal';
import { column1, column2 } from '../../../utils/data/colums';
import { useSelector } from 'react-redux';

const nodata_img = require('../../../utils/images/no-data.jpg');

const PurchaseTPT = () => {

   const web3Provider: ethers.providers.Web3Provider = useOutletContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const [activeTab, setActiveTab] = useState("purchase");

   const [productsShip, setProductsShip] = useState<any>([]);
   const [productsReceive, setProductsReceive] = useState<any>([]);
   const [products, setProducts] = useState<any>([]);
   const [longitude, setLongitude] = useState('');
   const [latitude, setLatitude] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [uid, setUid] = useState(0);

   const getProductsShipByFarmer = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ShippedByFarmer && data.thirdPartyDetails
            .thirdParty === currentUser?.addressWallet));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsShip(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsReceived = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ReceivedByThirdParty && data.thirdPartyDetails
            .thirdParty === currentUser?.addressWallet));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProductsReceive(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.SoldByThirdParty && data.thirdPartyDetails
            .thirdParty === currentUser?.addressWallet));
         const listProducts = [];
         for (let i = 0; i < productFilted.length; i++) {
            listProducts.push(convertObjectProduct(productFilted[i]));
         }
         setProducts(listProducts.reverse());
      } catch (error) {
         console.log(error);
      }
   }

   const convertObjectProduct = (data: any) => {
      return {
         uid: data.uid.toNumber(),
         productState: data.productState,
         name: data.productDetails.name,
         code: data.productDetails.code,
         price: formatToEth(data.productDetails.price),
         priceTPT: formatToEth(data.productDetails.priceThirdParty),
         category: data.productDetails.category,
         images: data.productDetails.images,
         description: data.productDetails.description,
         quantity: data.productDetails.quantity.toNumber(),
         temp: data.productDetails.temp,
         humidity: data.productDetails.humidity,
         date: data.productDetails.date.toNumber()
      }
   }

   useEffect(() => {
      if (currentUser?.addressWallet) {
         getProductsShipByFarmer();
         getProductsReceived();
         getProducts();
      }
   }, [currentUser?.addressWallet]);

   useEffect(() => {
      getLocation();
   }, [])

   const getLocation = () => {
      navigator.geolocation.getCurrentPosition(function (position) {
         setLongitude(position.coords.longitude.toString());
         setLatitude(position.coords.latitude.toString());
      },
         (error: any) => {
            // Xử lý khi người dùng không cho phép truy cập vị trí hoặc có lỗi khác xảy ra
            switch (error.code) {
               case error.PERMISSION_DENIED:
                  Swal.fire('Opps!', 'Vui lòng thêm quyền truy cập vị trí', 'error');
                  break;
            }
         })
   }

   const actionReceive = [
      {
         field: 'action',
         headerName: 'Thao tác',
         width: 95,
         renderCell: (params: any) => (
            <button onClick={() => handleConfirm(params.row.uid)} className='bg-bg-green text-white rounded-md py-1 px-2'>
               Nhận hàng
            </button>
         )
      }
   ]

   const handleConfirm = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      try {
         setIsLoading(true);
         const supplychainContract = new SupplyChainContract(web3Provider);
         await supplychainContract.receiveByThirdParty(uid, longitude, latitude);
         setTimeout(() => {
            getProductsShipByFarmer();
            getProductsReceived();
         }, 3000)
         setIsLoading(false);
      } catch (error) {
         setIsLoading(false);
         console.log(error);
      }
   }

   const handlePostSell = async (uid: number) => {
      if (!web3Provider) {
         Swal.fire('Opps', 'Vui lòng kết nối với ví', 'error');
         return;
      }
      setIsOpenModal(true);
      setUid(uid);
   }

   const actionWarehouse = [
      {
         field: 'action',
         headerName: 'Thao tác',
         width: 95,
         renderCell: (params: any) => (
            <button onClick={() => handlePostSell(params.row.uid)} className='bg-bg-green text-white rounded-md py-1 px-2'>
               Đăng bán
            </button>
         )
      }
   ]

   const data = [
      {
         label: `Đơn hàng đang giao (${productsShip.length})`,
         value: "purchase",
         desc: productsShip.length > 0 ?
            <DataTable columns={column1.concat(actionReceive)} rows={productsShip} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Kho hàng (${productsReceive.length})`,
         value: "warehouse",
         desc: productsReceive.length > 0 ?
            <DataTable columns={column1.concat(actionWarehouse)} rows={productsReceive} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
      {
         label: `Sản phẩm (${products.length})`,
         value: "products",
         desc: products.length > 0 ?
            <DataTable columns={column2} rows={products} /> :
            <div className='flex flex-col gap-3 items-center justify-center mt-10'>
               <img src={nodata_img} alt='' />
               Không có dữ liệu nào!
            </div>
      },
   ]

   return (
      <div className='w-auto bg-white mx-5 px-5 py-2 mt-8 rounded-lg'>
         {isLoading && <Loading />}
         {isOpenModal && <SellProductModal setIsOpenModal={setIsOpenModal} uid={uid} getProductsReceived={getProductsReceived} getProducts={getProducts} />}
         <Tabs value={activeTab}>
            <TabsHeader
               className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
               indicatorProps={{ className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none" }}>
               {data.map(({ label, value }) => (
                  <Tab key={value} value={value} onClick={() => setActiveTab(value)} className={activeTab === value ? "text-gray-900 border-b-2 border-green-600" : ""}>
                     {label}
                  </Tab>
               ))}
            </TabsHeader>
            <TabsBody>
               {data.map(({ value, desc }) => (
                  <TabPanel key={value} value={value}>
                     {desc}
                  </TabPanel>
               ))}
            </TabsBody>
         </Tabs>
      </div>
   );
}

export default PurchaseTPT