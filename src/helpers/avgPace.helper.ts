import { MileData } from "../types";

export const percentageOfPace = (distance: number, pace: number) => {
  const fractionalPace = pace * distance;
  // Adjusts the average pace based on fractional distances, with larger fractions 
  // pulling the average closer to the full pace, while smaller fractions have less impact.

  const weightedPace = (fractionalPace + pace) / 2;

  return Math.round(weightedPace);
};

export const toHHMMSS = (secs: number) => {
  const roundedSecs = Math.round(secs)
  var hours = Math.floor(roundedSecs / 3600);
  var minutes = Math.floor(roundedSecs / 60) % 60;
  var seconds = roundedSecs % 60;

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

export const calcTime = (md: MileData[], lmd: number, lastMile: boolean) => {
  const sum = md.reduce((accumulator, currentValue, index) => {
    if (lastMile && index == md.length - 1) return accumulator + (lmd * currentValue.pace)
    return accumulator + currentValue.pace;
  }, 0);

  return toHHMMSS(sum);
};