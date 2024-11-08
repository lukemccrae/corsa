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
            <TableCell sx={{ padding: "0 3px 0 5px" }}>Elapsed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plan.mileData.map((md, i) => (
            <TableRow key={i}>
              <TableCell sx={{ padding: "0 0 0 3px" }}>
                {i === plan.mileData.length - 1 ? plan.lastMileDistance : i + 1}
              </TableCell>
              <TableCell>
                {" "}
                {toHHMMSS(md.pace)}
              </TableCell>
              <TableCell sx={{ padding: "0" }}>
                <MileProfile 
                  multiplyPadding={1} 
                  color={"black"} 
                  mileVertProfile={md.mileVertProfile}>
                </MileProfile>
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
              {toHHMMSS(md.gap)}
              </TableCell>
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
