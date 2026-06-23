# HABIDOO — Progression, Rewards, Achievements and Inventory Spec RU

Version: 1.0  
Date: 2026-06-23  
Repository source of truth: this file + HANDOFF.md  
Status: Product specification for implementation. Codex must implement from this file, not invent alternative economy.

## 0. Назначение документа

Этот документ фиксирует игровую систему Habidoo для закрытой beta и дальнейшего развития Foundation Era. Его задача — убрать неопределённость для Codex и для будущей реализации.

Документ описывает:

- систему Foundation Level 1-100;
- что даёт XP и что не даёт XP;
- Research и Insight;
- достижения;
- конкретные награды;
- инвентарь;
- экипировку профиля;
- reward banners;
- основу магазина Coming Soon;
- правила, которые нельзя нарушать при реализации.

Главный принцип: Habidoo — это Life Strategy RPG, а не habit tracker, todo list или копия Habitica. Игрок развивается через реальные миссии дерева, доказательства выполнения и постепенное открытие личной системы жизни.

## 1. Жёсткие правила экономики

1. XP выдаётся только за миссии Life Tree / Technology Missions.
2. Ежедневные и еженедельные задания не дают XP аккаунта напрямую.
3. Daily/weekly активность может давать Research, но не должна ускорять Foundation Level напрямую.
4. Foundation Level 100 возможен только при полном закрытии Foundation Era, включая все обязательные миссии и ключевые Trial/Chapter gates.
5. Игрок может перейти дальше без 100%, если будущая логика перехода это разрешает, но тогда он не получает Foundation Perfected статус.
6. Предыдущая эпоха сохраняется как отдельный prestige record. Пример: Foundation Level 87 или Foundation Perfected 100.
7. Награды не должны сыпаться в каждой миссии так, чтобы потерять ценность.
8. Косметика выдаётся редко: за milestone, achievement, Trial, beta status, особые условия.
9. Reward banner должен усиливать момент завершения, но не перегружать интерфейс.
10. Tree/MissionPanel остаются экраном действия, а не витриной магазина и не архивом наград.

## 2. Основные валюты

### 2.1 Foundation XP

Foundation XP — опыт текущей эпохи Foundation. Он отвечает за Foundation Level 1-100.

Источники Foundation XP:

- завершение Technology Mission;
- завершение Milestone;
- завершение Trial;
- завершение Chapter gate.

Не дают Foundation XP:

- произвольные чекбоксы;
- планировщик;
- вход в аккаунт;
- смена темы;
- просмотр статистики;
- ежедневный login сам по себе;
- будущие social actions.

### 2.2 Research

Research — рабочая валюта для открытия дополнительных возможностей внутри веток. Она не заменяет XP.

Источники Research:

- Daily/weekly focused actions;
- Technology Mission completion;
- optional challenges;
- weekly review.

Будущее использование Research:

- открыть optional challenge;
- открыть bonus mission;
- открыть deeper reflection task;
- открыть веточный side objective с дополнительной наградой.

Research не покупает:

- достижения;
- Foundation Level;
- основной прогресс эпохи;
- платный premium.

### 2.3 Insight

Insight — редкая валюта/редкий drop для будущих косметических и prestige-наград. В текущей beta её можно показывать как редкий ресурс, но не обязательно разрешать тратить.

Правило drop chance:

- обычная Technology Mission: 1-3% шанс получить 1 Insight;
- важная Technology Mission: 4-6% шанс получить 1 Insight;
- Milestone: 10-15% шанс получить 1 Insight;
- Trial: гарантированно 1-3 Insight;
- Chapter completion: гарантированно 3-5 Insight.

Для beta можно не включать случайный drop, если это усложняет баланс. Но структура должна быть готова.

## 3. Foundation Level 1-100

Foundation Level — это уровень текущей эпохи, а не вечный общий аккаунт-уровень.

Формула порога:

```text
requiredFoundationXp(level) = roundTo10(100000 * ((level - 1) / 99) ^ 1.55)
```

