import React from "react";

export default function Input({
  type = "text",
  className = "",
  style = {},
  value,
  onChange,
  placeholder = "",
  required = false,
  ...props
}) {
  return (
    <input
      type={type}
      className={className}
      style={{...style }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      {...props} // allows passing extra things like minLength, maxLength, onBlur, etc.
    />
  );
}
