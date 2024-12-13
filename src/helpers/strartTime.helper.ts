export const calculateStartWithTZ = (start: Date, tz: string) => {
  console.log(start)
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz,
  });

  const formattedDate = formatter.format(new Date(start))
    .replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$3-$2-$1') // Rearrange to ISO format
    .replace(/ /g, ' ');

  return formattedDate;
}