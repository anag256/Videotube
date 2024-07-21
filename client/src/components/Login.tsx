import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import "../styles/Login.scss";
import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSuccess = (res:any) => {
    console.log("success", res.profileObj);
    navigate("/",{replace:true})
  };

  const onFailure = (res:any) => {
    console.log("failure", res);
  };
const clientId=import.meta.env.clientId;
  useEffect(()=>{
    function start(){
      gapi.client.init({
        clientId:clientId,
        scope:""
      })
    }
    gapi.load('client:auth2',start)
  });
  return (
    <div className="loginContainer">
      <div className="login_form">
        <div className="login_form_details">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Youtube_vanced.png"
            alt="logo"
          />
          <input type="text" placeholder="Username*" />
          <div className="passwordContainer">
            <input
              type={`${!showPassword ? "password" : "text"}`}
              placeholder="Password*"
              required
            />
            <button onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <IoEyeOutline size="1.2rem" color="#2196F3" />
              ) : (
                <IoEyeOffOutline size="1.2rem" color="#2196F3" />
              )}
            </button>
          </div>

          <button type="submit" className="blueBtn login">
            Sign In
          </button>
          <h5>
            New to Videotube? <span><Link to="/signup">Create Account</Link></span>
          </h5>

          <div className="OR_with_line">
            <hr/>
            <h4> Or </h4>
          </div>

          <div className="google_login">
            <GoogleLogin
              clientId={import.meta.env.VITE_CLIENT_ID}
              buttonText="Login with Google"
              cookiePolicy="single_host_origin"
              isSignedIn={true}
              onSuccess={onSuccess}
              onFailure={onFailure}

            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
