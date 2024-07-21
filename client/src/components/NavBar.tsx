import { useThemeContext } from "../context/Theme-context";
import { IoMdSearch } from "react-icons/io";
import "../styles/NavBar.scss";
import { ToggleSwitch } from "./ToggleSwitch";
import useScroll from "../hooks/useGetScrollPosition";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/appState";
import { RxCross1 } from "react-icons/rx";
import { RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";

const NavBar = () => {
  const { theme, toggleTheme } = useThemeContext();
  const { direction } = useScroll();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSidebar } = useSelector((state: RootState) => state.appState);
  const toggleSidebarState = () => {
    dispatch(toggleSidebar());
  };


const logout=()=>{
  // console.log("auth2",auth2);
  const auth2 = gapi?.auth2?.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
    navigate("/login", { replace: true })
  });

}
  return (
    <nav className={`navbar ${direction === "up" ? "show" : "hide"}`}>
      <div className="icons">
        <div className="hamburger_icon">
          {showSidebar ? (
            <RxCross1
              size="1.8rem"
              onClick={toggleSidebarState}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <RxHamburgerMenu
              size="1.8rem"
              onClick={toggleSidebarState}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
        <img
          className="logo"
          alt="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Youtube_vanced.png"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="search-bar">
        <IoMdSearch
          size="1.2rem"
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translate(0, -50%)",
          }}
        />
        <input type="text" placeholder="Search"></input>
      </div>
      <div className="nav_logout_toggle">
        <button
          className="blueBtn borderBlueBtn"
          onClick={logout}
        >
          Log Out
        </button>
        <ToggleSwitch onSwitch={toggleTheme} isChecked={theme === "dark"} />
      </div>
    </nav>
  );
};

export default NavBar;
