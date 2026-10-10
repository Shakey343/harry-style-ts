const UPLOAD_SEGMENT = "/upload/";

export default function cloudinaryUrl(url: string, transform: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes(UPLOAD_SEGMENT))
    return url;
  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}${transform}/`);
}
