import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";

const Clock: React.FC<{ format: string | undefined }> = ({ format }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(new Date());
    }, 1000);
    return () => clearTimeout(timer);
  });
  return (
    <span>
      {dateFormat(time, format || "shortTime")}
    </span>
  );
};

export default Clock;