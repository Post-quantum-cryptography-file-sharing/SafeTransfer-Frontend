import Avatar from "boring-avatars";

type StyledAvatarProps = {
    name?: string;
    size?: number;
}

export const StyledAvatar = ({name, size} : StyledAvatarProps) => {
    return <Avatar
        size={size || 100}
        name={name || 'SafeTransfer'}
        variant="beam"
        colors={["#00686c","#32c2b9","#edecb3","#fad928","#ff9915"]}
    />
}