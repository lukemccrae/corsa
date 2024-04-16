import { MileData } from "../types";

export const percentageOfPace = (distance: number, secs: number) => {
  return Math.round((1 / distance) * secs);
};

export const toHHMMSS = (secs: number) => {
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor(secs / 60) % 60;
  var seconds = secs % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
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
