import React, { useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import "../styles/VideoDetailPage.scss";
import Video, { video } from "../components/Video";
import { videos } from "../data/videos";
import Comment from "../components/Comment";
import { comments } from "../data/comments";
import { AiTwotoneLike, AiTwotoneDislike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const VideoListItem = () => {
  return (
    <div className="videoListItem">
      <img src="https://templates.simplified.co/thumb/b1be416d-4eea-49f7-88f9-e57fbfc25481.jpg" />

      <div>
        <h4>JavaScript Fundamentals: Variables and Data Types</h4>
        <h5>Code Master</h5>
        <div>
          <h6>10.3k Views </h6>
          <h6>44 minutes ago</h6>
        </div>
      </div>
    </div>
  );
};
function VideoDetailPage() {
  const [like,setLike]=useState<boolean>(false);
  const [dislike,setDislike]=useState<boolean>(false);
  const {showSidebar}=useSelector((state:RootState)=>state.appState);
  const toggleDislike=()=>{
    setDislike((prev)=>!prev);
    setLike(false);
  }
  const toggleLike=()=>{
    setLike((prev)=>!prev);
    setDislike(false);
  }

  return (
    <>
      <NavBar />
      <div className={`videoDetail container  ${showSidebar ? ' overlay ':''}`}>
        {/* Video Section */}
        <div>
          <div className="vidSection">
            <iframe
              width="100%"
              height="350px"
              src="https://www.youtube.com/embed/pxfZU_-HRlU?si=OOU5PVG9zbZXARp_"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              frameBorder="0"
            ></iframe>
            <section className="videoDetails">
              <div className="video_title_reactions">
                <h4>Advanced React Patterns</h4>
                <div className="reactions">
                  <div className="likes">
                    <span>{4980}</span>
                    <AiTwotoneLike size="1.5rem" onClick={toggleLike} className={`reaction_icon ${like ? 'liked' : ''}`}/>
                    </div>

                 <div className="dislikes">
                 <span>{280}</span>
                 <AiTwotoneDislike size="1.5rem"  onClick={toggleDislike} className={`reaction_icon ${dislike ? 'disliked' : ''}`}/>
                  </div>
                </div>
              </div>

              <div className="flx">
                <h6>30,184 Views </h6>
                <h6>18 hours agao </h6>
              </div>
              <section className="channel_detail_section">
                <div>
                  <div>
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/001/993/889/small/beautiful-latin-woman-avatar-character-icon-free-vector.jpg" />
                    <div className="channel_detail">
                      <h5>React Patterns</h5>
                      <h6>757K Subscribers</h6>
                    </div>
                  </div>

                  <button className="blueBtn">Subscribe</button>
                </div>
                <hr />
                <p>
                  🚀 Dive into the world of React with our latest tutorial
                  series: "Advanced React Patterns"! 🛠️ Whether you're a
                  seasoned developer or just starting out, this series is
                  designed to elevate your React skills to the next level.
                </p>
              </section>
            </section>

            <section className="comment_section">
              <input type="text" placeholder=" Add comment" />
              <hr />
              {comments.map((comment) => (
                <Comment commentData={comment} />
              ))}
            </section>
          </div>

          {/* Video recommendatations */}
          <section className="video_recommendations">
            <VideoListItem />
            <VideoListItem />
            <VideoListItem />
            <VideoListItem />
            <VideoListItem />
          </section>
        </div>
        <SideBar />
      </div>
    </>
  );
}

export default VideoDetailPage;
