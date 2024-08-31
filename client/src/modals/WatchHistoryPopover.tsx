import useShowLoader from "../hooks/useShowLoader";
import { useGetWatchHistoryQuery } from "../redux/UserAPI";
import { useSearchParams } from "react-router-dom";
import { WATCH_HISTORY } from "../constants/Actions";
import VideoPopover from "./VideoPopover";
import { useCallback } from "react";

function WatchHistoryPopover() {
  const { data: videos, isFetching } = useGetWatchHistoryQuery(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const onClose = useCallback(() => {
    searchParams.delete("popover");
    setSearchParams(searchParams);
  }, [searchParams]);
  useShowLoader(isFetching);
  return (
    <VideoPopover
      isOpen={searchParams.get("popover") === WATCH_HISTORY}
      onClose={onClose}
      videos={videos?.watchHistoryData}
      emptyPopoverMessage="You have not watched any videos."
    />
  );
}

export default WatchHistoryPopover;
