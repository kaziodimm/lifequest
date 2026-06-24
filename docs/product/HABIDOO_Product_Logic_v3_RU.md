# HABIDOO — Product Logic v3 RU

Version: 3.0
Date: 2026-06-24
Status: CURRENT SOURCE OF TRUTH FOR CODEX

Этот документ заменяет старую логику repeat-count миссий и уточняет продуктовую архитектуру Habidoo перед закрытой beta.

Codex должен читать этот файл вместе с `HANDOFF.md`. Если старые Product Bible / progression документы противоречат этому файлу, приоритет имеет этот файл.

## 1. Главный продуктовый вывод

Habidoo не должен ощущаться как demo habit tracker.

Пользователь должен видеть:

- что он начал путь;
- что каждый шаг меняет прогресс;
- что миссии не являются галочками ради счётчика;
- что профиль, инвентарь, уровни и награды связаны с реальным прохождением;
- что прогресс защищён аккаунтом и синхронизируется между устройствами.

## 2. Superseded / больше не использовать как целевую логику

Следующие решения считаются устаревшими и не должны развиваться дальше:

1. `Technology Node = выполнить одну и ту же миссию N раз`.
2. Root mission как повторяемая однотипная задача.
3. Первая миссия, после которой пользователь сразу видит cooldown как основной следующий результат.
4. Профиль как место для выбора языка, reset, темы и всех настроек.
5. Theme picker на половину профиля.
6. Cloud sync, который работает только когда открыта страница Profile.
7. Награды в каждой миссии как перегруженный список будущих предметов.
8. Daily/weekly task logic как отдельный todo/planner слой.
9. 24h Planner как центральная механика.
10. Стартовые задания вида `запишите настроение`, `подумайте`, `сделайте выбор`, если человек ещё не понимает зачем.

## 3. Новая модель миссий

Правильная модель:

```text
Technology Node = Lesson Chain + Mastery/Gold Step
```

Один узел дерева не должен требовать повторить одну и ту же задачу 5 раз. Узел должен раскрываться через последовательность разных, но связанных шагов.

Пример структуры узла:

```text
Step 1 — First action
Step 2 — Similar but different action
Step 3 — Real-world application
Step 4 — Proof / evidence
Step 5 — Gold / Mastery challenge
```

Каждый шаг должен давать видимый прогресс.

### 3.1 Что остаётся повторяемым

Повторение допустимо там, где повторение имеет реальный смысл:

- ходьба;
- тренировка;
- чтение;
- фокус-сессия;
- weekly review;
- routine-based actions.

### 3.2 Что не должно повторяться механически

Root/start missions не должны быть `сделай то же самое 5 раз`.

Для стартовых технологий повтор должен заменяться развитием:

- сначала простое действие;
- затем похожее действие;
- затем применение;
- затем доказательство;
- затем gold challenge.

## 4. Пример lesson-chain для root missions

### Body & Energy Root

```text
1. Быстрый reset: вода + 60 секунд растяжки.
2. Короткая прогулка или движение 10 минут.
3. Заметь один телесный сигнал после работы/сидения.
4. Подготовь минимальное body rule на завтра.
5. Gold: полноценная 20-минутная body session.
```

### Focus & Mind Root

```text
1. Закрыть одно отвлечение и выбрать 5-минутное действие.
2. Выполнить короткую focus session.
3. Убрать один источник шума из рабочей среды.
4. Сохранить правило фокуса на завтра.
5. Gold: 25 минут глубокой работы без переключений.
```

### Money & Freedom Root

```text
1. Открыть источник денег и сохранить один простой факт.
2. Найти одну подписку/регулярный расход.
3. Отметить один ближайший платёж.
4. Сформулировать минимальное money rule на неделю.
5. Gold: собрать первый простой money snapshot.
```

### Build & Create Root

```text
1. Ввести название своего проекта вручную.
2. Создать один маленький видимый артефакт.
3. Определить ближайший видимый результат.
4. Убрать одну лишнюю идею из scope.
5. Gold: сохранить первую usable version / showable draft.
```

### Direction & Career Root

