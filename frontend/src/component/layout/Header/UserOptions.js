import React, { Fragment,useState } from 'react'
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import './Header.css'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Dashboard from '@mui/icons-material/Dashboard';
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {logout} from '../../../actions/userAction'
import {useAlert } from 'react-alert'
import Backdrop from '@mui/material/Backdrop';
import {ShoppingCart} from '@mui/icons-material' 


const UserOptions = ({user}) => {

   const {cartItems}=useSelector(state=>state.cart)

   const alert=useAlert();
   const dispatch=useDispatch()
   
   const navigate=useNavigate();
   const orders=()=>{
      navigate('/orders')
   }
   const account=()=>{
      navigate('/account')
   }
   const logoutUser=()=>{
     dispatch(logout())
     alert.success("Logged out successfully");
     navigate("/login");

   }
   const dashboard=()=>{
      navigate('/admin/dashboard')
   }
  const cart=()=>{
     navigate('/cart')
  }
   const options=[
      {icon:<ListAltIcon/>,name:"Orders",func:orders},
      {icon:<PersonIcon/>,name:"Profile",func:account},
      {icon:<ExitToAppIcon/>,name:"Logout",func:logoutUser},
      {icon:<ShoppingCart style={{"color":`${(cartItems && cartItems.lenght !=0) ? "pink":"unset"}`}}/>,name:"cart",func:cart},


   ]
   if(user.role==='admin'){
      options.unshift({icon:<Dashboard/>,name:"Dashboard",func:dashboard})
   }
    const [open, setOpen] = useState(false)
    return (
       <Fragment>
          <Backdrop open={open} style={{"zIndex":10}}/>
          <SpeedDial 
          style={{"zIndex":11}}
          className="speedDial"
          ariaLabel='SpeedDial tooltip example'
          onClose={()=>setOpen(false)}
          onOpen={()=>setOpen(true)}
          open={open}
          direction='down'
          icon={<img src={user.avatar.url} className='speedDialIcon' alt='profile'/>}
          >
          {
             options.map((item,index)=>(
                <SpeedDialAction 
                icon={item.icon} 
                key={index}  
                tooltipTitle={item.name} 
                tooltipOpen={window.innerWidth < 800}
                onClick={item.func} />
             ))
          } 
          
          </SpeedDial>

       </Fragment>
    )
}

export default UserOptions
