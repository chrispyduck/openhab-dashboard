import React from "react";
import * as IconsImport from "@material-ui/icons";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";
import { library, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fab, fas, far);

interface IIcon {
  new(): React.ReactNode;
}

interface IconDictionary {
  [key: string]: IIcon;
}

const Icons = IconsImport as unknown as IconDictionary;

const Icon: React.FC<{ icon: string }> = ({ icon }) => {
  const nameParts = icon.split(":");
  let libraryName, iconName;
  if (nameParts.length == 2) {
    libraryName = nameParts[0];
    iconName = nameParts[1];
  } else if (nameParts.length == 1) {
    libraryName = "material";
    iconName = icon;
  } else {
    throw new Error("The icon name must be in the form \"name\" or \"library:name\"");
  }

  switch (libraryName) {
    case "material": {
      const Icon = Icons[iconName] as any;
      if (!Icon)
        break;
      return <Icon />;
    }

    case "fab":
    case "fas":
    case "far": {
      const match = findIconDefinition({
        prefix: libraryName as IconPrefix,
        iconName: iconName as IconName,
      });
      if (!match)
        break;
      return <FontAwesomeIcon size="3x" icon={[libraryName as IconPrefix, iconName as IconName]} />;
    }
  }

  console.warn(`Missing icon: ${icon}`);
  return <FontAwesomeIcon icon={["far", "circle"]} size="3x" />;
};

export default Icon;
