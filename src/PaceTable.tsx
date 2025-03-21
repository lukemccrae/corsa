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
  cols: string[];
  backgroundColor: string;
  miles: number[];
}

export const PaceTable: React.FC<PaceTableProps> = (props: PaceTableProps) => {
  function checkDisplayCols(col: string) {
    return props.cols.includes(col) ? "table-cell" : "none"
  }
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ backgroundColor: props.backgroundColor, minWidth: 400, maxWidth: 600, margin: "8px" }} aria-label="pace table" size="small" id="paceTable">
        <TableHead>
          <TableRow>
            <TableCell sx={{display: checkDisplayCols('Mile')}}>Mile</TableCell>
            <TableCell sx={{display: checkDisplayCols('Pace')}}>Pace</TableCell>
            <TableCell sx={{display: checkDisplayCols('Profile')}}>Profile</TableCell>
            <TableCell sx={{display: checkDisplayCols('Avg.')}}>Avg.</TableCell>
            <TableCell sx={{display: checkDisplayCols('Gain')}}>Gain</TableCell>
            <TableCell sx={{display: checkDisplayCols('Loss')}}>Loss</TableCell>
            <TableCell sx={{display: checkDisplayCols('GAP')}}>GAP</TableCell>
            <TableCell sx={{display: checkDisplayCols('Elapsed')}}>Elapsed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* render only miles provided in arg */}
          {props.plan.mileData.map((md, i) => (
            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 }, display: i > props.miles[0] && i < props.miles[1] ? "table-row" : "none" }}>
              <TableCell align="center" sx={{ padding: "0 0 0 3px", display: checkDisplayCols('Mile') }}>
                {i === props.plan.mileData.length - 1 ? props.plan.lastMileDistance : i + 1}
              </TableCell>
              <TableCell sx={{display: checkDisplayCols('Pace')}}>
                {" "}
                {toHHMMSS(md.pace)}
              </TableCell>
              <TableCell sx={{ padding: "0", display: checkDisplayCols('Profile') }}>
                <MileProfile
                  marginRight={1}
                  multiplyPadding={1}
                  color={"black"}
                  mileVertProfile={md.mileVertProfile}>
                </MileProfile>
              </TableCell>
              <TableCell align="center" sx={{ padding: "5px", display: checkDisplayCols('Avg.') }}>
                {averagePaces(
                  props.plan.mileData.slice(0, i + 1),
                  props.plan.lastMileDistance,
                  i === props.plan.mileData.length - 1
                )}
              </TableCell>
              <TableCell align="center" sx={{ padding: "0", display: checkDisplayCols('Gain') }}>
                {Math.round(md.elevationGain * 3.28084)}
              </TableCell>
              <TableCell align="center" sx={{ padding: "0 5px 0 0", display: checkDisplayCols('Loss') }}>
                {Math.round(md.elevationLoss * 3.28084)}
              </TableCell>
              {/* GAP */}
              <TableCell align="center" sx={{ padding: "5px", display: checkDisplayCols('GAP') }}>
                {toHHMMSS(md.gap)}
              </TableCell>
              <TableCell align="center" sx={{ padding: "0 3px 0 0", display: checkDisplayCols('Elapsed') }}>
                {calcTime(props.plan.mileData.slice(0, i + 1), props.plan.lastMileDistance, i === props.plan.mileData.length - 1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
