import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faExclamation, faListSquares, faBookmark } from "@fortawesome/free-solid-svg-icons";
import NavbarTab from "./NavbarTab";
export default function Navbar(){
    const { isNavOpen } = useSelector((state)=> state.nav);
    return (
        <div className="custom-navbar">
        <nav className="navbar navbar-expand-lg">
          {/* Button to toggle navigation */}

          {/* Navigation links */}
          <div className={`navbar-nav d-flex justify-content-between w-100 ${isNavOpen ? 'show' : ''} align-items-center`}>
            <NavbarTab
              tab="tab1"
              icon={<FontAwesomeIcon icon={faClock} className="rec" />}
            />
            <NavbarTab
              tab="tab2"
              icon={<FontAwesomeIcon icon={faExclamation} className="imp" />}
            />
            <NavbarTab
              tab="tab3"
              icon={<FontAwesomeIcon icon={faListSquares} className="imp" />}
            />
            <NavbarTab
              tab="tab4"
              icon={<FontAwesomeIcon icon={faBookmark} className="imp" />}
            />
          </div>
        </nav>
      </div>
    );
}