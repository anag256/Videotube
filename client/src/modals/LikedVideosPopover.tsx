import useShowLoader from "../hooks/useShowLoader";
import { useGetLikedVideosQuery } from "../redux/UserAPI";
import { useSearchParams } from "react-router-dom";
import { LIKED_VIDEOS } from "../constants/Actions";
import VideoPopover from "./VideoPopover";
import { useCallback } from "react";

function LikedVideosPopover() {
  const { data: videos, isFetching } = useGetLikedVideosQuery(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const onClose = useCallback(() => {
    searchParams.delete("popover");
    setSearchParams(searchParams);
  }, [searchParams]);

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
