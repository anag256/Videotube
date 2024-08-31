import React, { useState } from "react";
import "../styles/Signup.scss";
import withForm from "../hoc/withForm";
import { useRegisterUserMutation } from "../redux/UserAPI";
import { useDispatch } from "react-redux";
import {
  field,
  handleShowToast,
  preventDefaultEvent,
  validateField,
  validationErrorMessages,
} from "../utils/utils";
import { EMAIL, PASSWORD, USERNAME } from "../constants/LoginFormConstants";
import useShowLoader from "../hooks/useShowLoader";
import { Field } from "../commonTypes";
import PasswordInput from "../components/PasswordInput";

interface RegisterFormData {
  username: string;
  email: string;
  fullName: string;
  password: string;
  avatar: File | null;
  coverImage: File | null;
}

interface areFieldsValid {
  username: boolean | null;
  password: boolean | null;
  email: boolean | null;
}
const initialFormData = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  avatar: null,
  coverImage: null,
};
const initialAreFieldsValidData = {
  username: null,
  password: null,
  email: null,
};

function SignUp() {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [areFieldsValid, setAreValidFields] = useState<areFieldsValid>(
    initialAreFieldsValidData
  );
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  useShowLoader(isLoading);

  const shouldShowValidationError = (name: field) =>
    !areFieldsValid[name] && areFieldsValid[name] !== null;

  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value, name, type, files } = e.target as HTMLInputElement;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type !== "file" ? value : (files as FileList)[0],
    }));
    if ([USERNAME, PASSWORD, EMAIL].includes(name)) {
      setAreValidFields((prev) => ({
        ...prev,
        [name]: validateField(name as field, value),
      }));
    }
  };

  const Fields = [
    {
      type: "text",
      name: "username",
      placeholder: "Username*",
      value: formData?.username,
      isRequired: true,
    },
    {
      type: "email",
      name: "email",
      placeholder: "Email*",
      value: formData?.email,
      isRequired: true,
    },
    {
      type: "text",
      name: "fullName",
      placeholder: "Full Name*",
      value: formData?.fullName,
      isRequired: true,
    },
    {
      type: "password",
      name: "password",
      placeholder: "Password*",
      value: formData?.password,
      isRequired: true,
    },
    {
      type: "file",
      name: "avatar",
      file: formData?.avatar,
      placeholder: "Upload Profile Pic",
      isRequired: false,
    },
    {
      type: "file",
      name: "coverImage",
      file: formData?.coverImage,
      placeholder: "Upload Cover Image",
      isRequired: false,
    },
  ];

  const SwitchInputTypes = (field: Field) => {
    const { type, name, placeholder, value, isRequired } = field;
    switch (type) {
      case "password":
        return (
          <div className="flexCol">
            <PasswordInput
              placeholder={placeholder}
              isRequired={isRequired}
              name={name}
              value={value || ""}
              onChange={onChange}
              maxLength={12}
            />
            {shouldShowValidationError(name as field) && (
              <h5 className="validation-error">
                {validationErrorMessages[name as field]}
              </h5>
            )}
          </div>
        );

      case "file":
        return (
          <div>
            <label htmlFor="file-upload" className="custom-file-upload">
              {(formData[name as keyof RegisterFormData] as File)?.name
                ? (formData[name as keyof RegisterFormData] as File)?.name
                : placeholder}
              <input
                type="file"
                className="file_upload"
                name={name}
                onChange={onChange}
                accept="image/*"
              />
            </label>
          </div>
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
            {shouldShowValidationError(name as field) && (
              <h5 className="validation-error">
                {validationErrorMessages[name as field]}
              </h5>
            )}
          </div>
        );
    }
  };

  const resetFields = () => {
    setFormData(initialFormData);
    setAreValidFields(initialAreFieldsValidData);
  };

  const onSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    preventDefaultEvent(e);
    const result: any = await registerUser(formData);
    resetFields();
    handleShowToast(dispatch, result);
  };
  return (
    <>
      {Fields.map((field: Field, index: number) => {
        return <div key={index}>{SwitchInputTypes(field)}</div>;
      })}
      <button
        type="submit"
        className="btn bluebg"
        onClick={onSignUp}
        disabled={Object.values(areFieldsValid).some((item) => !item)}
      >
        Sign Up
      </button>
    </>
  );
}

export default withForm(SignUp);