```text
1. Сохранить одну реальную возможность, навык или CV/portfolio item.
2. Определить ближайший профессиональный proof.
3. Сделать маленькое действие для этого proof.
4. Записать следующий карьерный шаг.
5. Gold: создать видимый career proof artifact.
```

### People & Connection Root

```text
1. Отправить или подготовить конкретное сообщение человеку.
2. Зафиксировать следующий шаг общения.
3. Сделать один follow-up или договориться о контакте.
4. Сформулировать relationship rule на неделю.
5. Gold: завершить meaningful connection loop.
```

### Creative Practice Root

```text
1. Создать грубый черновик за 10 минут.
2. Выбрать один элемент для улучшения.
3. Сделать вторую версию или маленькое продолжение.
4. Сохранить принцип, который сработал.
5. Gold: завершить маленький creative artifact.
```

## 5. Первая сессия / Guide system

Первая сессия должна быть отдельным сильным flow, а не маленькой подсказкой в стороне.

Цель:

```text
Новый пользователь должен почувствовать: я начал свой прогресс.
```

Правильный flow:

```text
Account / onboarding
-> выбрать направление
-> пройти guided first step
-> получить reward banner
-> увидеть visible progress
-> открыть первую настоящую lesson-chain mission
```

Guide system должна:

- быть заметной и основной для нового пользователя;
- вести пользователя очень прямо;
- иметь возможность отказаться/пропустить, но не быть незаметной;
- не ставить cooldown;
- не создавать active Technology Mission;
- не ломать экономику;
- сохранять прогресс;
- подводить к первой настоящей mission chain.

## 6. Видимый прогресс

Текущая проблема: пользователь может выполнить действие и не почувствовать изменения.

Нужна система видимого прогресса после каждого шага:

```text
Node Progress: 1/5, 2/5, 3/5, 4/5, Gold
```

Визуальная форма:

- сегменты вокруг ноды;
- progress strip в MissionPanel;
- completion banner;
- профильный progress feed;
- Command Center next-step card.

Не использовать только текст `completed`.

## 7. Reward banners

Reward banner нужен не как казино-эффект, а как подтверждение значимости.

Типы:

1. First Step Banner.
2. Lesson Complete Banner.
3. Node Complete Banner.
4. Gold/Mastery Banner.
5. Achievement Banner.
6. Sync/Account Banner.

Правила:

- без full-screen confetti по умолчанию;
- мягкий glow / light sweep / small pulse;
- хорошо работает на mobile;
- уважает reduced motion;
- не показывает будущие награды в каждой миссии;
- показывает только то, что реально получено сейчас.

## 8. XP / Research / Insight под новую логику

XP должен идти за прохождение lesson steps внутри Technology Node.

Пример:

```text
Root Node total XP = сумма XP всех lesson steps + completion bonus.
Gold Step даёт отдельный mastery bonus.
```

Research может выдаваться:

- за guide step;
- за lesson step;
- за optional/weekly actions;
- за review.

Insight остаётся редким ресурсом для будущих cosmetic/prestige rewards, но его нельзя превращать в постоянную награду за каждую мелочь.

Старую таблицу 1-100 можно использовать как rough economy reference, но она должна быть пересчитана после перехода на lesson-chain architecture.

## 9. Achievements под новую логику

Достижения должны быть за значимые события:

- первый guide step;
- первый завершённый lesson chain;
- первый Gold node;
- все 7 root chains;
- Awakening Trial;
- chapter completion;
- beta tester;
- meaningful weekly consistency;
- synced account milestone.

Не создавать достижения за каждую мелкую кнопку.

## 10. Inventory / Profile / Settings

Новая структура:

```text
Profile = статус игрока.
Inventory = предметы и экипировка.
Settings = язык, аккаунт, безопасность, уведомления, reset.
Tree = дерево и быстрые theme slots.
```

### Profile

Показывает:

- Habid;
- avatar/profile card;
- Foundation level / prestige;
- title;
- main badge;
- profile frame;
- profile effect;
- recent meaningful progress;
- sync status compact.

Profile не должен быть страницей настроек.

### Inventory

