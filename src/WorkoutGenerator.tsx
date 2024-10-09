import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl, Grid, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { Plan } from './types';
import { handleAssistantCall } from './services/assistant.service';

interface WorkoutGeneratorProps {
    generatorOpen: boolean
    setGeneratorOpen: Function
    plan: Plan
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const WorkoutGenerator = (props: WorkoutGeneratorProps) => {
    const [errors, setErrors] = React.useState({
        pr1Time: '',
        pr2Time: '',
    });
    const [activeStep, setActiveStep] = React.useState(0);
    const [assistantResult, setAssistantResult] = React.useState("Loading...");

    const [formData, setFormData] = React.useState({
        // name: props.plan.name,
        experienceLevel: 0,
        description: '',
        pr1Type: "",
        pr2Type: "",
        pr1Time: "",
        pr2Time: "",
    });

    // const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
    const steps = ['Step 1', 'Step 2', 'Step 3'];


    const experienceLevels = [
        "",
        "I'm new to things like this",
        "I kinda know what I'm doing",
        "I'm an experienced trail racer"
    ]

    const prList = [
        "",
        "5k",
        "10k",
        "Half Marathon",
        "Marathon"
    ]


    // Move to the next step
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    // Move to the previous step
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Handle input change
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // validation for time inputs and set errors based on pattern matching
        if (name === 'pr1Time' || name === 'pr2Time') {
            // Check if value matches HH:MM:SS format
            const isValid = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(value);

            setErrors({
                ...errors,
                [name]: isValid ? '' : 'Invalid time format. Use HH:MM:SS.',
            });
        }

    };

    interface PaceData {
        mile: string;
        pace: string;
        // avg: string;
        gain: string;
        loss: string;
        gap: string;
    }

