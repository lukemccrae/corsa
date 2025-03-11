import { Avatar, Box, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { MileProfile } from './MileProfile';
import { createMiniProfile } from './helpers/miniVertProfile.helpter';
import { Plan } from './types';
import { toHHMMSS } from './helpers/avgPace.helper';
import { Logo } from './Logo';

interface ShareablesProps {
    plan: Plan
}

export const Shareables = (props: ShareablesProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageUrl = 'https://example.com/path-to-your-image.jpg'; // Static image URL or path

    const articleQuotes = [
        "The Owens Valley is a remarkable place. Winding rivers and canals snake through a flat valley between two mountain ranges. To the west the mighty Sierra Nevada shoots straight up. To the east are the less prestigious but mysterious White Mountains. On top of the Whites are the oldest living things on earth, Bristlecone Pines.",
        "At 3.2 miles the summit came into view! Maybe it was the knowledge that I was going to get it or maybe I was just spent, but I felt myself softening and did my best to finish strong. At this point I could feel the end. My pace had slowed considerably but I was at the summit block climbing over rocks, panting, trying not to look at the beautiful sunset until I could finally stop moving.",
        "Since I was on grade, I had to spend more time to do the 8 miles. It’s rare that I can spend that much time at a sustained effort running on real terrain. On the treadmill I spent about 70 minutes above marathon effort as I progressed from 150 - 170bpm+."
    ];

    const getRandomColor = () => {
        const colors = [
            { bg: "#515B63", text: "#E3A446" }, // Grey with accent orange text
            { bg: "#5B83A3", text: "#E3A446" }, // Grey blue with accent orange text
            { bg: "#E3A446", text: "#515B63" }, // Accent orange with grey text
            { bg: "#2E3B4E", text: "#D8A31A" }, // Deep navy with golden yellow text
            { bg: "#37474F", text: "#FFAB40" }, // Dark slate with warm orange text
            { bg: "#4E342E", text: "#FFCC80" }, // Deep brown with light peach text
            { bg: "#263238", text: "#F5CBA7" }, // Charcoal with soft tan text
            { bg: "#607D8B", text: "#FFD54F" }, // Muted blue-grey with golden text
            { bg: "#546E7A", text: "#E57373" }, // Steely blue-grey with warm red text
            { bg: "#3E2723", text: "#FFC107" }, // Dark coffee brown with vibrant yellow text
            { bg: "#455A64", text: "#D4E157" }, // Cool blue-grey with muted lime text
            { bg: "#1E293B", text: "#FACC15" }, // Deep blue-black with soft gold text
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {/* data box */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {/* Data Box */}
                <Box sx={{
                    display: "flex", flexDirection: "column", margin: 2,
                    backgroundColor: getRandomColor().bg, borderRadius: 2, padding: 2, position: "relative", color:getRandomColor().text 
                }}>
                    <Typography variant="h2" sx={{ color: getRandomColor().text }}>
                        {props.plan.name}
                    </Typography>

                    <Typography variant="body1" fontWeight="bold" color={getRandomColor().text}>
                        {props.plan.distanceInMiles + props.plan.lastMileDistance} mi
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: 2 }}>
                        <Box>
                            <Typography variant="body1" fontWeight="bold" color={getRandomColor().text}>
                                +{Math.round(props.plan.mileData.reduce((total, md) => total + md.elevationGain, 0) * 3.28084)} ft
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color={getRandomColor().text}>
                                {toHHMMSS(props.plan.mileData.reduce((sum, item) => sum + item.pace, 0))}
                            </Typography>
                        </Box>
                        <MileProfile marginRight={7} mileVertProfile={createMiniProfile(props.plan.mileData)} multiplyPadding={70} color={getRandomColor().text} />

                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Avatar src={props.plan.profilePhoto} sx={{ width: 48, height: 48, marginRight: 1 }} />
                            <Typography variant="h6">{props.plan.author}</Typography>
                        </Box>
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 16,
                                right: 16,
                                display: "flex",
                                alignItems: "center",
                                gap: 0,
                            }}
                        >
                            <Logo></Logo>
                        </Box>

                    </Box>
                </Box>
            </Box>
            {articleQuotes.map((a) => {
                const { bg, text } = getRandomColor();

                return (
                    <Box
                        sx={{
                            position: "relative",
                            height: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: bg,
                            color: text,
                            borderRadius: 2,
                            margin: 2,
                            p: 5,
                        }}
                    >
                        {/* Centered Text */}
                        <Typography variant="h4" sx={{ textAlign: "left", paddingRight: 5 }}>
                            "{a}"
                        </Typography>

                        {/* Logo in Top Right */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                            }}
                        >
                            <Avatar src={props.plan.profilePhoto} sx={{ width: 56, height: 56 }} />
                        </Box>

                        {/* Name & Profile Photo Bottom Right */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 16,
                                right: 16,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Logo></Logo>
                        </Box>
                    </Box>
                )
            })}
            <Box sx={{ display: "flex", flexDirection: "column", margin: 2 }}>

            </Box>

        </Box>

    );
};