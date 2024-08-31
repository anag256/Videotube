import { ReactElement, useEffect, useMemo, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { IoIosPeople, IoIosVideocam } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import "../styles/SideBar.scss";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LIKED_VIDEOS,
  SUBCRIPTION_DETAILS,
  WATCH_HISTORY,
} from "../constants/Actions";
import { popoverPath } from "../utils/utils";
import {
  HOME_PAGE_URL_REGEX,
  LIKED_VIDEOS_POPOVER_PAGE_REGEX,
  MY_CONTENT_PAGE_URL_REGEX,
  SUBCRIPTION_DETAILS_POPOVER_PAGE_REGEX,
  WATCH_HISTORY_POPOVER_PAGE_REGEX,
} from "../constants/Regex";

interface PopoverPathResult {
  pathname: string;
  search: string;
}

interface navItem {
  id: number;
  title: string;
  linkTo: string | PopoverPathResult;
  icon: ReactElement;
}

const SideBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { showSidebar, user } = useSelector(
    (state: RootState) => state.appState
  );
  const location = useLocation();
  const navigate = useNavigate();

  const navList: navItem[] = useMemo(
    () => [
      {
        id: 1,
        title: "Home",
        key: "home",
        linkTo: "/",
        icon: <FaHome />,
      },
      {
        id: 2,
        title: "Liked Videos",
        key: "liked_videos",
        linkTo: popoverPath(LIKED_VIDEOS),
        icon: <AiOutlineLike />,
      },
      {
        id: 3,
        title: "History",
        linkTo: popoverPath(WATCH_HISTORY),
        icon: <MdHistory />,
      },
      {
        id: 4,
        title: "My Content",
        linkTo: `/channel/${user.username}`,
        icon: <IoIosVideocam />,
      },
      {
        id: 5,
        title: "Subscribers",
        linkTo: popoverPath(SUBCRIPTION_DETAILS),
        icon: <IoIosPeople />,
      },
      {
        id: 6,
        title: "Settings",
        linkTo: `/channel/${user.username}`,
        icon: <IoSettings />,
      },
    ],
    [user]
  );

  const onClickListItem = (navItem: navItem) => {
    setActiveIndex(navItem.id);
    navigate(navItem.linkTo);
  };

  const switchListItems = () => {
    const loc = location.pathname.concat(location.search);
    switch (loc) {
      case loc.match(HOME_PAGE_URL_REGEX)?.input:
        return 1;
      case loc.match(LIKED_VIDEOS_POPOVER_PAGE_REGEX)?.input:
        return 2;
      case loc.match(WATCH_HISTORY_POPOVER_PAGE_REGEX)?.input:
        return 3;
      case loc.match(SUBCRIPTION_DETAILS_POPOVER_PAGE_REGEX)?.input:
        return 5;
      case loc.match(MY_CONTENT_PAGE_URL_REGEX)?.input:
        return 4;
      default:
        return 1;
    }
  };

  useEffect(() => {
    setActiveIndex(switchListItems());
  }, [location]);
  return (
    <aside
      className="sidelist"
      style={{
        opacity: showSidebar ? 0.967 : 0,
        transform: showSidebar ? "translateX(0)" : "translateX(-1000px)",
      }}
    >
      <ul>
        {navList.map((navItem: navItem) => {
          return (
            <li
              key={navItem.id}
              onClick={() => onClickListItem(navItem)}
              className={`${activeIndex === navItem.id ? "active" : ""}`}
            >
              <span className="icon">{navItem.icon}</span>
              <span className="text">{navItem.title}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default SideBar;
