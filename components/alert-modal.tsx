import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  action: string;
  actionVariant: "destructive" | "default" | "outline" | "secondary" | "ghost";
  title: string;
  description: string;
  showCancelButton?: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  action,
  actionVariant,
  title,
  description,
  showCancelButton = true,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex w-full items-center justify-end space-x-2 pt-6">
          {showCancelButton && (
            <Button disabled={loading} variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            disabled={loading}
            variant={actionVariant}
            onClick={onConfirm}
          >
            {action}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
