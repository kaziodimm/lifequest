# HABIDOO — Progression, Rewards, Achievements and Inventory Spec RU

Version: 1.1 compatibility note
Date: 2026-06-24
Status: SUPERSEDED BY `docs/product/HABIDOO_Product_Logic_v3_RU.md`

## Важно для Codex

Этот файл больше не является самостоятельным source of truth для реализации.

Codex должен сначала читать:

1. `HANDOFF.md`
2. `docs/product/HABIDOO_Product_Logic_v3_RU.md`

Если этот файл противоречит v3, использовать v3.

## Что устарело

Следующая логика из прежней версии больше не должна реализовываться как целевая архитектура:

1. `Technology Node = одна миссия, повторённая N раз`.
2. Root/start missions как repeat-count задания.
3. Уровни/XP, рассчитанные без учёта lesson-chain модели.
4. Достижения за простое закрытие старых root missions без Gold/Mastery логики.
5. Инвентарь внутри Profile как основная точка управления всем.
6. Reward display в каждой миссии как список будущих наград.

## Что остаётся валидным

Сохраняются только базовые принципы:

1. Habidoo — Life Strategy RPG, а не habit tracker и не todo list.
2. XP нельзя выдавать за произвольные чекбоксы, planner или пустые daily tasks.
3. XP должен идти за реальные шаги Life Tree / lesson-chain progress.
4. Daily/weekly активность может давать Research, но не должна ломать Foundation Level.
5. Research — рабочая валюта для optional challenges / side objectives / bonus missions.
6. Insight — редкий ресурс для будущих cosmetic/prestige rewards, не постоянная награда за каждую мелочь.
7. Косметика должна быть редкой и значимой.
8. Reward banners должны показывать только реально полученное сейчас.
9. Achievements должны фиксировать значимые события, а не каждую кнопку.
10. Progress cannot be bought.

## Новая механика прогресса

Правильная модель теперь описана в v3:

```text
Technology Node = Lesson Chain + Gold/Mastery Step
```

Пример:

```text
Step 1 — First action
Step 2 — Similar but different action
Step 3 — Real-world application
Step 4 — Proof / evidence
Step 5 — Gold / Mastery challenge
```

Поэтому XP, rewards, achievements и level curve должны быть пересчитаны после внедрения lesson-chain architecture.

## Временная экономика до пересчёта

До полной переработки экономики использовать консервативные правила:

- guide step: small Research only or very small onboarding reward;
- lesson step: small XP + small Research;
- node completion: stronger XP + possible achievement/item;
- Gold/Mastery step: mastery bonus + possible cosmetic/achievement;
- Trial/chapter gate: major reward.

Не добавлять награду в каждый маленький шаг, если это перегружает интерфейс.

## Инвентарь / профиль / настройки

Новая структура:

```text
Profile = статус игрока.
Inventory = предметы и экипировка.
Settings = язык, аккаунт, безопасность, уведомления, reset.
Tree = дерево и быстрые theme slots.
```

Inventory должен развиваться как Destiny/Fortnite hybrid:

- profile identity card;
- equipped slots;
- item tabs;
- preview;
- equip/unequip;
- owned/locked/coming soon.

Темы дерева остаются доступны в Tree, но при большом количестве тем использовать `Theme Slots + Theme Library`, а не длинный ряд кнопок.

## Достижения под v3

Достижения должны быть за:

- первый guide step;
- первый завершённый lesson chain;
- первый Gold node;
- все 7 root lesson chains;
- Awakening Trial;
- chapter completion;
- beta account/Habid;
- meaningful weekly consistency;
- cloud sync milestone.

Не создавать достижения за каждую мелкую активность.

## Следующий обязательный документ

Все будущие правки по уровням, наградам и достижениям должны обновлять новый v3-compatible файл, а не восстанавливать старую таблицу без пересчёта.
