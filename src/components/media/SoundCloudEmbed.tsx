import { isSoundCloudUrl, soundCloudEmbedSrc } from "../../utils/embeds";

const SoundCloudEmbed = ({ url }: { url: string }) => {
  if (!isSoundCloudUrl(url)) {
    return null;
  }
  return (
    <iframe
      title="SoundCloud player"
      width="100%"
      height={166}
      allow="autoplay"
      loading="lazy"
      src={soundCloudEmbedSrc(url)}
    />
  );
};

export default SoundCloudEmbed;
