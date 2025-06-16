
import { Badge } from "./badge";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export const NotificationBadge = ({ count, className = "" }: NotificationBadgeProps) => {
  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={`ml-2 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white animate-pulse ${className}`}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};
