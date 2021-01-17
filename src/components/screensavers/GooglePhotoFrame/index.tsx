import React, { useEffect, useState } from "react";
import { IScreensaverProps } from "../IScreensaverProps";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { IGooglePhotoFrameConfiguration, DefaultConfiguration } from "./configuration";
import { merge } from "lodash";
import { MediaItem } from "./api/MediaItem";
import { GooglePhotos } from "./api";
import dateFormat from "dateformat";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      backgroundSize: "cover",
      height: "100vh",
      width: "100vw",
      position: "relative",
    },
    imageInfo: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      textAlign: "right",
      color: "#fff",
      textShadow: "0px 0px 4px #000",
      opacity: 0.9,
    },
    albums: {
      margin: theme.spacing(1),
      padding: 0,
    },
    date: {
      margin: theme.spacing(1),
      padding: 0,
    }
  }),
);

interface IGooglePhotoFrameProps {
  config: IGooglePhotoFrameConfiguration;
  ready: boolean;
  client?: GooglePhotos;
}

const PhotoFrame: React.FC<IGooglePhotoFrameProps> = (props) => {
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const classes = useStyles();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const changeImage = () => {
      props.client?.fetchRandomMedia().then(result => {
        if (!result) {
          console.warn("Failed to retrieve a media item to display");
          timer = setTimeout(changeImage, Math.min(3, props.config.photoChangeInterval) * 1e3);
          return;
        }

        const img = new Image();
        let url = result.url;
        const urlParts = url.split("=");
        if (urlParts.length == 2) {
          url = urlParts[0];
        }
        result.url = img.src = `${url}=w${window.innerWidth}-h${window.innerHeight}-c`;
        img.onload = () => {
          setCurrentMedia(result);
          timer = setTimeout(changeImage, props.config.photoChangeInterval * 1e3);
        }
        img.onerror = (eventOrMessage, source, line, col, error) => {
          console.warn(`Error loading image ${result.id}: ${result.url}`, error);
          timer = setTimeout(changeImage, Math.min(3, props.config.photoChangeInterval) * 1e3);
        }
      }, error => {
        console.warn("Error in fetchRandomMedia()", error);
        timer = setTimeout(changeImage, props.config.photoChangeInterval * 1e3);
      });
    };
    changeImage();
    return () => {
      if (timer)
        clearTimeout(timer);
    }
  }, [props.config]);

  if (!currentMedia) {
    return <span>Loading...</span>;
  }

  return (
    <div className={classes.image} style={{ backgroundImage: `url("${currentMedia.url}")` }}>
      <div className={classes.imageInfo}>
        <h3 className={classes.date}>
          {dateFormat(currentMedia.date, "mmmm dS, yyyy")}
        </h3>
        <h5 className={classes.albums}>
          {currentMedia.albums.map(a => a.title).join(", ")}
        </h5>
      </div>
    </div>
  );
};

const PhotoFrameConfigContainer: React.FC<IScreensaverProps> = (props) => {
  if (!props.show)
    return null;

  const config = merge({}, DefaultConfiguration, props.config as IGooglePhotoFrameConfiguration);
  const [client, setClient] = useState<GooglePhotos | undefined>(undefined);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const localClient = new GooglePhotos(config);
    setClient(localClient);
    localClient.init().then(() => {
      setHasData(true);
    }, e => {
      console.error("Error when fetching data from Google Photos", e);
    })
  }, [props.config]);

  return <PhotoFrame config={config} client={client} ready={hasData} />
}

export default PhotoFrameConfigContainer;