import { useThemeContext } from "../context/Theme-context";
import useShowLoader from "../hooks/useShowLoader";
import { useGetLikedVideosQuery } from "../redux/UserAPI";
import { useSearchParams } from "react-router-dom";
import { LIKED_VIDEOS } from "../constants/Actions";
import VideoPopover from "./VideoPopover";
import { useCallback } from "react";

function LikedVideosPopover() {
  const { data: videos, isFetching } = useGetLikedVideosQuery(undefined);
  const { theme } = useThemeContext();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log("theme", theme);
  const onClose = useCallback(() => {
    searchParams.delete("popover");
    setSearchParams(searchParams);
  }, [searchParams]);

  console.log("searchParams.get('popover')", searchParams.get("popover"));
  useShowLoader(isFetching);
  return (
    <VideoPopover
      isOpen={searchParams.get("popover") === LIKED_VIDEOS}
      onClose={onClose}
      videos={videos?.likedVideos}
      emptyPopoverMessage="You have not liked any videos."
    />
  );
}

export default LikedVideosPopover;
