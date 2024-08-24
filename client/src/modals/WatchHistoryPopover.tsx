import { useThemeContext } from "../context/Theme-context";
import useShowLoader from "../hooks/useShowLoader";
import { useGetWatchHistoryQuery } from "../redux/UserAPI";
import { useSearchParams } from "react-router-dom";
import { WATCH_HISTORY } from "../constants/Actions";
import VideoPopover from "./VideoPopover";
import { useCallback } from "react";

function WatchHistoryPopover() {
  const { data: videos, isFetching } = useGetWatchHistoryQuery(undefined);
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
      isOpen={searchParams.get("popover") === WATCH_HISTORY}
      onClose={onClose}
      videos={videos?.watchHistoryData}
      emptyPopoverMessage="You have not watched any videos."
    />
  );
}

export default WatchHistoryPopover;
