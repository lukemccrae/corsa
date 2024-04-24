import { MileData } from "../types";

export const percentageOfPace = (distance: number, secs: number) => {
  return Math.round((1 / distance) * secs);
};
export const toHHMMSS = (secs: number) => {
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor(secs / 60) % 60;
  var seconds = secs % 60;

  const formattedHours = hours > 0 ? hours.toString() : "";
  const formattedMinutes = hours > 0 ? minutes.toString().padStart(2, "0") : minutes.toString();
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return [formattedHours, formattedMinutes, formattedSeconds]
    .filter((v, i) => v !== "" || i > 0)
    .join(":");
};

export const averagePaces = (
  md: MileData[],
  lastMileDistance: number,
  lastMileIncluded: boolean
) => {
  const sum = md.reduce((accumulator, currentValue, i) => {
    if (lastMileIncluded && i == md.length - 1) {
      return (
        accumulator + percentageOfPace(lastMileDistance, currentValue.pace)
      );
    } else {
      return accumulator + currentValue.pace;
    }
  }, 0);

  const result = toHHMMSS(Math.round(sum / md.length));
  return result;
};

export const calcTime = (md: MileData[], start: number) => {
  const sum = md.reduce(
    (accumulator, currentValue) => accumulator + currentValue.pace,
    0
  );
  return toHHMMSS(sum + start);
};
