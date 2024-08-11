import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
const HomePage = lazy(() => import("./pages/HomePage"));
const ChannelDetailPage = lazy(() => import("./pages/ChannelDetailPage"));
const VideoDetailPage = lazy(() => import("./pages/VideoDetailPage"));
import "./styles/App.scss";
import "./styles/Container.scss";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
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
          path="/video/:id"
          element={
            <ProtectedRoute>
              <VideoDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/channel/:id"
          element={
            <ProtectedRoute>
              <ChannelDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
