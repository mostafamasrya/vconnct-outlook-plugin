import React from "react";
import { shorthands } from "@fluentui/react-components";

const CustomCheckbox = ({ attendee, onChange, label, language }) => {
  const customCheckBox = {
    appearance: "none",
    width: "17px",
    height: "17px",
    // borderRadius: "50%",
    ...shorthands.border("1px", "solid", "#cccccc"),
    ...shorthands.borderRadius("50%"),
    // border: "1px solid #cccccc",
    backgroundColor: attendee ? "#FFA500" : "transparent",
    marginRight: "5px",
    verticalAlign: "middle",
    outline: "none",
    cursor: "pointer",
    position: "absolute",
    left: "0",
    top: "0",
  };

  const checkedBox = {
    position: "absolute",
    top: "28%",
    left: language === "ar" ? "15%" : language === "ru" ? "10%" : "12%",
    width: "3px",
    height: "9px",
    borderBottom: "2px solid white",
    borderRight: "2px solid white",
    rotate: "40deg",
  };

  return (
    <label style={{ display: "inline-block", cursor: "pointer", position: "relative", marginRight: "5px" }}>
      <input type="checkbox" checked={attendee} onChange={onChange} style={customCheckBox} />
      <span style={{ verticalAlign: "middle", paddingLeft: "25px" }}>{label}</span>
      {attendee && <span style={checkedBox} />}
    </label>
  );
};

export default CustomCheckbox;
