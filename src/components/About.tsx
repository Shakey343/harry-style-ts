import Button from "./Button";

const About = ({ openModal }: { openModal: () => void }) => {
  return (
    <div className="md:flex w-full bg-center bg-teal">
      <img
        src="https://res.cloudinary.com/dlaso8l44/image/upload/v1744223578/Harry_Style_Headshot_Left_ulqt4z.jpg"
        alt="Headshot of Harry smiling."
        className="w-1/2 object-cover hidden md:block"
      />
      <div className="md:w-1/2 p-10 pt-10 flex flex-col gap-10 items-center text-bone">
        <p className="px-10">
          Ever since One Direction won the X Factor in 2010, I have been mistaken for Harry Styles on countless occasions, and I am humbled every day when I joke to myself that people have thought that he is me. Aside from our names, good looks and fashion sense, it turns out that we're both musicians too - the chances of this coincidence have truly baffled me since I was 18.
          <br />
          <br />
          I am a composer, arranger and musical director based in London, UK and I work primarily in theatre. I have travelled nationwide and internationally to work on a variety of new writing projects starting from first draft presentations to full-scale productions of established musicals in the musical theatre canon.
          <br />
          <br />
          My latest composer-arranger outing has been alongside co-creators Ashley Jacobs and Jo Parsons. Since partnering with Evolution Productions in April 2024, we have taken our sea-shanty show Shantify to the Edinburgh Fringe twice with rave reviews, and most recently performed it in The Ambassador's Theatre in the West End.
          <br />
          <br />
          I am currently working on the Upstairs at the Gatehouse production of Schwartz's Pippin with Chromolume Productions, for which I was musical director and also heavily re-orchestrated the music.
          <br />
          <br />
          I have also composed music for other media including TV and podcasts, most notably with music featured in an advert for The Alzheimer's Society with the barbershop quartet The Ashatones, for whom I also arrange and sing. We reached the quarter-finals of The Voice UK 2023, you can find our music on Spotify and social media platforms.
          <br />
          <br />
          In addition, I work with various upcoming artists as arranger for their music, as well as orchestrating concert music for various ensembles. I conduct choirs, play piano and sing at various functions, and also work for Molto Music Group.
        </p>
        <Button
          className="bg-tangerine text-teal hover:ring-tangerine hover:bg-teal hover:text-tangerine"
          initialWord="Get in touch"
          hoverWord="Email me"
          onClick={openModal}
        />
      </div>
    </div>
  );
};

export default About;
