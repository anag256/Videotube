import React, { useState } from "react";
import "../styles/Comment.scss";
import { formatPublishedDate } from "../utils/utils";
interface comment {
  comment_id: number;
  text: string;
  name: string;
  image: string;
  publishedAt: string;
  replies: comment[];
}

interface commentProps {
  commentData: comment;
}
function Comment({ commentData }: commentProps) {
  const [showReplies, setShowReplies] = useState(false);
  return (
    <div className="comment_details" key={commentData?.comment_id}>
      <div className="profile_details">
        <img className="avatar" src={commentData?.image} />
        <div className="comment_detail">
          <div className="profile">
            <h5>{commentData?.name}</h5>
            <h6>{formatPublishedDate(commentData?.publishedAt)}</h6>
          </div>
        </div>
      </div>

      <p>{commentData?.text}</p>
     {commentData?.replies?.length>0 &&  <h5 className="show_replies" onClick={()=>setShowReplies((prev)=>!prev)}>{`${showReplies? 'Hide replies':'Show replies'}`}</h5>}
      {
       showReplies && commentData?.replies.length>0 && commentData.replies.map(reply=><Comment commentData={reply}/>)
      }
    </div>
  );
}

export default Comment;
