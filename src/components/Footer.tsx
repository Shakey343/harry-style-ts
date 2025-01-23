import Container from "./Container";
import email from "../assets/email.svg"
import Socials from "./Socials";

const Footer = () => {
  return (
    <div className="bg-bone h-[140px]">
      <Container className="flex justify-between items-center h-full">
        <img src={email} alt="" />
        <Socials />
      </Container>
    </div>
  )
};

export default Footer;
