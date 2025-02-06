import React from "react";
import logo from "../../assets/logo.png";
import img from "../../assets/img.png";
import { useNavigate } from "react-router-dom";
const Landing = () => {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/sign-in"); // Navigates to /home
  };
  const goToSignup = () => {
    navigate("/register"); // Goes back to the previous page
  };
  return (
    <div className="relative h-screen w-full flex justify-center items-center">
      <style>
        {`
        .cover {
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            position: fixed; /* Keeps it in the background */
            top: 0;
            left: 0;
          }
          .login-button {
            background: none;
            border: none;
            color: white;
            font-size: 1rem;
            cursor: pointer;
          }
          .login-button:hover {
            text-decoration: underline;
          }
        `}
      </style>
      {/* Background Image */}
      <img src={img} alt="" className="cover" />
      {/* Navbar */}
      <div className="absolute top-5 left-5 text-white text-xl font-semibold flex items-center space-x-2">
        <img src={logo} alt="carbonX" className="" />
      </div>
      <div className="absolute top-5 right-5 flex text-white mt-4 justify-center text-center items-center gap-3">
        <button className="login-button" onClick={goToLogin}>Login</button>
        <button className="login-button" onClick={goToSignup}>Sign up</button>
      </div>
      {/* Centered Text - Ensured it's Above the Image */}
      <div className="relative flex flex-col items-center justify-center h-full text-white text-center z-10">
        <h1 className="text-5xl font-bold">Welcome</h1>
        <p className="text-2xl mt-2">To Carbon Trading</p>
      </div>
      {/* Footer with 3 Boxes */}
      <div className="absolute bottom-5 w-[90%] left-1/2 -translate-x-1/2 flex justify-between space-x-4">
        <div className="w-1/3 bg-black/80 rounded-2xl p-6 text-white text-center">
          <p className="text-2xl">
            Privacy?
            <br />
            That's Us. <br />
          </p>
          <p className="mt-3">
            {" "}
            Blockchain powers a decentralized, tamper-proof ledger, while
            state-of-the-art encryption keeps your data private—only you have
            the key to view it.
          </p>
        </div>
        <div className="w-1/3 bg-black/80 rounded-2xl p-6 text-white text-center">
          <p className="text-2xl">Realtime IOT Data, So You're Never Behind.</p>
          <p className="mt-3">
            Monitor your consumption data and analytics in real time through a
            grid of independently functioning IOTs. Compare yourself to your
            industry and stay on top of the game.{" "}
          </p>
        </div>
        <div className="w-1/3 bg-black/80 rounded-2xl p-6 text-white text-center">
          <p className="text-2xl">
            Seamless P2P Trading, Eliminate The Middleman.
          </p>
          <p className="mt-3">
            Open and a free marketplace for the transaction of carbon credits,
            completely anonymous and secure at the same time.{" "}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Landing;