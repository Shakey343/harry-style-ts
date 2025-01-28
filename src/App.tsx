import "./App.css";
import { useState } from "react";
import muteIcon from "./assets/mute.svg";
import playIcon from "./assets/play.svg";
import harryStyleTitle from "./assets/harry-style.svg";
import theatreTitle from "./assets/theatre.svg";
import moreProjectsTitle from "./assets/moreProjects.svg";
import aboutTitle from "./assets/about.svg";
import Navbar from "./components/Navbar";
import Container from "./components/Container";
import TheatreImages from "./components/Theatre";
import MoreProjects from "./components/MoreProjects";
import About from "./components/About";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import cn from "./utils/cn";

function App() {
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
      {showPlayBtn && (
        <div className="fixed top-0 h-screen w-screen bg-night z-50 overflow-hidden">
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
            className="w-screen h-screen object-cover object-left xl:object-center fixed -z-10"
          >
            <source
              src="https://www.dropbox.com/scl/fi/8c4p9pdxoc0qpvaju7e09/Cheek-to-Cheek-Harry-Website.mp4?rlkey=j2a5wo2kvp3duvhn1nwbl4bhq&st=vko11vnv&raw=1"
              type="video/mp4"
            />
            {/* <source src={homepageVideoWebM} type="video/webm" /> */}
            Your browser does not support the video tag.
          </video>

          <button
            className="fixed bottom-[57px] hidden lg:block left-4 xl:left-8 hover:opacity-80"
            type="button"
            onClick={handleUnmute}
          >
            <img src={mute ? muteIcon : playIcon} alt="" />
          </button>
          <div className={cn("absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out", loading ? "top-1/2 -translate-y-1/2 scale-125" : "top-[14%] scale-75")}>
            <div className="text-center text-bone">
              <img src={harryStyleTitle} alt="" className="mb-4" />
              <span className="text-2xl">COMPOSER | ARRANGER | MUSICAL DIRECTOR</span>
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

        <Container className="py-40" id="about">
          <div className="w-full flex justify-center mb-16">
            <img src={aboutTitle} alt="" className="scale-125" />
          </div>
          <About openModal={openModal} />
        </Container>

        <Modal isVisible={isModalVisible} onClose={closeModal} />

        <Footer />
      </div>
    </>
  );
}

export default App;
