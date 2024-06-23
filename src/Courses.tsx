import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { fetchPlans } from "./services/fetchPlans.service";
import { averagePaces } from "./helpers/avgPace.helper";
import Card from "@mui/material/Card";
import DeleteIcon from "@mui/icons-material/Delete";
import { deletePlanById } from './services/deletePlan.service'


import { Plan, User } from "./types";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { PaceTable } from "./PaceTable";
import { makeStyles } from "@mui/styles";

const mockPlans = () => {
  return JSON.parse(
    `[{"id":"0c4c7722-0d01-4960-b9f5-9430893c9c2f","mileData":[{"elevationGain":1,"elevationLoss":-1,"pace":329},{"elevationGain":1,"elevationLoss":-1,"pace":332},{"elevationGain":1,"elevationLoss":-1,"pace":323},{"elevationGain":0,"elevationLoss":0,"pace":28}],"name":"Morning Run | Run | Strava","startTime":0,"userId":"379b949b-f20b-4860-9963-9274308aca09","lastMileDistance":0.09},{"id":"62e5a5a0-b938-4de7-9d66-18b795fa97e9","mileData":[{"elevationGain":105,"elevationLoss":0,"pace":461},{"elevationGain":221,"elevationLoss":0,"pace":703},{"elevationGain":224,"elevationLoss":0,"pace":772},{"elevationGain":190,"elevationLoss":-1,"pace":735},{"elevationGain":167,"elevationLoss":0,"pace":695},{"elevationGain":81,"elevationLoss":-7,"pace":542},{"elevationGain":160,"elevationLoss":-5,"pace":706},{"elevationGain":204,"elevationLoss":0,"pace":837},{"elevationGain":233,"elevationLoss":0,"pace":967},{"elevationGain":257,"elevationLoss":-22,"pace":1013},{"elevationGain":217,"elevationLoss":0,"pace":1021},{"elevationGain":111,"elevationLoss":0,"pace":452}],"name":"pike speak | Run | Strava","startTime":0,"userId":"379b949b-f20b-4860-9963-9274308aca09","lastMileDistance":0.53}] `
  );
};

export default function Courses({ userId }: { userId: string }) {
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [expandedPlan, setExpandedPlan] = React.useState<number | undefined>();

  React.useEffect(() => {
    const fetchPlansData = async () => {
      const retrievedPlans = await fetchPlans({ userId });
      // const retrievedPlans = mockPlans();

      if (retrievedPlans && retrievedPlans.length > 0) {
        setPlans(retrievedPlans);
      }
    };
    fetchPlansData();
  }, [userId]);

  const handleClick = (index: number) => {
    setExpandedPlan(index);
  };

  return (
    <Grid justifyContent="center" item xs={12} sm={12} container spacing={1}>
      <Box>
        <Title>{"My Courses"}</Title>
        {plans.map((plan: Plan, i: number) => {
          console.log(plan.id)
          return (
            <React.Fragment key={plan.id}>
              <Card
                sx={{ minWidth: 300, maxWidth: 600 }}
                onClick={() => {
                  handleClick(i);
                }}
                style={{ cursor: "pointer" }}
                variant="outlined"
              >
                <CardContent>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {plan.name}
                    </Typography>
                    <IconButton aria-label="delete" size="small">
                      <DeleteIcon onClick={async () => {
                        const planId = plan.id;
                        const userId = plan.userId;
                        const deleteResult = await deletePlanById({ planId, userId })
                        if (deleteResult) setPlans(plans.splice(i))
                      }} fontSize="inherit" />
                    </IconButton>
                  </div>
                  <Typography component="div">
                    Distance: {plan.mileData.length - 1 + plan.lastMileDistance}
                    {" mi."}
                  </Typography>
                </CardContent>
              </Card>
            </React.Fragment>
          )
        })}

        {/* If a plan has been selected show the table */}
        {typeof expandedPlan === "number" ? (
          <div>
            <div style={{ margin: "10px" }}></div>
            <Grid item xs={12} sm={12} justifyContent="center">
              <Paper sx={{ minWidth: 200, maxWidth: 600 }}>
                <PaceTable plan={plans[expandedPlan]}></PaceTable>
              </Paper>
            </Grid>
          </div>
        ) : (
          <div></div>
        )}
      </Box>
    </Grid>




  );
}
