
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedPassword: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onOpenChange,
  generatedPassword
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    toast({
      title: "Password Copied",
      description: "Password copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-400/5 flex items-center justify-center mb-2">
              <Check className="w-7 h-7 text-green-600 dark:text-green-300/80" />
            </div>
            <DialogTitle className="text-center text-green-700 dark:text-green-600/80">
              Registration Successful!
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              The member has been registered successfully.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="relative bg-green-50 dark:bg-green-400/5 p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium dark:text-gray-300/80"><strong>Default Password:</strong></p>
          <div className="relative">
            <div className="bg-background p-3 rounded border border-green-200 dark:border-green-600/60 font-mono text-center text-lg">
              {generatedPassword}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute -top-3 -right-3 bg-background shadow hover:bg-emerald-100 dark:hover:bg-emerald-300/5 rounded-full"
                  type="button"
                  aria-label={copied ? "Password copied" : "Copy password"}
                  onClick={handleCopy}
                  tabIndex={0}
                  disabled={copied}
                >
                  {copied ?
                    <Check className="w-4 h-4 text-green-500 dark:text-green-300 transition-all" /> :
                    <Copy className="w-4 h-4 text-emerald-500 dark:text-emerald-300/80 transition-all" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Password copied" : "Copy password"}
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-green-700 dark:text-green-400/80 text-center">
            Please share this password with the member. They will be required to change it on first login.
          </p>
        </div>
        <Button
          onClick={() => onOpenChange(false)}
          className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600 transition-colors"
        >
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;

