import React, { useState } from "react";
import { Button } from "@fluentui/react-components";
import Language from "./Language";
import { makeStyles, tokens, shorthands } from "@fluentui/react-components";
import lang from "./lang.json";
import Loader from "./Loader";
const useStyles = makeStyles({
  loginButton: {
    ...shorthands.border("0"),
    backgroundColor: "#F8B517",
    color: "#2E2A27",
    fontWeight: "bold",
  },
  loginButtonArabic: {
    maxWidth: "110px",
    minWidth: "110px",
  },
  tabDiv: {
    display: "flex",
  },
  boxSection: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    height: "200px",
    marginTop: "60px",
  },
  scheduleBtn: {
    backgroundColor: "#A7A9AC",
    fontSize: "small",
    width: "100%",
    color: "#fff",
    paddingTop: "5px",
    paddingBottom: "5px",
  },
});
const Login = ({ handleScreensChange, activeLanguage, handleLanguageChange, handleLogin }) => {
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const handle_login = async () => {
    setIsLoading(true);
    handleLogin();
  };
  return (
    <div>
      <Loader loading={isLoading} />
      <div className={styles.tabDiv}>
        {activeLanguage === "ar" ? (
          <>
            <Button
              onClick={handle_login}
              shape="square"
              style={{
                maxWidth: activeLanguage === "ar" ? "110px" : "55px",
                minWidth: activeLanguage === "ar" ? "110px" : "55px",
              }}
              className={styles.loginButton}
            >
              {lang[activeLanguage]["loginButton"]}
            </Button>
            <Language onLanguageChange={handleLanguageChange} />
          </>
        ) : (
          <>
            <Language onLanguageChange={handleLanguageChange} />
            <Button
              onClick={handle_login}
              shape="square"
              style={{
                maxWidth: activeLanguage === "ar" ? "110px" : "55px",
                minWidth: activeLanguage === "ar" ? "110px" : "55px",
              }}
              className={styles.loginButton}
            >
              {lang[activeLanguage]["loginButton"]}
            </Button>
          </>
        )}
      </div>
      <p style={{ fontWeight: 500, fontSize: "small", marginTop: "50%" }}>
        {lang[activeLanguage]["emailScheduleText"]} <span style={{ color: "#F8B517" }}>V.connect Meet</span>{" "}
        {lang[activeLanguage]["outlookPlugin"]}.
      </p>
      <Button disabledFocusable="false" appearance="secondary" size="large" className={styles.scheduleBtn}>
        {lang[activeLanguage]["scheduleMeetingButton"]}
      </Button>
      <p style={{ fontWeight: 500, fontSize: "small", textAlign: "center" }}>
        {lang[activeLanguage]["accountRequiredText"]}
      </p>
    </div>
  );
};
export default Login;
