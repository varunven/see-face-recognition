import { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/nav-bar-logo.png"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";

// Renders a horizontal navigation bar for the different pages on web and mobile
const Navbar = () => {

    const [toggle, isToggled] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 850);

    useEffect(() => {
      const reactToWindowResize = () => {
        setIsMobile(window.innerWidth <= 850);
      }
      window.addEventListener('resize', reactToWindowResize);
    });

    // set up navigation pages
    const renderNavItems = () => {
      if (isMobile) {
        return (
          <>
          <Link to={'/'}>
            <li className={"item " + (toggle ? "active" : "")}><a>Home</a></li>
          </Link>

          <Link to={'/object-recognition'}>
            <li className={"item " + (toggle ? "active" : "")}><a>Object Recognition Settings</a></li>
          </Link>

          <Link to={'/object-detection'}>
            <li className={"item " + (toggle ? "active" : "")}><a>Object Detection Settings</a></li>
          </Link>

          <Link to={'/learned-faces'}>
            <li className={"item " + (toggle ? "active" : "")}><a>Learned Faces</a></li>
          </Link>

          <Link to={'/view-stream'}>
            <li className={"item " + (toggle ? "active" : "")}><a>View Stream</a></li>
          </Link>
          </>
        )
      } else {
        return(
          <div className="nav-items">

            <Link to={'/'}>
              <li className={"item " + (toggle ? "active" : "")}><a>Home</a></li>
            </Link>

            <Link to={'/object-recognition'}>
              <li className={"item " + (toggle ? "active" : "")}><a>Object Recognition Settings</a></li>
            </Link>

            <Link to={'/object-detection'}>
              <li className={"item " + (toggle ? "active" : "")}><a>Object Detection Settings</a></li>
            </Link>

            <Link to={'/learned-faces'}>
              <li className={"item " + (toggle ? "active" : "")}><a>Learned Faces</a></li>
            </Link>

            <Link to={'/view-stream'}>
              <li className={"item " + (toggle ? "active" : "")}><a>View Stream</a></li>
            </Link>



          </div>
        )
      }
    }

    return (        
    <nav>
        <ul className="menu">
            <Link to={'/'}>
              <img className="img-logo" src={logo}></img>
            </Link>

            {renderNavItems()}

            <FontAwesomeIcon className="toggle-icon" icon={toggle ? faX : faBars} onClick={() => {isToggled(!toggle)}}/>
        </ul>
    </nav>
    )
}

export default Navbar