    const handleSubmit = async () => {
        console.log(props.plan.mileData[0]);

        const calcdCumulativeTime = props.plan.mileData.reduce((accumulator, m) => accumulator + m.pace, 0)
        const calcdCumulativeGap = props.plan.mileData.reduce((accumulator, m) => accumulator + m.gap, 0)

        // grab calculated pace table data from table
        // grabbing it from table because it would be repetitive to recalculate it
        const rows = Array.from(document.querySelectorAll('#paceTable tbody tr'));
        let cumulativeGain = 0;
        let cumulativeLoss = 0;

        const tableData = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            // return empty string if cell is null
            let obj: PaceData = {
                mile: '',
                pace: '',
                gain: '',
                loss: '',
                gap: ''
            }
            cells.forEach((cell, i) => {

                const cellVal = cell ? (cell.textContent!.trim()) : '';
                switch (i) {
                    case (0):
                        obj['mile'] = cellVal;
                        break;
                    case (1):
                        obj['pace'] = cellVal;
                        break;
                    // skip 2 because it is vert profile
                    // skip 3 because it is avg
                    case (4):
                        obj['gain'] = cellVal;
                        cumulativeGain += Number(cellVal)
                        break;
                    case (5):
                        obj['loss'] = cellVal;
                        cumulativeLoss += Number(cellVal)
                        break; ''
                    case (6):
                        obj['gap'] = cellVal
                        break;
                    default:
                        break;

                }
            });
            return obj;
        });

        const determineGrade = (length: number, gain: number, loss: number) => {
            const grade = Math.round(((gain) / (length * 5280)) * 100);
            // flat
            if (grade < 2) return `This route has LOW avg grade of ${grade}%`

            // med gain
            if (grade < 4) return `This route has MEDIUM avg grade of ${grade}%`

            // high gain
            if (grade < 7) return `This route has HIGH avg grade of ${grade}%`

            // downhill
            if (grade < 0) return `This route has NEGATIVE avg grade of ${grade}%`

            return `This route has an EXTREME avg grade of ${grade}%`
        }

        const determineThirdWorkout = () => {
            const message = `Workout 3: Tailor this workout to the specifics of the race course.
            If EXTREME or HIGH avg grade give a hill workout. Prescribe effort levels and specific time for rest.
            If under an hour prescribe 1 mile repeats and target faster than flat race pace.
            If over 6 hours prescribe a time-on-feet session.
            Pretend the runner does not know what a workout is.
            Provide instructions as if the runner was a computer and will only follow highly tailored instructions.`
            return message;
        }

        const determineEquivilantDistance = (length: number, vert: number) => {
            if (length < 4 && vert > 1500) return 'Vertical Kilometer'
            if (length < 7) return '5k';
            if (length < 15) return 'half marathon';
            if (length < 28) return 'marathon';
            if (length < 40) return '50k';
            return 'extreme ultra marathon'

        }

        // Numbers coming in as strings from table
        const routeLengthInMiles = Number(tableData.length - 1) + Number(tableData[tableData.length - 1].mile);

        // closeModal();
        // const result = {
        //     milePaceData: tableData,
        //     routeLengthInMiles,
        //     calcdCumulativeTime,
        //     calcdCumulativeGap,
        //     formData,
        //     cumulativeGain,
        //     cumulativeLoss
        // }

        const messages = [
            `The goal here is to provide workouts with SPECIFIC pacing details targetting demands of this race time`,
            `Give me three workouts according to the style of jack daniels.`,
            // length of racee
            `Length: ${length} miles.`,
            // time
            `I need to run this in ${Math.round(calcdCumulativeTime / 60)} minutes.`,
            // describe grade
            `${determineGrade(routeLengthInMiles, cumulativeGain, cumulativeLoss)}`,
            // user description
            `This is a user-supplied description of the route: ${formData.description}`,
            // return format description
            `Now generate me three workouts that target the fitness required. This race effort is 
            very similar to: ${determineEquivilantDistance(routeLengthInMiles, cumulativeGain)}.`,
            // describe GAP
            `The equivilant flat paces for this run are: 
            ${(calcdCumulativeGap / 60) / routeLengthInMiles} min. per mile`,
            // workout description 1
            `Workout 1 fartlek in the style of Jack Daniels.\
            Prescribe length of the run and period of harder effort. 
            GIVE SPECIFIC MILE INSTRUCTIONS.
            Make the paces challenging, at least 10% faster than goal flat race pace.
            Give specific times. Do the math for me.`,
            // workout description 2
            `Workout 2 threshold repeats in the style of Jack Daniels.
            Prescribe length of the run and period of harder effort. 
            GIVE SPECIFIC MILE INSTRUCTIONS.
            3 sets of 2 mile tempo. Make paces 15% faster than goal flat pace.
            Specific paces. Do the math for me.`,
            // workout description 3
            `${determineThirdWorkout()}`,
            `Give a brief description of the race in two or three sentences. 
            Give a brief description of the workouts in 2 or 3 sentences.
            Don't mention Jack Daniels.
            Don't reference "5% faster" or "flat pace" other specific prompt words.
            Focus on the run, not methodology.
            Don't say "the target pace", give a precise target, you are the coach.
            `
        ]
        setActiveStep(2)
        const result = await handleAssistantCall(messages);
        setAssistantResult(result.message.content)
        console.log(result, '<< result')
    };

    const closeModal = () => {
        props.setGeneratorOpen(false)
        setActiveStep(0)
    }


    return (
        <div>
            <Modal
                open={props.generatorOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* <Typography variant="h6">Workout Generator</Typography> */}

                    {/* Stepper to show progress */}
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => (
                            <Step key={index}>
                                <StepLabel></StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Step Content */}
                    {
                        activeStep === 0 && (
                            <Box mt={2}>
                                <h2>Welcome to CorsaAI</h2>
                                <p style={{ marginBottom: '16px' }}>
                                    The purpose of this tool is to help you prepare for racing this course.
                                </p>
                                <p style={{ marginBottom: '16px' }}>
                                    The AI assistant will generate workouts aimed to prepare you to match the times in this GPX file.
                                </p>
                                <p style={{ marginBottom: '16px' }}>
                                    Use these workouts as fitness benchmarks to gauge your readiness.
                                </p>
                                <p style={{ marginBottom: '16px' }}>
                                    Click Next to provide information about the course and help us give the most accurate results.
                                </p>
                            </Box>
                        )}

                    {
                        // activeStep === 1 && (
                        //     <Box mt={2}>
                        //         {/* <TextField
                        //             label="Race Name"
                        //             type="string"
                        //             variant="outlined"
                        //             name="name"
                        //             fullWidth
                        //             value={formData.name}
                        //             onChange={handleInputChange}
                        //             sx={{ mt: 2 }}
                        //         /> */}
                        //         <FormControl fullWidth sx={{ mt: 2 }}>
                        //             <InputLabel id="demo-simple-select-label">Level of Experience</InputLabel>
                        //             <Select
                        //                 labelId="demo-simple-select-label"
                        //                 id="demo-simple-select"
                        //                 name="experienceLevel"
                        //                 value={formData.experienceLevel}
                        //                 label="Experience Level"
                        //                 onChange={handleInputChange}
                        //             >
                        //                 <MenuItem value={experienceLevels[1]}>{experienceLevels[1]}</MenuItem>
                        //                 <MenuItem value={experienceLevels[2]}>{experienceLevels[2]}</MenuItem>
                        //                 <MenuItem value={experienceLevels[3]}>{experienceLevels[3]}</MenuItem>
                        //             </Select>
                        //         </FormControl>
                        //     </Box>
                        // )
                    }

                    {/* {activeStep === 2 && (
                        <Box mt={2}>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Enter two of your flat-running PRs. This will help the system create a helpful tailored to your fitness abilities.
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel id="demo-simple-select-label">PR #1</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="pr1Type"
                                            value={formData.pr1Type}
                                            label="PR #1"
                                            onChange={handleInputChange}
                                        >
                                            <MenuItem value={prList[1]}>{prList[1]}</MenuItem>
                                            <MenuItem value={prList[2]}>{prList[2]}</MenuItem>
                                            <MenuItem value={prList[3]}>{prList[3]}</MenuItem>
                                            <MenuItem value={prList[4]}>{prList[4]}</MenuItem>
                                        </Select>

                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        label="Time (HH:MM:SS)"
                                        id="pr1Time"
                                        name="pr1Time"
                                        value={formData.pr1Time}
                                        onChange={handleInputChange}
                                        placeholder="HH:MM:SS"
                                        error={!!errors.pr1Time}
                                        helperText={errors.pr1Time}
                                    />
                                </Grid>


                                <Grid item xs={6}>
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel id="demo-simple-select-label">PR #2</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="pr2Type"
                                            value={formData.pr2Type}
                                            label="PR #2"
                                            onChange={handleInputChange}
                                        >
                                            <MenuItem value={prList[1]}>{prList[1]}</MenuItem>
                                            <MenuItem value={prList[2]}>{prList[2]}</MenuItem>
                                            <MenuItem value={prList[3]}>{prList[3]}</MenuItem>
                                            <MenuItem value={prList[4]}>{prList[4]}</MenuItem>


                                        </Select>

                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        label="Time (HH:MM:SS)"
                                        id="pr2Time"
                                        name="pr2Time"
                                        value={formData.pr2Time}
                                        onChange={handleInputChange}
                                        placeholder="HH:MM:SS"
                                        error={!!errors.pr2Time}
                                        helperText={errors.pr2Time}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )} */}

                    {activeStep === 1 && (
                        <Box mt={2}>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Details like difficulty of terrain, max elevation, and average temperature will help produce better results.
                            </Typography>
                            <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                sx={{ mt: 2 }}
                            />
                        </Box>
                    )}

                    {activeStep === 2 && (
                        <Box mt={2}>
                            {assistantResult}
                        </Box>
                    )}

                    {/* Navigation Buttons */}
                    <Box mt={2} display="flex" justifyContent="space-between">
                        {activeStep === 0 ? (
                            <Button disabled={activeStep === 0} onClick={handleBack}>
                                Back
                            </Button>
                        ) : <div></div>}

                        {activeStep === 1 ? (
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                        ) : <div></div>}

                        {activeStep === 0 ? (
                            <Button variant="contained" color="primary" onClick={handleNext}>
                                Next
                            </Button>
                        ) : <div></div>}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}