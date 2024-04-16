import React from "react";
import { Button } from "@fluentui/react-components";
import { tokens, makeStyles, Tab, TabList } from "@fluentui/react-components";

// import "../../../assets/main.css"

const useStyles = makeStyles({
  root: {
    minHeight: "96vh",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: "10px",
    paddingBottom: "10px",
  },
  login_button: {
    backgroundColor: tokens.colorPaletteMarigoldForeground3,
    fontColor: tokens.colorNeutralForeground1Hover,
    fontWeight: "bold",
  },
  tab_div: {
    display: "inline-flex",
    float: "right",
    height: "10px",
  },
});

const Header = function () {
  const styles = useStyles();

  return (
    <div>
      <Button className={styles.login_button} size="small">
        Login
      </Button>

      <TabList className={styles.tab_div} defaultSelectedValue="tab2">
        <Tab value="tab1">English</Tab>
        <Tab value="tab2">عربي</Tab>
      </TabList>
    </div>
  );
};
export default Header;
