export const getRandomColor = () => {
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