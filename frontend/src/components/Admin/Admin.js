import { useContext, useEffect, useState } from "react";
import './Admin.css';
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import avatarImg from './avatar.jpg';
import Modal from 'react-modal';
import AdminProfileModal from './AdminProfile';
import { Link, Outlet } from "react-router-dom";
import AdminDashBoard from "./AdminDashboard";

Modal.setAppElement('#root'); // Set the root element for accessibility

const Admin = () => {
  const { user } = useContext(AuthContext)
  // const {notify} = toast.success('chao mừng ${user.Username} đến với trang quản trị');
  const [showContent, setShowContent] = useState(false);


  useEffect(() => {
    if (user) {
      
    }
  }, [user]);

  const toggleManagerContent = () => { setShowContent(!showContent); };
  return (

//     <div>
//       <ProSidebar>
//         <SidebarHeader>
//           <div>
//             <img className="avatar"
//               src={avatarImg}
//               alt="Avatar"
//             />
//             <h3 className="name"> JackBoCon</h3>
//           </div>
//           <button>
// <Link to="adminprofile">Admin Profile</Link>
// <Outlet />
// </button>
//         </SidebarHeader>

//         <SidebarContent>
//           <Menu iconShape="circle">
//             <MenuItem onClick={toggleManagerContent}>
//               Manager
//             </MenuItem>
//             {showContent && (
//               <>
//                 <MenuItem>Manager School Nurse</MenuItem>
//                 <MenuItem>Manager Parent</MenuItem>
//                 <MenuItem>Manager Student</MenuItem>
//               </>
//             )}
//           </Menu>
//         </SidebarContent>
//       </ProSidebar>
//     </div>

<>
<AdminDashBoard/>
<Outlet/>
</>

  );
};
export default Admin;




