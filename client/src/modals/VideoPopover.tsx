import ModalPopover from "./ModalPopover";
import Video, { video } from "../components/Video";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  content: {
    background: "#555555",
    borderRadius: "0.7rem",
    padding: "4rem",
    position: "absolute",
    right: "auto",
    bottom: "auto",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    opacity: 0.95,
    width: "max-content",
    maxHeight: "90%",
    overflowY: "auto",
  },
};
interface VideoPopover {
  isOpen: boolean;
  onClose: () => void;
  videos: video[];
  emptyPopoverMessage:string;
}
function VideoPopover({ isOpen, onClose, videos ,emptyPopoverMessage}: VideoPopover) {
  return (
    <ModalPopover isOpen={isOpen} onClose={onClose} style={customStyles}>
      {
        videos?.length===0 && <h5>{emptyPopoverMessage}</h5>
      }
      <div className="vidsPopover">
        {videos?.map((video: video) => (
          <Video
            key={video._id}
            title={video.title}
            description={video.description}
            owner={video.owner}
            views={video.views}
            createdAt={video.createdAt}
            _id={video._id}
            thumbnail={video.thumbnail}
            disableScalingOnHover
          />
        ))}
      </div>
    </ModalPopover>
  );
}

export default VideoPopover;
