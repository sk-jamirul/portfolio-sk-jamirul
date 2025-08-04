"use client";

import React from "react";

const FBVideoShow = ({ myVideoUrl }: { myVideoUrl: string }) => {
  return (
    <div>
      <FacebookVideo videoUrl={myVideoUrl} />
    </div>
  );
};

export default FBVideoShow;

const FacebookVideo = ({ videoUrl }: { videoUrl: string }) => {
  // You can construct the full embed URL here, or pass it directly as a prop
  const embedUrl = `https://www.facebook.com/plugins/video.php?height=314&href=${encodeURIComponent(
    videoUrl
  )}&show_text=false&width=560&t=0`;

  return (
    <div
      style={{ width: "100%" }}
      className="flex items-center pb-6 justify-center"
    >
      <iframe
        src={embedUrl}
        width={400}
        height={230}
        style={{
          border: "none",
          overflow: "hidden",
          borderRadius: "10px",
        }}
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
      ></iframe>
    </div>
  );
};
