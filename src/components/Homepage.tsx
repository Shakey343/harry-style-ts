import { useState } from "react";
import { Helmet } from "react-helmet-async";
import harryStyleTitle from "../assets/harry-style.svg";
import theatreTitle from "../assets/theatre.svg";
import moreProjectsTitle from "../assets/moreProjects.svg";
import aboutTitle from "../assets/about.svg";
import Navbar from "./Navbar";
import Container from "./Container";
import TheatreImages from "./Theatre";
import MoreProjects from "./MoreProjects";
import About from "./About";
import Footer from "./Footer";
import Modal from "./Modal";
import cn from "../utils/cn";
import Mute from "./icons/Mute";
import Play from "./icons/Play";

const Homepage = () => {
  const [mute, setMute] = useState(true);
  const [showPlayBtn, setShowPlayBtn] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handlePlayBtn = () => {
    setShowPlayBtn(false);
    handleUnmute();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleUnmute = () => {
    const video = document.querySelector("video");
    if (!video) {
      return;
    }
    if (video.muted) {
      video.muted = false;
      video.play();
      setMute(false);
    } else {
      video.muted = true;
      setMute(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Harry Style - Composer | Arranger | Musical Director</title>
        <meta name="description" content="I am a composer, arranger and musical director based in London, UK and
          I work primarily in theatre. I have travelled nationwide and
          internationally to work on a variety of new writing projects starting
          from first draft presentations to full-scale productions of
          established musicals in the musical theatre canon." />
        <meta name="keywords" content="Harry, Style, Musician, Composer, Arranger, Musical Director" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content="Harry Style - Composer | Arranger | Musical Director" />
        <meta property="og:description" content="I am a composer, arranger and musical director based in London, UK and
          I work primarily in theatre. I have travelled nationwide and
          internationally to work on a variety of new writing projects starting
          from first draft presentations to full-scale productions of
          established musicals in the musical theatre canon." />
        <meta property="og:image" content="https://www.dropbox.com/scl/fi/lczazu2li9f69huusci7x/Harry-Style-Headshot-Left.jpg?rlkey=j6ytrxab2woj8a33rqodjx3iy&st=510e0vk1&raw=1" />
        <meta property="og:url" content="https://www.harrystyle.co.uk" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Harry Style - Composer | Arranger | Musical Director" />
        <meta name="twitter:description" content="I am a composer, arranger and musical director based in London, UK and
          I work primarily in theatre. I have travelled nationwide and
          internationally to work on a variety of new writing projects starting
          from first draft presentations to full-scale productions of
          established musicals in the musical theatre canon." />
        <meta name="twitter:image" content="https://www.dropbox.com/scl/fi/lczazu2li9f69huusci7x/Harry-Style-Headshot-Left.jpg?rlkey=j6ytrxab2woj8a33rqodjx3iy&st=510e0vk1&raw=1" />
      </Helmet>
      {showPlayBtn && (
        <div className="fixed top-0 h-full w-full bg-night z-50 overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
            <p className="text-tangerine mb-4 text-2xl">(Sound on)</p>
            <button
              className="bg-teal text-tangerine px-5 py-3 mb-4"
              type="button"
              onClick={handlePlayBtn}
            >
              Enter
            </button>
          </div>
        </div>
      )}
      <div className="relative">
        <Navbar openModal={openModal} />
        <div className="h-screen overflow-hidden relative">
          <video
            loop
            muted
            playsInline
            controls={false}
            preload="auto"
            className="w-full h-screen object-cover object-left xl:object-center fixed -z-10"
          >
            <source
              src="https://www.dropbox.com/scl/fi/8c4p9pdxoc0qpvaju7e09/Cheek-to-Cheek-Harry-Website.mp4?rlkey=j2a5wo2kvp3duvhn1nwbl4bhq&st=vko11vnv&raw=1"
              type="video/mp4"
            />
            {/* <source src={homepageVideoWebM} type="video/webm" /> */}
            Your browser does not support the video tag.
          </video>

          <button
            className="fixed bottom-20 md:bottom-[57px] left-6 md:left-8 hover:opacity-80"
            type="button"
            onClick={handleUnmute}
          >
            {mute ? (
              <Mute className="text-tangerine md:text-teal" />
            ) : (
              <Play className="text-tangerine md:text-teal" />
            )}
          </button>
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out text-",
              loading
                ? "top-1/2 -translate-y-1/2 sm:scale-125"
                : "top-[18%] md:top-[14%] scale-[80%] sm:scale-75"
            )}
          >
            <div className="text-center text-nowrap text-bone2 md:text-bone drop-shadow-xl">
              <img src={harryStyleTitle} alt="" className="mb-4" />
              <span className="text-2xl hidden md:block">
                COMPOSER | ARRANGER | MUSICAL DIRECTOR
              </span>
              <div className="md:hidden text-4xl">
                <p>
                  COMPOSER
                </p>
                <p>
                  ARRANGER
                </p>
                <p>
                  MUSICAL DIRECTOR
                </p>
              </div>
            </div>
          </div>
        </div>

        <Container className="py-40" id="theatre">
          <div className="w-full flex justify-center mb-16">
            <img src={theatreTitle} alt="" className="scale-125" />
          </div>
          <TheatreImages />
        </Container>

        <Container className="py-40" id="projects">
          <div className="w-full flex justify-center mb-16">
            <img src={moreProjectsTitle} alt="" className="scale-125" />
          </div>
          <MoreProjects />
        </Container>

        <Container className="py-40 hidden md:block" id="about">
          <div className="w-full flex justify-center mb-16">
            <img src={aboutTitle} alt="" className="scale-125" />
          </div>
          <About openModal={openModal} />
        </Container>

        <div className="pt-40 block md:hidden" id="about-mobile">
          <div className="w-full flex justify-center mb-16">
            <img src={aboutTitle} alt="" className="scale-125" />
          </div>
          <About openModal={openModal} />
        </div>

        <Modal isVisible={isModalVisible} onClose={closeModal} />

        <Footer />
      </div>
    </>
  );
}

export default Homepage;
