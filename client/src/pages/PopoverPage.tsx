import { useParams } from "react-router-dom";
import LikedVideosPopover from "../modals/LikedVideosPopover";
import {
  LIKED_VIDEOS,
  SUBCRIPTION_DETAILS,
  WATCH_HISTORY,
} from "../constants/Actions";

type path = "liked-videos" | "watch-history" | "subscription-details";
const switchPaths = (path: path) => {
  switch (path) {
    case LIKED_VIDEOS:
      return <LikedVideosPopover />;
    case WATCH_HISTORY:
      break;
    case SUBCRIPTION_DETAILS:
      break;
    default:
      break;
  }
};
function PopoverPage() {
  const { path } = useParams();

  if(!path) return;
  return <>{switchPaths(path as path)}</>;
}

export default PopoverPage;
