import VideoBox from "@/component/VideoBox";
import { cameraActions } from "@/store/context/cameraSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useRef, useState } from "react";
import { MediaConnection, Peer } from "peerjs";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { PhoneCall } from "lucide-react";
import callaudio from "@/assets/call.mp3";
import CallAlert from "@/component/CallAlert";

const peer = new Peer();
const audio = new Audio(callaudio);

const Dashboard = () => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const [currentCall, setCurrentCall] = useState<MediaConnection>();
  const [callAlert, setCallAlert] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {
    stream,
  } = useAppSelector((state) => state.camera);

  const [myID, setMyID] = useState<string>();
  const [connectID, setConnectID] = useState<string>();

  function connectToPeer(id: string, stream: MediaStream) {
    const call = peer.call(id, stream, {
      metadata: {
        info: "test",
        receiver: id,
        connector: myID,
      },
    });

    setCurrentCall(call);
    call.on("stream", (stream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = stream;
      }
    });
    call.on("close", () => {
      console.log("connection close.");
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = null;
      }
    });
    call.on("iceStateChanged", (stat) => {
      console.log("iceStateChanged", stat);
      if(stat === 'disconnected'){
        if(remoteVideo.current){
          remoteVideo.current.srcObject = null;
        }
      }
    });
    call.on("error", (err) => {
      console.log(err);
    });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  function initCall(
    e: React.FormEvent<HTMLFormElement>,
    stream: MediaStream | null
  ) {
    e.preventDefault();
    if (!connectID) {
      alert("Enter Connection ID");
      return;
    }
    if (!stream) {
      alert("No stream");
      return;
    }
    connectToPeer(connectID, stream);
  }

  function initPeerConnection() {
    peer.on("open", (id) => {
      setMyID(id);
      console.log(id);
    });
    peer.on("call", (call) => {

      // alert call
      setCurrentCall(call);
      setCallAlert(true);
      audio.play();

        call.on("stream", (userVideoStream) => {
          if (remoteVideo.current) {
            remoteVideo.current.srcObject = userVideoStream;
          }
        });

        call.on("close", () => {
          console.log("call closed");
          if (remoteVideo.current) {
            remoteVideo.current.srcObject = null;
          }
        });

        call.on("error", (err) => {
          console.log("call error", err);
        });

        call.on("iceStateChanged", (state) => {
          console.log("call iceStateChanged", state);
        });

        console.log(call);
      
    });
  }

  function disconnectCall() {
    if (currentCall) {
      currentCall.close();
    }
  }

  useEffect(() => {
    const openMediaDevices = async (constraints: MediaStreamConstraints) => {
      return await navigator.mediaDevices.getUserMedia(constraints);
    };
    (async () => {
      try {
        initPeerConnection();
        const stream = await openMediaDevices({
          audio: true,
          video: true,
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
    <>
      <div className="dashboard flex flex-wrap gap-2">
        <VideoBox src={remoteVideo} />
        <VideoBox src={localVideo} muted />
      </div>

      {currentCall && (
        <>
          <Button onClick={disconnectCall}>Disconnect</Button>
        </>
      )}

      <form onSubmit={(e) => initCall(e, stream)}>
        <Input
          value={connectID}
          onChange={(e) => setConnectID(e.target.value)}
          placeholder="Enter Connection ID"
        />
        <Button type="submit">
          <PhoneCall />
        </Button>
      </form>

      <CallAlert open={callAlert} onAccept={()=> {
        if (currentCall) {
          currentCall.answer(stream!);
        }
        audio.pause();
        setCallAlert(false);
      }} onDecline={()=> {
        if (currentCall) {
          currentCall.close();
        }
        audio.pause();
        setCallAlert(false);
      }} />


      <span className="fixed bottom-0 right-0 m-1 text-xs caret-indigo-400" onClick={() => copyToClipboard(myID as string)}>{myID}</span>
    </>
  );
};

export default Dashboard;
