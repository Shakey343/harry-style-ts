import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faSoundcloud,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const links = [
  {
    link: "https://www.instagram.com/harry_s_style",
    icon: faInstagram,
  },
  {
    link: "https://www.facebook.com/harry.samuel.style",
    icon: faFacebookF,
  },
  {
    link: "https://twitter.com/harry_s_style?lang=en-gb",
    icon: faXTwitter,
  },
  {
    link: "https://soundcloud.com/harry-style",
    icon: faSoundcloud,
  },
];

const Socials = () => {
  return (
    <div className="fixed left-0 md:left-auto md:right-10 bottom-0 md:top-1/2 md:-translate-y-1/2 w-full flex justify-evenly md:justify-center z-10 bg-tangerine md:w-0 md:flex-col md:items-center md:bg-transparent">
      {links.map((link, i) => (
        <a href={link.link} target="_blank" rel="noreferrer" key={i}>
          <FontAwesomeIcon
            icon={link.icon}
            size="2xl"
            className="my-3 text-teal hover:text-persian"
          />
        </a>
      ))}
    </div>
  );
};

export default Socials;
