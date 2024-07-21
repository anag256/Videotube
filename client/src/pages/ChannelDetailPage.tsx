import React from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import "../styles/ChannelDetails.scss";
import { videos } from "../data/videos";
import Video, { video } from "../components/Video";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
function ChannelDetailPage() {
  const {showSidebar}=useSelector((state:RootState)=>state.appState);
  return (
    <>
      <NavBar />
      <div className={`channelDetail container ${showSidebar ? ' overlay ':''}`}>
        <div className="channelDetails">
          <div className="bg_thumbnail">
            <img src="https://torange.biz/photofxnew/261/HD/digital-thumbnail-background-261969.jpg" loading="lazy"/>
          </div>
          <div className="profile_details">
            <div className="profile_data">
              <img
                className="avatar"
                src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
              />
              <div>
                <h3>{"Gangsta Perspectives"}</h3>
                <h5>{"@GangstaPerspectives"}</h5>
                <h6>
                  <span>{"226K Subscriber"}</span>
                  <span>•</span>
                  <span>{"220 Subscribed"}</span>
                </h6>
              </div>
            </div>
            {/* conditional button */}
            <button className="blueBtn">Subscribe</button>
          </div>

          <div className="videos">
            {videos.slice(0, 4).map((video: video) => {
              return (
                <Video
                  key={video.id}
                  title={video.title}
                  description={video.description}
                  channel={video.channel}
                  duration={video.duration}
                  published_at={video.published_at}
                  id={video.id}
                  thumbnail={video.thumbnail}
                  isChannelDetailsVideo
                />
              );
            })}
          </div>
        </div>
        <SideBar />
      </div>
    </>
  );
}

export default ChannelDetailPage;
