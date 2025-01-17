// src/components/DropboxImageViewer.tsx
import React, { useState, useEffect } from "react";
import { listImages } from "../services/dropboxService";

const DropboxImageViewer: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const imageLinks = await listImages();
      setImages(imageLinks);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <h1>Dropbox Image Viewer</h1>

      {loading && <p>Loading images...</p>}

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "16px" }}>
        {images.map((url, index) => (
          <div key={index} style={{ margin: "8px" }}>
            <img
              src={url}
              alt={`Dropbox Image ${index}`}
              style={{ width: "200px", height: "auto" }}
            />
          </div>
        ))}
      </div>

      {!loading && images.length === 0 && <p>No images found in Dropbox.</p>}
    </div>
  );
};

export default DropboxImageViewer;
