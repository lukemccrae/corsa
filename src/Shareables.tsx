import { Avatar, Box, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { MileProfile } from './MileProfile';
import { createMiniProfile } from './helpers/miniVertProfile.helpter';
import { Plan } from './types';
import { averagePaces, toHHMMSS } from './helpers/avgPace.helper';
import { Logo } from './Logo';
import { useUser } from './context/UserContext';
import { handleAssistantCall } from './services/assistant.service';
import { PaceTable } from './PaceTable';

interface ShareablesProps {
    plan: Plan
}

type AssistantSummary = {
    overview: string;
    exciting: string;
    thesis: string;
    summary: string
}

export const Shareables = (props: ShareablesProps) => {
    const { user } = useUser();
    const [articleQuotes, setArticleQuotes] = React.useState<AssistantSummary>({
        overview: "",
        exciting: "",
        thesis: "",
        summary: ""
    });

    const prompt = `
        I need exact quotes from the article below. Do not summarize, rephrase, or interpret. Only return direct excerpts from the article.

        Return a **valid stringified JSON** in this format:
        \`\`\`json
        {
        "overview": "EXACT QUOTE FROM ARTICLE",
        "exciting": "EXACT QUOTE FROM ARTICLE",
        "thesis": "EXACT QUOTE FROM ARTICLE",
        "summary": "EXACT QUOTE FROM ARTICLE"
        }
        \`\`\`

        ### **Rules:**
        - **Only include sentences directly from the article.**
        - **No additional words, no paraphrasing.** 
        - **Each section must be a direct copy-paste from the article.**
        - Keep each section **between 100-200 words**.
        - **Strip out any markdown formatting (like images, lists, or links).**
        - **Only output the JSON, nothing else. No explanations.**

        ### **Article:**
        ${props.plan.articleContent}
    `;



    React.useEffect(() => {
        const getArticleQuotes = async () => {
            const result = await handleAssistantCall([prompt])
            const cleanedString = result.message.content.replace(/^```json\n/, "").replace(/\n```$/, "");
            const quotes = JSON.parse(cleanedString)
            setArticleQuotes(quotes)
        };
        getArticleQuotes();
    }, []);

    // const articleQuotes = [
    //     "The Owens Valley is a remarkable place. Winding rivers and canals snake through a flat valley between two mountain ranges. To the west the mighty Sierra Nevada shoots straight up. To the east are the less prestigious but mysterious White Mountains. On top of the Whites are the oldest living things on earth, Bristlecone Pines.",
    //     "At 3.2 miles the summit came into view! Maybe it was the knowledge that I was going to get it or maybe I was just spent, but I felt myself softening and did my best to finish strong. At this point I could feel the end. My pace had slowed considerably but I was at the summit block climbing over rocks, panting, trying not to look at the beautiful sunset until I could finally stop moving.",
    //     "Since I was on grade, I had to spend more time to do the 8 miles. It’s rare that I can spend that much time at a sustained effort running on real terrain. On the treadmill I spent about 70 minutes above marathon effort as I progressed from 150 - 170bpm+."
    // ];

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

    const { bg, text } = getRandomColor();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {/* data box */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
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

                            <Logo />
                        </Box>
                    </Box>
                </Box>
            </Box>
            {Object.values(articleQuotes).map((a) => {
                const { bg, text } = getRandomColor();
                return (
                    <Box
                        sx={{
                            position: "relative",
                            height: "500px",
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
                        <Typography variant="h5" sx={{ textAlign: "left", paddingRight: 5 }}>
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

        </Box>

    );
};