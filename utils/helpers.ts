// Returns the expected quarter text based on the system date.
// Example output:
// "Q4 October - December 2025"
// "Q1 January - March 2025"

export function getCurrentQuarterText(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1–12

  if (month >= 1 && month <= 3) {
    return `Q1 January - March ${year}`;
  }
  if (month >= 4 && month <= 6) {
    return `Q2 April to June ${year}`;
  }
  if (month >= 7 && month <= 9) {
    return `Q3 July to September ${year}`;
  }

  return `Q4 October - December ${year}`;
}
