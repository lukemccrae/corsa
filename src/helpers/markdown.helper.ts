export const unescapeMarkdown = (escapedString: string) => {
  const escaped = escapedString
    // .slice(1, -1) // Remove the first and last character
    .replace(/\\n/g, "\n") // Replace \n with actual newlines
    .replace(/\\`/g, "`") // Replace \` with `
    .replace(/\\#/g, "#") // Replace \# with #
    .replace(/\\-/g, "-") // Replace \- with -
    .replace(/\\\*/g, "*") // Replace \* with *
    .replace(/\\_/g, "_") // Replace \_ with _
    .replace(/\\\|/g, "|") // Replace \| with |
    .replace(/\\\\/g, "\\")
  return escaped;
};
