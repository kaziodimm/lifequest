# Habidoo — Local Codex Setup RU

Version: 1.0
Date: 2026-06-25
Purpose: подготовить личный ПК так, чтобы Codex мог работать с Habidoo качественно, запускать проверки и продолжать проект без потери контекста.

## 1. Что установить на личный ПК

Минимум:

- Git
- Node.js 20 или 22 (`package.json` требует `>=20 <23`)
- pnpm через Corepack
- Codex / OpenAI coding agent
- Доступ к GitHub репозиторию `kaziodimm/lifequest`

Рекомендуется:

- VS Code
- GitHub CLI (`gh`)
- Vercel CLI
- Supabase CLI

## 2. Клонирование проекта

```bash
git clone https://github.com/kaziodimm/lifequest.git
cd lifequest
```

Проверить ветку:

```bash
git status
git branch --show-current
```

Основная ветка production: `main`.

## 3. Установка зависимостей

В репозитории есть `pnpm-lock.yaml`, поэтому использовать pnpm.

```bash
corepack enable
pnpm install --frozen-lockfile
```

Если `--frozen-lockfile` падает из-за локальной версии pnpm, сначала проверить ошибку, не удалять lockfile без явной причины.

## 4. Environment variables

Создать `.env.local` из `.env.example`:

```bash
cp .env.example .env.local
```

Заполнить:

```text
NEXT_PUBLIC_SUPABASE_URL=https://oywbykuqvdvqsybwpkig.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Supabase publishable key>
```

Где взять:

- Supabase dashboard -> Project Settings -> API
- или Vercel dashboard -> Project -> Settings -> Environment Variables

Важно:

- никогда не добавлять `service_role` key в браузер;
- никогда не создавать `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE`;
- `.env.local` не коммитить.

## 5. Локальный запуск

```bash
pnpm dev
```

Открыть:

```text
http://localhost:3000
```

Supabase redirect allow list уже должен включать:

```text
http://localhost:3000/auth/confirm
https://www.habidoo.com/auth/confirm
```

Если локальная регистрация/подтверждение email не возвращает на localhost, проверить Supabase Auth URL Configuration.

## 6. Проверки перед каждым commit

Запускать:

```bash
pnpm test
pnpm typecheck
pnpm build
```

В `package.json` сейчас scripts:

```text
dev       next dev
build     next build
test      node --experimental-strip-types --test tests/mission-rules.test.ts
typecheck tsc --noEmit
start     next start
```

## 7. Что Codex должен читать первым

Каждый новый Codex чат/сессия должен начать с:

1. `HANDOFF.md`
2. `docs/product/HABIDOO_Product_Logic_v3_RU.md`
3. `docs/product/HABIDOO_Progression_Rewards_Level_100_RU.md`
4. `docs/dev/CODEX_LOCAL_SETUP_RU.md`
5. `docs/dev/CODEX_FIRST_TASK_GLOBAL_SYNC_RU.md`

При конфликте старых документов с v3 использовать v3.

## 8. Текущее направление продукта

Не делать демо ради MVP. Цель — beta-quality foundation.

Главная текущая логика:

```text
Technology Node = Lesson Chain + Gold/Mastery Step
```

Не продолжать старую repeat-count модель.

## 9. Что не делать без отдельного запроса

- не добавлять новые эпохи;
- не генерировать новые темы/фоны/иконки;
- не возвращать 24h Planner;
- не превращать Habidoo в Habitica clone;
- не переносить всё в Profile;
- не делать платный shop/subscriptions;
- не трогать production env без необходимости;
- не коммитить secrets.

## 10. Первый технический приоритет

P0: глобальная синхронизация прогресса между устройствами.

Причина: сейчас прогресс может не переноситься desktop -> phone, если autosync зависит от Profile/CloudAccountPanel. До beta это blocker.

Сначала читать и выполнить:

```text
docs/dev/CODEX_FIRST_TASK_GLOBAL_SYNC_RU.md
```

## 11. Browser QA после больших UI changes

Минимум проверить:

- desktop 1440x900;
- mobile 390x844;
- signup/login;
- onboarding;
- Tree;
- MissionPanel;
- Command;
- Profile;
- legal pages;
- отсутствие horizontal overflow;
- важные кнопки не обрезаны.

## 12. Git discipline

Перед работой:

```bash
git status
```

После работы:

```bash
git diff
pnpm test
pnpm typecheck
pnpm build
```

Коммит должен быть узким. Один pass = одна задача.

После каждого pass обновлять `HANDOFF.md`.
