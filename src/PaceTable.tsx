import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { MileData } from './types';
import { averagePaces, calcTime, toHHMMSS } from './helpers/avgPace.helper';
import { MileProfile } from './MileProfile';
import { Box, Paper, TableContainer } from '@mui/material';
import { Logo } from './Logo';
type PartialPlan = {
  mileData: MileData[];
  lastMileDistance: number;
  activityType: string;
};

interface PaceTableProps {
  plan: PartialPlan;
  cols: string[];
  miles: number[];
}

export const PaceTable: React.FC<PaceTableProps> = (props: PaceTableProps) => {
  function checkDisplayCols(col: string) {
    return props.cols.includes(col) ? 'table-cell' : 'none';
  }
  return (
    <Box
      sx={{
        backgroundColor: '#515b63',
        overflowX: 'auto',
        border: '10px solid #515b63',
        borderRadius: '15px',
      }}
    >
      <TableContainer sx={{ margin: '0 0 10px 0' }} component={Paper}>
        <Table sx={{ tableLayout: 'fixed' }} aria-label="pace table" size="small">
          <TableHead>
            <TableRow>
              {['Mile', 'Pace', 'Profile', 'Avg.', 'Gain', 'Loss', 'GAP', 'Elapsed'].map(col => (
                <TableCell key={col} sx={{ display: checkDisplayCols(col), minWidth: 70, align: 'left', padding: '10px' }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.plan.mileData.map((md, i) => {
              const isLast = i === props.plan.mileData.length - 1;
              // mile number
              let mileNumber = i + 1;
              // filter for selected miles
              const isVisible = mileNumber >= props.miles[0] && mileNumber <= props.miles[1];
              // if last, set distance to lastMileDistance
              if (props.plan.lastMileDistance && isLast) {
                mileNumber = props.plan.lastMileDistance;
              }
              return (
                <TableRow
                  sx={{
                    display: isVisible ? 'table-row' : 'none',
                    backgroundColor: i % 2 == 0 ? 'silver' : 'none',
                  }}
                  key={i}
                >
                  <TableCell
                    align="left"
                    sx={{ display: checkDisplayCols('Mile'), maxWidth: '60px' }}
                  >
                    {mileNumber}
                  </TableCell>
                  <TableCell sx={{ display: checkDisplayCols('Pace'), minWidth: 80 }}>
                    {toHHMMSS(md.pace)}
                  </TableCell>
                  <TableCell
                    sx={{ display: checkDisplayCols('Profile'), padding: 0, minWidth: 100 }}
                  >
                    <MileProfile
                      marginRight={1}
                      multiplyPadding={1}
                      color="black"
                      mileVertProfile={md.mileVertProfile}
                    />
                  </TableCell>
                  <TableCell align="left" sx={{ display: checkDisplayCols('Avg.'), minWidth: 80 }}>
                    {averagePaces(
                      props.plan.mileData.slice(0, i + 1),
                      props.plan.lastMileDistance,
                      i === props.plan.mileData.length - 1
                    )}
                  </TableCell>
                  <TableCell align="left" sx={{ display: checkDisplayCols('Gain'), minWidth: 80 }}>
                    {Math.round(md.elevationGain * 3.28084)}
                  </TableCell>
                  <TableCell align="left" sx={{ display: checkDisplayCols('Loss'), minWidth: 80 }}>
                    {Math.round(md.elevationLoss * 3.28084)}
                  </TableCell>
                  <TableCell align="left" sx={{ display: checkDisplayCols('GAP'), minWidth: 80 }}>
                    {toHHMMSS(md.gap)}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: checkDisplayCols('Elapsed'), minWidth: 80 }}
                  >
                    {calcTime(
                      props.plan.mileData.slice(0, i + 1),
                      props.plan.lastMileDistance,
                      i === props.plan.mileData.length - 1
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Logo color={'#e3a446'} activityType={props.plan.activityType}></Logo>
    </Box>
  );
};
