import React, { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { makeStyles, tokens, shorthands } from "@fluentui/react-components";
import { SettingsRegular } from "@fluentui/react-icons";
import moment from "moment";
import Language from "./Language";
import lang from "./lang.json";
import Loader from "./Loader";
const useStyles = makeStyles({
  logoutButton: {
    ...shorthands.border("0"),
    backgroundColor: "#F7F5F0",
    color: "#A7A9AC",
    fontWeight: "bold",
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
    backgroundColor: "#F8B517",
    color: "#2E2A27",
    fontSize: "small",
    width: "100%",
    paddingTop: "5px",
    paddingBottom: "5px",
  },
});
const Home = ({ handleScreensChange, activeLanguage, handleLanguageChange, setting_Data, user_data, handleLogout }) => {
  const styles = useStyles();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisable, setButtonDisable] = useState(false);
  function convertTimeToDesiredFormat(time) {
    const momentTime = moment(time);
    return momentTime.format("HH:mm:ss");
  }
  function convertDateToDesiredFormat(date) {
    const momentDate = moment(date);
    return momentDate.format("YYYY-MM-DD");
  }
  useEffect(() => {
  }, [setting_Data]);
  async function getMeetingDetails() {
    try {
      const subjectResult = await new Promise((resolve, reject) => {
        Office.context.mailbox.item.subject.getAsync(function (asyncResultSubject) {
          if (asyncResultSubject.status === Office.AsyncResultStatus.Succeeded) {
            resolve(asyncResultSubject.value);
          } else {
            reject(new Error("Error getting subject: " + asyncResultSubject.error.message));
          }
        });
      });
      const startTimeResult = await new Promise((resolve, reject) => {
        Office.context.mailbox.item.start.getAsync(function (asyncResultStart) {
          if (asyncResultStart.status === Office.AsyncResultStatus.Succeeded) {
            resolve(asyncResultStart.value);
          } else {
            reject(new Error("Error getting start time: " + asyncResultStart.error.message));
          }
        });
      });
      const endTimeResult = await new Promise((resolve, reject) => {
        Office.context.mailbox.item.end.getAsync(function (asyncResultEnd) {
          if (asyncResultEnd.status === Office.AsyncResultStatus.Succeeded) {
            resolve(asyncResultEnd.value);
          } else {
            reject(new Error("Error getting end time: " + asyncResultEnd.error.message));
          }
        });
      });
      const startTime = convertTimeToDesiredFormat(startTimeResult);
      const endTime = convertTimeToDesiredFormat(endTimeResult);
      const startDate = convertDateToDesiredFormat(startTimeResult);
      return {
        subject: subjectResult,
        startDate: startDate,
        startTime: startTime,
        endTime: endTime,
      };
    } catch (error) {
      console.error("Error occurred while fetching meeting details: ", error);
      throw error;
    }
  }
  const handleScheduleMeeting = async () => {
    try {
      setErrorMessage("");
      setIsError(false);
      setIsLoading(true);
      const meetingDetails = await getMeetingDetails();
      if (!meetingDetails.subject) {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage("Title is required.");
        return;
      }
      var settings = {
        url: process.env.REACT_APP_API_URL,
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          url: "api/method/vconnct.v2.meeting.create",
          data: {
            engine_type: "Meet",
            meeting_type: "schedule",
            student_id: user_data.name,
            title: meetingDetails.subject,
            room_id: setting_Data.data.room_id,
            password: "",
            meeting_status: "Not Started",
            meeting_date: meetingDetails.startDate,
            meeting_time: meetingDetails.startTime,
            meeting_settings: setting_Data.data.settings,
            invitations: [],
          },
        }),
      };
      fetch(settings.url, {
        method: settings.method,
        headers: settings.headers,
        body: settings.data,
      })
        .then((response) => response.json())
        .then((data) => {
          updateEventItem(data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          // setIsLoading(false);
          if (error.response && error.response.data) {
            console.log(error.response);
            const { error: errorType, error_description: errorDescription } = error.response.data;
            if (error.response.status === 401) {
              console.error("Token verification failed:", errorDescription);
              setIsLoading(true);
              handleLogout();
              setIsLoading(false);
            } else {
              console.error("Other error occurred:", errorType, errorDescription);
            }
          } else {
            console.error("Unknown error occurred.");
          }

        });
    } catch (error) {
      console.error("Error occurred while fetching meeting time: ", error);
    }
  };
  async function updateEventItem(apiResponse) {
    try {
      Office.context.mailbox.item.location.setAsync(apiResponse.meeting_url, function (asyncResultLocation) {
        if (asyncResultLocation.status === Office.AsyncResultStatus.Failed) {
          console.error("Error setting location:", asyncResultLocation.error.message);
        } else {
        }
      });
    } catch (error) {
      console.error("Error occurred while updating event item:", error);
    }
  }
  useEffect(() => {
    Office.onReady(() => {
      Office.context.mailbox.item.addHandlerAsync(
        Office.EventType.EnhancedLocationsChanged,
        getChangedLocation,
        (asyncResult) => {
          if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            
            return;
          }
          getChangedLocation();
        }
      );
    });
  }, [Office.context.mailbox.item.addHandlerAsync]);
  useEffect(() => {
    Office.onReady(() => {
      Office.context.mailbox.item.location.getAsync((result) => {
        if (result.status !== Office.AsyncResultStatus.Succeeded) {
          console.error(`Action failed with message ${result.error.message}`);
          return;
        }
        if (result.value && result.value.indexOf("vconnect")) {
          setButtonDisable(true);
        } else {
          setButtonDisable(false);
        }
      });
    });
  }, []);
  function getChangedLocation(eventArgs) {
    if (eventArgs && eventArgs.enhancedLocations && eventArgs.enhancedLocations.length > 0) {
      checkLocationIfVConnect(eventArgs.enhancedLocations[0].locationIdentifier.id);
    } else {
      setButtonDisable(false);
    }
  }
  function checkLocationIfVConnect(location) {
    if (location.indexOf("vconnct")) {
      setButtonDisable(true);
    } else {
      setButtonDisable(false);
    }
  }
  return (
    <div>
      <Loader loading={isLoading} />
      {/* <button onClick={addLcoationEvent}>Add Event</button> */}
      <div className={styles.tabDiv}>
        {activeLanguage === "ar" ? (
          <>
            <Button
              onClick={handleLogout}
              className={styles.logoutButton}
              style={{
                maxWidth: activeLanguage === "ar" ? "110px" : "75px",
                minWidth: activeLanguage === "ar" ? "110px" : "75px",
              }}
              shape="square"
            >
              {lang[activeLanguage]["logoutButton"]}
            </Button>
            <Language onLanguageChange={handleLanguageChange} />
          </>
        ) : (
          <>
            <Language onLanguageChange={handleLanguageChange} />
            <Button
              onClick={handleLogout}
              className={styles.logoutButton}
              style={{
                maxWidth: activeLanguage === "ar" ? "110px" : "75px",
                minWidth: activeLanguage === "ar" ? "110px" : "75px",
              }}
              shape="square"
            >
              {lang[activeLanguage]["logoutButton"]}
            </Button>
          </>
        )}
      </div>
      <p
        style={{
          fontWeight: 500,
          fontSize: "small",
          marginTop: "50%",
          textAlign: activeLanguage === "ar" ? "right" : "left",
        }}
      >
        {lang[activeLanguage]["emailScheduleText"]}{" "}
        <span style={{ color: "#F8B517" }}>{lang[activeLanguage]["outlookPluginText"]}</span>{" "}
        {lang[activeLanguage]["outlookPlugin"]}
      </p>
      <div style={{ display: "flex" }}>
        <Button
          appearance="secondary"
          onClick={handleScheduleMeeting}
          style={{ flex: "90" }}
          size="large"
          className={styles.scheduleBtn}
          disabled={isButtonDisable}
        >
          {lang[activeLanguage]["scheduleMeetingButton"]}
        </Button>
        <Button
          onClick={() => {
            handleScreensChange("Settings");
          }}
          style={{ flex: "30", marginLeft: "3px" }}
          icon={<SettingsRegular />}
        />
      </div>
      {isError ? <p style={{ color: "red" }}>{errorMessage}</p> : ""}
    </div>
  );
};
export default Home;
