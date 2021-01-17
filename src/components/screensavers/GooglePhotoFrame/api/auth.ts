import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import { IGooglePhotoFrameConfiguration } from "../configuration";
//import KeyStore from "../../../data/KeyStore";
import { CredentialsTable } from "./storage";

const SCOPES = [
  "https://www.googleapis.com/auth/photoslibrary.readonly"
];

const getSavedToken = async (config: IGooglePhotoFrameConfiguration): Promise<Credentials | undefined> => {
  const result = await CredentialsTable.get("google:" + config.oAuthClientId);
  return result?.key;
}

const saveToken = async (config: IGooglePhotoFrameConfiguration, key: Credentials): Promise<void> => {
  await CredentialsTable.put({
    id: "google:" + config.oAuthClientId,
    key
  });
}

export const login = async (config: IGooglePhotoFrameConfiguration): Promise<OAuth2Client> => {
  const client = new OAuth2Client(config.oAuthClientId, config.oAuthClientSecret, window.location.toString());
  const savedToken = await getSavedToken(config);
  if (savedToken) {
    savedToken.expiry_date
    client.setCredentials(savedToken);
  }
  else {
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    await new Promise<Credentials>((resolve) => {
      console.warn(`
**********************************************************************************************
This application needs to be authorized with Google. Please go to the following URL to login:
${url}

Once you have logged in, provide your code by running the following command in your browser
console: 

         window.__openhab_dashboard_google_oauth_verify("the code");
**********************************************************************************************`);
      const yuck = window as unknown as {
        __openhab_dashboard_google_oauth_verify: (code: string) => Promise<void>
      };
      yuck.__openhab_dashboard_google_oauth_verify = async function (code: string) {
        console.info("Fetching token ...");
        const token = await client.getToken(code);
        console.info("Token received; saving it ...", token);
        await saveToken(config, token.tokens);
        resolve(token.tokens);
      }
    });
  }
  client.forceRefreshOnFailure = true;
  return client;
}