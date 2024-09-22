import * as React from "react";
import Link from "@mui/material/Link";
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

export const PaceTable: React.FC<PaceTableProps> = ({ plan }) => {
  return (
    <React.Fragment>
      <Title>{"Course Details"}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ padding: "0 0 0 3px" }}>Mile</TableCell>
            <TableCell>Pace</TableCell>
            <TableCell sx={{ padding: "0" }}>Profile</TableCell>
            <TableCell sx={{ padding: "5px" }}>Avg.</TableCell>
            <TableCell sx={{ padding: "10px" }} align="left">Gain</TableCell>
            <TableCell sx={{ padding: "0 5px 0 0" }}>Loss</TableCell>
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
