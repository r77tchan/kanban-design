import type { Member, UserProfile } from "./kanban-types";

export const currentUser = {
  name: "山田 太郎",
  initial: "山",
  color: "#0f766e",
  email: "taro.yamada@example.com",
  passwordUpdatedAt: "2026/06/01",
} satisfies UserProfile;

export const boardMembers: Member[] = [
  currentUser,
  { name: "佐藤 花", initial: "佐", color: "#7c3aed" },
  { name: "田中 誠", initial: "田", color: "#b45309" },
  { name: "Lee Chen", initial: "L", color: "#0e7490" },
  { name: "高橋 葵", initial: "高", color: "#be123c" },
  { name: "井上 蓮", initial: "井", color: "#4338ca" },
];
