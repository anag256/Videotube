import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import loaderGif from "../assets/loading.gif";
import '../styles/Loader.scss';

function Loader() {
  const { showLoader } = useSelector((state: RootState) => state.appState);
  if(!showLoader) return;
  return  <div className="backdrop"><img src={loaderGif} className="loader"/></div>;
}

export default Loader;
