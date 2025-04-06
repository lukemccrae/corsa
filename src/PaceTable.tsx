import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { MileData, Plan } from "./types";
import {
  averagePaces,
  calcTime,
  toHHMMSS,
} from "./helpers/avgPace.helper";
import { MileProfile } from "./MileProfile";
import { Box, Divider, Paper, TableContainer } from "@mui/material";
import { Logo } from "./Logo";
import { getRandomColor } from "./helpers/randomColor.helper";
type PartialPlan = {
  mileData: MileData[];
  lastMileDistance: number;
  activityType: string;
}

interface PaceTableProps {
  plan: PartialPlan;
  cols: string[];
  miles: number[];
}

export const PaceTable: React.FC<PaceTableProps> = (props: PaceTableProps) => {
  function checkDisplayCols(col: string) {
    return props.cols.includes(col) ? "table-cell" : "none"
  }
  console.log(props.plan.activityType)
  return (
    <Box sx={{ backgroundColor: "white", overflowX: "auto" }}>
      <TableContainer sx={{ margin: "0 0 10px 0" }} component={Paper}>
        <Table sx={{ tableLayout: 'fixed' }} aria-label="pace table" size="small">
          <TableHead>
            <TableRow>
              {["Mile", "Pace", "Profile", "Avg.", "Gain", "Loss", "GAP", "Elapsed"].map((col) => (
                <TableCell key={col} sx={{ display: checkDisplayCols(col), minWidth: 70 }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.plan.mileData.map((md, i) => {
              const mileNumber = i === props.plan.mileData.length - 1
                ? props.plan.lastMileDistance
                : i + 1;
              const isVisible =
                mileNumber >= props.miles[0] && mileNumber <= props.miles[1];
              return (
                <TableRow sx={{ display: isVisible ? "table-row" : "none" }} key={i}>
                  <TableCell align="left" sx={{ display: checkDisplayCols("Mile"), maxWidth: "60px" }}>
                    {mileNumber}
                  </TableCell>
                  <TableCell sx={{ display: checkDisplayCols("Pace"), minWidth: 80 }}>
                    {toHHMMSS(md.pace)}
                  </TableCell>
                  <TableCell sx={{ display: checkDisplayCols("Profile"), padding: 0, minWidth: 100 }}>
                    <MileProfile marginRight={1} multiplyPadding={1} color="black" mileVertProfile={md.mileVertProfile} />
                  </TableCell>
                  <TableCell align="left" sx={{ display: checkDisplayCols("Avg."), minWidth: 80 }}>
                    {averagePaces(props.plan.mileData.slice(0, i + 1), props.plan.lastMileDistance, i === props.plan.mileData.length - 1)}
                  </TableCell>
                  <TableCell align="left" sx={{ display: checkDisplayCols("Gain"), minWidth: 80 }}>
                    {Math.round(md.elevationGain * 3.28084)}
                  </TableCell>
                  <TableCell align="left" sx={{ display: checkDisplayCols("Loss"), minWidth: 80 }}>
                    {Math.round(md.elevationLoss * 3.28084)}
                  </TableCell>
                  <TableCell align="left" sx={{ display: checkDisplayCols("GAP"), minWidth: 80 }}>
                    {toHHMMSS(md.gap)}
                  </TableCell>
                  <TableCell align="left" sx={{ display: checkDisplayCols("Elapsed"), minWidth: 80 }}>
                    {calcTime(props.plan.mileData.slice(0, i + 1), props.plan.lastMileDistance, i === props.plan.mileData.length - 1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Logo activityType={props.plan.activityType}></Logo>
    </Box>
  );
};
