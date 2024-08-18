import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
const HomePage = lazy(() => import("./pages/HomePage"));
const ChannelDetailPage = lazy(() => import("./pages/ChannelDetailPage"));
const VideoDetailPage = lazy(() => import("./pages/VideoDetailPage"));
import "./styles/App.scss";
import "./styles/Container.scss";
import ProtectedRoute from "./components/ProtectedRoute";
import { useGetCurrentUserQuery } from "./redux/UserAPI";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./redux/appState";
import Toast from "./components/Toast";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

function App() {
  const { data, isFetching, isError, error } =
    useGetCurrentUserQuery(undefined);
    const location = useLocation();
    console.log('location',location)
  const { user, toast } = useSelector((state: RootState) => state.appState);
  const { isAuthenticated } = user;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("data", data, isError, error);
    if (data && data?._id && !isFetching && !isError) {
      console.log("current user", data);
      dispatch(
        setCurrentUser({
          userId: data?._id,
          username: data?.username,
          avatar:data?.avatar,
          isAuthenticated: true,
        })
      );
      return;
    }
    dispatch(
      setCurrentUser({ user: "", username: "", avatar:"",isAuthenticated: false })
    );
  }, [data, isFetching]);

  useEffect(() => {
    if (isAuthenticated) navigate(location.state.from);
    console.log("isAuth", isAuthenticated);
  }, [isAuthenticated]);
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:videoID"
            element={
              <ProtectedRoute>
                <VideoDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/channel/:username"
            element={
              <ProtectedRoute>
                <ChannelDetailPage />
              </ProtectedRoute>
            }
          />
          {/* <Route path="*" element={<Navigate replace to="/" />} /> */}
        </Routes>
      </Suspense>
      {toast.isVisible && <Toast />}
      <Loader />
    </>
  );
}

export default App;
