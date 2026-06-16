import { Plus, Settings, Timer, Users } from "lucide-react";
import { Avatar } from "@/app/_components/avatar";
import type { Activity, Member } from "@/app/_lib/kanban-types";

export function BoardSidePanels({
  activities,
  isWorkspaceWide,
  members,
}: {
  activities: Activity[];
  isWorkspaceWide: boolean;
  members: Member[];
}) {
  return (
    <aside
      className={`grid gap-4 md:grid-cols-2 ${
        isWorkspaceWide ? "xl:grid-cols-2" : "xl:auto-rows-min xl:grid-cols-1"
      }`}
    >
      <MembersPanel members={members} />
      <ActivityPanel activities={activities} />
    </aside>
  );
}

function ActivityPanel({ activities }: { activities: Activity[] }) {
  return (
    <section className="border-border bg-surface rounded-lg border p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Timer
          aria-hidden="true"
          className="text-muted"
          size={18}
          strokeWidth={1.8}
        />
        <h2 className="text-foreground text-base font-semibold">更新</h2>
      </div>
      <div className="relative space-y-5 pl-4">
        <span
          aria-hidden="true"
          className="bg-border absolute top-1 bottom-1 left-1.5 w-px"
        />
        {activities.map((activity, index) => (
          <div
            className="relative min-w-0"
            key={`${activity.user}-${activity.dateLabel}-${activity.time}`}
          >
            <span
              aria-hidden="true"
              className={`border-surface absolute top-1.5 -left-[0.875rem] size-3 rounded-full border-2 ${
                index === 0 ? "bg-brand" : "bg-border-strong"
              }`}
            />
            <p className="text-muted mb-1 text-xs leading-none font-semibold select-none">
              {activity.dateLabel} {activity.time}
            </p>
            <p className="text-foreground truncate text-sm font-semibold">
              {activity.user}
            </p>
            <p className="text-surface-foreground mt-0.5 text-sm leading-5">
              {activity.action}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MembersPanel({ members }: { members: Member[] }) {
  const [owner, ...participantMembers] = members;

  if (!owner) {
    return null;
  }

  return (
    <section className="border-border bg-surface rounded-lg border p-4 shadow-sm">
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Users
            aria-hidden="true"
            className="text-muted shrink-0"
            size={18}
            strokeWidth={1.8}
          />
          <h2 className="text-foreground text-base font-semibold">メンバー</h2>
        </div>
        <button
          aria-label="メンバー管理"
          className="text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus grid size-8 shrink-0 cursor-pointer place-items-center rounded-md select-none focus-visible:outline-2 focus-visible:outline-offset-2"
          title="メンバー管理"
          type="button"
        >
          <Settings aria-hidden="true" size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar framed={false} member={owner} />
          <div className="min-w-0">
            <p className="text-surface-foreground truncate text-sm font-semibold">
              {owner.name}
            </p>
            <p className="text-muted text-xs font-medium">所有者</p>
          </div>
        </div>

        <div className="border-border space-y-3 border-t pt-4">
          <p className="text-muted text-xs font-semibold select-none">
            参加メンバー
          </p>

          {participantMembers.map((member) => (
            <div className="flex min-w-0 items-center gap-3" key={member.name}>
              <Avatar framed={false} member={member} />
              <div className="min-w-0">
                <p className="text-surface-foreground truncate text-sm font-semibold">
                  {member.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="border-border text-muted hover:border-border-strong hover:bg-surface-muted hover:text-foreground focus-visible:outline-focus flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-sm font-semibold select-none focus-visible:outline-2 focus-visible:outline-offset-2"
          type="button"
        >
          <Plus aria-hidden="true" size={16} strokeWidth={1.8} />
          メンバー追加
        </button>
      </div>
    </section>
  );
}
