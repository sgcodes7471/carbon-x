import { useContext, useState } from "react";
import axios from "axios";
import { RegisterBusiness } from "../../apis/auth.contracts.js";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import logo from "../../assets/logo.png";
import { Context } from "../../context/context.jsx";
import Dialog from "../../components/dailog.jsx";
import Loader from "../../components/loader.jsx";

const Register = () => {
  const navigate = useNavigate();

  const [dialogProps, setDialogProps] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading , setLoading] = useState(false);

  const [key, setKey] = useState("");

  const context = useContext(Context);
  const {accData,isConnected} = context;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleHashing = (formData) => {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(formData),
      key
    ).toString();
    return encrypted;
  };

  async function handleSubmit() {
    try {
      if (
        !formData.country.trim() ||
        !formData.businessName.trim() ||
        !formData.sector.trim() ||
        !formData.iots.trim() ||
        !formData.unitsProd.trim() ||
        !formData.yearOfEstablishment.trim() ||
        !key.trim()
      ) return;
      const iotArray = formData.iots.split(',').map((iot)=>iot.trim());
      let temp= {
        ...formData ,
        carbonCredits:100,
        creditsLimit:100,
        activity:0,
        iots:iotArray,
        user: accData.user
      };
      setFormData(temp);
      console.log(temp);
      const data = handleHashing(temp);
      console.log(data);
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/company/register",
        { data: data },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 500) throw new Error("Not Uploaded to IPFS");
      const transaction = await RegisterBusiness({
        data: res.data.data,
        formData: temp,
      });
      if (!transaction) {
        setLoading(false)
        setOpenDialog(true);
        setDialogProps({
        msg:'Failed to Register!',
        closefn:setOpenDialog,
        callback:null
      })
        return;
      }
      setLoading(false);
      setOpenDialog(true);
      setDialogProps({
        msg:'Success in Registration!\nProceed to Login',
        closefn:setOpenDialog,
        callback:null
      })
    } catch (error) {
      setLoading(false)
        setOpenDialog(true);
        setDialogProps({
        msg:'Failed to Register!',
        closefn:setOpenDialog,
        callback:null
      })
    }
  }

  return (
    <>
    {
      loading &&
      <div className="w-[100vw] h-[100vh] glassmorphism fixed flex justify-center items-center">
        <Loader />
      </div>
    }
    {openDialog && (
        <Dialog
          msg={dialogProps.msg}
          closefn={dialogProps.closefn}
          callback={dialogProps.callback}
        />
      )}
      <div className="flex w-[100vw]">
        <div className="col1">
          <img src={logo} alt="" />
        </div>

        <div className="col2">
          <div style={{fontSize:'2rem',margin:'20px 0px'}}>Register your company</div>

          <form className="create" onSubmit={(e)=>{
            e.preventDefault();
            if(!isConnected) {
              setOpenDialog(true);
              setDialogProps({
                msg: `Connect to your Wallet!`,
                closefn: setOpenDialog,
                callback: null,
              });
              return
            }
            handleSubmit();
          }}>
            <label>Enter your Company Name</label>
            <input type="text" name="businessName" onChange={handleChange} required/>
            <label>Enter your Country</label>

            <input type="text" name="country" onChange={handleChange} required />

            <label>Enter your Sector</label>
            <input type="text" name="sector" onChange={handleChange} required />

            <label>Enter your Smart Meter Identifiers(separated by commas(,))</label>
            <input type="text" name="iots" onChange={handleChange} required />

            <label>Enter your Amount of Power Consumed per year(in KWh)</label>
            <input type="text" name="unitsProd" onChange={handleChange} required />

            <label>Enter your year established</label>
            <input
              type="date"
              name="yearOfEstablishment"
              onChange={handleChange}
              required
            />

            <label>Enter a private key</label>
            <input
              type="password"
              name="private_key"
              onChange={(e) => {
                setKey(e.target.value);
              }}
              required
            />

            <button className="submit" type="submit" >Proceed</button>
          </form>
          <p className="register">
            Already Registered?{" "}
            <a
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
