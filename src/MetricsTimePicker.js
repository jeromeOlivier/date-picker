import React, { useState, useEffect } from "react";

const MetricsTimePicker = ({ time, onTimeChange }) => {
  const [localTime, setLocalTime] = useState(time);

  useEffect(() => {
      setLocalTime(time);
  }, [time]);

  const handleHourChange = event => {
    let newHour = Number(event.target.value);
    if (newHour > 23) {
      newHour = 0;
    } else if (newHour < 0) {
      newHour = 23;
    }
    const timeParts = localTime.split(":");
    timeParts[0] = String(newHour).padStart(2, "0");
    const newTime = timeParts.join(':');
    setLocalTime(newTime); // update local state
    onTimeChange(newTime); // notify the parent component
  };

  const handleMinuteChange = event => {
    let newMinute = Number(event.target.value);
    if (newMinute > 59) {
      newMinute = 0;
    } else if (newMinute < 0) {
      newMinute = 59;
    }
    const timeParts = time.split(":");
    timeParts[1] = String(newMinute).padStart(2, "0");
    const newTime = timeParts.join(":");
    setLocalTime(newTime); // update local state
    onTimeChange(newTime); // notify the parent component
  };

  const handleSecondChange = event => {
    let newSecond = Number(event.target.value);
    if (newSecond > 59) {
      newSecond = 0;
    } else if (newSecond < 0) {
      newSecond = 59;
    }
    const timeParts = time.split(":");
    timeParts[2] = String(newSecond).padStart(2, "0");
    const newTime = timeParts.join(":");
    setLocalTime(newTime); // update local state
    onTimeChange(newTime); // notify the parent component
  };

  return (
    <div>
      H:
      <input type="number"
             value={ time.split(':')[0] }
             onChange={ handleHourChange }
      />
      M:
      <input type="number"
             value={ time.split(':')[1] }
             onChange={ handleMinuteChange }
      />
      S:
      <input type="number"
             value={ time.split(':')[2] }
             onChange={ handleSecondChange }
      />
    </div>
  );
};

export default MetricsTimePicker;
