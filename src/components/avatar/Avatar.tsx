import { useSession } from "@/context/session-context/useSession";

interface AvatarProps {
  userName?: string;
}

export function Avatar({ userName: propUser }: AvatarProps) {
  const { user } = useSession();

  const splittedName = (propUser || user?.name || "").split(" ");

  const initials = ((splittedName[0][0] || "") + (splittedName[splittedName.length - 1][0] || "")).toUpperCase();

  return (
    <div
      role='img'
      aria-label={user?.name || "User avatar"}
      css={["display-flex", "align-center", "justify-center", "padding-lg", "text-bold", "border-radius-circle", "background-primary", "color-white", "width-20px", "height-20px"]}
    >
      {initials}
    </div>
  );
}
