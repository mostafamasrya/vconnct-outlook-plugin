import React, { useState } from "react";
import { CiGlobe } from "react-icons/ci";
import {
  makeStyles,
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  MenuPopover,
  MenuList,
  shorthands,
} from "@fluentui/react-components";
const useStyles = makeStyles({
  language_button: {
    backgroundColor: "#F7F5F0",
    ...shorthands.border("0"),
  },
  language_list_button: {
    ...shorthands.border("0"),
    width: "86px",
  },
  language_div: {
    width: "100%",
    position: "relative",
  },
});
export default function Language({ onLanguageChange }) {
  const styles = useStyles();
  const languageCodes = {
    en: "English",
    ar: "عربي",
    ru: "Pусский",
  };
  const [activeLanguage, setActiveLanguage] = useState(() => {
    return localStorage.getItem("activeLanguage") || "en";
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const handleClick = (languageCode) => {
    setActiveLanguage(languageCode);
    localStorage.setItem("activeLanguage", languageCode);
    onLanguageChange(languageCode);
    setMenuOpen(false);
  };
  return (
    <div className={styles.language_div} style={{ textAlign: activeLanguage === "ar" ? "right" : "left" }}>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button icon={<CiGlobe />} shape="square" className={styles.language_button}>
            {languageCodes[activeLanguage]}
          </Button>
        </MenuTrigger>
        <MenuPopover style={{ minWidth: "auto" }}>
          <MenuList>
            {Object.keys(languageCodes).map((code) => (
              <MenuItem
                key={code}
                shape="square"
                className={styles.language_list_button}
                as="button"
                onClick={() => handleClick(code)}
                style={{ backgroundColor: activeLanguage === code ? "#F7F5F0" : "" }}
              >
                {languageCodes[code]}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
}
