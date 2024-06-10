import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LiaGripfire } from "react-icons/lia";
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { sideBarAdmin, sideBarDeliveryHub, sideBarFarmer, sideBarThirdParty } from '../../utils/data/sideBar';
import { useStateContext } from '../../contexts/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { resetAuth } from '../../features/authSlice';
import { resetCurrentUser } from '../../features/userSlice';
import roles from '../../utils/data/roles';

const SideBar = () => {

   const { activeMenu, setActiveMenu, screenSize, currentColor } = useStateContext();
   const { currentUser } = useSelector((state: any) => state.user);

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleCloseSidebar = () => {
      if (activeMenu && screenSize! <= 900) {
         setActiveMenu(false)
      }
   }

   const logOut = async () => {
      dispatch(resetAuth());
      dispatch(resetCurrentUser());
      localStorage.removeItem('supplychain_address');
      navigate('/');
   }

   const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
   const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-light-gray m-2';

   return (
      <div className='ml-3 overflow-auto h-screen md:overflow-hidden md:hover:overflow-auto pb-10 '>
         {activeMenu &&
            <>
               <div className='flex justify-between items-center'>
                  <Link to='/dashboard' onClick={handleCloseSidebar} className='items-center gap-2 ml-3 mt-4 flex'>
                     <LiaGripfire size={38} className='text-green' /><span className='text-primary text-xl font-bold'>Agrichain</span>
                  </Link>
                  <TooltipComponent content='Menu' position='BottomCenter'>
                     <button type='button' onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
                        className='text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden'>
                        <MdOutlineCancel />
                     </button>
                  </TooltipComponent>
               </div>
               <div className='mt-10'>
                  {currentUser?.role === roles[roles.admin] &&
                     <>
                        {sideBarAdmin.map((item) => (
                           <div key={item.title}>
                              <p className='text-gray-400 m-3 mt-4 uppercase'> {item.title}</p>
                              {item.links.map((link) => (
                                 <NavLink to={`${link.path}`} key={link.path}
                                    style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
                                    onClick={handleCloseSidebar} className={({ isActive }) => isActive ? activeLink : normalLink}>{link.icon}
                                    <span className='capitalize'>{link.name}</span>
                                 </NavLink>
                              ))}
                           </div>
                        ))}
                     </>}
                  {currentUser?.role === roles[roles.farmer] &&
                     <>
                        {sideBarFarmer.map((item) => (
                           <div key={item.title}>
                              <p className='text-gray-400 m-3 mt-4 uppercase'> {item.title}</p>
                              {item.links.map((link) => (
                                 <NavLink to={`${link.path}`} key={link.path}
                                    style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
                                    onClick={handleCloseSidebar} className={({ isActive }) => isActive ? activeLink : normalLink}>{link.icon}
                                    <span className='capitalize'>{link.name}</span>
                                 </NavLink>
                              ))}
                           </div>
                        ))}
                     </>}
                  {currentUser?.role === roles[roles.thirdparty] &&
                     <>
                        {sideBarThirdParty.map((item) => (
                           <div key={item.title}>
                              <p className='text-gray-400 m-3 mt-4 uppercase'> {item.title}</p>
                              {item.links.map((link) => (
                                 <NavLink to={`${link.path}`} key={link.path}
                                    style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
                                    onClick={handleCloseSidebar} className={({ isActive }) => isActive ? activeLink : normalLink}>{link.icon}
                                    <span className='capitalize'>{link.name}</span>
                                 </NavLink>
                              ))}
                           </div>
                        ))}
                     </>}
                  {currentUser?.role === roles[roles.deliveryhub] &&
                     <>
                        {sideBarDeliveryHub.map((item) => (
                           <div key={item.title}>
                              <p className='text-gray-400 m-3 mt-4 uppercase'> {item.title}</p>
                              {item.links.map((link) => (
                                 <NavLink to={`${link.path}`} key={link.path}
                                    style={({ isActive }) => ({ backgroundColor: isActive ? currentColor : '' })}
                                    onClick={handleCloseSidebar} className={({ isActive }) => isActive ? activeLink : normalLink}>{link.icon}
                                    <span className='capitalize'>{link.name}</span>
                                 </NavLink>
                              ))}
                           </div>
                        ))}
                     </>}
                  <button className={`${normalLink} w-64 mt-3`} onClick={logOut}> Logout</button>
               </div>
            </>}
      </div>
   )
}

export default SideBar