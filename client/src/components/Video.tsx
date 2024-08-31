import React, { forwardRef } from "react";
import "../styles/Video.scss";
import { formatPublishedDate, shortenText } from "../utils/utils";
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
  disableScalingOnHover?:boolean
}

const Video = forwardRef((props:video, ref:any) => {
  const { title, _id, thumbnail, createdAt, owner, views,disableScalingOnHover } = props;
  const navigate = useNavigate();
  const goToChannel = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    navigate(`/channel/${owner.username}`);
  };

  return (
    <div
      className={`video ${disableScalingOnHover && "disable-scaling"}`}
      key={_id}
      onClick={() => navigate(`/video/${_id}`)}
      ref={ref}
    >
      <div className="thumbnail">
        <img src={thumbnail} alt={`${title}-thumbnail`} loading="lazy"/>
      </div>

      <div className="vid_metadata">
        {<img src={owner.avatar} alt="channel_avatar" onClick={goToChannel} referrerPolicy="no-referrer" loading="lazy"/>}
        <div>
          <h5>{shortenText(title,50)}</h5>
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
