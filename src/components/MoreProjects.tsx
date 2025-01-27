import Card from "./Card";

const imgLinks = [
  {
    img: "https://www.dropbox.com/scl/fi/pxmjmezer3n9zjx3oid8s/1.-BWWL-Backdrop.png?rlkey=otxw8qyjfzgd54qoww29u9d8v&st=g3nprxc3&raw=1",
    url: "https://www.youtube.com/watch?v=XY1G1jKB_ew",
  },
  {
    img: "https://www.dropbox.com/scl/fi/oy798i0kl6085j707obkx/2.-The-Ashatones-Line.jpg?rlkey=54ek1b1nye1li1o80s7g7fq15&st=d8thwy6h&raw=1",
    url: "https://www.youtube.com/@theashatones",
  },
  {
    img: "https://www.dropbox.com/scl/fi/3ibxsw7v75cjji6hn8g8w/3.-Healthworker-Talk-Poster.jpg?rlkey=8ftp00lzl9h1miwbz0rsglb2c&st=fh2z1w6d&raw=1",
    url: "https://www.soundcloud.com/harry-style/sets/healthworker-talk ",
  },
  {
    img: "https://www.dropbox.com/scl/fi/i4eteisoxaxfappwc8mir/4.-Imy-Halsey.jpeg?rlkey=uivvrjzjrkivmbeavn5kq9py2&st=ves3e15e&raw=1",
    url: "https://open.spotify.com/album/5ah5PTvjYd9cjgoCS9bAzX?si=eXkI6h2qTYixW6efsKPzww",
  },
  {
    img: "https://www.dropbox.com/scl/fi/xyn2bm6uqepl3z68adi1l/5.-Anna-Anouk.jpg?rlkey=zk1p7lj3ivc50simr949egp2u&st=9h1l9l6l&raw=1",
    url: "https://open.spotify.com/artist/6nEijwetSlwcQ2p59A7qKy?si=I3Iou3THQH6YjufmDnd3hw",
  },
  {
    img: "https://www.dropbox.com/scl/fi/mi0kvkahgffxinb4bivns/6.-Improv-Poster.jpeg?rlkey=fvggqdyv019gqbpfl9lypb1ql&st=kfuv5bh9&raw=1",
    url: "https://www.soundcloud.com/harry-style/improv-theme",
  },
];

const MoreProjects = () => {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {imgLinks.map((obj, i) => (
        <Card key={i} imgUrl={obj.img} link={obj.url} className="" />
      ))}
    </div>
  );
};

export default MoreProjects;
