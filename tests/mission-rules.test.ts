import assert from "node:assert/strict";
import test from "node:test";
import { canCompleteMissionAttempt, canStartMission, completeAttemptOnce, findReusableFocusObject, migrateLocale, migrateThemeId, normalizePersistedMissionData, recommendUnlocked } from "../lib/mission-rules.ts";
import { technologies } from "../lib/life-tree.ts";
import { localizeMissionDefinition } from "../lib/mission-i18n.ts";
import { getMissionDefinition } from "../lib/missions.ts";
import { getUiTranslationSourceKeys, translate } from "../lib/i18n.ts";
import { localizeTechnology } from "../lib/technology-i18n.ts";
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
