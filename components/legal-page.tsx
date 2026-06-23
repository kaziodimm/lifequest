"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLifeStore } from "@/lib/store";
import type { Locale } from "@/lib/types";

type LegalPageKind = "terms" | "privacy" | "rules";
type LegalContent = { eyebrow: string; title: string; subtitle: string; back: string; sections: { title: string; body: string }[] };

const content: Record<Locale, Record<LegalPageKind, LegalContent>> = {
  en: {
    terms: {
      eyebrow: "Habidoo legal",
      title: "Terms of Use",
      subtitle: "Effective date: June 23, 2026. MVP/closed-beta policy; review before public scale.",
      back: "Back to Habidoo",
      sections: [
        { title: "Use of Habidoo", body: "Habidoo helps you plan and track self-improvement missions. You are responsible for your own choices, actions and safety." },
        { title: "Account", body: "Use your own email, keep access secure and choose a Habid that follows public username rules." },
        { title: "Progress data", body: "Progress, missions, focus objects, inventory and statistics may be saved to your account when sync is active." },
        { title: "Closed beta", body: "Features, progression balance, rewards, inventory, legal copy and availability may change before public launch." },
        { title: "No professional advice", body: "Habidoo is not medical, legal, financial, emergency or professional advice." },
        { title: "Fair use", body: "Do not abuse, attack, scrape, reverse engineer, spam, impersonate others or access data that is not yours." },
        { title: "Ownership", body: "Habidoo assets and systems belong to the project owner unless stated otherwise. No patent, trademark or registration claim is made here." },
        { title: "Support and deletion", body: "During closed beta, account or data deletion requests should go through the invitation/support channel. A public support address will be published before broader launch." }
      ]
    },
    privacy: {
      eyebrow: "Habidoo legal",
      title: "Privacy Policy",
      subtitle: "Effective date: June 23, 2026. Current account and cloud-save model.",
      back: "Back to Habidoo",
      sections: [
        { title: "Data we collect", body: "Email, Habid, optional display name, locale, account identifiers and Habidoo progress state: missions, answers, focus objects, rewards and statistics." },
        { title: "Why we collect it", body: "To create your account, confirm email, save progress, restore progress across devices and improve the product." },
        { title: "Storage", body: "Account and progress data are stored through Supabase. Confirmation emails are sent through the configured email provider." },
        { title: "Security posture", body: "No service-role key is used in the browser, authorization is not stored in user metadata, and private progress is not intentionally public." },
        { title: "Cloud/device conflict", body: "If account progress and device progress both exist, Habidoo asks which one to use instead of silently overwriting." },
        { title: "Deletion", body: "During closed beta, deletion requests go through the invitation/support channel. Public support contact will be added before launch." },
        { title: "Safety", body: "Do not enter highly sensitive medical, legal, financial or emergency information into mission answers." }
      ]
    },
    rules: {
      eyebrow: "Habidoo community",
      title: "Rules of Use",
      subtitle: "Simple rules for a product about real-life progress.",
      back: "Back to Habidoo",
      sections: [
        { title: "Use it honestly", body: "Use Habidoo for real personal progress, not manipulation, harassment or impersonation." },
        { title: "Respect identity", body: "Choose a Habid that is not offensive, misleading, reserved or pretending to be official staff." },
        { title: "Protect data", body: "Do not try to access another user’s account, progress state or private data." },
        { title: "No abuse", body: "Do not use automation or abuse patterns that degrade the service for others." },
        { title: "Safety first", body: "Missions are guidance. For health, money, legal or safety decisions, use qualified professional help." },
        { title: "No emergencies", body: "Do not use Habidoo for emergencies. If there is immediate danger, contact local emergency services." },
        { title: "Beta rewards", body: "Closed-beta rewards and progression may change; do not sell, trade or represent beta rewards as real-world monetary value." }
      ]
    }
  },
  ru: {
    terms: {
      eyebrow: "Правовая информация Habidoo",
      title: "Условия использования",
      subtitle: "Дата вступления: 23 июня 2026. MVP/закрытая бета; перед публичным запуском нужен финальный обзор.",
      back: "Назад в Habidoo",
      sections: [
        { title: "Использование Habidoo", body: "Habidoo помогает планировать и отслеживать миссии саморазвития. Вы отвечаете за свои решения, действия и безопасность." },
        { title: "Аккаунт", body: "Используйте свой email, храните доступ безопасно и выбирайте Habid по публичным правилам имени." },
        { title: "Данные прогресса", body: "Прогресс, миссии, фокус-объекты, инвентарь и статистика могут сохраняться в аккаунт при активной синхронизации." },
        { title: "Закрытая бета", body: "Функции, баланс прогресса, награды, инвентарь, правовые тексты и доступность могут измениться до публичного запуска." },
        { title: "Не профессиональная консультация", body: "Habidoo не является медицинской, юридической, финансовой, экстренной или профессиональной консультацией." },
        { title: "Честное использование", body: "Не злоупотребляйте сервисом, не атакуйте, не спамьте, не выдавайте себя за других и не пытайтесь получить чужие данные." },
        { title: "Права", body: "Материалы и системы Habidoo принадлежат владельцу проекта, если не указано иное. Здесь нет заявления о патенте, торговой марке или регистрации." },
        { title: "Поддержка и удаление", body: "Во время закрытой беты запросы на удаление аккаунта или данных идут через канал приглашения/поддержки. Публичный контакт будет добавлен перед запуском." }
      ]
    },
    privacy: {
      eyebrow: "Правовая информация Habidoo",
      title: "Политика приватности",
      subtitle: "Дата вступления: 23 июня 2026. Текущая модель аккаунта и cloud-save.",
      back: "Назад в Habidoo",
      sections: [
        { title: "Какие данные собираются", body: "Email, Habid, необязательное имя, язык, идентификаторы аккаунта и прогресс Habidoo: миссии, ответы, фокус-объекты, награды и статистика." },
        { title: "Зачем", body: "Для создания аккаунта, подтверждения email, сохранения прогресса, восстановления на устройствах и улучшения продукта." },
        { title: "Хранение", body: "Аккаунт и прогресс хранятся через Supabase. Письма подтверждения отправляет настроенный email-провайдер." },
        { title: "Безопасность", body: "Service-role key не используется в браузере, авторизация не хранится в user_metadata, приватный прогресс не делается публичным намеренно." },
        { title: "Конфликт cloud/device", body: "Если есть прогресс аккаунта и устройства, Habidoo спрашивает, какой использовать, вместо тихой перезаписи." },
        { title: "Удаление", body: "Во время закрытой беты запросы на удаление идут через канал приглашения/поддержки. Публичный контакт будет добавлен перед запуском." },
        { title: "Безопасность пользователя", body: "Не вводите в ответы миссий особо чувствительную медицинскую, юридическую, финансовую или экстренную информацию." }
      ]
    },
    rules: {
      eyebrow: "Сообщество Habidoo",
      title: "Правила использования",
      subtitle: "Простые правила для продукта о реальном прогрессе.",
      back: "Назад в Habidoo",
      sections: [
        { title: "Используйте честно", body: "Используйте Habidoo для личного прогресса, а не для манипуляций, травли или выдачи себя за других." },
        { title: "Уважайте идентичность", body: "Habid не должен быть оскорбительным, вводящим в заблуждение, зарезервированным или похожим на официальный аккаунт." },
        { title: "Защищайте данные", body: "Не пытайтесь получить доступ к чужому аккаунту, прогрессу или приватным данным." },
        { title: "Без злоупотреблений", body: "Не используйте автоматизацию или паттерны, ухудшающие сервис для других." },
        { title: "Сначала безопасность", body: "Миссии — это ориентиры. Для здоровья, денег, права и безопасности обращайтесь к квалифицированным специалистам." },
        { title: "Не для экстренных случаев", body: "Не используйте Habidoo для экстренных ситуаций. При непосредственной опасности обращайтесь в местные экстренные службы." },
        { title: "Бета-награды", body: "Награды и прогресс закрытой беты могут измениться; не продавайте и не представляйте их как имеющие реальную денежную ценность." }
      ]
    }
  },
  cs: {
    terms: {
      eyebrow: "Právní informace Habidoo",
      title: "Podmínky používání",
      subtitle: "Účinné od 23. června 2026. MVP/uzavřená beta; před veřejným spuštěním je nutná finální kontrola.",
      back: "Zpět do Habidoo",
      sections: [
        { title: "Používání Habidoo", body: "Habidoo pomáhá plánovat a sledovat mise seberozvoje. Za svá rozhodnutí, kroky a bezpečnost odpovídáte vy." },
        { title: "Účet", body: "Používejte vlastní email, chraňte přístup a zvolte Habid podle veřejných pravidel." },
        { title: "Data postupu", body: "Postup, mise, objekty soustředění, inventář a statistiky se mohou ukládat k účtu při aktivní synchronizaci." },
        { title: "Uzavřená beta", body: "Funkce, vyvážení postupu, odměny, inventář, právní texty i dostupnost se mohou před veřejným spuštěním změnit." },
        { title: "Nejde o odborné poradenství", body: "Habidoo není lékařské, právní, finanční, nouzové ani jiné odborné poradenství." },
        { title: "Poctivé používání", body: "Nezneužívejte službu, neútočte, nespamujte, nevydávejte se za jiné a nepokoušejte se získat cizí data." },
        { title: "Vlastnictví", body: "Materiály a systémy Habidoo patří vlastníkovi projektu, není-li uvedeno jinak. Tento text netvrdí registraci patentu či ochranné známky." },
        { title: "Podpora a smazání", body: "Během uzavřené bety řešte žádosti o smazání účtu či dat přes invitační/podpůrný kanál. Veřejný kontakt bude přidán před spuštěním." }
      ]
    },
    privacy: {
      eyebrow: "Právní informace Habidoo",
      title: "Zásady soukromí",
      subtitle: "Účinné od 23. června 2026. Aktuální model účtu a cloudového ukládání.",
      back: "Zpět do Habidoo",
      sections: [
        { title: "Jaká data sbíráme", body: "Email, Habid, volitelné jméno, jazyk, identifikátory účtu a stav postupu Habidoo: mise, odpovědi, objekty soustředění, odměny a statistiky." },
        { title: "Proč", body: "Pro vytvoření účtu, potvrzení emailu, ukládání postupu, obnovu mezi zařízeními a zlepšování produktu." },
        { title: "Uložení", body: "Účet a postup jsou uloženy přes Supabase. Potvrzovací emaily odesílá nastavený emailový poskytovatel." },
        { title: "Bezpečnost", body: "Service-role key není v prohlížeči, autorizace není v user_metadata a soukromý postup není záměrně veřejný." },
        { title: "Konflikt cloud/device", body: "Pokud existuje postup účtu i zařízení, Habidoo se zeptá, který použít, místo tichého přepsání." },
        { title: "Smazání", body: "Během uzavřené bety jdou žádosti o smazání přes invitační/podpůrný kanál. Veřejný kontakt bude přidán před spuštěním." },
        { title: "Bezpečnost uživatele", body: "Do odpovědí misí nevkládejte vysoce citlivé lékařské, právní, finanční nebo nouzové informace." }
      ]
    },
    rules: {
      eyebrow: "Komunita Habidoo",
      title: "Pravidla používání",
      subtitle: "Jednoduchá pravidla pro produkt o skutečném pokroku.",
      back: "Zpět do Habidoo",
      sections: [
        { title: "Používejte poctivě", body: "Používejte Habidoo pro vlastní pokrok, ne pro manipulaci, obtěžování nebo vydávání se za jiné." },
        { title: "Respektujte identitu", body: "Habid nesmí být urážlivý, klamavý, rezervovaný ani působit jako oficiální účet." },
        { title: "Chraňte data", body: "Nepokoušejte se získat přístup k cizímu účtu, postupu nebo soukromým datům." },
        { title: "Bez zneužívání", body: "Nepoužívejte automatizaci nebo vzorce, které zhoršují službu ostatním." },
        { title: "Bezpečnost první", body: "Mise jsou vodítka. Pro zdraví, peníze, právo nebo bezpečí využijte kvalifikovanou pomoc." },
        { title: "Ne pro nouzové situace", body: "Nepoužívejte Habidoo pro nouzové situace. Při bezprostředním nebezpečí kontaktujte místní nouzové služby." },
        { title: "Beta odměny", body: "Odměny a postup v uzavřené betě se mohou změnit; neprodávejte je ani je neprezentujte jako peněžní hodnotu." }
      ]
    }
  },
  uk: {
    terms: {
      eyebrow: "Правова інформація Habidoo",
      title: "Умови використання",
      subtitle: "Дата набуття чинності: 23 червня 2026. MVP/закрита бета; перед публічним запуском потрібен фінальний перегляд.",
      back: "Назад до Habidoo",
      sections: [
        { title: "Використання Habidoo", body: "Habidoo допомагає планувати й відстежувати місії саморозвитку. Ви відповідаєте за власні рішення, дії та безпеку." },
        { title: "Акаунт", body: "Використовуйте власний email, зберігайте доступ безпечно й обирайте Habid за публічними правилами." },
        { title: "Дані прогресу", body: "Прогрес, місії, об’єкти фокуса, інвентар і статистика можуть зберігатися в акаунт, коли синхронізація активна." },
        { title: "Закрита бета", body: "Функції, баланс прогресу, нагороди, інвентар, правові тексти й доступність можуть змінитися до публічного запуску." },
        { title: "Не професійна консультація", body: "Habidoo не є медичною, юридичною, фінансовою, екстреною чи професійною консультацією." },
        { title: "Чесне використання", body: "Не зловживайте сервісом, не атакуйте, не спамте, не видавайте себе за інших і не намагайтеся отримати чужі дані." },
        { title: "Права", body: "Матеріали та системи Habidoo належать власнику проєкту, якщо не зазначено інше. Тут немає заяви про патент, торговельну марку чи реєстрацію." },
        { title: "Підтримка й видалення", body: "Під час закритої бети запити на видалення акаунта чи даних ідуть через канал запрошення/підтримки. Публічний контакт буде додано перед запуском." }
      ]
    },
    privacy: {
      eyebrow: "Правова інформація Habidoo",
      title: "Політика приватності",
      subtitle: "Дата набуття чинності: 23 червня 2026. Поточна модель акаунта й cloud-save.",
      back: "Назад до Habidoo",
      sections: [
        { title: "Які дані збираються", body: "Email, Habid, необов’язкове ім’я, мова, ідентифікатори акаунта й стан прогресу Habidoo: місії, відповіді, об’єкти фокуса, нагороди та статистика." },
        { title: "Навіщо", body: "Для створення акаунта, підтвердження email, збереження прогресу, відновлення між пристроями та покращення продукту." },
        { title: "Зберігання", body: "Акаунт і прогрес зберігаються через Supabase. Листи підтвердження надсилає налаштований email-провайдер." },
        { title: "Безпека", body: "Service-role key не використовується в браузері, авторизація не зберігається в user_metadata, приватний прогрес не робиться публічним навмисно." },
        { title: "Конфлікт cloud/device", body: "Якщо є прогрес акаунта й пристрою, Habidoo питає, який використати, замість тихого перезапису." },
        { title: "Видалення", body: "Під час закритої бети запити на видалення йдуть через канал запрошення/підтримки. Публічний контакт буде додано перед запуском." },
        { title: "Безпека користувача", body: "Не вводьте у відповіді місій особливо чутливу медичну, юридичну, фінансову чи екстрену інформацію." }
      ]
    },
    rules: {
      eyebrow: "Спільнота Habidoo",
      title: "Правила використання",
      subtitle: "Прості правила для продукту про реальний прогрес.",
      back: "Назад до Habidoo",
      sections: [
        { title: "Використовуйте чесно", body: "Використовуйте Habidoo для особистого прогресу, а не для маніпуляцій, переслідування чи видавання себе за інших." },
        { title: "Поважайте ідентичність", body: "Habid не має бути образливим, оманливим, зарезервованим або схожим на офіційний акаунт." },
        { title: "Захищайте дані", body: "Не намагайтеся отримати доступ до чужого акаунта, прогресу чи приватних даних." },
        { title: "Без зловживань", body: "Не використовуйте автоматизацію чи патерни, що погіршують сервіс для інших." },
        { title: "Спочатку безпека", body: "Місії — це орієнтири. Для здоров’я, грошей, права чи безпеки звертайтеся до кваліфікованих фахівців." },
        { title: "Не для екстрених випадків", body: "Не використовуйте Habidoo для екстрених ситуацій. За безпосередньої небезпеки звертайтеся до місцевих екстрених служб." },
        { title: "Бета-нагороди", body: "Нагороди й прогрес закритої бети можуть змінитися; не продавайте й не представляйте їх як такі, що мають реальну грошову цінність." }
      ]
    }
  }
};

export function LegalPage({ page }: { page: LegalPageKind }) {
  const locale = useLifeStore((state) => state.locale);
  const pageContent = content[locale]?.[page] ?? content.en[page];
  return (
    <AppShell hideNavigation>
      <main className="mx-auto grid max-w-3xl gap-4 py-6">
        <Link href="/" className="text-sm font-bold text-primary hover:underline">← {pageContent.back}</Link>
        <Card>
          <CardHeader>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{pageContent.eyebrow}</p>
            <CardTitle className="text-3xl">{pageContent.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{pageContent.subtitle}</p>
          </CardHeader>
          <CardContent className="grid gap-4">
            {pageContent.sections.map((section) => (
              <section key={section.title} className="rounded-xl border border-border bg-muted/25 p-4">
                <h2 className="font-black text-foreground">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
