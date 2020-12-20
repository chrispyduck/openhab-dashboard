import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";

export default function Clock({ format }: { format: string | undefined }) {
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
}