import "./App.css";
import Navbar from "./components/Navbar";
import homepageVideo from "./assets/Cheek to Cheek Harry Website.mp4";
import muteIcon from "./assets/mute.svg";
import playIcon from "./assets/play.svg";
import { useState } from "react";

function App() {
  const [mute, setMute] = useState(true);
  const [showPlayBtn, setShowPlayBtn] = useState(true);

  const handlePlayBtn = () => {
    setShowPlayBtn(false);
    handleUnmute();
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
    <div className="relative">
      <Navbar />
      <div className="h-screen overflow-hidden">
        <video
          loop
          muted
          className="w-screen h-screen object-cover object-left xl:object-center fixed -z-10"
        >
          <source src="https://www.dropbox.com/scl/fi/8c4p9pdxoc0qpvaju7e09/Cheek-to-Cheek-Harry-Website.mp4?rlkey=j2a5wo2kvp3duvhn1nwbl4bhq&st=vko11vnv&raw=1" type="video/mp4" />
          {/* <source src={homepageVideoWebM} type="video/webm" /> */}
          Your browser does not support the video tag.
        </video>
        {showPlayBtn && (
          <div className="h-screen w-screen relative bg-night">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center">
              <p className="text-tangerine mb-4 text-2xl">(Sound on)</p>
              <button
                className="bg-teal text-tangerine px-5 py-3 mb-4"
                type="button"
                onClick={handlePlayBtn}
              >
                PLAY
              </button>
            </div>
          </div>
        )}
        <button
          className="absolute bottom-[50px] left-[40px]"
          type="button"
          onClick={handleUnmute}
        >
          <img src={mute ? muteIcon : playIcon} alt="" />
        </button>
        <div className="absolute">
          <h1>Harry Style</h1>
          <span>COMPOSER | ARRANGER | MUSICAL DIRECTOR</span>
        </div>
      </div>
    </div>
  );
}

export default App;
