import { ROLE_LABELS, ROLE_BADGE_COLORS } from "@/lib/constants";

interface RoleBadgeProps {
  role: string;
  size?: "sm" | "md";
}

export function RoleBadge({ role, size = "md" }: RoleBadgeProps) {
  const label = ROLE_LABELS[role] ?? role;
  const colors = ROLE_BADGE_COLORS[role] ?? "bg-gray-300 text-white";
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${colors}`}>
      {label}
    </span>
  );
}
