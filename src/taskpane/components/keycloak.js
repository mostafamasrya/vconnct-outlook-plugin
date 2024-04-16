import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: process.env.REACT_APP_SSO,
  realm: "Variiance",
  clientId: "VLC",
};
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;