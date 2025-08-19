import React from "react";
import { useSelector } from "react-redux";
import Button from "../Button/Button";
import { useHandleTabClick } from "../../Utils/Navbar/Navbar";

export default function NavbarTab({
    tab = 'tab1',
    icon
}) {
    const selectedTab = useSelector((state) => state.nav);
    const handleTabClick = useHandleTabClick();
    return (
        <div className={`nav-item d-flex flex-column align-items-center ${selectedTab === tab ? 'active' : ''} col`} onClick={() => handleTabClick(tab)}>
            <Button
                className="nav-link btn btn-link tab-button d-flex align-items-center justify-content-center"
                icon={icon}
            />
        </div>
    );
    
}