- Level 1 = 0 XP.
- Level 100 = 100 000 Foundation XP.
- Кривая медленная в начале и тяжелее ближе к финалу.
- Level 100 не должен быть достижим без полного закрытия Foundation Era.

### 3.1 Таблица уровней

| Level | Required Foundation XP | Rank Name | Guaranteed Reward |
|---:|---:|---|---|
| 1 | 0 | Initiate of Foundation | Стартовый профиль: Orbit identity, базовая рамка Profile Core. |
| 2 | 80 | Initiate of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 3 | 240 | Initiate of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 4 | 440 | Initiate of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 5 | 690 | Initiate of Foundation | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 6 | 980 | Initiate of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 7 | 1 300 | Initiate of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 8 | 1 650 | Initiate of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 9 | 2 030 | Initiate of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 10 | 2 430 | Initiate of Foundation | Milestone reward: новый title tier или badge tier согласно эпохе. |
| 11 | 2 860 | Keeper of Focus | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 12 | 3 320 | Keeper of Focus | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 13 | 3 800 | Keeper of Focus | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 14 | 4 300 | Keeper of Focus | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 15 | 4 820 | Keeper of Focus | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 16 | 5 370 | Keeper of Focus | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 17 | 5 930 | Keeper of Focus | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 18 | 6 520 | Keeper of Focus | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 19 | 7 120 | Keeper of Focus | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 20 | 7 740 | Keeper of Focus | Milestone reward: новый title tier или badge tier согласно эпохе. |
| 21 | 8 380 | Builder of Rhythm | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 22 | 9 040 | Builder of Rhythm | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 23 | 9 720 | Builder of Rhythm | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 24 | 10 410 | Builder of Rhythm | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 25 | 11 120 | Builder of Rhythm | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 26 | 11 850 | Builder of Rhythm | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 27 | 12 590 | Builder of Rhythm | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 28 | 13 350 | Builder of Rhythm | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 29 | 14 120 | Builder of Rhythm | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 30 | 14 910 | Builder of Rhythm | Milestone reward: новый title tier или badge tier согласно эпохе. |
| 31 | 15 710 | Architect of Order | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 32 | 16 530 | Architect of Order | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 33 | 17 370 | Architect of Order | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 34 | 18 220 | Architect of Order | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 35 | 19 080 | Architect of Order | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 36 | 19 960 | Architect of Order | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 37 | 20 850 | Architect of Order | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 38 | 21 750 | Architect of Order | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 39 | 22 670 | Architect of Order | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 40 | 23 600 | Architect of Order | Milestone reward: новый title tier или badge tier согласно эпохе. |
| 41 | 24 540 | Strategist of Momentum | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 42 | 25 500 | Strategist of Momentum | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 43 | 26 470 | Strategist of Momentum | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 44 | 27 460 | Strategist of Momentum | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 45 | 28 450 | Strategist of Momentum | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 46 | 29 460 | Strategist of Momentum | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 47 | 30 480 | Strategist of Momentum | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 48 | 31 510 | Strategist of Momentum | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 49 | 32 560 | Strategist of Momentum | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 50 | 33 620 | Strategist of Momentum | Milestone reward: новый title tier или badge tier согласно эпохе. |
| 51 | 34 690 | Guardian of Stability | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 52 | 35 770 | Guardian of Stability | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 53 | 36 860 | Guardian of Stability | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 54 | 37 970 | Guardian of Stability | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 55 | 39 080 | Guardian of Stability | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 56 | 40 210 | Guardian of Stability | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 57 | 41 350 | Guardian of Stability | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 58 | 42 500 | Guardian of Stability | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 59 | 43 660 | Guardian of Stability | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 60 | 44 830 | Guardian of Stability | Milestone reward: новый title tier или badge tier согласно эпохе. |
| 61 | 46 020 | Navigator of Growth | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 62 | 47 210 | Navigator of Growth | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 63 | 48 410 | Navigator of Growth | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 64 | 49 630 | Navigator of Growth | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 65 | 50 860 | Navigator of Growth | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 66 | 52 090 | Navigator of Growth | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 67 | 53 340 | Navigator of Growth | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 68 | 54 600 | Navigator of Growth | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 69 | 55 870 | Navigator of Growth | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 70 | 57 150 | Navigator of Growth | Milestone reward: новый title tier или badge tier согласно эпохе. |
| 71 | 58 430 | Master of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 72 | 59 730 | Master of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 73 | 61 040 | Master of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 74 | 62 360 | Master of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 75 | 63 690 | Master of Foundation | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 76 | 65 030 | Master of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 77 | 66 380 | Master of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 78 | 67 740 | Master of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 79 | 69 110 | Master of Foundation | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 80 | 70 480 | Master of Foundation | Milestone reward: новый title tier или badge tier согласно эпохе. |
| 81 | 71 870 | Era Finisher | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 82 | 73 270 | Era Finisher | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 83 | 74 680 | Era Finisher | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 84 | 76 090 | Era Finisher | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 85 | 77 520 | Era Finisher | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 86 | 78 950 | Era Finisher | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 87 | 80 400 | Era Finisher | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 88 | 81 850 | Era Finisher | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 89 | 83 310 | Era Finisher | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 90 | 84 790 | Era Finisher | Milestone reward: новый title tier или badge tier согласно эпохе. |
| 91 | 86 270 | Foundation Perfected | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 92 | 87 760 | Foundation Perfected | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 93 | 89 260 | Foundation Perfected | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 94 | 90 760 | Foundation Perfected | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 95 | 92 280 | Foundation Perfected | Minor reward: 1 косметический fragment для будущего магазина + reward banner. |
| 96 | 93 810 | Foundation Perfected | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 97 | 95 340 | Foundation Perfected | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 98 | 96 890 | Foundation Perfected | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 99 | 98 440 | Foundation Perfected | Standard reward: уровень профиля, визуальный прогресс, без отдельной косметики. |
| 100 | 100 000 | Foundation Perfected | Foundation Perfected Seal, Foundation 100 Frame, title: Architect of Self. |

