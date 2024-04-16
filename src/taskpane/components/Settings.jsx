import React, { useState, useEffect } from "react";
import { makeStyles, shorthands, Checkbox } from "@fluentui/react-components";
import { ArrowLeftRegular, ChevronDownRegular, ChevronUpRegular, ArrowRightRegular } from "@fluentui/react-icons";
import lang from "./lang.json";
import CustomCheckbox from "./CustomCheckbox";
const useStyles = makeStyles({
  switch: {
    position: "relative",
    display: "inline-block",
    width: "40px",
    height: "20px",
  },
  input: {
    opacity: "0",
    width: "0",
    height: "0",
  },
  slider: {
    position: "absolute",
    cursor: "pointer",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "#ccc",
    transitionDelay: ".4s",
    ...shorthands.borderRadius("20px"),
  },
  sliderBefore: {
    position: "absolute",
    content: '""',
    height: "17px",
    width: "17px",
    left: "3px",
    bottom: "1px",
    backgroundColor: "white",
    transitionDelay: ".4s",
    ...shorthands.borderRadius("50%"),
  },
  checkedSlider: {
    ...shorthands.borderRadius("20px"),
    backgroundColor: "orange",
  },
  checkedSliderBefore: {
    ...shorthands.borderRadius("50%"),
    transform: "translateX(17px)",
  },
  checkBoxStyles: {
    width: "30px",
  },
  customCheckbox: {
    position: "relative",
    display: "inline-block",
    width: "30px", 
    height: "30px", 
  },
  checkmark: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "#fff", 
    border: "2px solid #333", 
    borderRadius: "50%", 
  },
  hiddenCheckbox: {
    opacity: 0,
    width: "30px",
    height: "30px",
  },
});
const Settings = ({ handleScreensChange, activeLanguage, setting_Data, setSettingData }) => {
  const styles = useStyles();
  const [contentVisibility, setContentVisibility] = useState({});
  const [checkedModerate, setCheckedModerate] = useState(false);
  const [checkedAttendee, setCheckedAttendee] = useState(false);
  useEffect(() => {
    if (setting_Data && setting_Data.data) {
      const newContentVisibility = {};
      setting_Data.data.settings.forEach((setting) => {
        newContentVisibility[setting.group_key] = true;
      });
      setContentVisibility(newContentVisibility);
    }
  }, [setting_Data]);
  const handleCheckboxChange = (option, settingKey) => {
    const updatedSettingData = { ...setting_Data };
    const settingGroup = updatedSettingData.data.settings.find((group) =>
      group.group_settings.some((setting) => setting.setting_key === settingKey)
    );
    const setting = settingGroup.group_settings.find((setting) => setting.setting_key === settingKey);
    if (option === "Moderate") {
      if (setting.moderator === false) {
        setting.moderator = true;
        setting.attendee = true; 
      } else {
        setting.moderator = !setting.moderator;
        setting.attendee = false;
        setting.setting_value = false;
      }
    } else if (option === "Attendee") {
      setting.attendee = !setting.attendee;
      if (setting.attendee === false && setting.moderator === false && setting.general) {
        setting.moderator = null;
        setting.attendee = null;
        setting.setting_value = false;
      }
    }
    setSettingData(updatedSettingData); 
  };
  const toggleContent = (section) => {
    setContentVisibility({ ...contentVisibility, [section]: !contentVisibility[section] });
  };
  const toggleSwitch = (settingKey) => {
    const updatedSettingData = {
      ...setting_Data,
      data: {
        ...setting_Data.data,
        settings: setting_Data.data.settings.map((group) => ({
          ...group,
          group_settings: group.group_settings.map((setting) => {
            if (setting.setting_key === settingKey) {
              const updatedSetting = {
                ...setting,
                setting_value: !setting.setting_value,
              };
              if (updatedSetting.setting_value && updatedSetting.general) {
                updatedSetting.moderator = true;
              }
              return updatedSetting;
            }
            return setting;
          }),
        })),
      },
    };
    setSettingData(updatedSettingData);
  };
  const Content = ({ title, description, checked, onChange, settings }) => (
    <div style={{ display: "flex", flexDirection: "column", paddingTop: "5px" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: "110" }}>
          <p style={{ margin: "0px", fontWeight: 500 }}>{title}</p>
          <small style={{ fontSize: "11px" }}>{description}</small>
        </div>
        <div style={{ flex: "10" }}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={checked}
              onChange={onChange}
              className={styles.input}
              onClick={(e) => e.stopPropagation()}
            />
            <span className={`${styles.slider} ${checked ? styles.checkedSlider : ""}`}>
              <span className={`${styles.sliderBefore} ${checked ? styles.checkedSliderBefore : ""}`}></span>
            </span>
          </label>
        </div>
      </div>
      {settings.general && settings.setting_value && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "5px",
            textAlign: activeLanguage === "ar" ? "end" : "",
            direction: activeLanguage === "ar" ? "ltr" : "",
          }}
        >
          <div style={{ flex: "10" }}>
            <CustomCheckbox
              attendee={settings.moderator}
              onChange={() => handleCheckboxChange("Moderate", settings.setting_key)}
              label={lang[activeLanguage]["moderateBtn"]}
              language={activeLanguage}
            />
            <CustomCheckbox
              attendee={settings.attendee}
              onChange={() => handleCheckboxChange("Attendee", settings.setting_key)}
              label={lang[activeLanguage]["attendeeBtn"]}
              language={activeLanguage}
            />
          </div>
        </div>
      )}
    </div>
  );
  const renderSection = (sectionTitle, sectionKey, groupSettings) => (
    <div>
      <div style={{ display: "flex", padding: "15px 0px 15px 0px" }}>
        <div style={{ flex: "45" }}>
          <small style={{ whiteSpace: "nowrap", paddingRight: "3px" }}>{sectionTitle[activeLanguage]}</small>
        </div>
        <div style={{ flex: "auto", position: "relative", top: "4px", width: "-webkit-fill-available" }}>
          <hr />
        </div>
        <div style={{ flex: "5" }}>
          {contentVisibility[sectionKey] ? (
            <ChevronUpRegular style={{ cursor: "pointer" }} onClick={() => toggleContent(sectionKey)} />
          ) : (
            <ChevronDownRegular style={{ cursor: "pointer" }} onClick={() => toggleContent(sectionKey)} />
          )}
        </div>
      </div>
      <div style={{ display: contentVisibility[sectionKey] ? "block" : "none", transition: "all 0.3s ease" }}>
        {groupSettings.map((setting) => (
          <Content
            key={setting.setting_key}
            title={setting.setting_title[activeLanguage]}
            description={setting.setting_description[activeLanguage]}
            checked={setting.setting_value}
            onChange={() => toggleSwitch(setting.setting_key)}
            settings={setting}
          />
        ))}
      </div>
    </div>
  );
  return (
    <div
      style={{
        direction: activeLanguage === "ar" ? "rtl" : "ltr",
        textAlign: activeLanguage === "ar" ? "right" : "left",
      }}
    >
      <div>
        {activeLanguage === "ar" ? (
          <ArrowRightRegular
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleScreensChange("Home");
            }}
          />
        ) : (
          <ArrowLeftRegular
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleScreensChange("Home");
            }}
          />
        )}
        <h2 style={{ display: "inline-flex", fontWeight: 500, fontSize: "16px", paddingLeft: "8px" }}>
          {lang[activeLanguage]["settingHeading"]}
        </h2>
      </div>
      {setting_Data &&
        setting_Data.data &&
        setting_Data.data.settings.map((settingGroup) => (
          <React.Fragment key={settingGroup.group_key}>
            {renderSection(settingGroup.group_title, settingGroup.group_key, settingGroup.group_settings)}
          </React.Fragment>
        ))}
    </div>
  );
};
export default Settings;
