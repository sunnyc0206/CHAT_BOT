import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFormCreatorClick = () => {
    navigate("/");
  };

  const handleFormListClick = () => {
    navigate("/form-list");
  };

  const handleDataListClick = () => {
    navigate("/data-list");
  };

  return (
    <div className="sidebar">
      <button
        onClick={handleFormCreatorClick}
        className={location.pathname === "/" ? "active" : ""}
      >
        Form Creator
      </button>
      <button
        onClick={handleFormListClick}
        className={location.pathname === "/form-list" ? "active" : ""}
      >
        Form List
      </button>
      <button
        onClick={handleDataListClick}
        className={location.pathname === "/data-list" ? "active" : ""}
      >
        My Submissions
      </button>
    </div>
  );
};

export default Sidebar;