## 4. Названия ключевых reward tiers

### 4.1 Titles

| Item ID | Name | Type | Unlock Condition |
|---|---|---|---|
| title_first_step | First Step Strategist | Title | Complete first Life Tree mission |
| title_focus_keeper | Keeper of Focus | Title | Complete 3 missions in one branch |
| title_branch_starter | Branch Initiate | Title | Complete first root branch mission |
| title_sevenfold_path | Sevenfold Pathfinder | Title | Complete all 7 root branch missions |
| title_the_awakened | The Awakened | Title | Complete Awakening Trial |
| title_foundation_architect | Foundation Architect | Title | Complete Foundation Chapter 1 |
| title_architect_of_self | Architect of Self | Title | Reach Foundation Level 100 and perfect Foundation Era |
| title_beta_pioneer | Beta Pioneer | Title | Confirmed beta account with Habid |

### 4.2 Badges

| Item ID | Name | Type | Rarity | Unlock Condition |
|---|---|---|---|---|
| badge_beta_spark | Beta Spark | Badge | Rare | Confirmed beta account with Habid |
| badge_first_mission | First Real Step | Badge | Common | Complete first mission |
| badge_focus_anchor | Focus Anchor | Badge | Common | Create first Focus Object |
| badge_body_energy_root | Body Root | Badge | Common | Complete Body & Energy root mission |
| badge_mind_root | Mind Root | Badge | Common | Complete Focus & Mind root mission |
| badge_money_root | Money Root | Badge | Common | Complete Money & Freedom root mission |
| badge_build_root | Build Root | Badge | Common | Complete Build & Create root mission |
| badge_career_root | Direction Root | Badge | Common | Complete Direction & Career root mission |
| badge_people_root | Connection Root | Badge | Common | Complete People & Connection root mission |
| badge_creative_root | Creative Root | Badge | Common | Complete Creative Practice root mission |
| badge_four_branches | Four Branches Awake | Badge | Uncommon | Complete root missions in 4 branches |
| badge_seven_roots | Seven Roots Awake | Badge | Rare | Complete all 7 root missions |
| badge_awakening_trial | Awakening Trial Seal | Badge | Epic | Complete Awakening Trial |
| badge_foundation_chapter_1 | Chapter 1 Seal | Badge | Epic | Complete The Awakening chapter |
| badge_foundation_perfected | Foundation Perfected Seal | Badge | Legendary | Foundation Era 100% completion |

