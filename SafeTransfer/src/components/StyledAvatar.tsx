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
          variant="marble"
          colors={[
              "#A78BFA",
              "#F472B6",
              "#C084FC",
              "#FB7185",
              "#818CF8",
              "#E879F9",
              "#FDBA74",
              "#FACC15",
              "#4ADE80",
              "#2DD4BF",
              "#F9A8D4",
              "#8B5CF6",
              "#FB923C",
              "#FDE047",
              "#34D399",
          ]}
        />
      </AvatarFallback>
    </Avatar>
  );
}
