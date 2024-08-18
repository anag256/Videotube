import "../styles/CommentInput.scss";

interface commentInputProps {
  avatar: string;
  value: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onAddComment: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
function CommentInput({
  avatar,
  value,
  onInputChange,
  onAddComment,
  onCancel,
}: commentInputProps) {
  return (
    <div className="commentContainer">
      <img className="avatar" src={avatar} />
      <div className="commentInput">
        <input
          type="text"
          placeholder=" Add comment"
          className="common-input"
          value={value}
          onChange={onInputChange}
        />
        <div className="flex btn-container">
          <button
            disabled={value === ""}
            className="btn borderBlueBtn"
            onClick={onAddComment}
          >
            Comment
          </button>
          <button className="btn borderBlueBtn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CommentInput;
