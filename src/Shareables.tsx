import { Avatar, Box, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { MileProfile } from './MileProfile';
import { createMiniProfile } from './helpers/miniVertProfile.helpter';
import { MileData, Plan } from './types';
import { averagePaces, toHHMMSS } from './helpers/avgPace.helper';
import { Logo } from './Logo';
import { useUser } from './context/UserContext';
import { handleAssistantCall } from './services/assistant.service';
import { PaceTable } from './PaceTable';
import { getRandomColor } from './helpers/randomColor.helper';
import { ElementsMap } from './Details';

interface ShareablesProps {
    elements: ElementsMap;
    profilePhoto: string;
    showShareables: boolean;
    planName: string;
    mileData: MileData[]
    lastMileDistance: number;
    author: string;
    activityType: string;
}

type AssistantSummary = {
    overview: string;
    exciting: string;
    thesis: string;
    summary: string;
    beginning: string;
    middle: string;
    end: string;
}

export const Shareables = (props: ShareablesProps) => {
    console.log(props)
    const { user } = useUser();
    const [articleQuotes, setArticleQuotes] = React.useState<AssistantSummary>({
        overview: "",
        exciting: "",
        thesis: "",
        summary: "",
        beginning: "",
        middle: "",
        end: ""
    });

    const prompt = `
        I need exact quotes from the article below. Do not summarize, rephrase, or interpret. Only return direct excerpts from the article.

        {
        "overview": "EXACT QUOTE FROM ARTICLE",
        "exciting": "EXACT QUOTE FROM ARTICLE",
        "thesis": "EXACT QUOTE FROM ARTICLE",
        "summary": "EXACT QUOTE FROM ARTICLE",
        "beginning": "EXACT QUOTE FROM ARTICLE",
        "middle": "EXACT QUOTE FROM ARTICLE",
        "end": "EXACT QUOTE FROM ARTICLE"
        }

        ### **Rules:**
        - **Only include sentences directly from the article.**
        - **No additional words, no paraphrasing.** 
        - **Each section must be a direct copy-paste from the article.**
        - Keep each section **between 200-300 words**.
        - **Strip out any markdown formatting (like images, lists, or links).**
        - **Only output the JSON, nothing else. No explanations.**

        ### **Article:**
        ${Object.values(props.elements).map((e) => 'text' in e && e.text ? e.text.content : "").join("\n\n")}
    `;


    React.useEffect(() => {
        const getArticleQuotes = async () => {
            try {
                const result = await handleAssistantCall([prompt]);
                console.log(result, '<< result');

                // Parse the JSON content from the result
                const quotes = JSON.parse(result.message.content);

                // Assuming you want to set the parsed quotes to state
                setArticleQuotes(quotes);
            } catch (error) {
                console.error("Error parsing result:", error);
            }
        };
        getArticleQuotes();
    }, [props.showShareables]);

    // const articleQuotes = [
    //     "The Owens Valley is a remarkable place. Winding rivers and canals snake through a flat valley between two mountain ranges. To the west the mighty Sierra Nevada shoots straight up. To the east are the less prestigious but mysterious White Mountains. On top of the Whites are the oldest living things on earth, Bristlecone Pines.",
    //     "At 3.2 miles the summit came into view! Maybe it was the knowledge that I was going to get it or maybe I was just spent, but I felt myself softening and did my best to finish strong. At this point I could feel the end. My pace had slowed considerably but I was at the summit block climbing over rocks, panting, trying not to look at the beautiful sunset until I could finally stop moving.",
    //     "Since I was on grade, I had to spend more time to do the 8 miles. It’s rare that I can spend that much time at a sustained effort running on real terrain. On the treadmill I spent about 70 minutes above marathon effort as I progressed from 150 - 170bpm+."
    // ];
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
                        {props.planName}
                    </Typography>
                    <Box>
                        <MileProfile marginRight={7} mileVertProfile={createMiniProfile(props.mileData, 50)} multiplyPadding={150} color={getRandomColor().text} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 2 }}>
                        {/* Data rows */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>
                                <Typography variant="body1" fontWeight="bold" color={text}>
                                    {props.mileData.length + props.lastMileDistance} mi
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" color={text}>
                                    +{Math.round(props.mileData.reduce((total, md) => total + md.elevationGain, 0) * 3.28084)} ft
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" color={text}>
                                    {averagePaces(
                                        props.mileData,
                                        props.lastMileDistance,
                                        true
                                    )} /mi
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" color={text}>
                                    {toHHMMSS(props.mileData.reduce((sum, item) => sum + item.pace, 0))}
                                </Typography>
                            </Box>
                        </Box>
                        {/* Row with Avatar, Username, and Logo */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            {/* Avatar and Username */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar src={props.profilePhoto} sx={{ width: 64, height: 64 }} />
                                <Typography variant="h6">{props.author}</Typography>
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
                                left: 16,
                            }}
                        >
                            <Avatar src={props.profilePhoto} sx={{ width: 56, height: 56 }} />
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
                            <Logo activityType={props.activityType}></Logo>
                        </Box>
                    </Box>
                )
            })}

        </Box>

    );
};