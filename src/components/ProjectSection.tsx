import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

type Image = {
  id: string;
  img: string;
  url: string;
  subtitle: string;
};

type ImgObject = {
  public_id: string;
  image_url: string;
  metadata: {
    link_to: string;
    subtitle: string;
  };
  tags: string[];
};

const ProjectSection = ({tag}:{tag:string}) => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}api/images/by-tag?tag=${tag}`)
      .then((res) => {
        const sortedImages: ImgObject[] = res.data.images.sort((a: ImgObject, b: ImgObject) =>
          a.public_id.localeCompare(b.public_id)
        );

        const mappedImages: Image[] = sortedImages.map((imgObj) => ({
          id: imgObj.public_id.slice(0, -7).replace(/_/g, " "),
          img: imgObj.image_url,
          url: imgObj.metadata.link_to,
          subtitle: imgObj.metadata.subtitle
        }));

        setImages(mappedImages);
      })
      .catch((err) => console.error("Error fetching images:", err));
  }, [tag]);

  return (
    <div className="flex flex-wrap justify-center gap-10">
      {images.map((obj, i) => (
        <Card key={i} imgId={obj.id} imgUrl={obj.img} link={obj.url} subtitle={obj.subtitle} className="" />
      ))}
    </div>
  );
};

export default ProjectSection;
