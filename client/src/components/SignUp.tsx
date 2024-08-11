import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import "../styles/Signup.scss";
import GoogleLogin from "react-google-login";
import withForm from "../hoc/withForm";

function SignUp() {
  const [file, setFile] = useState<any>();
  const [showPassword, setShowPassword] = useState(false);
  const onSelectFile = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
  };
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
      <div className="profile_pic">
        <label htmlFor="file-upload" className="custom-file-upload">
          {file?.name ? file?.name : "Upload Profile Photo"}
          <input type="file" className="file_upload" onChange={onSelectFile} accept="image/*"/>
        </label>
      </div>
      <div className="cover_image">
        <label htmlFor="file-upload" className="custom-file-upload">
          {file?.name ? file?.name : "Upload Cover Image"}
          <input type="file" className="file_upload" onChange={onSelectFile} accept="image/*"/>
        </label>
      </div>

      <button type="submit" className="blueBtn">
        Sign Up
      </button>
    </>
  );
}

export default withForm(SignUp);
