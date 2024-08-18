import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.scss";
import { useDispatch } from "react-redux";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import withForm from "../hoc/withForm";
import { setCurrentUser, setToastData } from "../redux/appState";
import { useGoogleSignInMutation, useLoginUserMutation } from "../redux/UserAPI";
import useShowLoader from "../hooks/useShowLoader";
import { handleShowToast, preventDefaultEvent } from "../utils/utils";
import { Field } from "../commonTypes";
import PasswordInput from "../components/PasswordInput";

interface LoginFormData {
  username: string;
  password: string;
}

const initialLoginData = {
  username: "",
  password: "",
};
function Login() {
  const dispatch = useDispatch();
  const [loginData, setLogindata] = useState<LoginFormData>(initialLoginData);
  const [googleSignIn]=useGoogleSignInMutation();
  const [loginUser, { isLoading, isSuccess, isError, error }] =
    useLoginUserMutation();

  useShowLoader(isLoading);

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log("google res",result);
      const data=await googleSignIn(result.user);
      dispatch(setCurrentUser({ userId:data.data.user._id,username:data.data.user.username,avatar:data.data.user.avatar,isAuthenticated: true }));
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  const resetFields = () => {
    setLogindata(initialLoginData);
  };
  const onLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    preventDefaultEvent(e);
    const result: any = await loginUser(loginData);
    console.log("isError", isError, error);
    console.log("isSuccess", isSuccess);
    handleShowToast(dispatch,result);
    resetFields();
  };

  const Fields = [
    {
      type: "text",
      name: "username",
      placeholder: "Username*",
      value: loginData?.username,
      isRequired: true,
    },
    {
      type: "password",
      name: "password",
      placeholder: "Password*",
      value: loginData?.password,
      isRequired: true,
    },
  ];

  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value, name } = e.target as HTMLInputElement;
    setLogindata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const SwitchInputTypes = (field: Field) => {
    const { type, name, placeholder, value, isRequired } = field;
    switch (type) {
      case "password":
        return (
          <PasswordInput
            placeholder={placeholder}
            isRequired={isRequired}
            name={name}
            value={value || ""}
            onChange={onChange}
            maxLength={12}
          />
        );

      default:
        return (
          <div>
            <input
              type={type}
              name={name}
              value={value}
              required={isRequired}
              placeholder={placeholder}
              onChange={onChange}
            />
          </div>
        );
    }
  };

  return (
    <>
      {Fields.map((field: Field, index: number) => (
        <div key={index}>{SwitchInputTypes(field)}</div>
      ))}
      <button
        type="submit"
        className="btn bluebg login"
        onClick={onLogin}
        disabled={Object.values(loginData).some((item) => item === "")}
      >
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
      </button>
    </>
  );
}

export default withForm(Login);
