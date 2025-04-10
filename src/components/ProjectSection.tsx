import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

type Image = {
  img: string;
  url: string;
};

type ImgObject = {
  public_id: string;
  image_url: string;
  metadata: {
    link_to: string;
  };
  tags: string[];
};

const ProjectSection = ({tag}:{tag:string}) => {
  const [images, setImages] = useState<Image[]>([]);

  console.log(images);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}api/images/by-tag?tag=${tag}`)
      .then((res) => {
        const sortedImages: ImgObject[] = res.data.images.sort((a: ImgObject, b: ImgObject) =>
          a.public_id.localeCompare(b.public_id)
        );

        const mappedImages: Image[] = sortedImages.map((imgObj) => ({
          img: imgObj.image_url,
          url: imgObj.metadata.link_to,
        }));

        setImages(mappedImages);
      })
      .catch((err) => console.error("Error fetching images:", err));
  }, [tag]);

  return (
    <div className="flex flex-wrap justify-center gap-10">
      {images.map((obj, i) => (
        <Card key={i} imgUrl={obj.img} link={obj.url} className="" />
      ))}
    </div>
  );
};

export default ProjectSection;
