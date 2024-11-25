export const haversineInFeet = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const DEG_TO_RAD = Math.PI / 180;
    const R = 20902688; // Earth's radius in feet

    const dLat = (lat2 - lat1) * DEG_TO_RAD;
    const dLon = (lon2 - lon1) * DEG_TO_RAD;

    const avgLat = (lat1 + lat2) / 2 * DEG_TO_RAD;

    // Adjust longitude difference by latitude
    const x = dLon * Math.cos(avgLat);
    const y = dLat;

    return R * Math.sqrt(x * x + y * y); // Approximate distance in feet
};