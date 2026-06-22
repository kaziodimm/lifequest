import assert from "node:assert/strict";
import test from "node:test";
import { canCompleteMissionAttempt, canStartMission, completeAttemptOnce, findReusableFocusObject, migrateLocale, migrateThemeId, normalizePersistedMissionData, recommendUnlocked } from "../lib/mission-rules.ts";
import type { MissionAttempt, MissionDefinition, UserFocusObject } from "../lib/types.ts";

const definition = { minimumDurationSeconds: 60, inputSchema: [{ id: "result", type: "shortText", label: "Result", required: true }], technologyId: "health-root" } as MissionDefinition;
const attempt = { id: "a1", missionId: "technology:health-root", technologyId: "health-root", startedAt: 1000, answers: { result: "Saved result" } } as MissionAttempt;

test("a second mission cannot start while another mission is active", () => assert.equal(canStartMission({ locked: false, completed: false, hasAnotherActiveMission: true, now: 1000 }), false));
test("a locked technology cannot start", () => assert.equal(canStartMission({ locked: true, completed: false, hasAnotherActiveMission: false, now: 1000 }), false));
test("completion is blocked before minimum duration", () => assert.equal(canCompleteMissionAttempt(definition, attempt, { progress: 0, status: "active", startedAt: 1000 }, 30_000), false));
test("required answers must be filled", () => assert.equal(canCompleteMissionAttempt(definition, { ...attempt, answers: {} }, { progress: 0, status: "active", startedAt: 1000 }, 70_000), false));
test("completion succeeds after duration and answers", () => assert.equal(canCompleteMissionAttempt(definition, attempt, { progress: 0, status: "active", startedAt: 1000 }, 70_000), true));
test("reward is attached only once", () => { const once = completeAttemptOnce(attempt, 70_000, 69, { xp: 20 }); const twice = completeAttemptOnce(once, 90_000, 89, { xp: 20 }); assert.equal(twice.completedAt, 70_000); assert.equal(twice.earnedRewards?.xp, 20); });
test("mission attempt keeps saved answers", () => assert.equal(attempt.answers.result, "Saved result"));
test("focus object is reused by category", () => { const focus = { id: "f1", type: "project", category: "business", name: "Taskovo", desiredOutcome: "Screen", createdAt: 1 } as UserFocusObject; assert.equal(findReusableFocusObject([focus], "business")?.id, "f1"); });
test("recommendation excludes locked and active technologies", () => assert.deepEqual(recommendUnlocked([{ id: "locked", locked: true, completed: false }, { id: "active", locked: false, completed: false, status: "active" as const }, { id: "ready", locked: false, completed: false }]).map((item) => item.id), ["ready"]));
test("legacy persisted state gets safe mission collections", () => assert.deepEqual(normalizePersistedMissionData({ totalXp: 10 }), { missionAttempts: [], focusObjects: [] }));
test("supported locale survives migration", () => assert.equal(migrateLocale("uk"), "uk"));
test("old theme ids migrate to canonical ids", () => assert.equal(migrateThemeId("pixel-quest"), "arcade-codex"));
