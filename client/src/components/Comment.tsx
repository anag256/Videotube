import { useState } from "react";
import "../styles/Comment.scss";
import { formatPublishedDate } from "../utils/utils";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import CommentInput from "./CommentInput";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface owner {
  _id: string;
  avatar: string;
  fullName: string;
  username: string;
}
export interface comment {
  _id: string;
  comment: string;
  commentedBy: owner;
  createdAt: string;
  replies: comment[];
  parentComment: string | null;
  video: string;
}

interface commentProps {
  commentData: comment;
  onAddComment: (commentText: string, parentComment: string | null) => void;
}
const initialReply = {
  value: "",
  isVisible: false,
};

function Comment({ commentData, onAddComment }: commentProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState(initialReply);
  const { user } = useSelector((state: RootState) => state.appState);
  const onShowHideReplyClick = () => {
    setReply(initialReply);
    setShowReplies((prev) => !prev);
  };
  const handleAddClick = () => {
    onAddComment(reply.value, commentData._id);
    setReply(initialReply);
  };
  return (
    <div className="comment_details" key={commentData?._id}>
      <div className="profile_details">
        <img className="avatar" src={commentData?.commentedBy?.avatar} />
        <div className="comment_detail">
          <div className="profile">
            <h5>{commentData?.commentedBy?.username}</h5>
            <h6>{formatPublishedDate(commentData?.createdAt)}</h6>
          </div>
        </div>
      </div>

      <p>{commentData?.comment}</p>
      <div className="reply-container">
        <span
          className="reply-btn"
          onClick={() =>
            setReply((prev) => ({
              ...prev,
              isVisible: true,
            }))
          }
        >
          Reply
        </span>

        {commentData?.replies?.length > 0 && (
          <div className="show_replies" onClick={onShowHideReplyClick}>
            {showReplies ? (
              <span className="flex">
                <h4>Hide replies</h4> <FaChevronUp />
              </span>
            ) : (
              <span className="flex">
                <h4>Show replies</h4> <FaChevronDown />
              </span>
            )}
          </div>
        )}
      </div>
      {reply.isVisible && (
        <CommentInput
          avatar={user?.avatar}
          value={reply.value}
          onInputChange={(e) =>
            setReply((prev) => ({
              ...prev,
              value: e.target.value,
            }))
          }
          onAddComment={handleAddClick}
          onCancel={() => setReply(initialReply)}
        />
      )}
      {showReplies &&
        commentData?.replies.length > 0 &&
        commentData.replies.map((reply) => (
          <div className="reply"><Comment commentData={reply} onAddComment={onAddComment} /></div>
        ))}
    </div>
  );
}

export default Comment;
