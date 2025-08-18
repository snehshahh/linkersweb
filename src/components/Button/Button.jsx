import React from "react";

export default function Button({ 
  onClick, 
  icon, 
  text, 
  className = "", 
  style = {}, 
  type = "button" 
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`btn ${className}`}
      style={style}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
}
