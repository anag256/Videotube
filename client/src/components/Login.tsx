import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import "../styles/Login.scss";
// import GoogleLogin from "react-google-login";
// import { gapi } from "gapi-script";
// import { setisAuthenticated } from "../redux/appState";
import { useDispatch } from "react-redux";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import withForm from "../hoc/withForm";
import { setisAuthenticated } from "../redux/appState";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  // const onSuccess = (res: any) => {
  //   console.log("success", res?.profileObj);
  //   dispatch(setisAuthenticated({ isAuthenticated: true }));
  //   navigate("/", { replace: true });
  // };

  // const onFailure = (res: any) => {
  //   console.log("failure", res);
  // };
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      dispatch(setisAuthenticated({ isAuthenticated: true }));
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };
  // const clientId = import.meta.env.clientId;
  // useEffect(() => {
  //   function start() {
  //     gapi.client.init({
  //       clientId: clientId,
  //       scope: "",
  //     });
  //   }
  //   gapi.load("client:auth2", start);
  // });
  return (
    <>
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
        New to Videotube?{" "}
        <span>
          <Link to="/signup">Create Account</Link>
        </span>
      </h5>

      <div className="OR_with_line">
        <hr />
        <h4> Or </h4>
      </div>

      <button className="google_login" onClick={handleGoogleClick}>
        <img
          alt="google_icon"
          src="https://techdocs.akamai.com/identity-cloud/img/social-login/identity-providers/iconfinder-new-google-favicon-682665.png"
          width={20}
          height={20}
        />
        <h4>Login with Google</h4>
        {/* <GoogleLogin
              clientId={import.meta.env.VITE_CLIENT_ID}
              buttonText="Login with Google"
              cookiePolicy="single_host_origin"
              isSignedIn={true}
              onSuccess={onSuccess}
              onFailure={onFailure}
            /> */}
      </button>
    </>
  );
}

export default withForm(Login);
