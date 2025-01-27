import Card from "./Card";

const imgLinks = [
  {
    img: "https://www.dropbox.com/scl/fi/tlnpsoz0808mqdq36svct/1.-Shantify-Poster.jpg?rlkey=j8m7ecz467otk86kdm968mzaf&st=rt6bq15q&raw=1",
    img2: "https://uc179d14f5084742403bedd014ae.dl.dropboxusercontent.com/cd/0/inline/Ci_3aRhOMR_j1q1uJD4pOt3sfCW5aEs-LD_QZjUikPWoYtEIM5So0WzJmnOc2SStaGJQy7IM8MZmuOH-U80MTJZEW74tJezabhjczdU-cA1tSrAmbdswhxW5n5vMSqSrZbi43GrRJBq16qG1kjGSLTNG/file#",
    url: "https://www.instagram.com/p/C-3HxhmIRrH/",
  },
  {
    img: "https://www.dropbox.com/scl/fi/pu54u11yo1uppwwey71xy/2.-Liz-Poster.jpg?rlkey=4lyvjj1tcj371ytj8me92uras&st=gp77jewm&raw=1",
    img2: "https://uc181e6d858ea015e5c06aba05dc.dl.dropboxusercontent.com/cd/0/inline/Ci9RLETUaCddxod3HT5cPNcDdQQ7MRRYjQtOPTnxy_tckkvC805M58Tdfuryy9runsw8GJr1jJDLX7zRAoawYZHetmvz7_z4vxw0bLYenLczLDkjwdGJ8YoxSbBo0hg3mX17SERRB3iT4Ec8a_z6Sh75/file#",
    url: "https://www.soundcloud.com/harry-style/sets/liz",
  },
  {
    img: "https://www.dropbox.com/scl/fi/pr3hung0p6qwgztnbtz17/3b.-Forgive-Us-Oh-Father-Portrait-Poster.jpg?rlkey=pnckbpxqa24vmj1ov6z2rl611&st=pbsdi146&raw=1",
    img2: "https://uc1168f7a1ecccce0a9df2386682.dl.dropboxusercontent.com/cd/0/inline/Ci_qA4YAv3ocedUkVxQAKjE-p319-BdF_9bJfFWPyGK5p52JkgdpW-oPezGPqR5H5pt5SujDPi7LWQdLRgOT5QoitFYqs8KDIOviAAcfsVRdMpAxU9vRPIMkp_cMgOpn2k76ElR8OrRv6i6gnA8c7U9d/file#",
    url: "https://www.soundcloud.com/harry-style/sets/forgive-us-oh-father",
  },
  {
    img: "https://www.dropbox.com/scl/fi/tqgfjsstbbj79r0rcf26m/4.-Road-Show-Poster.png?rlkey=rki2eyb4sf4qmd9rzsgjqiwt8&st=dvbkwvxf&raw=1",
    img2: "https://uc273aee5a0448ac795f820e9fcf.dl.dropboxusercontent.com/cd/0/inline/Ci8TNUNt7xpHVpgf9wWW5zzm8VwmMZYxgCTErcceaNex8SQ-NyCR_WvuIOsWFzdV3pGpuqbAGE2iOSLFECCSkxT20QfiEwMAUNr4He5FLAr-Tvl1i9Fb6J7Kd4rdvrYb7dlX3SIvkZZLMxxrEDYU9GRd/file#",
    url: "https://www.instagram.com/p/DEf2p4eowZI/",
  },
  {
    img: "https://www.dropbox.com/scl/fi/utviullbsy6g43trnd7s8/5.-YAGMCB-Poster-Gatehouse.png?rlkey=x1smyyoo1djfba0ahkezmab2a&st=0u1apqhz&raw=1",
    img2: "https://uce66720ed4ce1bbdd645e4250a5.dl.dropboxusercontent.com/cd/0/inline/Ci-s6WAxZNB1XQ9bJa3JfOwBrocljaHr7uwZsrYfHGd0wS17Y5zfYhaUN4KS-9xpHrIRG7kHmDc5qWeqZ3qEpRNQ7LbBicskTe68gj-yvrwzHvHCqLEby4Ug54AyqueWwMqMd-rTchQww_f4OHfUKcmm/file#",
    url: "https://www.instagram.com/stories/highlights/18405156373047559/",
  },
  {
    img: "https://www.dropbox.com/scl/fi/mgfcclw56kqba2ygk6xrb/6.-Tom-Lehrer-Poster.png?rlkey=wx7rqsuf9t7nk0jukf2i9poxq&st=edcth6wv&raw=1",
    img2: "https://ucabf97374ddf923b75995d70c75.dl.dropboxusercontent.com/cd/0/inline/Ci814N9lLkatyANl1yeO6_dkUHUNv6tvNKodyhOdaLNCYO0xYFoWiTAgLWmT_jvCaBJPlHQ1Chcs0ZPAd8ujorQFfyabRZ-BLrzpBiuoTaGTDulPP4hsykadzIIbQaFdEFTzYYKKTtijXTVcQb_YU4uV/file#",
    url: "https://www.instagram.com/stories/highlights/18257575183254909/",
  },
  {
    img: "https://www.dropbox.com/scl/fi/1y58m8kvouoz03z73i5n7/7b.-The-Crooked-Spire-Poster-Square.png?rlkey=5m4m904n86wgbkww1m3znxai4&st=ds2fk4t0&raw=1",
    img2: "https://uce268bf6129a4701503e0656886.dl.dropboxusercontent.com/cd/0/inline/Ci80kB3ssUGjzlpZWbov9hBSd1lGXLhiahKiRWbGWe9n1JOMndBrcQhAY67kZ9VgriLU2MKQxXWRzu1k5jeC3gNq0C9HmJ1jaOdsK1GK9fAV7AInSv-Mxay5Vxku4tNQATo6Avj2vkDC8QNoAjLrroFG/file#",
    url: "https://www.ashgateheritagearts.co.uk/crooked-spire-murder-mystery-musical.html",
  },
  {
    img: "https://www.dropbox.com/scl/fi/rfyxilu3br5tup5zwnu02/8.-A-Lark-Poster.png?rlkey=76kwysgmgwd2qjubkksh8vaer&st=md2ytom5&raw=1",
    img2: "https://uc0c90775c9ff55a97cfcec5f047.dl.dropboxusercontent.com/cd/0/inline/Ci9OUsEyVYF7acP-KPZkx96efvrXWXT7QYfADro7cJZpm6auuYSjZoy-CRK7mRKwSywUC3U42CBSiDnJoakpuaoSNkVCaCPVpbAcy37-D6SvZSRfyJMzS6Pku6bVRy8b3S786FsoAz_Dqfm--zSZGPrl/file#",
    url: "https://www.youtube.com/watch?v=FIjp4W_l6WQ",
  },
  {
    img: "https://www.dropbox.com/scl/fi/dq8mx2gr1vb5risbmh8s3/9.-Mountains-of-the-Moon-Poster.jpg?rlkey=v1lmtlwuhlmz98jeiquar7l6k&st=wzdibzwp&raw=1",
    img2: "https://uc8756baed24b18bf3f372fc278c.dl.dropboxusercontent.com/cd/0/inline/Ci90WCQWzcsrs42XDN2SD-oMU75_652u_HnBPAbvbm7R5UNXUq2LLw_VgvZ5EytX3vpsW1INy8MkAlEjroSa_LDDKmurpwtfrKgCDfPVW4zf-gPHnOIBAId3Im8pWDGYhH2PynppxCmjSSaYCwHUcMot/file#",
    url: "https://www.ashgateheritagearts.co.uk/mountains-of-the-moon.html",
  },
];

const TheatreImages = () => {
  console.log(navigator.userAgent)
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {imgLinks.map((obj) => (
        <Card imgUrl={navigator.userAgent.includes("Safari") ? obj.img2 : obj.img} link={obj.url} className="" />
      ))}
    </div>
  );
};

export default TheatreImages;
