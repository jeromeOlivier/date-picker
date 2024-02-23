import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import MetricsTimePicker from "./MetricsTimePicker";

const incrementTime = (time) => {
  let [hours, minutes, seconds] = time.split(":").map(Number);
  seconds += 1;
  // if time elements breach max values, reset to zero
  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
    if (minutes >= 60) {
      minutes = 0;
      hours += 1;
      if (hours >= 24) {
        hours = 0;
      }
    }
  }
  // convert hours, minutes, and seconds to strings, pad with zeros if single digit,
  // join to format time in "HH:MM:SS"
  return [hours, minutes, seconds].map(v => String(v).padStart(2, "0")).join(":");
};

const decrementTime = (time) => {
  let [hours, minutes, seconds] = time.split(":").map(Number);
  seconds -= 1;
  // If time elements become negative, set them to max values
  if (seconds < 0) {
    seconds = 59;
    minutes -= 1;
    if (minutes < 0) {
      minutes = 59;
      hours -= 1;
      if (hours < 0) {
        hours = 23;
      }
    }
  }
  // convert time to strings, pad with zeros, join to format time in "HH:MM:SS"
  return [hours, minutes, seconds].map(v => String(v).padStart(2, "0")).join(":");
};

function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  // pad with zeros if time values are less than 10
  return [hours, minutes, seconds].map(num => num < 10 ? "0" + num : num).join(":");
}

function App() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState(formatTime(new Date()));

  const handleStartDateChange = (date) => {
    let newEndDate = endDate;
    // condition checks if the chosen start date matches the end date
    if (date.getTime() === endDate.getTime()) {
      // convert end time to milliseconds
      let [eHours, eMinutes, eSeconds] = endTime.split(":").map(Number);
      const endTimeInMs = new Date().setHours(eHours, eMinutes, eSeconds, 0);
      // convert start time to milliseconds
      let [sHours, sMinutes, sSeconds] = startTime.split(":").map(Number);
      const startTimeInMs = new Date().setHours(sHours, sMinutes, sSeconds, 0);
      // condition checks if the start time is later than the end time
      if (startTimeInMs > endTimeInMs) {
        newEndDate = new Date(date);
        newEndDate.setDate(newEndDate.getDate() + 1);
        // condition checks if the recalculated end date is in the future
        if (newEndDate > new Date()) {
          date.setDate(date.getDate() - 1);
        } else {
          setEndDate(newEndDate);
        }
      }
    }
    // condition checks if the chosen start date is later than the existing end date
    else if (date > endDate) {
      newEndDate = new Date(date);
      setEndDate(newEndDate);
    }
    // sets new start date.
    setStartDate(date);
  };

  const handleEndDateChange = date => {
    if (date < startDate) {
      date = new Date(startDate);
    }
    setEndDate(date);
  };

  const handleStartTimeChange = (newTime) => {
    const [hours, minutes, seconds] = newTime.split(":").map(Number);
    // new Date object from the existing startDate, set the hours, minutes, and seconds
    let newStartDate = new Date(startDate);
    newStartDate.setHours(hours, minutes, seconds, 0);
    // new Date object from the existing endDate
    let newEndDate = new Date(endDate);
    // new end date & time in UTC
    const [eHours, eMinutes, eSeconds] = endTime.split(":").map(Number);
    const endDateTimeInMs = newEndDate.setHours(eHours, eMinutes, eSeconds, 0);

    const now = new Date();
    // if new start date is today and the new start time is in the future, set the start date and time to now
    if (newStartDate.toDateString() === now.toDateString() && newStartDate.getTime() > now.getTime()) {
      newStartDate = now;
      newTime = formatTime(now);
    }
    // if new start date/time is the same as or later than the end date/time, adjust the end date & time
    if (newStartDate.getTime() >= endDateTimeInMs && !(newTime === "23:59:59" && endTime === "00:00:00")) {
      newEndDate = new Date(newStartDate);
      let newEndTime = incrementTime(newTime);
      if (newEndTime === "00:00:00") {
        newEndDate.setDate(newStartDate.getDate() + 1);
      }
      // update states
      setEndDate(newEndDate);
      setEndTime(newEndTime);
    }
    setStartDate(newStartDate);
    setStartTime(newTime);
  };

  const handleEndTimeChange = (newTime) => {
    // new Date objects from the existing endDate and startDate
    const [hours, minutes, seconds] = newTime.split(":").map(Number);
    let newEndDate = new Date(endDate);
    newEndDate.setHours(hours, minutes, seconds, 0);
    let newStartDate = new Date(startDate);
    // new start date & time in UTC
    const [sHours, sMinutes, sSeconds] = startTime.split(":").map(Number);
    const startDateTimeInMs = newStartDate.setHours(sHours, sMinutes, sSeconds, 0);

    const now = new Date();
    // if new end date is today and the new end time is in the future, set the end date and time to now
    if (newEndDate.toDateString() === now.toDateString() && newEndDate.getTime() > now.getTime()) {
      newEndDate = now;
      newTime = formatTime(now);
    }
    // if the end dateTime is the same or before the start dateTime, push the start dateTime back appropriately
    if (newEndDate.getTime() <= startDateTimeInMs && !(startTime === "23:59:59" && newTime === "00:00:00")) {
      newStartDate = new Date(newEndDate);
      let newStartTime = decrementTime(newTime);
      if (newStartTime === "23:59:59") {
        newStartDate.setDate(newEndDate.getDate() - 1);
      }
      // update states
      setStartDate(newStartDate);
      setStartTime(newStartTime);
    }
    setEndDate(newEndDate);
    setEndTime(newTime);
  };

  return (
    <>
      <div>
        Start Date: <DatePicker
        selected={ startDate }
        onChange={ handleStartDateChange }
        selectsStart
        startDate={ startDate }
        endDate={ endDate }
        maxDate={ new Date() }
      />
      </div>
      <MetricsTimePicker
        time={ startTime }
        onTimeChange={ handleStartTimeChange }

      />
      <div>
        End Date: <DatePicker
        selected={ endDate }
        onChange={ handleEndDateChange }
        selectsEnd
        startDate={ startDate }
        endDate={ endDate }
        minDate={ startDate }
        maxDate={ new Date() }
      />
      </div>
      <MetricsTimePicker
        time={ endTime }
        onTimeChange={ handleEndTimeChange }
      />
    </>
  );
}

export default App;
