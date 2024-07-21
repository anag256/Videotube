import { ReactElement } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { IoIosPeople, IoIosVideocam } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import "../styles/SideBar.scss";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface navItem {
  title: string;
  icon: ReactElement;
}
const navList: navItem[] = [
  {
    title: "Home",
    icon: <FaHome />,
  },
  {
    title: "Liked Videos",
    icon: <AiOutlineLike />,
  },
  {
    title: "History",
    icon: <MdHistory />,
  },
  {
    title: "My Content",
    icon: <IoIosVideocam />,
  },
  {
    title: "Subscribers",
    icon: <IoIosPeople />,
  },
  {
    title: "Settings",
    icon: <IoSettings />,
  },
];

const SideBar = () => {
  const {showSidebar}=useSelector((state:RootState)=>state.appState);
  console.log("sow",showSidebar)
  return (
    <aside className="sidelist" style={{opacity:showSidebar? 0.967:0,transform:showSidebar?'translateX(0)':'translateX(-1000px)'}}>
      <ul>
        {navList.map((navItem: navItem, index: number) => {
          return (
            <li key={index}>
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
