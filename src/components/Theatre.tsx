import { useEffect } from "react";
import Card from "./Card";
import axios from "axios";

const imgLinks = [
  {
    img: "https://www.dropbox.com/scl/fi/tlnpsoz0808mqdq36svct/1.-Shantify-Poster.jpg?rlkey=j8m7ecz467otk86kdm968mzaf&st=rt6bq15q&raw=1",
    url: "https://www.instagram.com/p/C-3HxhmIRrH/",
  },
  {
    img: "https://www.dropbox.com/scl/fi/pu54u11yo1uppwwey71xy/2.-Liz-Poster.jpg?rlkey=4lyvjj1tcj371ytj8me92uras&st=gp77jewm&raw=1",
    url: "https://www.soundcloud.com/harry-style/sets/liz",
  },
  {
    img: "https://www.dropbox.com/scl/fi/pr3hung0p6qwgztnbtz17/3b.-Forgive-Us-Oh-Father-Portrait-Poster.jpg?rlkey=pnckbpxqa24vmj1ov6z2rl611&st=pbsdi146&raw=1",
    url: "https://www.soundcloud.com/harry-style/sets/forgive-us-oh-father",
  },
  {
    img: "https://www.dropbox.com/scl/fi/tqgfjsstbbj79r0rcf26m/4.-Road-Show-Poster.png?rlkey=rki2eyb4sf4qmd9rzsgjqiwt8&st=dvbkwvxf&raw=1",
    url: "https://www.instagram.com/p/DEf2p4eowZI/",
  },
  {
    img: "https://www.dropbox.com/scl/fi/utviullbsy6g43trnd7s8/5.-YAGMCB-Poster-Gatehouse.png?rlkey=x1smyyoo1djfba0ahkezmab2a&st=0u1apqhz&raw=1",
    url: "https://www.instagram.com/stories/highlights/18405156373047559/",
  },
  {
    img: "https://www.dropbox.com/scl/fi/mgfcclw56kqba2ygk6xrb/6.-Tom-Lehrer-Poster.png?rlkey=wx7rqsuf9t7nk0jukf2i9poxq&st=edcth6wv&raw=1",
    url: "https://www.instagram.com/stories/highlights/18257575183254909/",
  },
  {
    img: "https://www.dropbox.com/scl/fi/1y58m8kvouoz03z73i5n7/7b.-The-Crooked-Spire-Poster-Square.png?rlkey=5m4m904n86wgbkww1m3znxai4&st=ds2fk4t0&raw=1",
    url: "https://www.ashgateheritagearts.co.uk/crooked-spire-murder-mystery-musical.html",
  },
  {
    img: "https://www.dropbox.com/scl/fi/rfyxilu3br5tup5zwnu02/8.-A-Lark-Poster.png?rlkey=76kwysgmgwd2qjubkksh8vaer&st=md2ytom5&raw=1",
    url: "https://www.youtube.com/watch?v=FIjp4W_l6WQ",
  },
  {
    img: "https://www.dropbox.com/scl/fi/dq8mx2gr1vb5risbmh8s3/9.-Mountains-of-the-Moon-Poster.jpg?rlkey=v1lmtlwuhlmz98jeiquar7l6k&st=wzdibzwp&raw=1",
    url: "https://www.ashgateheritagearts.co.uk/mountains-of-the-moon.html",
  },
];

const TheatreImages = () => {
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}api/images/by-tag?tag=logo`)
      .then((res) => {
        setImages(res.data.images);
      })
      .catch((err) => console.error("Error fetching images:", err));
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-10">
      {imgLinks.map((obj, i) => (
        <Card key={i} imgUrl={obj.img} link={obj.url} className="" />
      ))}
    </div>
  );
};

export default TheatreImages;
