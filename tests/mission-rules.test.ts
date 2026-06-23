import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildEvidenceSummary, canCompleteAwakeningTrial, canCompleteMissionAttempt, canStartMission, completedBranchCategories, completeAttemptOnce, findReusableFocusObject, migrateLocale, migrateThemeId, normalizePersistedMissionData, recommendUnlocked, reconcileActiveMissionState, sanitizeEvidenceAnswers, validateMissionAnswers } from "../lib/mission-rules.ts";
import { technologies } from "../lib/life-tree.ts";
import { localizeMissionDefinition } from "../lib/mission-i18n.ts";
import { getMissionDefinition } from "../lib/missions.ts";
import { getUiTranslationSourceKeys, translate } from "../lib/i18n.ts";
import { validateHabid } from "../lib/habid.ts";
import { localizeTechnology } from "../lib/technology-i18n.ts";
import type { MissionAttempt, MissionDefinition, PlayerState, UserFocusObject } from "../lib/types.ts";

const definition = { minimumDurationSeconds: 60, inputSchema: [{ id: "result", type: "shortText", label: "Result", required: true }], technologyId: "health-root" } as MissionDefinition;
const attempt = { id: "a1", missionId: "technology:health-root", technologyId: "health-root", startedAt: 1000, answers: { result: "Saved result" } } as MissionAttempt;

test("a second mission cannot start while another mission is active", () => assert.equal(canStartMission({ locked: false, completed: false, hasAnotherActiveMission: true, now: 1000 }), false));
test("a locked technology cannot start", () => assert.equal(canStartMission({ locked: true, completed: false, hasAnotherActiveMission: false, now: 1000 }), false));
test("completion is blocked before minimum duration", () => assert.equal(canCompleteMissionAttempt(definition, attempt, { progress: 0, status: "active", startedAt: 1000 }, 30_000), false));
test("required answers must be filled", () => assert.equal(canCompleteMissionAttempt(definition, { ...attempt, answers: {} }, { progress: 0, status: "active", startedAt: 1000 }, 70_000), false));
test("completion succeeds after duration and answers", () => assert.equal(canCompleteMissionAttempt(definition, attempt, { progress: 0, status: "active", startedAt: 1000 }, 70_000), true));
test("reward is attached only once", () => { const once = completeAttemptOnce(attempt, 70_000, 69, { xp: 20 }); const twice = completeAttemptOnce(once, 90_000, 89, { xp: 20 }); assert.equal(twice.completedAt, 70_000); assert.equal(twice.earnedRewards?.xp, 20); });
test("mission attempt keeps saved answers", () => assert.equal(attempt.answers.result, "Saved result"));
test("focus object is reused by category", () => { const focus = { id: "f1", type: "project", category: "business", name: "My project", desiredOutcome: "Screen", createdAt: 1 } as UserFocusObject; assert.equal(findReusableFocusObject([focus], "business")?.id, "f1"); });
test("latest focus object wins inside one category", () => {
  const older = { id: "f1", type: "project", category: "business", name: "Old project", desiredOutcome: "Old", createdAt: 1 } as UserFocusObject;
  const newer = { id: "f2", type: "project", category: "business", name: "New project", desiredOutcome: "New", createdAt: 2, updatedAt: 5 } as UserFocusObject;
  assert.equal(findReusableFocusObject([older, newer], "business")?.id, "f2");
});
test("recommendation excludes locked and active technologies", () => assert.deepEqual(recommendUnlocked([{ id: "locked", locked: true, completed: false }, { id: "active", locked: false, completed: false, status: "active" as const }, { id: "ready", locked: false, completed: false }]).map((item) => item.id), ["ready"]));
test("recommendation prefers primary category and focus context", () => {
  const recommended = recommendUnlocked([
    { id: "generic", locked: false, completed: false, category: "health" as const },
    { id: "primary", locked: false, completed: false, category: "business" as const, hasFocus: true }
  ], { primaryCategory: "business" });
  assert.equal(recommended[0].id, "primary");
});
test("legacy persisted state gets safe mission collections", () => assert.deepEqual(normalizePersistedMissionData({ totalXp: 10 }), { missionAttempts: [], focusObjects: [] }));
test("supported locale survives migration", () => assert.equal(migrateLocale("uk"), "uk"));
test("old theme ids migrate to canonical ids", () => assert.equal(migrateThemeId("pixel-quest"), "arcade-codex"));

test("Habid validation accepts the public username MVP rules", () => {
  assert.deepEqual(validateHabid("life_pilot42"), { valid: true, habid: "life_pilot42", error: undefined });
  assert.equal(validateHabid("UserName").habid, "username");
  assert.equal(validateHabid("ab").valid, false);
  assert.equal(validateHabid("_pilot").valid, false);
  assert.equal(validateHabid("life pilot").valid, false);
  assert.equal(validateHabid("support").valid, false);
});

