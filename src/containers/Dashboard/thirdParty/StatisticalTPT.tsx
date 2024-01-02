import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment'
import 'moment/locale/vi'
import { apiGetStatistical } from '../../../services/statistical';
import { BsBoxSeam } from 'react-icons/bs';
import { FiBarChart } from 'react-icons/fi';
import { HiOutlineRefresh } from 'react-icons/hi'
import SupplyChainContract from '../../../contracts/SupplyChainContract';
import StateProduct from '../../../utils/data/statesProduct';
import { useSelector } from 'react-redux';

const StatisticalTPT = () => {

   const [statistical, setStatistical] = useState<any>([]);
   const { currentUser } = useSelector((state: any) => state.user);
   const [products, setProductsLength] = useState(0);
   const [productsReceive, setProductsReceive] = useState(0);
   const [productsOrdered, setProductsOrdered] = useState(0);

   const getStatistical = async () => {
      try {
         const response = await apiGetStatistical();
         setStatistical(response.data.data);
      } catch (error) {
         console.log(error)
      }
   }

   const data = [
      { name: 'Thứ 2', revenue: 0, spend: 0 },
      { name: 'Thứ 3', revenue: 0, spend: 0 },
      { name: 'Thứ 4', revenue: 0, spend: 0 },
      { name: 'Thứ 5', revenue: 0, spend: 0 },
      { name: 'Thứ 6', revenue: 0, spend: 0 },
      { name: 'Thứ 7', revenue: 0, spend: 0 },
      { name: 'Chủ nhật', revenue: 0, spend: 0 },
   ];

   for (let i = 0; i < statistical.length; i++) {
      if ((moment(statistical[i].dateOfWeek).day() + 1) === 2) {
         data[0].revenue += statistical[i].revenue;
         data[0].spend += statistical[i].spend;
      } else if ((moment(statistical[i].dateOfWeek).day() + 1) === 3) {
         data[1].revenue += statistical[i].revenue;
         data[1].spend += statistical[i].spend;
      } else if ((moment(statistical[i].dateOfWeek).day() + 1) === 4) {
         data[2].revenue += statistical[i].revenue;
         data[2].spend += statistical[i].spend;
      } else if ((moment(statistical[i].dateOfWeek).day() + 1) === 5) {
         data[3].revenue += statistical[i].revenue;
         data[3].spend += statistical[i].spend;
      } else if ((moment(statistical[i].dateOfWeek).day() + 1) === 6) {
         data[4].revenue += statistical[i].revenue;
         data[4].spend += statistical[i].spend;
      } else if ((moment(statistical[i].dateOfWeek).day() + 1) === 7) {
         data[5].revenue += statistical[i].revenue;
         data[5].spend += statistical[i].spend;
      } else if ((moment(statistical[i].dateOfWeek).day() + 1) === 1) {
         data[6].revenue += statistical[i].revenue;
         data[6].spend += statistical[i].spend;
      }
   }

   let totalRevenue = data.reduce(function (element: any, currentValue: any) {
      return element + currentValue.revenue;
   }, 0);

   let totalSpend = data.reduce(function (element: any, currentValue: any) {
      return element + currentValue.spend;
   }, 0);

   const getProducts = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.SoldByThirdParty && data.thirdPartyDetails
            .thirdPartyCode === currentUser?.code));
         setProductsLength(productFilted.length);
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsReceived = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.ReceivedByThirdParty && data.thirdPartyDetails
            .thirdPartyCode === currentUser?.code));
         setProductsReceive(productFilted.length);
      } catch (error) {
         console.log(error);
      }
   }

   const getProductsOrdered = async () => {
      try {
         const supplychainContract = new SupplyChainContract();
         const response = await supplychainContract.getProducts();
         const productFilted = response.filter((data: any) => (data.productState === StateProduct.PurchasedByCustomer && data.thirdPartyDetails
            .thirdParty === currentUser?.addressWallet));
         setProductsOrdered(productFilted.length);
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      if (currentUser?.code) {
         getProducts(); // product
         getProductsReceived(); // warehouse
         getProductsOrdered(); // ordered
         getStatistical();
      }
   }, [currentUser?.code]);

   return (
      <div className='w-auto mx-5 px-5 py-2 mt-8 rounded-lg'>
         <div className='flex items-center gap-5 ml-5'>
            <div className='flex flex-col gap-1.5 bg-white w-56 px-6 py-4 rounded-lg'>
               <div className='bg-[#FEC90F] p-4 rounded-full mx-auto ml-auto'><BsBoxSeam color='white' className='p-0.5' size={30} /></div>
               <span className='text-333 font-bold text-xl'>{products}</span>
               <span className='text-444'>Sản phẩm</span>
            </div>
            <div className='flex flex-col gap-1.5 bg-white w-56 px-6 py-4 rounded-lg'>
               <div className='bg-[#FFF4E5] p-4 rounded-full mx-auto ml-auto'><FiBarChart color='#E46A76' className='p-0.5' size={30} /></div>
               <span className='text-333 font-bold text-xl'>{productsReceive}</span>
               <span className='text-444'>Sản phẩm trong kho</span>
            </div>
            <div className='flex flex-col gap-1.5 bg-white w-56 px-6 py-4 rounded-lg'>
               <div className='bg-[#EBFAF2] p-4 rounded-full mx-auto ml-auto'><HiOutlineRefresh color='#00C292' className='p-0.5' size={30} /></div>
               <span className='text-333 font-bold text-xl'>{productsOrdered}</span>
               <span className='text-444'>Đơn đặt hàng</span>
            </div>
         </div>
         <div className='flex gap-3 mt-8 pt-5 pb-3 px-5 bg-white'>
            <div className='flex flex-col gap-4 mt-3 border-r pr-12 border-color'>
               <div className='flex flex-col gap-1'>
                  <span className='text-333 font-bold text-3xl'>${totalSpend} <span className='text-666 text-sm'>AGT</span></span>
                  <span className='text-666'>Tổng Chi</span>
               </div>
               <div className='flex flex-col gap-1'>
                  <span className='text-333 font-bold text-3xl'>${totalRevenue} <span className='text-666 text-sm'>AGT</span></span>
                  <span className='text-666'>Tổng Doanh thu</span>
               </div>
               <button className='bg-bg-green text-white rounded-lg py-3 px-5 mt-5'>Tải xuống Báo cáo</button>
            </div>
            <LineChart
               width={800}
               height={400}
               data={data}
               margin={{ top: 10, right: 10, left: 5, bottom: 5, }}
            >
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="name" />
               <YAxis />
               <Tooltip />
               <Legend />
               <Line type="monotone" dataKey="spend" stroke="#8884d8" activeDot={{ r: 8 }} />
               <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
         </div>
      </div>
   )
}

export default StatisticalTPT