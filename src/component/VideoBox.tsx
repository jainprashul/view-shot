import { Button } from "@/component/ui/button";
import { Video, Mic, MicOff, VideoOff } from "lucide-react";
import React, { useState } from "react";

type Props = {
  src: React.RefObject<HTMLVideoElement>;
  muted?: boolean;
  width?: number;
  height?: number;
};

function VideoBox(props: Props) {
  const stream = props.src.current?.srcObject as MediaStream;
  const [videoEnable, setVideoEnable] = useState(true);
  const [audioEnable, setAudioEnable] = useState(true);

  function toogleVideo() {
    const vtracks = stream.getVideoTracks();
    if (vtracks.length) {
      vtracks[0].enabled = !videoEnable;
      setVideoEnable(!videoEnable);
    }
  }
  function toogleAudio() {
    const atracks = stream.getAudioTracks();
    if (atracks.length) {
      atracks[0].enabled = !audioEnable;
      setAudioEnable(!audioEnable);
    }
  }

  return (
    <div className="flex flex-col md:flex-1 gap-2 justify-center w-full">
      <video
        width={props.width}
        height={props.height}
        muted={props.muted}
        className="video"
        id="localvideo"
        ref={props.src}
        autoPlay
      />
      <div className="video-controls flex gap-2 justify-center">
        <Button
          variant={"outline"}
          onClick={() => {
            toogleVideo();
          }}
        >
          {videoEnable ? <Video /> : <VideoOff />}
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            toogleAudio();
          }}
        >
          {audioEnable ? <Mic /> : <MicOff />}
        </Button>
      </div>
    </div>
  );
}

export default VideoBox;