test("Supabase migration enables own-row RLS without anon writes", () => {
  const migration = readFileSync("supabase/migrations/20260623150000_auth_cloud_save_mvp.sql", "utf8");
  assert.match(migration, /alter table public\.profiles enable row level security/i);
  assert.match(migration, /alter table public\.user_game_state enable row level security/i);
  assert.match(migration, /revoke all on public\.profiles from anon/i);
  assert.match(migration, /revoke all on public\.user_game_state from anon/i);
  assert.match(migration, /to authenticated\s+using \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.doesNotMatch(migration, /auth\.role\(\)/i);
});

test("client code does not expose a Supabase service role key", () => {
  const files = ["lib/supabase/client.ts", "lib/supabase/server.ts", "components/cloud-account-panel.tsx"].map((file) => readFileSync(file, "utf8")).join("\n");
  assert.equal(files.includes("service_role"), false);
  assert.equal(files.includes("SERVICE_ROLE"), false);
});

test("active runtime without matching attempt repairs to ready", () => {
  const repaired = reconcileActiveMissionState({
    technologyRuntime: { "health-root": { progress: 0, status: "active", startedAt: 1000 } },
    activeMissionAttemptId: "missing",
    missionAttempts: []
  });
  assert.equal(repaired.activeMissionAttemptId, undefined);
  assert.equal(repaired.technologyRuntime["health-root"].status, "ready");
  assert.equal(repaired.technologyRuntime["health-root"].startedAt, undefined);
});

test("valid active runtime with matching attempt is preserved", () => {
  const repaired = reconcileActiveMissionState({
    technologyRuntime: { "health-root": { progress: 0, status: "active", startedAt: 1000 } },
    activeMissionAttemptId: "attempt-1",
    missionAttempts: [{ ...attempt, id: "attempt-1", technologyId: "health-root" }]
  });
  assert.equal(repaired.activeMissionAttemptId, "attempt-1");
  assert.equal(repaired.technologyRuntime["health-root"].status, "active");
  assert.equal(repaired.technologyRuntime["health-root"].startedAt, 1000);
});

test("active attempt for another technology repairs active runtime to ready", () => {
  const repaired = reconcileActiveMissionState({
    technologyRuntime: { "health-root": { progress: 0, status: "active", startedAt: 1000 } },
    activeMissionAttemptId: "attempt-1",
    missionAttempts: [{ ...attempt, id: "attempt-1", technologyId: "mind-root" }]
  });
  assert.equal(repaired.activeMissionAttemptId, undefined);
  assert.equal(repaired.technologyRuntime["health-root"].status, "ready");
});

test("validation rejects bad numbers, invalid choices, blank text and bad links", () => {
  const strict = { ...definition, inputSchema: [
    { id: "amount", type: "number", label: "Current available balance", required: true, min: 0 },
    { id: "choice", type: "singleChoice", label: "Choice", required: true, choices: [{ id: "ok", label: "Ok" }] },
    { id: "note", type: "shortText", label: "Note", required: true },
    { id: "url", type: "link", label: "Link", required: true }
  ] } as MissionDefinition;
  const result = validateMissionAnswers(strict, { amount: -1, choice: "bad", note: "  ", url: "not-a-url" });
  assert.equal(result.valid, false);
  assert.equal(Object.keys(result.errors).length, 4);
});

test("empty number does not become a valid zero", () => {
  const strict = { ...definition, inputSchema: [{ id: "amount", type: "number", label: "Amount", required: true }] } as MissionDefinition;
  assert.equal(validateMissionAnswers(strict, { amount: "" }).valid, false);
});

test("evidence summary is built from user answers and sensitive money answers are removed", () => {
  const mission = getMissionDefinition(technologies.find((item) => item.id === "finance-root")!);
  const answers = { balance: 1000, income: 2000, "fixed-costs": 800, "flexible-spending": 300 };
  assert.match(buildEvidenceSummary(mission, answers), /Current available balance/);
  assert.deepEqual(sanitizeEvidenceAnswers(answers), {});
});

test("awakening trial requires four branches and three real practices", () => {
  const completedRoots = ["health-root", "mind-root", "business-root", "career-root"];
  const state = {
    completedTechnologyIds: completedRoots,
    focusObjects: [{ id: "f1", type: "project", category: "business", name: "Project", desiredOutcome: "Ship", createdAt: 1 }],
    missionAttempts: [
      ...completedRoots.map((id, index) => ({ id: `root-${id}`, missionId: `technology:${id}`, technologyId: id, startedAt: 1, completedAt: 2, answers: { result: id }, evidence: { summary: id, answers: { result: id }, confirmedAt: 2 } })),
      { id: "trial", missionId: "technology:awakening-trial", technologyId: "awakening-trial", startedAt: 3, answers: { "reviewed-branches": ["health", "mind", "business", "career"], "carried-practices": ["root-health-root", "root-mind-root", "root-business-root"], "personal-rule": "I will keep one minimum rule.", "weekly-standard": "Three realistic sessions per week.", "chapter-confirmed": true } }
    ]
  } as unknown as PlayerState;
  assert.deepEqual(completedBranchCategories(state, technologies).sort(), ["business", "career", "health", "mind"].sort());
  assert.equal(canCompleteAwakeningTrial(state, technologies, state.missionAttempts.at(-1)), true);
});

test("Taskovo is absent from product source", () => {
  const files = ["lib/missions.ts", "lib/mission-i18n.ts", "app/page.tsx", "components/life-tree.tsx"].map((file) => readFileSync(file, "utf8")).join("\n");
  assert.equal(files.includes("Taskovo"), false);
});

test("24h Planner is absent from Command Center UI", () => {
  const command = readFileSync("app/command/page.tsx", "utf8");
  assert.equal(command.includes("24h Planner"), false);
  assert.equal(command.includes("planner.map"), false);
});

test("reward placeholders are absent from mission panel UI", () => {
  const panel = readFileSync("components/life-tree.tsx", "utf8");
  assert.equal(panel.includes("Future reward"), false);
  assert.equal(panel.includes("Cosmetic reward slot prepared"), false);
  assert.equal(panel.includes("Insight\")}</p><p className=\"mt-1 font-black text-foreground\">+{technology.rewards.insightPoints ?? 0}"), false);
});

test("mission panel has a recovery state for broken active attempts", () => {
  const panel = readFileSync("components/life-tree.tsx", "utf8");
  assert.equal(panel.includes("Mission state needs repair"), true);
  assert.equal(panel.includes("Reset active mission"), true);
  assert.equal(panel.includes("missionNeedsRepair"), true);
});

test("the first mission after each root is guided", () => {
  const guidedIds = ["morning-walk", "reading-ritual", "expense-tracking", "project-definition", "opportunity-scan", "weekly-check-in", "reference-study"];
  guidedIds.forEach((id) => {
    const technology = technologies.find((item) => item.id === id);
    assert.ok(technology);
    const guided = getMissionDefinition(technology);
    assert.ok(guided.inputSchema.length >= 2);
    assert.ok(guided.inputSchema.every((input) => input.required));
  });
});

test("guided first missions are localized in every supported non-English locale", () => {
  const technology = technologies.find((item) => item.id === "project-definition");
  assert.ok(technology);
  const guided = getMissionDefinition(technology);
  (["ru", "cs", "uk"] as const).forEach((locale) => {
    const localized = localizeMissionDefinition(guided, locale);
    assert.notEqual(localized.actionTitle, guided.actionTitle);
    assert.notEqual(localized.inputSchema[0]?.label, guided.inputSchema[0]?.label);
  });
});

test("every chapter-one mission has a concrete outcome and required evidence", () => {
  technologies.forEach((technology) => {
    const mission = getMissionDefinition(technology);
    assert.ok(mission.actionTitle.trim());
    assert.ok(mission.concreteOutcome.trim());
    assert.ok(mission.inputSchema.some((input) => input.required));
  });
});

test("the full technology catalogue is localized in Czech and Ukrainian", () => {
  (["cs", "uk"] as const).forEach((locale) => {
    technologies.forEach((technology) => {
      const localizedTechnology = localizeTechnology(technology, locale);
      const originalMission = getMissionDefinition(technology);
      const localizedMission = localizeMissionDefinition(getMissionDefinition(localizedTechnology), locale);
      assert.notEqual(localizedTechnology.title, technology.title, `${locale}/${technology.id}/title`);
      assert.notEqual(localizedTechnology.description, technology.description, `${locale}/${technology.id}/description`);
      assert.notEqual(localizedMission.actionTitle, originalMission.actionTitle, `${locale}/${technology.id}/action`);
      assert.notEqual(localizedMission.concreteOutcome, originalMission.concreteOutcome, `${locale}/${technology.id}/outcome`);
      assert.ok(localizedMission.exactSteps.every((step) => step.instruction.trim().length > 0), `${locale}/${technology.id}/steps`);
    });
  });
});

test("all shared UI keys are localized in Czech and Ukrainian", () => {
  (["cs", "uk"] as const).forEach((locale) => {
    getUiTranslationSourceKeys().forEach((key) => assert.notEqual(translate(locale, key), key, `${locale}/${key}`));
  });
});
