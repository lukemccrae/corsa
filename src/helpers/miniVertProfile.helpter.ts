import { MileData } from "../types";

export const createMiniProfile = (arr: MileData[]): number[] => {
    // Initialize variables
    let continuousProfile: number[] = [];
    let lastValue = 0; // Tracks the last value from the previous segment

    // Create a continuous profile
    arr.forEach((segment, index) => {
        const currentProfile = segment.mileVertProfile;
        if (index === 0) {
            // For the first segment, add it directly
            continuousProfile = [...currentProfile];
        } else {
            // Calculate the difference between last value of previous segment and first of the current segment
            const adjustment = lastValue - currentProfile[0];
            // Adjust the current profile
            const adjustedSegment = currentProfile.map(value => value + adjustment);
            // Append the adjusted segment to the continuous profile
            continuousProfile.push(...adjustedSegment);
        }
        // Update lastValue to the last value of the adjusted segment
        lastValue = continuousProfile[continuousProfile.length - 1];
    });

    // Normalize the profile to have consistent vertical scaling
    const minElevation = Math.min(...continuousProfile);
    const maxElevation = Math.max(...continuousProfile);
    const normalizedProfile = continuousProfile.map(value => 
        (value - minElevation) / (maxElevation - minElevation)
    );

    // Downsample to 20 points
    const downsampleTo = 20;
    const step = Math.max(Math.floor(normalizedProfile.length / downsampleTo), 1);
    const downsampledProfile = normalizedProfile.filter((_, index) => index % step === 0).slice(0, downsampleTo);

    return downsampledProfile;
};
