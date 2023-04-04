import { useState } from "react";
import { InputBase } from "../scaffold-eth";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_WEEK = 604800;
const SECONDS_PER_MONTH = 2628000;
const SECONDS_PER_YEAR = 31540000;

const timeOptions = ["Seconds", "Minutes", "Hours", "Days", "Weeks", "Years"];

interface Props {
  name: string;
  placeholder: string;
  onChange: (value: string) => void;
}
export default ({ name, placeholder, onChange }: Props) => {
const [inputValue, setInputValue] = useState("")
const [selectedTime, setSelectedTime] = useState("seconds")

const handleInputChange = (value: string) => {
    setInputValue(value)
    convertToSeconds(selectedTime, value)
}

const convertToSeconds = (time: string, value: string) => {
    switch (time) {
        case "seconds":
          onChange(value)
          break;
        case "minutes":
          onChange((Number(value) * SECONDS_PER_MINUTE).toString());
          break;
        case "hours":
          onChange((Number(value) * SECONDS_PER_HOUR).toString());
          break;
        case "days":
          onChange((Number(value) * SECONDS_PER_DAY).toString());
          break;
        case "weeks":
          onChange((Number(value) * SECONDS_PER_WEEK).toString());
          break;
        case "months":
          onChange((Number(value) * SECONDS_PER_MONTH).toString());
          break;
        case "years":
          onChange((Number(value) * SECONDS_PER_YEAR).toString());
          break;
        default:
          break;
      }
}

const handleTimeSwitch = (time: string) => {
    setSelectedTime(time)
    convertToSeconds(time, inputValue)
  };

  return (
    <InputBase
      name={name}
      value={inputValue}
      placeholder={placeholder}
      onChange={handleInputChange}
      suffix={
        <select
          id="time"
          defaultValue="seconds"
          onChange={e => handleTimeSwitch(e.target.value)}
          className="bg-transparent outline-none"
        >
          {timeOptions.map(value => (
            <option value={value.toLowerCase()}>{value}</option>
          ))}
        </select>
      }
    />
  );
};
