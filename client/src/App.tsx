import { lazy, Suspense } from "react";


const VideoDetailPage = lazy(() => import("./pages/VideoDetailPage"));
import "./styles/App.scss";
import "./styles/Container.scss";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChannelDetailPage from "./pages/ChannelDetailPage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";



function App() {
  return (
    <Suspense fallback={<div >Loading...</div>}>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/video/:id" element={<VideoDetailPage/>}/>
      <Route path="/channel/:id" element={<ChannelDetailPage/>}/>
    </Routes>
    </Suspense>
  )

}

export default App;
