
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedPassword: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onOpenChange,
  generatedPassword
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-center text-green-600">✅ Registration Successful!</DialogTitle>
        <DialogDescription className="text-center">
          The member has been registered successfully.
        </DialogDescription>
      </DialogHeader>
      <div className="bg-green-50 p-4 rounded-lg space-y-2">
        <p className="text-sm"><strong>Default Password:</strong></p>
        <div className="bg-white p-3 rounded border border-green-200 font-mono text-center text-lg">
          {generatedPassword}
        </div>
        <p className="text-sm text-green-700">
          Please share this password with the member. They will be required to change it on first login.
        </p>
      </div>
      <Button onClick={() => onOpenChange(false)} className="w-full">
        Done
      </Button>
    </DialogContent>
  </Dialog>
);

export default SuccessModal;