### 4.3 Profile Frames

| Item ID | Name | Type | Rarity | Unlock Condition | Visual Direction |
|---|---|---|---|---|---|
| frame_profile_core | Profile Core | Profile Frame | Common | Default account profile | Thin neutral dark border |
| frame_beta_founder | Beta Founder Frame | Profile Frame | Rare | Confirmed beta account with Habid | Subtle gold/cyan edge, no heavy animation |
| frame_first_mission | First Step Frame | Profile Frame | Common | Complete first mission | Small active corner mark |
| frame_four_branches | Balanced Foundation Frame | Profile Frame | Uncommon | Complete 4 root branches | Four small branch marks |
| frame_awakening_trial | Awakening Frame | Profile Frame | Epic | Complete Awakening Trial | Warm inner glow, restrained |
| frame_foundation_100 | Foundation 100 Frame | Profile Frame | Legendary | Reach Foundation Level 100 | Prestige frame, visible but not noisy |

### 4.4 Profile Effects

Effects must be optional and restrained. They must not reduce readability.

| Item ID | Name | Type | Rarity | Unlock Condition |
|---|---|---|---|---|
| effect_none | No Effect | Profile Effect | Default | Default |
| effect_beta_glow | Beta Glow | Profile Effect | Rare | Beta Tester reward |
| effect_awakened_pulse | Awakened Pulse | Profile Effect | Epic | Awakening Trial |
| effect_foundation_aura | Foundation Aura | Profile Effect | Legendary | Foundation Perfected |

## 5. Achievement catalog

Achievements are meaningful records, not noise. Do not create achievements for every click.

| Achievement ID | Name | Visible Before Unlock | Requirement | Hidden Reward | Exact Reward |
|---|---|---:|---|---:|---|
| ach_beta_account | Beta Account Claimed | Yes | Confirmed email + Habid profile created during beta | No | badge_beta_spark, frame_beta_founder, title_beta_pioneer |
| ach_focus_created | Focus Anchor | Yes | First Focus Object created | No | badge_focus_anchor |
| ach_first_mission | First Real Step | Yes | First completed Life Tree mission | No | badge_first_mission, frame_first_mission, title_first_step |
| ach_first_root | Root Initiate | Yes | Complete any root branch mission | Yes | title_branch_starter |
| ach_three_missions | First Rhythm | Yes | Complete 3 Life Tree missions | Yes | title_focus_keeper |
| ach_body_root | Body Root Awakened | Yes | Complete health-root | No | badge_body_energy_root |
| ach_mind_root | Mind Root Awakened | Yes | Complete mind-root | No | badge_mind_root |
| ach_money_root | Money Root Awakened | Yes | Complete finance-root | No | badge_money_root |
| ach_build_root | Build Root Awakened | Yes | Complete business-root | No | badge_build_root |
| ach_career_root | Direction Root Awakened | Yes | Complete career-root | No | badge_career_root |
| ach_people_root | Connection Root Awakened | Yes | Complete relationships-root | No | badge_people_root |
| ach_creative_root | Creative Root Awakened | Yes | Complete creativity-root | No | badge_creative_root |
| ach_four_branches | Four Branches Awake | Yes | Complete root missions in 4 different branches | Yes | badge_four_branches, frame_four_branches |
| ach_seven_roots | Seven Roots Awake | Yes | Complete all 7 root missions | Yes | badge_seven_roots, title_sevenfold_path |
| ach_awakened | The Awakening Complete | Yes | Complete Awakening Trial | Yes | badge_awakening_trial, frame_awakening_trial, title_the_awakened, effect_awakened_pulse |
| ach_chapter_1_seal | Chapter 1 Seal | Yes | Complete The Awakening chapter summary/gate | Yes | badge_foundation_chapter_1, title_foundation_architect |
| ach_foundation_level_10 | Foundation Level 10 | Yes | Reach Foundation Level 10 | No | minor fragment reward |
| ach_foundation_level_25 | Foundation Level 25 | Yes | Reach Foundation Level 25 | Yes | minor fragment reward |
| ach_foundation_level_50 | Foundation Level 50 | Yes | Reach Foundation Level 50 | Yes | profile cosmetic fragment bundle |
| ach_foundation_level_75 | Foundation Level 75 | Yes | Reach Foundation Level 75 | Yes | profile cosmetic fragment bundle |
| ach_foundation_perfected | Foundation Perfected | Yes | Reach Level 100 + complete all Foundation Era requirements | Yes | badge_foundation_perfected, frame_foundation_100, title_architect_of_self, effect_foundation_aura |

