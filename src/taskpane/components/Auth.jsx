import React from "react";
import { useKeycloak } from "@react-keycloak/web";

const Auth = () => {
  // Using Object destructuring
  const { keycloak, initialized } = useKeycloak();


  const handleLogout = () => {
    keycloak.logout();
  };

  const handleLogin = async () => {
    if (!keycloak.authenticated) {
      //   try {
      //     await keycloak.init({
      //       // Replace with your Keycloak configuration options
      //       url: process.env.REACT_APP_SSO,
      //       realm: "Variiance",
      //       clientId: "VLC",
      //     });
      //   } catch (error) {
      //     console.error("Error initializing Keycloak:", error);
      //     return;
      //   }
      await keycloak.login(); // Initiates SSO login flow
    }
  };

  //   const handleUpdateToken = async () => {
  //     return new Promise((resolve, reject) => {
  //         keycloak.loadUserInfo() // Set minValidity to 5 seconds (optional)
  //           .then(() => {
  //             resolve("Token successfully updated");
  //           })
  //           .catch((error) => {
  //             reject(error);
  //           });
  //       });
  //   };

  const handleUpdateToken = async () => {
    // Replace these with your actual values

    // Get the full URL, including protocol, hostname, and path
    const fullUrl = window.location.href;

    var urlParams = new URLSearchParams(fullUrl.split("#")[1]);
    var code = urlParams.get("code");

    console.log(code);
    console.log(fullUrl);

    const authorizationCode = "your_authorization_code";
    const clientId = "your_client_id";
    const clientSecret = "your_client_secret";
    const redirectUri = "your_redirect_uri";
    const realmName = "your_realm_name";
    const keycloakUrl = "https://your-keycloak-server-url";

    // try {
    //   const response = await fetch(`${keycloakUrl}/auth/realms/${realmName}/protocol/openid-connect/token`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: new URLSearchParams({
    //       grant_type: "authorization_code",
    //       code: authorizationCode,
    //       client_id: clientId,
    //       client_secret: clientSecret,
    //       redirect_uri: redirectUri,
    //     }).toString(),
    //   });

    //   if (!response.ok) {
    //     throw new Error(`Error fetching token: ${response.statusText}`);
    //   }

    //   const data = await response.json();
    //   console.log(data);
    // //   setAccessToken(data.access_token);
    //   console.log(null);
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  const checkKeyloak = () => {
    

    console.log(keycloak);
    console.log(keycloak.endpoints.token());
    console.log(keycloak.updateToken());
    console.log(keycloak.endpoints.userinfo());
    // var data = {
    //   sso_sub: keycloak.tokenParsed.sub,
    //   student: keycloak.tokenParsed.email,
    //   name: keycloak.tokenParsed.given_name,
    //   last_name: keycloak.tokenParsed.family_name,
    //   student_mobile_number: keycloak.tokenParsed.phone_number ? keycloak.tokenParsed.phone_number : "",
    //   service_source: "DASHBOARD",
    // };

    // console.log(data);
  };

  return (
    <div>
      <div>{`User is ${!keycloak.authenticated ? "NOT " : ""}authenticated`}</div>

      {!keycloak.authenticated && (
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      )}

      <button type="button" onClick={checkKeyloak}>
        check data
      </button>

      <button onClick={handleUpdateToken}>Update Token</button>
      <button onClick={handleLogout}>Logout</button>

      {!!keycloak.authenticated && (
        <button type="button" onClick={() => keycloak.logout()}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Auth;
