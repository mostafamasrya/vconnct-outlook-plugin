import React, { useState, useEffect } from "react";
import { FluentProvider } from "@fluentui/react-components";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { makeStyles, tokens } from "@fluentui/react-components";
import Login from "./Login";
import Home from "./Home";
import Settings from "./Settings";
import Loader from "./Loader";
import axios from "axios";
import customTheme from "../../theme";
initializeIcons();
const useStyles = makeStyles({
  root: {
    minHeight: "96vh",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  rootPrimary: { backgroundColor: tokens.colorPaletteMarigoldForeground3 },
});
const App = () => {
  const styles = useStyles();
  const [screen, setScreen] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(localStorage.getItem("activeLanguage") || "en");
  const [settingData, setSettingData] = useState(null);
  let dialog;
  useEffect(() => {
    let loggedIn = localStorage.getItem("keycloak_token");
    if (loggedIn) {
      getCurrentUser();
    } else {
      setScreen("Login");
      setIsLoading(false);
    }
  }, []);
  const handleScreensChange = (screen) => {
    setScreen(screen);
  };
  const handleLanguageChange = (language) => {
    setActiveLanguage(language);
  };
  const handleLogin = () => {
    const redirectURL = `${process.env.REACT_APP_REDIRECT_URL}/assets/redirectPage.html`;
    Office.context.ui.displayDialogAsync(
      `${process.env.REACT_APP_SSO}/realms/Variiance/protocol/openid-connect/auth?client_id=VLC&redirect_uri=${redirectURL}&state=8215a188-9858-4167-8751-337eba4b130a&response_mode=fragment&response_type=code&scope=openid&nonce=a1f1a86f-5724-4df5-80a8-8e3ee3336ec9&ui_locales=${activeLanguage}`,
      { height: 70, width: 70 },
      function (asyncResult) {
        dialog = asyncResult.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
      }
    );
  };
  async function processMessage(arg) {
    dialog.close();
    getToken(arg.message);
  }
  const getToken = async (AuthCodeURL) => {
    const codeRegex = /code=([^&]+)/;
    const match = AuthCodeURL.match(codeRegex);
    const code = match ? match[1] : null;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("code", code);
    urlencoded.append("redirect_uri", `${process.env.REACT_APP_REDIRECT_URL}/assets/redirectPage.html`);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };
    fetch(`${process.env.REACT_APP_SSO_SERVER}/api/keycloak-token`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const accessToken = result.access_token;
        localStorage.setItem("keycloak_token", accessToken);
        localStorage.setItem("keycloak_refresh_token", result.refresh_token);
        getCurrentUser();
      })
      .catch((error) => console.error(error));
  };
  async function refreshToken() {
    // debugger;

    handle_Logout();

    // const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    // const urlencoded = new URLSearchParams();
    // urlencoded.append("refresh_token", localStorage.getItem("keycloak_refresh_token"));
    // const requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: urlencoded,
    //   redirect: "follow",
    // };
    // try {
    //   const response = await fetch(`${process.env.REACT_APP_SSO_SERVER}/api/refresh-token`, requestOptions);
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }
    //   const data = await response.json();
    //   localStorage.setItem("keycloak_token", data.access_token);
    //   localStorage.setItem("keycloak_refresh_token", data.refresh_token);

    //   return data.access_token;
    // } catch (error) {
    //   console.error("Error refreshing token:", error);
    //   throw error;
    // }
  }
  async function getCurrentUser() {
    let accessToken = localStorage.getItem("keycloak_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SSO}/realms/Variiance/protocol/openid-connect/userinfo`,
        config
      );
      fetchUser(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response);
        const { error: errorType, error_description: errorDescription } = error.response.data;
        if (error.response.status === 401) {
          console.error("Token verification failed:", errorDescription);
          setIsLoading(true);
          handle_Logout();
          setIsLoading(false);
          // await refreshToken();
          // await getCurrentUser();
          // setIsLoading(false);
        } else {
          console.error("Other error occurred:", errorType, errorDescription);
        }
      } else {
        console.error("Unknown error occurred.");
      }
    }
  }
  const fetchUser = async (userInfo) => {
    try {
      const userData = {
        url: "api/method/variiance.users.api.v2.profile.get_user",
        data: {
          data: {
            sso_sub: userInfo.sub,
            student: userInfo.email,
            name: userInfo.given_name,
            last_name: userInfo.family_name,
            student_mobile_number: userInfo.phone_number ? userInfo.phone_number : "",
            service_source: "DASHBOARD",
          },
        },
      };
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };
      const response = await fetch(process.env.REACT_APP_API_URL, params);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setScreen("Home");

      setUser(result.data);
      fetchData(result.data.name);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching user:", error);
    }
  };
  let logoutDialoge;
  const handle_Logout = () => {
    const redirectURL = `${process.env.REACT_APP_REDIRECT_URL}/assets/redirectLogout.html`;
    Office.context.ui.displayDialogAsync(
      `${process.env.REACT_APP_SSO}/realms/Variiance/protocol/openid-connect/logout?redirect_uri=${redirectURL}`,
      { height: 50, width: 40 },
      function (asyncResult) {
        logoutDialoge = asyncResult.value;
        logoutDialoge.addEventHandler(Office.EventType.DialogMessageReceived, processMessageLogout);
      }
    );
    async function processMessageLogout(arg) {
      logoutDialoge.close();
      localStorage.removeItem("keycloak_token");
      localStorage.removeItem("keycloak_refresh_token");
      setScreen("Login");
    }
  };
  const updateSettingData = (newSettingData) => {
    setSettingData(newSettingData);
  };
  const fetchData = async (userID) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}?url=api/method/vconnct.v2.meeting.get_meeting_settings_for_plugin?user_id=` +
          userID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSettingData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };
  const getFontFamily = () => {
    switch (activeLanguage) {
      case "en":
        return "'Inter', sans-serif";
      case "ar":
        return "'Almarai', sans-serif";
      case "ru":
        return "'Bitter', sans-serif";
      default:
        return "'Inter', sans-serif";
    }
  };
  return (
    <FluentProvider theme={customTheme} rtl={true}>
      <Loader loading={isLoading} />

      <div className={styles.root} style={{ fontFamily: getFontFamily() }}>
        {screen === "Login" && (
          <Login
            activeLanguage={activeLanguage}
            handleScreensChange={handleScreensChange}
            handleLanguageChange={handleLanguageChange}
            handleLogin={handleLogin}
          />
        )}
        {screen === "Home" && (
          <Home
            activeLanguage={activeLanguage}
            handleScreensChange={handleScreensChange}
            handleLanguageChange={handleLanguageChange}
            setting_Data={settingData}
            user_data={user}
            handleLogout={handle_Logout}
          />
        )}
        {screen === "Settings" && (
          <Settings
            handleScreensChange={handleScreensChange}
            activeLanguage={activeLanguage}
            setting_Data={settingData}
            setSettingData={updateSettingData}
          />
        )}
      </div>
    </FluentProvider>
  );
};
export default App;
