import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setShowLoader } from "../redux/appState";

const useShowLoader = (isLoading: boolean) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading) {
      dispatch(
        setShowLoader({
          showLoader: true,
        })
      );
    } else {
      dispatch(
        setShowLoader({
          showLoader: false,
        })
      );
    }
  }, [isLoading]);
};

export default useShowLoader;
