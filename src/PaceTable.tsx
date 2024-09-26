import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { Plan } from "./types";
import {
  averagePaces,
  calcTime,
  percentageOfPace,
  toHHMMSS,
} from "./helpers/avgPace.helper";
import { MileProfile } from "./MileProfile";

interface PaceTableProps {
  plan: Plan;
}

const calcGap = (pace: number, gain: number, loss: number) => {
  // weight gain more than loss for gap, then convert meters to feet
  const weightedVert = (gain + (loss * .2)) * 3.28084

  // if gain is positive use pacing formula
  if (weightedVert > 0) {
    // divide weighted gain exponent by 100 for pacing equation
    const gainExponent = weightedVert / 100;
    const gap = pace / Math.round(Math.pow(1.1, gainExponent))

    return toHHMMSS(gap)
  } else {
    // pacing formula seems to break for downhill splits
    // not sure how to effectively modify pace for downhill splits, just subtracting for now
    return toHHMMSS(pace - weightedVert / 1.5)
  }
}

const calcLastMileGap = (pace: number, gain: number, loss: number, lmd: number) => {
  const gap = percentageOfPace(lmd, pace)
  return toHHMMSS(gap)
}

export const PaceTable: React.FC<PaceTableProps> = ({ plan }) => {
  return (
    <React.Fragment>
      <Title>{"Course Details"}</Title>
      <Table size="small" id="paceTable">
        <TableHead>
          <TableRow>
            <TableCell sx={{ padding: "0 0 0 3px" }}>Mile</TableCell>
            <TableCell>Pace</TableCell>
            <TableCell sx={{ padding: "0" }}>Profile</TableCell>
            <TableCell sx={{ padding: "5px" }}>Avg.</TableCell>
            <TableCell sx={{ padding: "10px" }} align="left">Gain</TableCell>
            <TableCell sx={{ padding: "0 5px 0 0" }}>Loss</TableCell>
            <TableCell sx={{ padding: "0 5px 0 0" }}>GAP</TableCell>
            {/* <TableCell sx={{ padding: "0 3px 0 5px" }}>Stop Time</TableCell> */}
            <TableCell sx={{ padding: "0 3px 0 5px" }}>Elapsed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plan.mileData.map((md, i) => (
            <TableRow key={md.index}>
              <TableCell sx={{ padding: "0 0 0 3px" }}>
                {i === plan.mileData.length - 1 ? plan.lastMileDistance : i + 1}
              </TableCell>
              <TableCell>
                {" "}
                {i === plan.mileData.length - 1
                  ? //If this is the last mile, calculate the pace as a percentage
                  toHHMMSS(percentageOfPace(plan.lastMileDistance, md.pace))
                  : // for all other miles return the pace in minutes
                  toHHMMSS(md.pace)}
              </TableCell>
              <TableCell sx={{ padding: "0" }}>
                <MileProfile mileData={md}></MileProfile>
              </TableCell>
              <TableCell sx={{ padding: "5px" }}>
                {averagePaces(
                  plan.mileData.slice(0, i + 1),
                  plan.lastMileDistance,
                  i === plan.mileData.length - 1
                )}
              </TableCell>
              <TableCell align="right">
                {Math.round(md.elevationGain * 3.28084)}
              </TableCell>
              <TableCell align="right" sx={{ padding: "0 5px 0 0" }}>
                {Math.round(md.elevationLoss * 3.28084)}
              </TableCell>
              {/* GAP */}
              <TableCell sx={{ padding: "5px" }}>
                {i === plan.mileData.length - 1
                  ?
                  calcLastMileGap(md.pace, md.elevationGain, md.elevationLoss, plan.lastMileDistance)
                  :
                  calcGap(md.pace, md.elevationGain, md.elevationLoss)}

                {/* {toHHMMSS(md.pace / Math.round(Math.pow(1.1, (md.elevationGain * 3.28084) / 100)))} */}
              </TableCell>
              {/* <TableCell>
                {toHHMMSS(md.stopTime)}
              </TableCell> */}
              <TableCell align="right" sx={{ padding: "0 3px 0 0" }}>
                {calcTime(plan.mileData.slice(0, i + 1), plan.startTime)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};
