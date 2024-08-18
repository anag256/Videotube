import React, { useState } from "react";
import { preventDefaultEvent } from "../utils/utils";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import '../styles/PasswordInput.scss';

interface PassWordInputProps {
  placeholder: string;
  name: string;
  isRequired: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  maxLength: number;
  // All other props
  [x: string]: any;
}
function PasswordInput({
  placeholder,
  isRequired,
  name,
  value,
  onChange,
  maxLength,
  ...restProps
}: PassWordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="passwordContainer">
      <input
        type={`${!showPassword ? "password" : "text"}`}
        placeholder={placeholder}
        required={isRequired}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        {...restProps}
      />
      <button
        onClick={(e) => {
          preventDefaultEvent(e);
          setShowPassword((prev) => !prev);
        }}
      >
        {showPassword ? (
          <IoEyeOutline size="1.2rem" color="#2196F3" />
        ) : (
          <IoEyeOffOutline size="1.2rem" color="#2196F3" />
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
