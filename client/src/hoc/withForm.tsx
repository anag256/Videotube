import React from "react";
import "../styles/withForm.scss";
import { useNavigate } from "react-router-dom";
const withForm = (WrappedComponent: React.FunctionComponent) => {
  return (props: any) => {
    const navigate = useNavigate();
    return (
      <div className="loginContainer">
        <form className="login_form">
          <div className="login_form_details">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Youtube_vanced.png"
              alt="logo"
              onClick={()=>navigate("/login",{replace:true})}
            />
            <WrappedComponent {...props} />
          </div>
        </form>
      </div>
    );
  };
};

export default withForm;
