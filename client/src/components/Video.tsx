import React, { forwardRef } from "react";
import "../styles/Video.scss";
import { formatPublishedDate } from "../utils/utils";
import { useNavigate } from "react-router-dom";
export interface channel {
  username: string;
  name: string;
  id: string;
  avatar: string;
}
export interface video {
  title: string;
  _id: string;
  thumbnail: string;
  description: string;
  createdAt: string;
  owner: channel;
  views: number;
  isChannelDetailsVideo?: boolean;
}
interface ValidRefTarget {
  contains(target: EventTarget | null): any;
}
const Video = forwardRef((props:video, ref:any) => {
  const { title, _id, thumbnail, description, createdAt, owner, views } = props;
  const navigate = useNavigate();
  const goToChannel = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    console.log("channel", `channel/${owner.username}`);
    navigate(`/channel/${owner.username}`, { replace: true });
  };
  console.log("publisheedDate", createdAt);
  return (
    <div
      className={`video ${ref && "hola"}`}
      key={_id}
      onClick={() => navigate(`/video/${_id}`, { replace: true })}
      ref={ref}
    >
      <div className="thumbnail">
        <img src={thumbnail} alt={`${title}-thumbnail`} />
      </div>

      <div className="vid_metadata">
        {<img src={owner.avatar} alt="channel_avatar" onClick={goToChannel} />}
        <div>
          <h5>{title}</h5>
          {<h6>{owner.username}</h6>}
          <p>
            <span>{views} views</span>
            <span className="formatted-date">
              {formatPublishedDate(createdAt)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
});

export default Video;
