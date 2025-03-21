export const unescapeMarkdown = (escapedString: string) => {
  console.log(escapedString, '<< escape')
  const parsedString = JSON.parse(escapedString);
  return (
    parsedString
      //   .slice(1, -1)               // Remove the first and last character
      .replace(/\\n/g, "\n") // Replace \n with actual newlines
      .replace(/\\`/g, "`") // Replace \` with `
      .replace(/\\#/g, "#") // Replace \# with #
      .replace(/\\-/g, "-") // Replace \- with -
      .replace(/\\\*/g, "*") // Replace \* with *
      .replace(/\\_/g, "_") // Replace \_ with _
      .replace(/\\\|/g, "|") // Replace \| with |
      .replace(/\\\\/g, "\\")
  ); // Replace double backslashes with a single backslash
};
