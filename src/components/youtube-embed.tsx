export function YouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  return (
    <div className="aspect-video overflow-hidden rounded-2xl shadow-md">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={`Video: ${title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="size-full"
      />
    </div>
  );
}
