import Container from "./Container";
import email from "../assets/email.svg"
import Socials from "./Socials";

const Footer = () => {
  return (
    <div className="bg-bone h-[140px]">
      <Container className="flex justify-between items-center h-full">
        <a href="mailto:h.style@rocketmail.com?subject=Music%20Enquiry&amp;body=Hello%20Harry..." target="_blank" title="Email" className="hover:opacity-60">
          <img src={email} alt="" />
        </a>
        <Socials />
      </Container>
    </div>
  )
};

export default Footer;