## 6. Inventory model

Recommended PlayerState additions:

```ts
unlockedInventoryItemIds: string[];
equippedBadgeId?: string;
equippedFrameId?: string;
equippedTitleId?: string;
equippedProfileEffectId?: string;
unlockedAchievementIds: string[];
achievementUnlocks: Record<string, number>;
foundationXp: number; // optional if replacing totalXp later; for now totalXp can act as Foundation XP
```

Rules:

- Item catalog is static code data.
- Player state stores only unlocked item IDs and equipped item IDs.
- Never store duplicate inventory entries.
- If equipped item is not unlocked, normalize it back to default.
- Default frame is `frame_profile_core`.
- Default effect is `effect_none`.
- Beta Tester reward is granted once after confirmed account + profile/Habid exists.

## 7. Profile UI requirements

Profile should show:

- Habid, not real name;
- Foundation Level;
- XP progress to next level;
- equipped title;
- equipped badge;
- equipped frame;
- profile card preview;
- inventory controls;
- account sync status;
- reset local progress in danger zone.

Profile must not be noisy. It should feel like a player identity card, not a store.

## 8. Awards / Inventory page

Achievements page should become a proper archive.

Sections:

1. Summary: Foundation Level, completed missions, unlocked achievements.
2. Achievements: unlocked + locked meaningful achievements.
3. Hidden rewards: show `Secret reward` before unlock, exact items after unlock.
4. Inventory summary: badges, titles, frames, effects.
5. Link/button to Profile customization.

## 9. Shop / Rewards Coming Soon

The shop must exist only as a base/preview in beta. No real purchases yet.

Show:

- Research balances by category;
- Insight balance;
- Coming Soon categories: Frames, Badges, Titles, Effects, Special Challenges;
- explanation that progress cannot be bought.

Do not allow spending currency until the economy is finalized.

## 10. Reward banner rules

After mission completion, show a small banner/toast.

Normal mission banner:

- Mission Complete;
- +XP;
- +Research;
- optional level progress.

Milestone/Trial banner:

- stronger visual hierarchy;
- show unlocked achievement/item;
- show title/badge/frame if any;
- no excessive particles;
- works on mobile;
- respects reduced motion.

## 11. Implementation order for Codex

1. Add catalogs: levels, inventory items, achievements.
2. Add state fields and migration.
3. Add helper functions and tests.
4. Add achievement evaluation.
5. Add inventory equip/unequip.
6. Add beta tester grant.
7. Upgrade Profile UI.
8. Upgrade Achievements/Awards UI.
9. Add Shop Coming Soon page/section.
10. Add reward banner.
11. Verify cloud sync with new state fields.
12. Update HANDOFF.md.

## 12. Non-goals

Do not implement now:

- new eras;
- full shop purchase logic;
- paid subscriptions;
- mobile app;
- new tree visual structures;
- heavy animated profile effects;
- achievements for trivial actions;
- Habitica-style tasks or mechanics.

## 13. Codex instruction

When implementing progression, achievements, rewards, inventory, profile frames, beta tester items, or reward banners, use this document as the product source of truth. If a detail is missing, implement the smallest coherent version and update this file instead of inventing an incompatible system in code.
