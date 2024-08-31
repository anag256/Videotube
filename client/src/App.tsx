import { lazy, Suspense, useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import loaderGif from "./assets/loading.gif";
// const HomePage = lazy(() => import("./pages/HomePage"));
const ChannelDetailPage = lazy(() => import("./pages/ChannelDetailPage"));
const VideoDetailPage = lazy(() => import("./pages/VideoDetailPage"));
import "./styles/App.scss";
import "./styles/Container.scss";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  useGetCurrentUserQuery,
  useGetMessagesQuery,
  useRefreshAccessTokenMutation,
} from "./redux/UserAPI";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./redux/appState";
import Toast from "./components/Toast";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import PopoverPage from "./pages/PopoverPage";
import { handleShowToast } from "./utils/utils";
import HomePage from "./pages/HomePage";

function App() {
  const { data, isFetching, isError, error } =
    useGetCurrentUserQuery(undefined);
  const [refreshAccessToken] = useRefreshAccessTokenMutation();

  const location = useLocation();
  const { user, toast } = useSelector((state: RootState) => state.appState);
  const { isAuthenticated } = user;
  const {currentData:messages}=useGetMessagesQuery(undefined,{skip:!isAuthenticated});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (data && data?._id && !isFetching && !isError) {
      dispatch(
        setCurrentUser({
          userId: data?._id,
          username: data?.username,
          avatar: data?.avatar,
          isAuthenticated: true,
        })
      );
      return;
    }
    dispatch(
      setCurrentUser({
        user: "",
        username: "",
        avatar: "",
        isAuthenticated: false,
      })
    );
  }, [data, isFetching]);

  useEffect(() => {
   async function refreshToken(){
    if (isError && (error as any)?.data.message === "Access Token Expired") {
      await refreshAccessToken(undefined);
    }
   }
   refreshToken();
  }, [isError, error]);

  useEffect(() => {
    if (isAuthenticated) navigate(location.state.from || '/');
  }, [isAuthenticated]);

  useEffect(()=>{
    if(!messages) return;
    handleShowToast(dispatch,{data:messages});
  },[messages])
  return (
    <>
      <Suspense fallback={<div>{loaderGif}</div>}>
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
          <Route
            path="/:path"
            element={
              <ProtectedRoute>
                <PopoverPage />
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
