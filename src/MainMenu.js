import React from 'react';
import { IoNavigate } from "react-icons/io5";
import { MdAir } from "react-icons/md";
import { CgTrack } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from 'react-router-dom'; // Import Link from React Router
import logo from './Assets/magna.png';
import './MainMenu.css';

const MainMenu = () => {
  return (
    <div className="main-menu-container">
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="logo-image" />
      </div>
      <div className="button-container">
        <h2>Our Services</h2>
        <div className="button-group">
          <Link to="/directions" className="icon-container icon-container-1"> {/* Tambahkan Link ke path yang sesuai */}
            <IoNavigate size={50} />
            <p className="icon-text">Get Direction</p>
          </Link>
          <Link to="/air-quality" className="icon-container icon-container-2"> {/* Tambahkan Link ke path yang sesuai */}
            <MdAir size={50} />
            <p className="icon-text">Air Quality Check</p>
          </Link>
        </div>
        <div className="button-group">
          <Link to="/maps-tracking" className="icon-container icon-container-3"> {/* Tambahkan Link ke path yang sesuai */}
            <CgTrack size={50} />
            <p className="icon-text">Maps Tracker</p>
          </Link>
          <Link to="/admin" className="icon-container icon-container-4"> {/* Tambahkan Link ke path yang sesuai */}
            <MdAdminPanelSettings size={50} />
            <p className="icon-text">Admin</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
