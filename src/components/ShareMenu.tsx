import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Share2, 
  MessageCircle, 
  Mail, 
  Linkedin, 
  Twitter,
  Facebook,
  Send,
  Copy,
  Check
} from "lucide-react";
import { 
  shareNative,
  shareToWhatsApp,
  shareToEmail,
  shareToLinkedIn,
  shareToTwitter,
  shareToFacebook,
  shareToTelegram,
  copyToClipboard,
  type ShareData
} from "@/utils/sharing";
import { useToast } from "@/hooks/use-toast";

interface ShareMenuProps {
  shareData: ShareData;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const ShareMenu = ({ 
  shareData, 
  variant = "outline", 
  size = "sm",
  className 
}: ShareMenuProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleNativeShare = async () => {
    const success = await shareNative(shareData);
    if (!success) {
      // Fallback to copy to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      action: () => shareToWhatsApp(shareData),
      color: "text-green-600"
    },
    {
      label: "Email",
      icon: Mail,
      action: () => shareToEmail(shareData),
      color: "text-blue-600"
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      action: () => shareToLinkedIn(shareData),
      color: "text-blue-700"
    },
    {
      label: "Twitter",
      icon: Twitter,
      action: () => shareToTwitter(shareData),
      color: "text-sky-500"
    },
    {
      label: "Facebook",
      icon: Facebook,
      action: () => shareToFacebook(shareData),
      color: "text-blue-500"
    },
    {
      label: "Telegram",
      icon: Send,
      action: () => shareToTelegram(shareData),
      color: "text-blue-400"
    },
    {
      label: copied ? "Copied!" : "Copy Link",
      icon: copied ? Check : Copy,
      action: handleCopyLink,
      color: copied ? "text-green-600" : "text-gray-600"
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`group ${className}`}
        >
          <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={handleNativeShare}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Share2 className="h-4 w-4" />
          Share
        </DropdownMenuItem>
        
        <div className="my-1 border-t border-border" />
        
        {shareOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={option.action}
            className="flex items-center gap-3 cursor-pointer"
          >
            <option.icon className={`h-4 w-4 ${option.color}`} />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};