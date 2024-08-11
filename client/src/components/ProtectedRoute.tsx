
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const appState = useSelector((state: RootState) => state.appState);
  let location = useLocation();
  console.log("appState.isAuthenticated", appState.isAuthenticated);
  return !appState.isAuthenticated ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    children
  );
};

export default ProtectedRoute;
