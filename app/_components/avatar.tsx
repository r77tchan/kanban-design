import type { Member } from "@/app/_lib/kanban-types";

export function Avatar({
  className = "",
  framed = true,
  member,
}: {
  className?: string;
  framed?: boolean;
  member: Member;
}) {
  return (
    <span
      aria-label={member.name}
      className={`grid size-8 place-items-center rounded-full text-xs font-semibold text-white select-none ${
        framed ? "border-surface border-2 shadow-sm" : ""
      } ${className}`}
      role="img"
      style={{ backgroundColor: member.color }}
      title={member.name}
    >
      {member.initial}
    </span>
  );
}

export function AssigneeStack({
  maxVisible = 3,
  members,
}: {
  maxVisible?: number;
  members: Member[];
}) {
  const visibleMemberCount =
    members.length === maxVisible + 1
      ? members.length
      : Math.min(members.length, maxVisible);
  const visibleMembers = members.slice(0, visibleMemberCount);
  const hiddenMemberCount = members.length - visibleMembers.length;
  const memberNames = members.map((member) => member.name).join(", ");

  return (
    <div
      aria-label={`担当者: ${memberNames}`}
      className="flex shrink-0 items-center -space-x-2 select-none"
      role="group"
      title={memberNames}
    >
      {visibleMembers.map((member, index) => (
        <span
          className="relative"
          key={member.name}
          style={{ zIndex: visibleMembers.length - index + 1 }}
        >
          <Avatar member={member} />
        </span>
      ))}
      {hiddenMemberCount > 0 ? (
        <span
          aria-label={`ほか${hiddenMemberCount}人`}
          className="border-surface bg-surface-muted text-surface-foreground relative grid size-8 place-items-center rounded-full border-2 text-[11px] font-semibold shadow-sm select-none"
          role="img"
          style={{ zIndex: 1 }}
          title={`ほか${hiddenMemberCount}人`}
        >
          +{hiddenMemberCount}
        </span>
      ) : null}
    </div>
  );
}
