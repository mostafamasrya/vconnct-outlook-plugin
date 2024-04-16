import { createLightTheme } from "@fluentui/react-theme";
const customBrandRamp = {
  10: "#FFA500", 
  160: "#FFA500",
};
const customTheme = createLightTheme({
  palette: {
    themePrimary: customBrandRamp[10],
    themeLighter: customBrandRamp[10],
    themeLight: customBrandRamp[10],
    themeTertiary: customBrandRamp[10],
    themeSecondary: customBrandRamp[10],
    themeDarkAlt: customBrandRamp[10],
    themeDark: customBrandRamp[10],
    themeDarker: customBrandRamp[10],
    neutralLighterAlt: customBrandRamp[10],
    neutralLighter: customBrandRamp[10],
    neutralLight: customBrandRamp[10],
    neutralQuaternaryAlt: customBrandRamp[10],
    neutralQuaternary: customBrandRamp[10],
    neutralTertiaryAlt: customBrandRamp[10],
    neutralTertiary: customBrandRamp[10],
    neutralSecondary: customBrandRamp[10],
    neutralPrimaryAlt: customBrandRamp[10],
    neutralPrimary: customBrandRamp[10],
    neutralDark: customBrandRamp[10],
    black: customBrandRamp[10],
    white: customBrandRamp[10],
  },
  semanticColors: {
  },
});
export default customTheme;
