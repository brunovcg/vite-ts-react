import { useSession } from "@/context/session-context/useSession";

export function Avatar() {
  const { user } = useSession();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <p css={["display-flex", "align-center", "justify-center", "padding-lg", "text-bold", "border-radius-circle", "background-primary", "color-white", "width-20px", "height-20px"]}>{initials}</p>
  );
}