Взять логику Destiny/Fortnite hybrid:

- профиль как персонаж/identity card;
- экипированные слоты;
- вкладки предметов;
- preview;
- equip/unequip;
- owned/locked/coming soon.

Категории:

- Badges;
- Titles;
- Frames;
- Profile Effects;
- Tree Themes;
- Legacy / Prestige.

### Tree Themes

Темы остаются доступными в самом дереве, но не как бесконечный ряд кнопок.

Если тем много:

```text
Tree Theme Slots: 3-5 быстрых слотов
+ Open Theme Library
```

Управление большим количеством тем находится в Inventory / Theme Library.

### Settings

Настройки должны включать:

- language;
- email;
- password;
- notifications;
- privacy;
- export data;
- delete account;
- reset local progress;
- account sync controls.

## 11. Cloud sync is P0

Cloud sync важнее визуальных банеров и новой миссионной логики.

Текущая архитектурная проблема: sync не должен зависеть от открытия Profile/CloudAccountPanel.

Нужен глобальный CloudSyncProvider:

- монтируется на всех protected routes;
- грузит server state после auth;
- не перезаписывает свежий server state пустым local state;
- умеет conflict resolution;
- сохраняет изменения с debounce;
- показывает sync status;
- работает между desktop/mobile.

Без этого closed beta нельзя считать надёжной.

## 12. Notifications / retention

Нужна система уведомлений.

Сначала in-app notifications:

- mission timer finished;
- cooldown finished;
- guide step waiting;
- reward unclaimed;
- weekly review available;
- trial ready;
- sync issue;
- account/security events.

Push/email позже, только после явного согласия пользователя.

Требования:

- notification center;
- unread counter;
- action button;
- settings for notification frequency;
- quiet hours in future.

## 13. Pre-login landing

Главная до входа должна продавать продукт, а не просто показывать login.

Структура:

1. Hero: Habidoo as Life Strategy RPG.
2. Problem: habit trackers do not show life progress.
3. How it works: choose direction -> mission chain -> visible progress -> rewards.
4. Screens/visual product preview.
5. Why account is required: sync, security, beta identity.
6. What beta includes.
7. Rules: no buying progress.
8. CTA: create account / login.
9. Legal links.

## 14. Pages to redesign before beta

Priority pages:

1. Tree / MissionPanel.
2. Command Center / Missions.
3. Stats.
4. Awards / Achievements.
5. Profile.
6. Inventory.
7. Settings.
8. Notifications.
9. Public landing.
10. Legal pages polish.

Every page must pass mobile and desktop layout QA.

## 15. Beta readiness checklist

Before beta:

- global sync works across devices;
- first-user guide is understandable;
- lesson-chain mission model exists for root/start nodes;
- visible progress exists after each step;
- reward banners exist;
- profile/inventory/settings are separated;
- notification basics exist;
- landing page explains and sells product;
- legal pages are present;
- mobile layout does not clip important controls;
- user can understand what to do next without founder explanation.

## 16. Codex implementation priority

Recommended implementation order:

1. Global CloudSyncProvider and conflict-safe sync.
2. Product state model for lesson-chain progress.
3. Root/start nodes converted from repeat-count to lesson chains.
4. First-user guide flow built around guide step + reward + next mission.
5. Visible progress and reward banners.
6. Profile/Inventory/Settings separation.
7. Notifications in-app basics.
8. Mission/Stats/Awards page redesign.
9. Landing page v2.
10. XP/rewards/achievements recalculation.

Do not implement everything in one pass. Each pass must update HANDOFF.md.

## 17. Non-goals for the next immediate pass

Do not add:

- new eras;
- new generated themes;
- mobile app store builds;
- paid shop;
- subscriptions;
- multiplayer;
- social features;
- heavy cosmetic effects;
- Habitica clone mechanics.

## 18. Rule for future Codex chats

If Codex sees older docs saying root missions should be repeated N times, ignore that part and follow this v3 document.

If Codex sees older docs saying first mission can lead into cooldown explanation, treat that as superseded.

If Codex sees `Product Bible v2`, use it only for high-level vision, not for current mechanics.
