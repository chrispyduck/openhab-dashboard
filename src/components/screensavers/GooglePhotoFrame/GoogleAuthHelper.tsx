import React, { useEffect, useContext } from "react";
import { GooglePhotos } from "./api";
import DataContext from "components/DataContext";
import { IGooglePhotoFrameConfiguration } from "./configuration";

export const GoogleAuthHelper: React.FC = () => {
  const context = useContext(DataContext);

  useEffect(() => {
    const api = new GooglePhotos(context.configuration.screensaver as IGooglePhotoFrameConfiguration);
    api.init().then(() => {
      window.location.href = "/";
    });
  }, []);

  return (
    <span>
      Authenticating...
    </span>
  );
}
