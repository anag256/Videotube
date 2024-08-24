import React, { useEffect } from "react";
import "../styles/ChannelDetails.scss";
import Video, { video } from "../components/Video";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useGetUserProfileQuery } from "../redux/UserAPI";
import { useNavigate, useParams } from "react-router-dom";
import { popoverPath, preventDefaultEvent } from "../utils/utils";
import VideoUploadForm from "../modals/VideoUploadForm";
import useShowLoader from "../hooks/useShowLoader";
import { useGetChannelVideosQuery } from "../redux/VideoAPI";
import Subscription from "../components/Subscription";
import withNavSideBar from "../hoc/withNavSideBar";
import { VIDEO_UPLOAD_FORM } from "../constants/Actions";

function ChannelDetailPage() {
  const { user } = useSelector(
    (state: RootState) => state.appState
  );
  const navigate = useNavigate();
  const { username } = useParams();
  const { data, isFetching, isError, error } = useGetUserProfileQuery(username);
  console.log("data",data)
  const { data: channelVideos, isFetching: isChannelVideosFetching,isError:isChannelVideosError,error:channelVideosError } =
    useGetChannelVideosQuery(data?._id, {
      skip: !data,
    });

  useShowLoader(isFetching || isChannelVideosFetching);
  const onUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    preventDefaultEvent(e);
    navigate(popoverPath(VIDEO_UPLOAD_FORM));
  };
  useEffect(()=>{
    console.log("iserror",isError,error)
  },[isError,error])
// console.log("iserror",isError,error)

  return (
    <>

        <div className="channelDetails">
          <div className="bg_thumbnail">
            <img src={data?.coverImage} loading="lazy" />
          </div>
          <div className="profile_details">
            <div className="profile_data">
              <img className="avatar" src={data?.avatar} referrerPolicy="no-referrer"/>
              <div>
                <h3>{data?.fullName}</h3>
                <h5>{data?.username}</h5>
                <h6>
                  <span>{`${data?.SubscribersCount} Subscribers`}</span>
                  <span>•</span>
                  <span>{`${data?.SubscribedToCount} Subscribed`}</span>
                </h6>
              </div>
            </div>
            {/* conditional button */}
            {username === user.username ? (
              <button className="btn bluebg" onClick={onUploadClick}>
                Upload
              </button>
            ) : (
              <Subscription channelID={data?._id} isSubscribedTo={data?.isSubscribedTo}/>
            )}
          </div>
          {
            isChannelVideosError && <p className="no-videos-error">{channelVideosError.data.message}</p>
          }
          {!isChannelVideosError &&
          <div className="videos">
            {channelVideos?.data?.map((video: video) => {
              return (
                <Video
                  key={video._id}
                  title={video.title}
                  description={video.description}
                  owner={data}
                  views={video.views}
                  // duration={video.duration}
                  createdAt={video.createdAt}
                  _id={video._id}
                  thumbnail={video.thumbnail}
                  // isChannelDetailsVideo
                />
              );
            })}
          </div>
}
        </div>

      <VideoUploadForm />
    </>
  );
}

export default withNavSideBar(ChannelDetailPage,{className:'channelDetail'});
