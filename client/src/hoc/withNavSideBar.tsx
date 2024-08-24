import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import LikedVideosPopover from "../modals/LikedVideosPopover";
import WatchHistoryPopover from "../modals/watchHistoryPopover";
import SubscriptionPopover from "../modals/SubscriptionPopover";

// Define props including className
interface WithNavSideBarProps {
  className?: string;
}

// Extend the wrapped component props to include WithNavSideBarProps
const withNavSideBar = <P extends object>(
  WrappedComponent: React.FunctionComponent<P>,
  defaultProps: WithNavSideBarProps = {}
) => {
  return (props: P & WithNavSideBarProps) => {
    const { showSidebar } = useSelector((state: RootState) => state.appState);
    const { className, ...restProps } = props as P & WithNavSideBarProps;

    // Merge default props with props passed during usage
    const combinedClassName = `${defaultProps.className || ""}`.trim();

    return (
      <>
        <NavBar />
        <div
          className={`container ${
            showSidebar ? "overlay" : ""
          } ${combinedClassName}`}
        >
          <WrappedComponent {...(restProps as P)} />
          <SideBar />
        </div>
        <LikedVideosPopover />
        <WatchHistoryPopover />
        <SubscriptionPopover />
      </>
    );
  };
};

export default withNavSideBar;
