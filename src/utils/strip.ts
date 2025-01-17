export default function strip(string:string) {
  if (!string) return string;

  return string.replace(/\s|\./g, '').trim();
}
