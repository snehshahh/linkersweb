import React from "react";

export default function Button({ 
  onClick, 
  icon, 
  text, 
  className = "", 
  style = {}, 
  type = "button" ,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`btn ${className}`}
      style={style}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
}
