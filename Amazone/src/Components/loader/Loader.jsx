import React from "react";
import { RiseLoader } from "react-spinners";

function Loader({ fullPage = true, message = "Loading..." }) {
  const containerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: fullPage ? "100vh" : "200px",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  };

  const textStyles = {
    color: "#565959",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div style={containerStyles}>
      <RiseLoader color="#2ed4be" size={15} margin={5} />
      <p style={textStyles}>{message}</p>
    </div>
  );
}

export default Loader;
