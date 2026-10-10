import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import harryStyleTitle from "../assets/harry-style.svg";
import theatreTitle from "../assets/theatre.svg";
import moreProjectsTitle from "../assets/moreProjects.svg";
import aboutTitle from "../assets/about.svg";
import Navbar from "./Navbar";
import Container from "./Container";
import ProjectSection from "./ProjectSection";
import About from "./About";
import Footer from "./Footer";
import Modal from "./Modal";
import { useBackgroundVideo } from "../context/BackgroundVideoContext";
import { useFirstInteraction } from "../hooks/useFirstInteraction";
import cn from "../utils/cn";
import Mute from "./icons/Mute";
import Play from "./icons/Play";


const Homepage = () => {
  const { videoRef, muted, unmute, toggleMute } = useBackgroundVideo();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const soundButtonRef = useRef<HTMLButtonElement>(null);

  // Browsers only allow sound after the visitor interacts, so the video starts
  // muted and the first click or Enter/Space anywhere turns the sound on.
  useFirstInteraction(() => {
    setInteracted(true);
    unmute();
  }, soundButtonRef);

  // Start muted playback explicitly: React sets `muted` only as a property, and
  // iOS Safari won't autoplay without the muted state set up front.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    video.play()?.catch(() => {
      // Autoplay refused (e.g. Low Power Mode): the first tap still starts it.
    });
  }, [videoRef]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSoundButton = () => {
    setInteracted(true);
    toggleMute();
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
        <meta property="og:image" content="https://res.cloudinary.com/dlaso8l44/image/upload/v1744223578/Harry_Style_Headshot_Left_ulqt4z.jpg" />
        <meta property="og:url" content="https://www.harrystyle.co.uk" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Harry Style - Composer | Arranger | Musical Director" />
        <meta name="twitter:description" content="I am a composer, arranger and musical director based in London, UK and
          I work primarily in theatre. I have travelled nationwide and
          internationally to work on a variety of new writing projects starting
          from first draft presentations to full-scale productions of
          established musicals in the musical theatre canon." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlaso8l44/image/upload/v1744223578/Harry_Style_Headshot_Left_ulqt4z.jpg" />
      </Helmet>
      <div className="relative">
        <Navbar openModal={openModal} />
        {/* Shorter than the screen so the Theatre title peeks above the fold
            (phones also clear the fixed social bar). */}
        <div className="h-[calc(100svh-21rem)] md:h-[calc(100svh-17.5rem)] overflow-hidden relative">
          <video
            ref={videoRef}
            autoPlay
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
            <source
              src="https://res.cloudinary.com/dlaso8l44/video/upload/v1744271669/Cheek_to_Cheek_Harry_Website_Compressed_-_960_x_540_wiunxh.mov"
              type="video/mov"
            />
            {/* <source src={homepageVideoWebM} type="video/webm" /> */}
            Your browser does not support the video tag.
          </video>

          <button
            ref={soundButtonRef}
            className="fixed bottom-20 md:bottom-[57px] left-6 md:left-8 hover:opacity-80"
            type="button"
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            onClick={handleSoundButton}
          >
            {muted ? (
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
              {muted && !interacted && (
                <p className="mt-6 text-lg tracking-wide text-tangerine animate-pulse motion-reduce:animate-none">
                  Tap anywhere for sound
                </p>
              )}
            </div>
          </div>
        </div>

        <Container className="py-40" id="theatre">
          <div className="w-full flex justify-center mb-16">
            <img src={theatreTitle} alt="Handwritten title - Theatre." className="md:scale-125" />
          </div>
          <ProjectSection tag="theatre" />
        </Container>

        <Container className="py-40" id="projects">
          <div className="w-full flex justify-center mb-16">
            <img src={moreProjectsTitle} alt="Handwritten title - More Projects." className="md:scale-125" />
          </div>
          <ProjectSection tag="more-projects" />
        </Container>

        <Container className="py-40 hidden md:block" id="about">
          <div className="w-full flex justify-center mb-16">
            <img src={aboutTitle} alt="Handwritten title - About." className="md:scale-125" />
          </div>
          <About openModal={openModal} />
        </Container>

        <div className="pt-40 block md:hidden" id="about-mobile">
          <div className="w-full flex justify-center mb-16">
            <img src={aboutTitle} alt="Handwritten title - About." className="md:scale-125" />
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
