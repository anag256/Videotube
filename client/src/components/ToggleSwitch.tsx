import React from "react";
import "../styles/ToggleSwitch.scss"
interface switchProps{
    onSwitch:()=>void;
    isChecked:boolean;
}
export const ToggleSwitch = ({onSwitch,isChecked}:switchProps) => {
  return (
    <div className="switch">
      <input
        type="checkbox"
        onChange={onSwitch}
        checked={isChecked}
      />
      <span className="slider round"></span>
    </div>
  );
};
