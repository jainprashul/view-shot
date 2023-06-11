import VideoBox from "@/component/VideoBox";
import { cameraActions } from "@/store/context/cameraSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";

const Dashboard = () => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const dispatch = useAppDispatch();
  const { audio, video } = useAppSelector((state) => state.camera);

  useEffect(() => {
    // async function getConnectedDevices(type: string) {
    //   const devices = await navigator.mediaDevices.enumerateDevices();
    //   return devices.filter((device) => device.kind === type);
    // }
    const openMediaDevices = async (constraints: MediaStreamConstraints) => {
      return await navigator.mediaDevices.getUserMedia(constraints);
    };
    (async () => {
      try {
        const stream = await openMediaDevices({
          audio,
          video,
        });
        dispatch(cameraActions.setStream(stream));
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    })();
  }, []);

  return (
    <div className="dashboard">
      <VideoBox src={localVideo} />
    </div>
  );
};

export default Dashboard;
