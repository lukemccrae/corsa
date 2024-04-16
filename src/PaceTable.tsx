import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { Plan } from "./types";
import { percentageOfPace, toHHMMSS } from "./helpers/avgPace.helper";

function createData(
  id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number
) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    "16 Mar, 2019",
    "Elvis Presley",
    "Tupelo, MS",
    "VISA ⠀•••• 3719",
    312.44
  ),
  createData(
    1,
    "16 Mar, 2019",
    "Paul McCartney",
    "London, UK",
    "VISA ⠀•••• 2574",
    866.99
  ),
  createData(
    2,
    "16 Mar, 2019",
    "Tom Scholz",
    "Boston, MA",
    "MC ⠀•••• 1253",
    100.81
  ),
  createData(
    3,
    "16 Mar, 2019",
    "Michael Jackson",
    "Gary, IN",
    "AMEX ⠀•••• 2000",
    654.39
  ),
  createData(
    4,
    "15 Mar, 2019",
    "Bruce Springsteen",
    "Long Branch, NJ",
    "VISA ⠀•••• 5919",
    212.79
  ),
];

interface PaceTableProps {
  plan: Plan;
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export const PaceTable: React.FC<PaceTableProps> = ({ plan }) => {
  return (
    <React.Fragment>
      <Title>{"Course Details"}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Mile</TableCell>
            <TableCell>Pace</TableCell>
            <TableCell>Profile</TableCell>
            <TableCell>Avg.</TableCell>
            <TableCell align="left">Gain</TableCell>
            <TableCell>Loss</TableCell>
            <TableCell>Elapsed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plan.mileData.map((md, i) => (
            <TableRow key={md.index}>
              <TableCell>
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
              <TableCell>
                {" "}
                {profile && profile[i] ? (
                  <MileProfile profile={profile[i]}></MileProfile>
                ) : (
                  <div></div>
                )}
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};
