import Container from "./Container";
import email from "../assets/email.svg"
import Socials from "./Socials";

const Footer = () => {
  return (
    <div className="bg-bone h-[140px] mb-[56px] md:mb-0">
      <Container className="flex flex-col md:flex-row gap-4 justify-center md:justify-between items-center h-full">
        <a href="mailto:h.style@rocketmail.com?subject=Music%20Enquiry&amp;body=Hello%20Harry..." target="_blank" title="Email" className="hover:opacity-60">
          <img src={email} alt="" />
        </a>
        <p className="font-mono text-night text-xs sm:text-sm">Copyright © 2025 <a href="https://github.com/shakey343" target="_blank" rel="noreferrer" className="hover:text-teal transition"><strong>Jake Pople</strong></a></p>
        <Socials />
      </Container>
    </div>
  )
};

export default Footer;
