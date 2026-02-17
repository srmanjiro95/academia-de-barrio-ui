import type { FightRecord } from "~/types/gym/record";

export const toApiRecord = (record: FightRecord) => ({
  member_id: record.memberId ?? "",
  member_name: record.memberName,
  category: record.category,
  wins: record.wins,
  losses: record.losses,
  draws: record.draws,
  wins_by_ko: record.winsByKo,
  wins_by_points: record.winsByPoints,
});

export const fromApiRecord = (record: any): FightRecord => ({
  id: record.id,
  memberId: record.member_id,
  memberName: record.member_name,
  category: record.category,
  wins: record.wins,
  losses: record.losses,
  draws: record.draws,
  winsByKo: record.wins_by_ko,
  winsByPoints: record.wins_by_points,
});
