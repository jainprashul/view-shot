import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { PhoneIncoming, PhoneOffIcon } from "lucide-react";

type Props = {
  open: boolean;
  onClose?: () => void;
  onAccept: () => void;
  onDecline: () => void;
};

const CallAlert = (props: Props) => {
  return (
    <div>
      <Dialog open={props.open} modal onOpenChange={props.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Incoming Call</DialogTitle>
            <DialogDescription>
              Incoming call from: <strong>John Doe</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={props.onAccept} variant={"success"}>
              <PhoneIncoming size={18} /> &nbsp; Connect
            </Button>
            <Button onClick={props.onDecline} variant={"destructive"}>
              <PhoneOffIcon size={18} /> &nbsp; Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallAlert;
