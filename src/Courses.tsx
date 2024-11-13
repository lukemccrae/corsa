import * as React from "react";
import Title from "./Title";
import { getPlansByUserId, getPlanById } from "./services/fetchPlans.service";
import Card from "@mui/material/Card";
import { Plan } from "./types";
import {
  Box,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { PaceTable } from "./PaceTable";
import { DeleteCourse } from "./DeleteCourse";
import { WorkoutGeneratorButton } from "./WorkoutGeneratorButton"
import { WorkoutGenerator } from "./WorkoutGenerator";

interface CourseProps {
  userId: string
  expandedPlan: number | undefined
  setExpandedPlan: Function
}

export default function Courses(props: CourseProps) {
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [generatorOpen, setGeneratorOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    const fetchPlansData = async () => {
      const retrievedPlans = await getPlansByUserId({ userId: props.userId });

      if (retrievedPlans && retrievedPlans.length > 0) {
        setPlans(retrievedPlans);
      }
    };
    fetchPlansData();
  }, [props.userId]);

  const handleClick = async (index: number) => {
    // if we are closing a plan set expanded index to undefined
    if (props.expandedPlan === index) {
      props.setExpandedPlan(undefined)
    } else {
      // if we're getting a new plan, first check if we already have the details
      if (plans[index].mileData) {
        // if we have the mile data, set the new index
        props.setExpandedPlan(index);
      } else {
        // if we dont have the mile data retrieve plan info and append
        const planId = plans[index].id
        const userId = props.userId;
        const planDetails = await getPlanById({ userId, planId })

        // add expanded plan info to existsing array
        const currentPlans = plans;
        currentPlans[index] = planDetails;
        setPlans(currentPlans)
        props.setExpandedPlan(index);
      }

    }

  };

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
                  display: typeof props.expandedPlan === 'undefined' || props.expandedPlan === i ? "block" : "none"
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
                    <div style={{ display: props.expandedPlan == i ? "flex" : "none" }}>
                      <WorkoutGeneratorButton generatorOpen={generatorOpen} setGeneratorOpen={setGeneratorOpen}></WorkoutGeneratorButton>
                      <DeleteCourse setExpandedPlan={props.setExpandedPlan} plan={plan} plans={plans} setPlans={setPlans}></DeleteCourse>
                    </div>
                  </div>
                  <Typography component="div">
                    Distance: {plan.distanceInMiles + plan.lastMileDistance}
                    {" mi."}
                  </Typography>
                </CardContent>
              </Card>
            </React.Fragment>
          )
        })}

        {/* If a plan has been selected show the table */}
        {typeof props.expandedPlan === "number" && (
          <div>
            <div style={{ margin: "10px" }}></div>
            <Grid item xs={12} sm={12} justifyContent="center">
              <WorkoutGenerator plan={plans[props.expandedPlan]} setGeneratorOpen={setGeneratorOpen} generatorOpen={generatorOpen}></WorkoutGenerator>
              <Paper sx={{ minWidth: 200, maxWidth: 600 }}>
                <PaceTable plan={plans[props.expandedPlan]}></PaceTable>
              </Paper>
            </Grid>
          </div>
        )}
      </Box>
    </Grid>
  );
}
