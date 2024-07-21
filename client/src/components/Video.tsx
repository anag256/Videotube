import React from "react";
import "../styles/Video.scss";
import { formatPublishedDate } from "../utils/utils";
import { useNavigate } from "react-router-dom";
export interface channel {
  name: string;
  id: string;
  thumbnail: string;
}
export interface video {
  title: string;
  id: string;
  thumbnail: string;
  description: string;
  published_at: string;
  duration: string;
  channel: channel;
  isChannelDetailsVideo?: boolean;
}
const Video = ({
  title,
  id,
  thumbnail,
  description,
  published_at,
  duration,
  channel,
  isChannelDetailsVideo = false,
}: video) => {
  const navigate = useNavigate();
  const goToChannel = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    navigate(`channel/${2}`);
  };
  return (
    <div className="video" key={id} onClick={() => navigate(`/video/${id}`,{replace:true})}>
      <div className="thumbnail">
        <img src={thumbnail} alt={`${title}-thumbnail`} />
      </div>

      <div className="vid_metadata">
        {!isChannelDetailsVideo && (
          <img
            src={channel.thumbnail}
            alt="channel_avatar"
            onClick={goToChannel}
          />
        )}
        <div>
          <h5>{title}</h5>
          {!isChannelDetailsVideo && <h6>{channel.name}</h6>}
          <p>{formatPublishedDate(published_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default Video;
