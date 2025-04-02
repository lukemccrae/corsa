import { Avatar, Box, Typography } from "@mui/material"
import { getRandomColor } from "./helpers/randomColor.helper"
import { text } from "stream/consumers"
import { averagePaces, toHHMMSS } from "./helpers/avgPace.helper"
import { createMiniProfile } from "./helpers/miniVertProfile.helpter"
import { Logo } from "./Logo"
import { MileProfile } from "./MileProfile"
import { Plan } from "./types"

interface TitleBoxProps {
    plan: Plan
}

export const TitleBox = (props: TitleBoxProps) => {
    const { bg, text } = getRandomColor();

    return <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {/* Data Box */}
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: bg,
                borderRadius: 2,
                margin: 1,
                p: 5,
                position: "relative",
                color: getRandomColor().text,
                height: "500px",
                marginTop: "64px"

            }}>
                <Typography variant="h4" sx={{ color: text }}>
                    {props.plan.name}
                </Typography>
                <Box>
                    <MileProfile marginRight={7} mileVertProfile={createMiniProfile(props.plan.mileData, 50)} multiplyPadding={150} color={getRandomColor().text} />

                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 2 }}>
                    {/* Data rows */}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box>
                            <Typography variant="body1" fontWeight="bold" color={text}>
                                {props.plan.distanceInMiles + props.plan.lastMileDistance} mi
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color={text}>
                                +{Math.round(props.plan.mileData.reduce((total, md) => total + md.elevationGain, 0) * 3.28084)} ft
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color={text}>
                                {averagePaces(
                                    props.plan.mileData,
                                    props.plan.lastMileDistance,
                                    true
                                )} /mi
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color={text}>
                                {toHHMMSS(props.plan.mileData.reduce((sum, item) => sum + item.pace, 0))}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Row with Avatar, Username, and Logo */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {/* Avatar and Username */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar src={props.plan.profilePhoto} sx={{ width: 64, height: 64 }} />
                            <Typography variant="h6">{props.plan.author}</Typography>
                        </Box>

                        <Logo activityType={props.plan.activityType} />
                    </Box>
                </Box>
            </Box>
        </Box>
}