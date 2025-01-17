// src/services/dropboxService.ts
import { Dropbox } from "dropbox";

const DROPBOX_ACCESS_TOKEN = import.meta.env.VITE_DROPBOX_API_KEY; // Replace with your Dropbox token

export const dropbox = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });

export const listImages = async (): Promise<string[]> => {
  try {
    // Fetch files from the root folder of Dropbox
    const response = await dropbox.filesListFolder({ path: "" });
    const imageLinks: string[] = [];

    for (const file of response.result.entries) {
      // Skip folders
      if (file[".tag"] !== "file") continue;

      // Generate a shareable link for the file
      const sharedLinkResponse = await dropbox.sharingCreateSharedLinkWithSettings({
        path: file.path_lower!,
      });

      // Convert the link for direct image access
      imageLinks.push(sharedLinkResponse.result.url.replace("?dl=0", "?raw=1"));
    }

    return imageLinks;
  } catch (error) {
    console.error("Error listing files in Dropbox:", error);
    throw error;
  }
};
