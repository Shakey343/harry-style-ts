import Card from "./Card";

const imgLinks = [
  {
    img: "https://www.dropbox.com/scl/fi/pxmjmezer3n9zjx3oid8s/1.-BWWL-Backdrop.png?rlkey=otxw8qyjfzgd54qoww29u9d8v&st=g3nprxc3&raw=1",
    img2: "https://ucf596e0fd6f0680a190f562c1a0.dl.dropboxusercontent.com/cd/0/inline/Ci_8sF1cpC5He2aqq1PNw3SIyQLHDPNEUVd8APuGz0kMGrVRpRfTcPmYnZ2pFbgvPU_bxq4lVCUFtkT87LODWXyqVzpTh2TZja5_FCNL2onDObCFuamULgHxC6ANMNI3K_h9f8dEQ6jUYa9ZilsNfTtp/file#",
    url: "https://www.youtube.com/watch?v=XY1G1jKB_ew",
  },
  {
    img: "https://www.dropbox.com/scl/fi/oy798i0kl6085j707obkx/2.-The-Ashatones-Line.jpg?rlkey=54ek1b1nye1li1o80s7g7fq15&st=d8thwy6h&raw=1",
    img2: "https://uc26b3a6209b60f4f4fb9ad5b89e.dl.dropboxusercontent.com/cd/0/inline/Ci-o0a0cYcJPFf-WbhfMGvJkaGLvsUOoUXPucIRX1w4LI8n0nEH7Fy1J9XxMgTCY4sGf5Zl-XaEx66zZQrfHgHiYjiYX3PoTuDOMgLTuD7dSXZt-yoiXni13eIkPPd1HI1dg9Dm0KQBL24toKP6_-uUK/file#",
    url: "https://www.youtube.com/@theashatones",
  },
  {
    img: "https://www.dropbox.com/scl/fi/3ibxsw7v75cjji6hn8g8w/3.-Healthworker-Talk-Poster.jpg?rlkey=8ftp00lzl9h1miwbz0rsglb2c&st=fh2z1w6d&raw=1",
    img2: "https://uc9732cd23920814e97be6f9018d.dl.dropboxusercontent.com/cd/0/inline/Ci9aZrqfYefZqbpujfW-Pej1KWZj50iMgM4jNf8AIpaKOf_RXENzYpbZSC-8bQUZ7EVUumJtdPD5PNZ_G-iFf02VRruZ69fXUufjts-ibcbeg8a20svLWsnWI0ZqCQFX-G31OKaGr51UDy1eXUyMDukj/file#",
    url: "https://www.soundcloud.com/harry-style/sets/healthworker-talk ",
  },
  {
    img: "https://www.dropbox.com/scl/fi/i4eteisoxaxfappwc8mir/4.-Imy-Halsey.jpeg?rlkey=uivvrjzjrkivmbeavn5kq9py2&st=ves3e15e&raw=1",
    img2: "https://uc317e18bd616b13e41369bc0639.dl.dropboxusercontent.com/cd/0/inline/Ci8lKwqwzKfgxKTZwCRQeLpJNvvp7RcxW7Oo-HAVyttEgvakqH3crNp8zUBpRQop_xVem4_UnNN1rm4qMOzvbiBafIW-MF9XIfby1I6agixO-MGHg-Z1_JbOT_StkIU53aOX0KD6r_Ct_NoP3bYU5P4z/file#",
    url: "https://open.spotify.com/album/5ah5PTvjYd9cjgoCS9bAzX?si=eXkI6h2qTYixW6efsKPzww",
  },
  {
    img: "https://www.dropbox.com/scl/fi/xyn2bm6uqepl3z68adi1l/5.-Anna-Anouk.jpg?rlkey=zk1p7lj3ivc50simr949egp2u&st=9h1l9l6l&raw=1",
    img2: "https://uc50248afebdc1c4e5478ade7b4c.dl.dropboxusercontent.com/cd/0/inline/Ci-XKX4wNJN4aXGSZJjrey-de3nBdwDTiDNMBuFMqaRCn8bcWXuGIA6cgc7YRppdjJLnlwso413s6oy7Ykc0Xt65BtuVjpZf8gC2M9yTrERjcw2aQEK5agY5Ln-a_k-cZTJL1Q1pOh_1IdyPcZS7Ct21/file#",
    url: "https://open.spotify.com/artist/6nEijwetSlwcQ2p59A7qKy?si=I3Iou3THQH6YjufmDnd3hw",
  },
  {
    img: "https://www.dropbox.com/scl/fi/mi0kvkahgffxinb4bivns/6.-Improv-Poster.jpeg?rlkey=fvggqdyv019gqbpfl9lypb1ql&st=kfuv5bh9&raw=1",
    img2: "https://uc25b63aaf3d579818de6cd8a457.dl.dropboxusercontent.com/cd/0/inline/Ci_ffD5hGz92tNZRqHP0pXrY1XsGecAt01ruToQYCrvfr3-MMZcZT4kdMgnDPKjP0Ynr7_7wdg0A4IWu2moc_9VQsUIfYrlUj93J5S1FhWnb98fvOcC8pIk7gQo2AbfeXPvG7ghPlDpwoyGMR70YaCL9/file#",
    url: "https://www.soundcloud.com/harry-style/improv-theme",
  },
];

const MoreProjects = () => {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {imgLinks.map((obj) => (
        <Card imgUrl={navigator.userAgent.includes("Safari") ? obj.img2 : obj.img} link={obj.url} className="" />
      ))}
    </div>
  );
};

export default MoreProjects;
