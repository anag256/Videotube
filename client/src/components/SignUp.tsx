import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import "../styles/Signup.scss";
import GoogleLogin from "react-google-login";

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<any>();
  const onSelectFile=(e:any)=>{
    const file=e.target.files[0];
    if(!file) return;
    setFile(file);
  }
  return (
    <div className="loginContainer">
      <div className="login_form">
        <div className="login_form_details">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Youtube_vanced.png"
            alt="logo"
            onClick={() => navigate("/login", { replace: true })}
          />

          <input type="text" placeholder="Username*" />
          <div className="passwordContainer">
            <input
              type={`${!showPassword ? "password" : "text"}`}
              placeholder="Password*"
            />
            <button onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <IoEyeOutline size="1.2rem" color="#2196F3" />
              ) : (
                <IoEyeOffOutline size="1.2rem" color="#2196F3" />
              )}
            </button>
          </div>
          <div className="profile_pic">
            <label htmlFor="file-upload" className="custom-file-upload">
             {file?.name ? file?.name : 'Upload Profile Photo'}
              <input type="file" className="file_upload" onChange={onSelectFile} />
            </label>
          </div>

          <button type="submit" className="blueBtn">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
