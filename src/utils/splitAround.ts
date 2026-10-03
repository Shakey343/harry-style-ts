export default function splitAround<T>(
  items: T[],
  selectedIndex: number,
): { left: T[]; right: T[] } {
  return {
    left: items.slice(0, selectedIndex),
    right: items.slice(selectedIndex + 1),
  }
}
