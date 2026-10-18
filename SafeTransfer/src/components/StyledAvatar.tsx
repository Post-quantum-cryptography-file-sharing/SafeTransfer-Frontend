import BoringAvatar from "boring-avatars";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "cn";

type StyledAvatarProps = {
  name?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
};

const sizeMap = {
  sm: 24,
  default: 32,
  lg: 40,
};

export function StyledAvatar({ name, size = "default", className }: StyledAvatarProps) {
  return (
    <Avatar size={size} className={cn("[&>span]:bg-transparent", className)}>
      <AvatarFallback>
        <BoringAvatar
          size={sizeMap[size]}
          name={name || "SafeTransfer"}
          variant="beam"
          colors={["#00686c", "#32c2b9", "#edecb3", "#fad928", "#ff9915"]}
        />
      </AvatarFallback>
    </Avatar>
  );
}
