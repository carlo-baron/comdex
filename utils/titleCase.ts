export function title(text: string) {
  return text
    .split(/[\s-]+/)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
