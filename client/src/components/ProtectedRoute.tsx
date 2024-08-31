
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const {user} = useSelector((state: RootState) => state.appState);
  let location = useLocation();
  console.log("children",children)
  console.log("appState.isAuthenticated", user.isAuthenticated);
  return !user.isAuthenticated ? (
    <Navigate to="/login" state={{ from: location || '/' }} replace />
  ) : (
    children
  );
};

export default ProtectedRoute;
