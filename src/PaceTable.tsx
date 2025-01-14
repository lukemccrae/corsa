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
import { Paper, TableContainer } from "@mui/material";

interface PaceTableProps {
  plan: Plan;
}

export const PaceTable: React.FC<PaceTableProps> = ({ plan }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400, maxWidth: 600, margin: "8px" }} aria-label="pace table" size="small" id="paceTable">
        <TableHead>
          <TableRow>
            <TableCell>Mile</TableCell>
            <TableCell>Pace</TableCell>
            <TableCell>Profile</TableCell>
            <TableCell>Avg.</TableCell>
            <TableCell>Gain</TableCell>
            <TableCell>Loss</TableCell>
            <TableCell>GAP</TableCell>
            <TableCell>Elapsed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plan.mileData.map((md, i) => (
            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="center" sx={{ padding: "0 0 0 3px" }}>
                {i === plan.mileData.length - 1 ? plan.lastMileDistance : i + 1}
              </TableCell>
              <TableCell>
                {" "}
                {toHHMMSS(md.pace)}
              </TableCell>
              <TableCell sx={{ padding: "0" }}>
                <MileProfile
                  marginRight={1}
                  multiplyPadding={1}
                  color={"black"}
                  mileVertProfile={md.mileVertProfile}>
                </MileProfile>
              </TableCell>
              <TableCell align="center" sx={{ padding: "5px" }}>
                {averagePaces(
                  plan.mileData.slice(0, i + 1),
                  plan.lastMileDistance,
                  i === plan.mileData.length - 1
                )}
              </TableCell>
              <TableCell align="center">
                {Math.round(md.elevationGain * 3.28084)}
              </TableCell>
              <TableCell align="center" sx={{ padding: "0 5px 0 0" }}>
                {Math.round(md.elevationLoss * 3.28084)}
              </TableCell>
              {/* GAP */}
              <TableCell align="center" sx={{ padding: "5px" }}>
                {toHHMMSS(md.gap)}
              </TableCell>
              <TableCell align="center" sx={{ padding: "0 3px 0 0" }}>
                {calcTime(plan.mileData.slice(0, i + 1))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
