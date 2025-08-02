import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Shield } from "lucide-react";

interface ProtectedContactProps {
  type: 'email' | 'phone';
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  className?: string;
}

const ProtectedContact = ({ type, value, label, icon: Icon, href, className = "" }: ProtectedContactProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    // Simple bot detection
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'facebook', 'twitter',
      'linkedin', 'whatsapp', 'telegram', 'googlebot', 'bingbot'
    ];
    
    const isBotDetected = botPatterns.some(pattern => userAgent.includes(pattern));
    setIsBot(isBotDetected);
  }, []);

  // Obfuscate the contact info
  const obfuscateValue = (val: string) => {
    if (type === 'email') {
      const [username, domain] = val.split('@');
      return `${username.substring(0, 2)}***@${domain.substring(0, 2)}***.***`;
    } else if (type === 'phone') {
      return `+91 ${val.slice(-10, -6)}****${val.slice(-2)}`;
    }
    return val;
  };

  // If bot detected, show obfuscated version
  if (isBot) {
    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg bg-muted/50 ${className}`}>
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium text-muted-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{obfuscateValue(value)}</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Protected from automated access
          </p>
        </div>
      </div>
    );
  }

  const handleReveal = () => {
    setIsRevealed(true);
    // Add a small delay before allowing click to prevent accidental bot access
    setTimeout(() => {
      window.location.href = href;
    }, 100);
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors ${className}`}>
      <Icon className="h-5 w-5 text-primary" />
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <div className="flex items-center gap-2">
          {isRevealed ? (
            <a 
              href={href} 
              className="text-sm text-primary hover:underline"
              rel="nofollow noopener"
            >
              {value}
            </a>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {obfuscateValue(value)}
              </span>
              <Button
                onClick={handleReveal}
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Reveal
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtectedContact;
