import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface DownloadDialogProps {
  open: boolean;
  username: string;
  roomId: string;
}

export default function UsernameTakenDialog({
  open,
  username,
  roomId,
}: DownloadDialogProps) {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Username Taken</AlertDialogTitle>
          <AlertDialogDescription>
            Someone with the username {username} is already present in the room.
            Do you want to change your username?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => navigate("/")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => navigate(`/settings?roomId=${roomId}`)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
