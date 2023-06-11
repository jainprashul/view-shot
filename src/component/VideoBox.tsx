import { Button } from "@/component/ui/button";
import { cameraActions } from "@/store/context/cameraSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Video, Mic, MicOff, VideoOff } from "lucide-react";
import React from "react";

type Props = {
  src: React.RefObject<HTMLVideoElement>;
};

function VideoBox(props : Props) {
  const dispatch = useAppDispatch();
  const { audio, video } = useAppSelector((state) => state.camera);
  return (
    <div className="video-player">
      <video
        className="video"
        id="localvideo"
        ref={props.src}
        autoPlay
      />
      <div className="video-controls flex gap-2 justify-center">
        <Button
          variant={"outline"}
          onClick={() => {
            dispatch(cameraActions.toggleVideo());
          }}
        >
          {!video ? <VideoOff /> : <Video />}
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            dispatch(cameraActions.toggleAudio());
          }}
        >
          {!audio ? <MicOff /> : <Mic />}
        </Button>
      </div>
    </div>
  );
}

export default VideoBox;