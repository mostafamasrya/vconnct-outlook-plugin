import React from "react";
import { Oval } from "react-loader-spinner";
import { makeStyles, shorthands } from "@fluentui/react-components";
const useStyles = makeStyles({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(249, 255, 255, 0.858)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    ...shorthands.transition("opacity", "0.3s", "ease-in"),
    opacity: 0,
    pointerEvents: "none",
  },
  visible: {
    opacity: 1,
    pointerEvents: "auto",
  },
  loader_container: {
    position: "relative",
    textAlign: "center",
    marginBottom: "90%",
  },
});
const Loader = ({ loading }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.overlay} ${loading ? classes.visible : ""}`}>
      <div className={classes.loader_container}>
        <div>
          <Oval
            visible={true}
            height="40"
            width="40"
            secondaryColor="gray"
            color="orange"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
            strokeWidth="4"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
export default Loader;
