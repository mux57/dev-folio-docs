import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Cloud, HardDrive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DatabaseToggle = () => {
  const [useLocalDb, setUseLocalDb] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const localDbSetting = localStorage.getItem('use_local_db') === 'true';
    const localhost = window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';
    setIsLocalhost(localhost);
    setUseLocalDb(localDbSetting || localhost);
  }, []);

  const toggleDatabase = () => {
    const newValue = !useLocalDb;
    setUseLocalDb(newValue);
    localStorage.setItem('use_local_db', newValue.toString());

    toast({
      title: "Database Mode Changed",
      description: `Switched to ${newValue ? 'Local SQLite' : 'Supabase Cloud'}. Refreshing page...`,
      duration: 2000,
    });

    // Auto-refresh after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const currentMode = useLocalDb ? 'Local SQLite' : 'Supabase Cloud';
  const icon = useLocalDb ? <HardDrive className="h-4 w-4" /> : <Cloud className="h-4 w-4" />;
  const autoDetected = isLocalhost && !localStorage.getItem('use_local_db');

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
        <Badge variant={useLocalDb ? "secondary" : "default"} className="gap-1">
          <Database className="h-3 w-3" />
          {currentMode}
          {autoDetected && <span className="text-xs opacity-70">(auto)</span>}
        </Badge>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleDatabase}
          className="gap-1 text-xs"
        >
          {icon}
          Switch to {useLocalDb ? 'Cloud' : 'Local'}
        </Button>
      </div>
    </div>
  );
};

export default DatabaseToggle;
