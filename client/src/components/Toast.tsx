import { FaCircleCheck } from "react-icons/fa6";
import { FaExclamationCircle } from "react-icons/fa";
import "../styles/Toast.scss";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setToastData } from "../redux/appState";

function Toast() {
  const { toast } = useSelector((state: RootState) => state.appState);
  const dispatch=useDispatch();

  useEffect(()=>{
   const timeout= setTimeout(()=>{
      dispatch(setToastData({
        toast:{
          isVisible:false,
          status:"",
          message:""
        }
      }))
    },3000)
    return ()=> clearTimeout(timeout)
  })
  if (!toast.isVisible) return;
  return (
    <div className={`toast ${toast.status} ${!toast.isVisible && 'disable'}`}>
      {toast.status === "error" ? <FaExclamationCircle size={30}/> : <FaCircleCheck />}
      <h4>{toast.message}</h4>
    </div>
  );
}

export default Toast;
