import * as React from "react";
import Title from "./Title";
import { fetchPlans } from "./services/fetchPlans.service";
import Card from "@mui/material/Card";
import { deletePlanById } from "./services/deletePlan.service";



import { Plan, User } from "./types";
import {
  Box,
  CardContent,
  Grid,

  Paper,
  Typography,
} from "@mui/material";
import { PaceTable } from "./PaceTable";
import { DeleteCourse } from "./DeleteCourse";

export default function Courses({ userId }: { userId: string }) {
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [expandedPlan, setExpandedPlan] = React.useState<number | undefined>();

  React.useEffect(() => {
    const fetchPlansData = async () => {
      const retrievedPlans = await fetchPlans({ userId });

      if (retrievedPlans && retrievedPlans.length > 0) {
        setPlans(retrievedPlans);
      }
    };
    fetchPlansData();
  }, [userId]);

  const handleClick = (index: number) => {
    if (expandedPlan === index) {
      setExpandedPlan(undefined)
    } else {
      setExpandedPlan(index);
    }

  };

  const deletePlan = async (userId: string, planId: string) => {
    // const result = await deletePlanById({ userId, planId })
    console.log(userId, planId)
  }

  return (
    <Grid justifyContent="center" item xs={12} sm={12} container spacing={1}>
      <Box>
        <Title>{"My Courses"}</Title>
        {plans.map((plan: Plan, i: number) => {
          return (
            <React.Fragment key={plan.id}>
              <Card
                sx={{
                  minWidth: 300,
                  maxWidth: 600,
                  display: typeof expandedPlan === 'undefined' || expandedPlan === i ? "block" : "none"
                }}
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
                    <div style={{ display: expandedPlan == i ? "block" : "none" }}>
                      <DeleteCourse deletePlan={deletePlan} plan={plan}></DeleteCourse>
                    </div>
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
