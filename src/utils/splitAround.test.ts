import splitAround from "./splitAround";

describe("splitAround", () => {
  it("splits before and after a middle index", () => {
    expect(splitAround([1, 2, 3, 4, 5], 2)).toEqual({
      left: [1, 2],
      right: [4, 5],
    });
  });
  it("gives empty left for index 0", () => {
    expect(splitAround([1, 2, 3], 0)).toEqual({ left: [], right: [2, 3] });
  });
  it("gives empty right for the last index", () => {
    expect(splitAround([1, 2, 3], 2)).toEqual({ left: [1, 2], right: [] });
  });
  it("gives both empty for a single item", () => {
    expect(splitAround([1], 0)).toEqual({ left: [], right: [] });
  });
});
