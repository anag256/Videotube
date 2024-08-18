import { ReactElement } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { IoIosPeople, IoIosVideocam } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import "../styles/SideBar.scss";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

interface navItem {
  title: string;
  linkTo:string;
  icon: ReactElement;
}


const SideBar = () => {
  const {showSidebar,user}=useSelector((state:RootState)=>state.appState);
  const navigate=useNavigate();
  const navList: navItem[] = [
    {
      title: "Home",
      linkTo:'/',
      icon: <FaHome />,
    },
    {
      title: "Liked Videos",
      linkTo:'/',
      icon: <AiOutlineLike />,
    },
    {
      title: "History",
      linkTo:'/',
      icon: <MdHistory />,
    },
    {
      title: "My Content",
      linkTo:`/channel/${user.username}`,
      icon: <IoIosVideocam />,
    },
    {
      title: "Subscribers",
      linkTo:'/',
      icon: <IoIosPeople />,
    },
    {
      title: "Settings",
      linkTo:'/',
      icon: <IoSettings />,
    },
  ];

  return (
    <aside className="sidelist" style={{opacity:showSidebar? 0.967:0,transform:showSidebar?'translateX(0)':'translateX(-1000px)'}}>
      <ul>
        {navList.map((navItem: navItem, index: number) => {
          return (
            <li key={index} onClick={()=>navigate(navItem.linkTo)}>
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
