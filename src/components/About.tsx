import Button from "./Button";

const About = ({ openModal }: { openModal: () => void }) => {
  return (
    <div className="md:flex w-full bg-center bg-teal">
      <img
        src="https://www.dropbox.com/scl/fi/lczazu2li9f69huusci7x/Harry-Style-Headshot-Left.jpg?rlkey=j6ytrxab2woj8a33rqodjx3iy&st=510e0vk1&raw=1"
        alt=""
        className="w-1/2 object-cover hidden md:block"
      />
      <div className="md:w-1/2 p-10 pt-10 flex flex-col gap-10 items-center text-bone">
        <p className="px-10">
          Ever since One Direction won the X Factor in 2010, I have been
          mistaken for Harry Styles on countless occasions, and I am humbled
          every day when I joke to myself that people have thought that he is
          me. Aside from our names, good looks and fashion sense, it turns out
          that we're both musicians too -- the chances of this coincidence have
          truly baffled me since I was 18.
          <br />
          <br />
          I am a composer, arranger and musical director based in London, UK and
          I work primarily in theatre. I have travelled nationwide and
          internationally to work on a variety of new writing projects starting
          from first draft presentations to full-scale productions of
          established musicals in the musical theatre canon.
          <br />
          <br />
          My latest composer-arranger outing has been alongside co-creators
          Ashley Jacobs and Jo Parsons. We partnered with Evolution Productions
          in April 2024 to take our sea-shanty show Shantify to the Edinburgh
          Fringe that summer with rave reviews.
          <br />
          <br />
          I most recently just finished the Upstairs at the Gatehouse production
          of Sondheim's Road Show with Chromolume Productions, for which I was
          musical director and also heavily re-orchestrated the music.
          <br />
          <br />
          I have also composed music for other media including TV and podcasts,
          most notably with music featured in an advert for The Alzheimer's
          Society with the barbershop quartet The Ashatones, for whom I also
          arrange and sing. We reached the quarter-finals of The Voice UK 2023,
          you can find our music on Spotify and social media platforms.
          <br />
          <br />
          In addition, I work with various upcoming artists as arranger for
          their music, as well as orchestrating concert music for various
          ensembles. I am also a pianist for Molto Music Group having played
          various London hotels since 2021.
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
