import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

const KYC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    country: "",
    sector: "",
    yearOfEstablishment: ""
  });

  const [pdf1 , setpdf1] = useState(null);
  const [pdf2 , setpdf2] = useState(null);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "pdf1") setpdf1(files[0]);
    else if (name === "pdf2") setpdf2(files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  async function handleSubmit() {
    try {
      if (
        !formData.country.trim() ||
        !formData.businessName.trim() ||
        !formData.sector.trim() ||
        !formData.yearOfEstablishment.trim()
      ) return;
      if (!pdf1 || !pdf2) {
        setMessage("Both files are required.");
        return;
      }

      const data = new FormData();
      data.append("name", formData.businessName);
      data.append("sector", formData.sector);
      data.append("country", formData.country);
      data.append("country", formData.country);
      data.append("yearOfEstablishment", formData.yearOfEstablishment);
      data.append("pdf1", pdf1);
      data.append("pdf2", pdf2);
    
      const res = await axios.post("/api/v1/dashboard/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 500) throw new Error("Documents not Submitted");
      console.log('Documents Submitted')
    } catch (error) {
      console.log(`Some Error occured\n${error.message}`);
    }
  }

  return (
    <>
      <div className="flex w-[100vw]">
        <div className="col1">
          <img src={logo} alt="" />
        </div>

        <div className="col2">
          <div style={{fontSize:'2rem',margin:'20px 0px'}}>Register your company</div>

          <form className="create" onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
          }}>
            <label>Enter your Company Name</label>
            <input
              type="text"
              name="country"
              onChange={handleChange}
              required
            />
            <label>Enter your Country</label>

            <input type="text" name="user" onChange={handleChange} required />

            <label>Enter your Sector</label>
            <input type="text" name="sector" onChange={handleChange} required />

            <label>Enter your year established</label>
            <input
              type="date"
              name="yearOfEstablishment"
              onChange={handleChange}
              required
            />

            <label>Upload Document 1</label>
            <input type="file" name="pdf1" onChange={handleFileChange} required />

            <label>Upload Document 2</label>
            <input type="file" name="pdf2" onChange={handleFileChange} required />

            <button className="submit" type="submit">Submit</button>
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

export default KYC;
