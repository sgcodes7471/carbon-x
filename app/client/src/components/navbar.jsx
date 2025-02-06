import logo from '../assets/logo.png'
import { Context } from '../context/context.jsx';
import { useNavigate } from "react-router";
import { useContext } from 'react';

const Navbar = ()=>{

    const context = useContext(Context);
    const {accData} = context;
    const navigate = useNavigate();

    return(
        <div className="w-full h-[10vh] bg-[#1E1E1E] flex items-center justify-between px-4 fixed top-[0px] z-30">
                  <div className="w-3/12">
                    <img src={logo} alt="logo" className="h-8 w-[120px]" />
                  </div>
                  <div className="w-6/12 flex items-center justify-evenly">
                    <p className="text-sm cursor-pointer" onClick={()=>{navigate('/dashboard')}}>Dashboard</p>
                    <p className="text-sm cursor-pointer" onClick={()=>{navigate('/p2p')}}>MarketPlace</p>
                    {/* <p className="text-sm cursor-pointer">Liquid Pool Identity</p> */}
                  </div>
                  <div className="w-3/12 text-right">
                    {/* <p className="text-md font-medium">{accData.businessName}</p> */}
                  </div>
            </div>
    )

}
export default Navbar