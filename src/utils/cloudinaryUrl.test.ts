import cloudinaryUrl from "./cloudinaryUrl";

describe("cloudinaryUrl", () => {
  it("inserts the transform after /upload/", () => {
    expect(
      cloudinaryUrl(
        "https://res.cloudinary.com/x/image/upload/v1/a.jpg",
        "w_800,f_auto,q_auto"
      )
    ).toBe(
      "https://res.cloudinary.com/x/image/upload/w_800,f_auto,q_auto/v1/a.jpg"
    );
  });
  it("leaves non-Cloudinary urls unchanged", () => {
    expect(cloudinaryUrl("https://example.com/a.jpg", "w_800")).toBe(
      "https://example.com/a.jpg"
    );
  });
});
