export type CatalogTranslation = {
  title: string;
  description: string;
  action: string;
  outcome: string;
  steps: string[];
};

export const catalogTranslations = {
  "cs": {
    "health-root": {
      "title": "Povědomí o těle",
      "description": "Naučte se vnímat svou energii, než se ji pokusíte zlepšit.",
      "action": "Třikrát během dne se pozastavte a zhodnoťte svůj aktuální tělesný stav.",
      "outcome": "Dokončete check-iny za 5 dní",
      "steps": [
        "Přestaňte s tím, co děláte.",
        "Proveďte 3 pomalé nádechy.",
        "Hodnotit energii od 1 do 5.",
        "Hodnotit stres od 1 do 5.",
        "Napište: Co mě právě teď ovlivňuje?"
      ]
    },
    "morning-walk": {
      "title": "Ranní procházka",
      "description": "Vybudujte si klidný venkovní pohybový rytmus.",
      "action": "Choďte venku alespoň 15 nepřetržitých minut.",
      "outcome": "Absolvujte 8 vycházek",
      "steps": [
        "Opusťte domov nebo práci.",
        "Choďte nepřetržitě alespoň 15 minut.",
        "Nekombinujte to s nákupy nebo pochůzkami.",
        "Nechte rolování telefonu zavřené."
      ]
    },
    "hydration": {
      "title": "Obnova hydratace",
      "description": "Před stimulanty dejte vodu.",
      "action": "Voda před kofeinem",
      "outcome": "Dokončeno za 10 dní",
      "steps": [
        "Naplňte sklenici nebo láhev.",
        "Vypijte alespoň 300 ml.",
        "Udělejte to před kávou, energetickým nápojem nebo sodou.",
        "Označte kompletní až po vypití."
      ]
    },
    "evening-shutdown": {
      "title": "Večerní uzavření",
      "description": "Vytvořte promyšlené zakončení dne.",
      "action": "10minutové vypnutí",
      "outcome": "Dokončete 7 večerů",
      "steps": [
        "Odložte telefon nebo povolte režim nerušit.",
        "Připravte si základní věci na zítra.",
        "Napište: Zítra začíná...",
        "Vypněte nepotřebná světla."
      ]
    },
    "daily-movement": {
      "title": "Denní pohyb",
      "description": "Udělejte ze záměrného pohybu normální sezení.",
      "action": "20 minut pohybu",
      "outcome": "Dokončete 6 sezení",
      "steps": [
        "Zvolte rychlou chůzi, jízdu na kole, schody, domácí pohyb nebo aktivní protahovací proud.",
        "Pohybujte se záměrně alespoň 20 minut."
      ]
    },
    "light-cardio": {
      "title": "Lehké kardio",
      "description": "Vybudujte si snadnou aerobní kapacitu bez přetěžování.",
      "action": "Lehké kardio zasedání",
      "outcome": "Dokončete 4 sezení",
      "steps": [
        "Zahřívejte 3 minuty.",
        "Pohybujte se nepřetržitě po dobu 15-20 minut.",
        "Udržujte mírnou intenzitu.",
        "Měl bys umět mluvit, ale ne zpívat."
      ]
    },
    "mobility-primer": {
      "title": "Rozcvička mobility",
      "description": "Otevřete tělo pomocí krátké opakovatelné sekvence.",
      "action": "8minutová rutina mobility",
      "outcome": "Dokončete 6 sezení",
      "steps": [
        "Kruhy na krku – 30 sekund.",
        "Kruhy na ramenou - 60 sekund.",
        "Kruhy kyčlí – 60 sekund.",
        "10 dřepů s vlastní hmotností.",
        "Přeložení vpřed – 60 sekund.",
        "Pohyb kočky-krávy nebo hřbetu — 60 sekund.",
        "Snadné dýchání – 60 sekund."
      ]
    },
    "simple-nutrition": {
      "title": "Jednoduchá výživa",
      "description": "Usnadněte pochopení jednoho jídla.",
      "action": "Sestavte si jedno jednoduché jídlo",
      "outcome": "Dokončete 5 jednoduchých jídel",
      "steps": [
        "Vyberte si jeden zdroj bílkovin.",
        "Přidejte jedno ovoce nebo zeleninu.",
        "Přidejte jeden praktický sacharid.",
        "Jezte bez rolování telefonu."
      ]
    },
    "sleep-anchor": {
      "title": "Spánková kotva",
      "description": "Dejte spánku jednu opakovatelnou kotvu.",
      "action": "Nastavte kotvu spánku",
      "outcome": "Nechte kotvu 5 nocí",
      "steps": [
        "Vyberte si realistický čas zhasnutí světla.",
        "Nastavte budík 15 minut před ním.",
        "Začněte večerní vypnutí na budíku.",
        "Zaznamenejte skutečnou dobu zhasnutí světel."
      ]
    },
    "movement-established": {
      "title": "Pohybový rytmus",
      "description": "Vytvořili jste svůj první tělesný rytmus.",
      "action": "Potvrďte svůj tělesný rytmus",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Zkontrolujte mise těla, které jste dokončili.",
        "Napište jeden rytmus, který můžete dodržet příští měsíc."
      ]
    },
    "first-endurance-trial": {
      "title": "První vytrvalostní zkouška",
      "description": "Jednorázová kontrola mistrovství těla, které jste vybudovali.",
      "action": "Kontrola standardního mistrovství těla",
      "outcome": "Dokončete kontrolu mistrovství těla a energie",
      "steps": [
        "Projděte si mise Body & Energy a milník, který jste dokončili.",
        "Dokončete jedno záměrné 30minutové pohybové sezení.",
        "Napište svůj minimální pohybový standard pro další kapitolu.",
        "Napište jednu spánkovou kotvu a jedno pravidlo hydratace.",
        "Potvrďte, že tato tři pravidla jsou dostatečně realistická, aby bylo možné pokračovat."
      ]
    },
    "mind-root": {
      "title": "Mentální jasnost",
      "description": "Vytvořte si mentální prostor, než se zmocní rozptýlená pozornost.",
      "action": "3minutový mentální reset",
      "outcome": "Dokončeno za 5 dní",
      "steps": [
        "Sedět nebo stát klidně.",
        "Zavřete nesouvisející karty nebo aplikace.",
        "Proveďte 5 pomalých nádechů.",
        "Napište jednu věc, která upoutá vaši pozornost.",
        "Napište další drobnou akci."
      ]
    },
    "reading-ritual": {
      "title": "Rituál čtení",
      "description": "Čtěte dostatečně hluboko, abyste zachovali jednu užitečnou myšlenku.",
      "action": "Přečtěte si 10 stránek nebo 15 minut",
      "outcome": "Dokončete 8 sezení",
      "steps": [
        "Vyberte si knihu, seriózní článek, text kurzu nebo dokumentaci.",
        "Odložte telefon.",
        "Přečtěte si 15 minut nebo 10 stránek.",
        "Napište jednu větu o tom, co jste se naučili."
      ]
    },
    "focus-sprint": {
      "title": "Soustředěný sprint",
      "description": "Chraňte jeden jasný úkol pro krátký blok.",
      "action": "25minutový blok zaostření",
      "outcome": "Dokončete 6 sezení",
      "steps": [
        "Vyberte si jeden jasný úkol.",
        "Nastavte časovač na 25 minut.",
        "Odstraňte rušivé vlivy telefonu.",
        "Pracujte pouze na tomto úkolu.",
        "Napište, co bylo dokončeno."
      ]
    },
    "reflection-note": {
      "title": "Reflexní poznámka",
      "description": "Proměňte den v jednu užitečnou úpravu.",
      "action": "Denní reflexe",
      "outcome": "Dokončete 7 dní",
      "steps": [
        "Napište, co vám dnes dodalo energii.",
        "Napište, co vám ubíralo energii.",
        "Napište jedno malé vylepšení na zítra."
      ]
    },
    "knowledge-seed": {
      "title": "Semínko poznání",
      "description": "Přeložte čtení do použitelné myšlenky.",
      "action": "Ušetřete jeden užitečný nápad",
      "outcome": "Uložte si 5 užitečných nápadů",
      "steps": [
        "Vyberte jeden nápad ze svého čtení.",
        "Napište to vlastními slovy.",
        "Přidejte jedno možné použití v reálném životě."
      ]
    },
    "deep-work-gate": {
      "title": "Brána hluboké práce",
      "description": "Zaměřte pozornost na jeden smysluplný úkol.",
      "action": "45minutová chráněná relace",
      "outcome": "Dokončete 3 sezení",
      "steps": [
        "Vyberte si jeden smysluplný úkol.",
        "Nastavte časovač na 45 minut.",
        "Žádný telefon, chat ani přepínání.",
        "Pracujte, dokud časovač neskončí.",
        "Napište výsledek jednou větou."
      ]
    },
    "self-awareness": {
      "title": "Sebeuvědomění",
      "description": "Všimněte si jednoho opakovaného mentálního vzorce.",
      "action": "Pojmenujte jeden vzor",
      "outcome": "Zaznamenejte 3 opakující se vzory",
      "steps": [
        "Zkontrolujte si poznámky k úvahám.",
        "Zakroužkujte jeden opakovaný výtok nebo spoušť.",
        "Napište jednu odpověď, kterou chcete otestovat."
      ]
    },
    "mind-awake": {
      "title": "Probuzená mysl",
      "description": "Vaše pozornost má nyní základní provozní rytmus.",
      "action": "Potvrďte svůj rytmus pozornosti",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Zkontrolujte své dokončené cílené mise.",
        "Napište cvičení, ve kterém budete pokračovat."
      ]
    },
    "attention-trial": {
      "title": "Zkouška pozornosti",
      "description": "Jednorázové vyšetření chráněné pozornosti a reflexe.",
      "action": "Kontrola mistrovství chráněné pozornosti",
      "outcome": "Dokončete kontrolu mistrovství soustředění a mysli",
      "steps": [
        "Zkontrolujte své pokroky ve čtení, reflexi a soustředění.",
        "Vyberte si jeden smysluplný úkol.",
        "Dokončete jednu chráněnou 45minutovou relaci zaostření bez přepínání.",
        "Napište, co pomohlo a co se pokusilo zlomit vaši pozornost.",
        "Napište jedno pravidlo osobního zaměření pro další kapitolu."
      ]
    },
    "finance-root": {
      "title": "Povědomí o penězích",
      "description": "Vidíte peníze jasně bez tlaku.",
      "action": "Vytvořte Money Snapshot",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Napište aktuální zůstatek na účtu.",
        "Napište očekávaný příjem za tento měsíc.",
        "Napište fixní výdaje.",
        "Napište: Můj největší únik peněz může být..."
      ]
    },
    "expense-tracking": {
      "title": "Sledování výdajů",
      "description": "Zviditelněte každodenní výdaje.",
      "action": "Sledujte každou platbu ještě dnes",
      "outcome": "Sledovat 10 celých dní",
      "steps": [
        "Uveďte každou platbu na konci dne.",
        "Zahrňte platby v hotovosti, kartou a online.",
        "Ke každé platbě přidejte kategorii."
      ]
    },
    "spending-categories": {
      "title": "Kategorie výdajů",
      "description": "Dejte každému výdaji jasné místo.",
      "action": "Vytvořte kategorie výdajů",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Vytvářejte kategorie bydlení, jídlo, doprava, předplatné, zábava, dluh, spoření a další.",
        "Přesuňte do nich nedávné výdaje."
      ]
    },
    "savings-seed": {
      "title": "Základ úspor",
      "description": "Začněte tvořit rezervu realistickou částkou.",
      "action": "Dejte stranou malé množství",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Vyberte si jakoukoli reálnou částku.",
        "Přesuňte jej do úsporného nebo samostatného prostoru.",
        "Napište, proč na tomto bufferu záleží."
      ]
    },
    "spending-pattern": {
      "title": "Výdajový vzor",
      "description": "Najděte chování za čísly.",
      "action": "Recenze 7 sledovaných dnů",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Prohlédněte si posledních 7 sledovaných dnů.",
        "Najděte 3 hlavní kategorie výdajů.",
        "Napište jeden zvyk utrácení, který byste měli sledovat."
      ]
    },
    "budget-snapshot": {
      "title": "Snímek rozpočtu",
      "description": "Vytvořte jednoduchý měsíční náhled.",
      "action": "Vytvořte zobrazení měsíčního rozpočtu",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Seznam měsíčních příjmů.",
        "Uveďte fixní náklady.",
        "Odhad variabilních nákladů.",
        "Napište dostupnou částku po započtení nákladů."
      ]
    },
    "emergency-buffer": {
      "title": "Nouzová rezerva",
      "description": "Definujte malý první bezpečnostní cíl.",
      "action": "Určete svou první rezervu",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Vyberte si malý první cíl.",
        "Napište, kde peníze zůstanou.",
        "Napište, co se považuje za nouzovou situaci."
      ]
    },
    "financial-visibility": {
      "title": "Finanční viditelnost",
      "description": "Nyní můžete vidět svůj základní peněžní systém.",
      "action": "Potvrďte finanční viditelnost",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Zkontrolujte svůj snímek a sledování.",
        "Napište jedno číslo, které budete každý týden kontrolovat."
      ]
    },
    "money-clarity-trial": {
      "title": "Zkouška finanční jasnosti",
      "description": "Jednorázová recenze vašeho prvního praktického peněžního systému.",
      "action": "Kontrola mistrovství čistoty peněz",
      "outcome": "Dokončete kontrolu mistrovství peněz a svobody",
      "steps": [
        "Zkontrolujte své sledování výdajů a aktuální přehled rozpočtu.",
        "Napište své tři hlavní vzorce výdajů.",
        "Identifikujte vzor s nejvyššími náklady nebo stresem.",
        "Vytvořte jedno jasné peněžní pravidlo pro další kapitolu.",
        "Potvrďte, kdy a jak toto pravidlo přezkoumáte."
      ]
    },
    "business-root": {
      "title": "Myšlení tvůrce",
      "description": "Proměňte jeden nápad ve viditelný výstup.",
      "action": "Vyberte si jednu malou věc, kterou chcete postavit",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Napište 3 nápady na malý projekt.",
        "Vyberte si nejmenší.",
        "Definice hotová jednou větou.",
        "Nastavte první akci na 30 minut."
      ]
    },
    "project-definition": {
      "title": "Definice projektu",
      "description": "Dejte malému projektu jasný okraj a konečnou čáru.",
      "action": "Napište jednostránkový stručný projekt",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Pojmenujte, komu tento projekt pomáhá.",
        "Napište problém jednou větou.",
        "Uveďte nejmenší užitečný výstup.",
        "Napište, co je výslovně mimo projekt."
      ]
    },
    "idea-capture": {
      "title": "Zachycení nápadů",
      "description": "Vytvářejte možnosti, aniž byste je posuzovali příliš brzy.",
      "action": "Zachyťte 10 syrových nápadů",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Otevřete poznámky.",
        "Napište 10 nápadů s jednou větou.",
        "Zatím je nesuďte ani nezkoumejte."
      ]
    },
    "project-sprint": {
      "title": "Projektový sprint",
      "description": "Posuňte jeden projekt vpřed v chráněném bloku.",
      "action": "30minutový projektový sprint",
      "outcome": "Dokončete 5 sezení",
      "steps": [
        "Vyberte jeden projekt.",
        "Před spuštěním definujte jeden výstup.",
        "Pracujte 30 minut.",
        "Uložte nebo napište, co se změnilo."
      ]
    },
    "idea-filter": {
      "title": "Filtr nápadů",
      "description": "Vyberte si užitečný nápad, ne ten nejhlasitější.",
      "action": "Zabodujte a vyberte si jeden nápad",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Ohodnoťte každý nápad 1–5 za užitečnost.",
        "Lehkost skóre.",
        "Bodujte osobní zájem.",
        "Pokračujte výběrem jednoho nápadu."
      ]
    },
    "first-asset": {
      "title": "První aktivum",
      "description": "Vytvořte něco, co může vidět jiný člověk.",
      "action": "Vytvořte jedno viditelné dílo",
      "outcome": "Vytvořte 2 viditelné položky",
      "steps": [
        "Vytvořte dokument, prototyp, tabulku, maketu, demo, vstupní sekci nebo veřejnou poznámku.",
        "Uložte viditelnou verzi."
      ]
    },
    "ship-tiny": {
      "title": "Malé vydání",
      "description": "Získejte zpětnou vazbu před leštěním navždy.",
      "action": "Ukažte práci jedné osobě",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Vyberte jedno aktivum.",
        "Pošlete to jedné osobě.",
        "Zeptejte se: Co je nejasné?",
        "Uložte zpětnou vazbu."
      ]
    },
    "creator-started": {
      "title": "Probuzený tvůrce",
      "description": "Nyní měníte nápady na viditelné artefakty.",
      "action": "Potvrďte svůj Builder Rhythm",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Zkontrolujte, co jste postavili.",
        "Napište další nejmenší výstup."
      ]
    },
    "tiny-launch-trial": {
      "title": "Zkouška malého spuštění",
      "description": "Jednorázová kontrola prvního systému tvorby a zveřejnění.",
      "action": "Drobná kontrola spouštění",
      "outcome": "Dokončete kontrolu mistrovství Build & Create",
      "steps": [
        "Zkontrolujte práci na projektu a viditelná aktiva, která jste dokončili.",
        "Vyberte si jeden užitečný majetek, který lze dokončit nebo jednoznačně vylepšit ještě dnes.",
        "Dokončete a uložte viditelnou verzi.",
        "Ukažte, publikujte nebo záměrně archivujte tuto verzi.",
        "Napište své nejmenší opakovatelné pravidlo zveřejnění pro další kapitolu."
      ]
    },
    "career-root": {
      "title": "Směr kariéry",
      "description": "Jasně uvidíte svou profesionální pozici.",
      "action": "Napište svůj aktuální směr",
      "outcome": "Dokončete 1krát",
      "steps": [
        "co mám teď dělat?",
        "co rád dělám?",
        "Co mě vysává?",
        "Jaká dovednost by mohla rozšířit mé možnosti?"
      ]
    },
    "opportunity-scan": {
      "title": "Průzkum příležitostí",
      "description": "Než si sami zvolíte směr, podívejte se na skutečné možnosti.",
      "action": "Zkontrolujte tři skutečné příležitosti",
      "outcome": "Projděte si 3 reálné příležitosti",
      "steps": [
        "Najděte tři role, projekty nebo cesty, které vás zajímají.",
        "Napište opakované dovednosti, které požadují.",
        "Zakroužkujte jeden vzor, který stojí za to prozkoumat."
      ]
    },
    "skill-inventory": {
      "title": "Inventář dovedností",
      "description": "Zviditelněte svou stávající schopnost.",
      "action": "Vytvořte inventář dovedností",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Vyjmenujte technické dovednosti.",
        "Vyjmenujte komunikační a organizační dovednosti.",
        "Vyjmenujte řešení problémů, jazyky a nástroje."
      ]
    },
    "learning-block": {
      "title": "Výukový blok",
      "description": "Prostudujte si jedno téma, které rozšíří vaše možnosti.",
      "action": "30minutový výukový blok",
      "outcome": "Dokončete 5 sezení",
      "steps": [
        "Vyberte jedno téma související s kariérou.",
        "Učte se 30 minut.",
        "Napište 3 poznámky.",
        "Napište jedno možné použití."
      ]
    },
    "proof-item": {
      "title": "Důkaz dovednosti",
      "description": "Vytvářejte důkazy namísto pouhého tvrzení o dovednosti.",
      "action": "Vytvořte jeden důkaz dovednosti",
      "outcome": "Vytvořte 3 důkazní položky",
      "steps": [
        "Vytvořte snímek obrazovky, mini případovou studii, dokument, GitHub commit, procesní poznámku nebo příklad před/po.",
        "Uložte si to tam, kde to najdete."
      ]
    },
    "skill-gap": {
      "title": "Dovednostní mezera",
      "description": "Vyberte jednu užitečnou mezeru, kterou chcete uzavřít.",
      "action": "Vyberte jednu mezeru mezi dovednostmi",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Zkontrolujte svůj inventář.",
        "Vyberte jednu chybějící dovednost.",
        "Definujte první krok učení.",
        "Naplánujte si jeden výukový blok."
      ]
    },
    "career-signal": {
      "title": "Kariérní signál",
      "description": "Aktualizujte jeden profesionální povrch, který mohou lidé vidět.",
      "action": "Aktualizujte jeden profesionální signál",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Vyberte si životopis, LinkedIn, portfolio, GitHub README nebo sekci webu.",
        "Aktualizujte jej jedním jasným důkazem nebo prohlášením o směru."
      ]
    },
    "direction-found": {
      "title": "Směr nalezen",
      "description": "Máte za sebou směr a první důkazy.",
      "action": "Potvrďte svůj směr",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Zkontrolujte své dovednosti a důkazy.",
        "Napište další profesionální krok jednou větou."
      ]
    },
    "professional-signal-trial": {
      "title": "Zkouška profesního signálu",
      "description": "Jednorázová kontrola připravenosti pro profesionální vedení a důkazy.",
      "action": "Profesionální kontrola mistrovství směru",
      "outcome": "Dokončete kontrolu mistrovství směru a kariéry",
      "steps": [
        "Zkontrolujte své dovednosti, důkazy a dokončené výukové bloky.",
        "Vyberte profesionální signál, který nejvíce potřebuje zlepšení.",
        "Aktualizujte jeden životopis, profil, portfolio, soubor README nebo povrch případové studie.",
        "Napište jednu větu popisující směr, kterým tento signál podporuje.",
        "Napište další položku důkazu, kterou vytvoříte v další kapitole."
      ]
    },
    "relationships-root": {
      "title": "Sociální signál",
      "description": "Vytvořte záměrný kontakt bez sociálního tlaku.",
      "action": "Pošlete jednu záměrnou zprávu",
      "outcome": "Dokončete 5krát",
      "steps": [
        "Vyberte jednu osobu.",
        "Pošlete skutečnou zprávu, nejen emotikony.",
        "Položte jednoduchou otázku nebo sdílejte něco relevantního.",
        "Nečekejte okamžitou odpověď."
      ]
    },
    "weekly-check-in": {
      "title": "Týdenní kontakt",
      "description": "Udržujte kontakt s někým, na kom vám záleží.",
      "action": "Ohlásit se s někým",
      "outcome": "Dokončete 4krát",
      "steps": [
        "Vyberte si někoho, na čem záleží.",
        "Odeslat: Jak se daří v poslední době? nebo jsem si na tebe vzpomněl, protože..."
      ]
    },
    "meaningful-conversation": {
      "title": "Smysluplná konverzace",
      "description": "Věnujte jednomu rozhovoru plnou pozornost.",
      "action": "15 minut skutečné konverzace",
      "outcome": "Dokončete 3 konverzace",
      "steps": [
        "Mluvte pomocí hovoru, hlasu, videa nebo osobně.",
        "Zeptejte se alespoň na jednu skutečnou otázku.",
        "Poslouchejte bez multitaskingu.",
        "Napište: Naučil jsem se..."
      ]
    },
    "help-offered": {
      "title": "Nabízená pomoc",
      "description": "Nabídněte něco konkrétního a užitečného.",
      "action": "Nabídněte konkrétní pomoc",
      "outcome": "Dokončete 2krát",
      "steps": [
        "Vyberte jednu osobu.",
        "Nabídněte něco konkrétního, například kontrolu dokumentu.",
        "Vyhněte se vágním nabídkám, jako je dejte mi vědět."
      ]
    },
    "gratitude-note": {
      "title": "Poznámka vděčnosti",
      "description": "Udělejte ocenění konkrétní místo předpokládaného.",
      "action": "Pošlete jedno konkrétní poděkování",
      "outcome": "Pošlete 2 poděkování",
      "steps": [
        "Vyberte jednu osobu.",
        "Pojmenujte přesně to, co oceňujete.",
        "Stručně vysvětlete, proč na tom záleželo."
      ]
    },
    "shared-time": {
      "title": "Sdílený čas",
      "description": "Proměňte dobré úmysly v čas v kalendáři.",
      "action": "Uspořádejte jeden sdílený okamžik",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Vyberte jednu osobu.",
        "Nabídněte konkrétní den a aktivitu.",
        "Udržujte plán malý a nízkotlaký."
      ]
    },
    "boundary-check": {
      "title": "Kontrola hranic",
      "description": "Chraňte připojení před odporem a přetížením.",
      "action": "Napište jednu jasnou hranici",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Uveďte jednu interakci, která vás vyčerpává.",
        "Napište, co můžete reálně nabídnout.",
        "Napište jednu uctivou větu, kterou byste mohli použít."
      ]
    },
    "trusted-circle": {
      "title": "Důvěryhodný kruh",
      "description": "Vytvořili jste záměrný rytmus spojení.",
      "action": "Potvrďte svůj rytmus připojení",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Zkontrolujte své nedávné záměrné kontakty.",
        "Vyberte si jeden vztah, který budete nadále pěstovat."
      ]
    },
    "connection-trial": {
      "title": "Zkouška spojení",
      "description": "Jednorázová kontrola vztahů, které se rozhodnete záměrně udržovat.",
      "action": "Záměrná kontrola ovládání připojení",
      "outcome": "Dokončete kontrolu ovládání lidí a připojení",
      "steps": [
        "Zkontrolujte záměrné kontakty a konverzace, které jste dokončili.",
        "Vyberte si jeden vztah, který si zaslouží skutečnou další akci.",
        "Pošlete jednu smysluplnou zprávu nebo naplánujte jednu skutečnou konverzaci.",
        "Napište jedno pravidlo vztahu pro další kapitolu.",
        "Potvrďte hranici, která udržuje toto pravidlo udržitelné."
      ]
    },
    "creativity-root": {
      "title": "Kreativní jiskra",
      "description": "Začněte tvořit namísto pouhé konzumace.",
      "action": "Tvořte 10 minut",
      "outcome": "Dokončete 5 sezení",
      "steps": [
        "Vyberte si skicování, psaní, design, hudbu, fotografii, video, rozvržení nebo koncept.",
        "Tvořte bez posuzování po dobu 10 minut.",
        "Uložte výsledek."
      ]
    },
    "reference-study": {
      "title": "Studium vzoru",
      "description": "Studujte jeden kus, který obdivujete, aniž byste jej kopírovali.",
      "action": "Rozebrat jednu referenci",
      "outcome": "Dokončete 3 referenční studie",
      "steps": [
        "Vyberte si jedno dílo, které obdivujete.",
        "Napište tři možnosti, které tvůrce učinil.",
        "Vyberte si jeden princip, který otestujete ve své vlastní práci."
      ]
    },
    "idea-sketch": {
      "title": "Náčrt nápadu",
      "description": "Proměňte jeden nápad v hrubý viditelný návrh.",
      "action": "Vytvořte jeden hrubý náčrt",
      "outcome": "Dokončete 5 náčrtů",
      "steps": [
        "Vyberte jeden nápad.",
        "Udělejte hrubý návrh.",
        "Dovolte, aby to bylo ošklivé.",
        "Uložte to."
      ]
    },
    "creative-session": {
      "title": "Tvůrčí sezení",
      "description": "Zůstaňte u jednoho kusu dostatečně dlouho na vytvoření verze.",
      "action": "30minutová kreativní relace",
      "outcome": "Dokončete 4 sezení",
      "steps": [
        "Vyberte si jeden kreativní kousek.",
        "Nastavte časovač na 30 minut.",
        "Neupravujte příliš.",
        "Vytvořte viditelnou verzi."
      ]
    },
    "publish-small": {
      "title": "Malé zveřejnění",
      "description": "Dejte malému výstupu jasný cíl.",
      "action": "Sdílejte jeden malý výstup",
      "outcome": "Dokončete 2krát",
      "steps": [
        "Pošlete jej příteli, zveřejněte soukromě, uložte do portfolia, publikujte koncept nebo jej archivujte ve složce projektu."
      ]
    },
    "creative-artifact": {
      "title": "Kreativní artefakt",
      "description": "Dokončete jeden malý kreativní objekt.",
      "action": "Dokonči jeden malý artefakt",
      "outcome": "Dokonči 2 artefakty",
      "steps": [
        "Vyberte obrázek, text, koncept videa, design, hudební smyčku, koncepční desku nebo koncept článku.",
        "Dokončete verzi, kterou můžete uložit nebo sdílet."
      ]
    },
    "creative-flame": {
      "title": "Kreativní plamen",
      "description": "Nyní vytváříte viditelné dílo opakovaně.",
      "action": "Potvrďte svůj kreativní rytmus",
      "outcome": "Dokončete 1krát",
      "steps": [
        "Zkontrolujte uložené výstupy.",
        "Pokračujte výběrem jednoho cvičení."
      ]
    },
    "creation-trial": {
      "title": "Zkouška tvorby",
      "description": "Jednorázová kontrola mistrovství pro přeměnu praxe v hotový artefakt.",
      "action": "Kontrola zvládnutí kreativních artefaktů",
      "outcome": "Dokončete kontrolu zvládnutí kreativní praxe",
      "steps": [
        "Zkontrolujte výstupy kreativ, které jste dokončili.",
        "Vyberte jeden artefakt, který může dosáhnout jasné hotové verze.",
        "Dokončete nebo smysluplně vyleštěte ten artefakt.",
        "Uložte, archivujte nebo sdílejte konečnou verzi.",
        "Napište jedno pravidlo kreativní praxe pro další kapitolu."
      ]
    },
    "awakening-trial": {
      "title": "Zkouška probuzení",
      "description": "Závěrečná jednorázová zkouška před vstupem do Vnitřního řádu.",
      "action": "Projděte si kapitolu, dokažte vyvážené jednání a napište osobní systém, který ponesete do Vnitřního řádu.",
      "outcome": "Dokončete kontrolu zvládnutí kapitoly alespoň ve 4 větvích",
      "steps": [
        "Zkontrolujte alespoň čtyři dokončené milníky pobočky.",
        "Vyberte si tři praktiky, které přenesete do Vnitřního řádu.",
        "Dokončete během této zkoušky jednu konkrétní akci ze tří různých větví.",
        "Napište minimální pravidlo pro každou zvolenou praxi.",
        "Spojte tato pravidla do jednoho osobního systému pro další kapitolu.",
        "Potvrďte, co vás přiměje pozastavit a revidovat systém místo toho, abyste jej opustili."
      ]
    }
  },
  "uk": {
    "health-root": {
      "title": "Усвідомлення тіла",
      "description": "Навчіться помічати свою енергію, перш ніж намагатися її покращити.",
      "action": "Тричі протягом дня зробіть паузу та оцініть поточний стан свого тіла.",
      "outcome": "Завершити реєстрації за 5 днів",
      "steps": [
        "Припиніть те, що ви робите.",
        "Зробіть 3 повільних вдиху.",
        "Оцініть енергію від 1 до 5.",
        "Оцініть стрес від 1 до 5.",
        "Напишіть: Що на мене зараз впливає?"
      ]
    },
    "morning-walk": {
      "title": "Ранкова прогулянка",
      "description": "Вибудуйте спокійний ритм руху на свіжому повітрі.",
      "action": "Гуляйте на вулиці принаймні 15 хвилин безперервно.",
      "outcome": "Виконайте 8 ходів",
      "steps": [
        "Залиште дім чи роботу.",
        "Ходіть безперервно не менше 15 хвилин.",
        "Не поєднуйте це з покупками чи справами.",
        "Тримайте прокрутку телефону закритою."
      ]
    },
    "hydration": {
      "title": "Водний баланс",
      "description": "Поставте воду перед стимуляторами.",
      "action": "Вода перед кофеїном",
      "outcome": "Завершити за 10 днів",
      "steps": [
        "Наповніть склянку або пляшку.",
        "Пити не менше 300 мл.",
        "Робіть це перед кавою, енергетичним напоєм або газованою водою.",
        "Позначте повним тільки після вживання."
      ]
    },
    "evening-shutdown": {
      "title": "Завершення дня",
      "description": "Створіть навмисне завершення дня.",
      "action": "Вимкнення на 10 хвилин",
      "outcome": "Пройдіть 7 вечорів",
      "steps": [
        "Відкладіть телефон або ввімкніть режим «не турбувати».",
        "Приготуйте найнеобхідніше на завтра.",
        "Напиши: Завтра починається з...",
        "Вимкніть непотрібне світло."
      ]
    },
    "daily-movement": {
      "title": "Щоденний рух",
      "description": "Зробіть навмисний рух звичайним сеансом.",
      "action": "20 хвилин руху",
      "outcome": "Пройдіть 6 сеансів",
      "steps": [
        "Виберіть швидку ходьбу, їзду на велосипеді, сходи, рух додому або активну розтяжку.",
        "Навмисно рухайтеся не менше 20 хвилин."
      ]
    },
    "light-cardio": {
      "title": "Легке кардіо",
      "description": "Розвивайте легку аеробну здатність, не перенапружуючись.",
      "action": "Легке кардіо заняття",
      "outcome": "Пройдіть 4 сеанси",
      "steps": [
        "Прогрійте 3 хвилини.",
        "Безперервно рухайтеся протягом 15-20 хвилин.",
        "Зберігайте помірну інтенсивність.",
        "Ви повинні вміти говорити, але не співати."
      ]
    },
    "mobility-primer": {
      "title": "Розминка рухливості",
      "description": "Розкрийте рухливість тіла короткою повторюваною послідовністю.",
      "action": "8-хвилинний режим мобільності",
      "outcome": "Пройдіть 6 сеансів",
      "steps": [
        "Круги шиєю — 30 секунд.",
        "Плечові кола — 60 секунд.",
        "Кола стегнами — 60 секунд.",
        "10 присідань з власною вагою.",
        "Згин вперед — 60 секунд.",
        "Кішка-корова або рухливість спини — 60 секунд.",
        "Легке дихання — 60 секунд."
      ]
    },
    "simple-nutrition": {
      "title": "Просте харчування",
      "description": "Зробіть один прийом їжі легшим для розуміння.",
      "action": "Зробіть одну просту їжу",
      "outcome": "Заповніть 5 простих прийомів їжі",
      "steps": [
        "Виберіть одне джерело білка.",
        "Додайте один фрукт або овоч.",
        "Додайте один практичний вуглевод.",
        "Їжте без прокручування телефону."
      ]
    },
    "sleep-anchor": {
      "title": "Якір сну",
      "description": "Дайте сну один повторюваний якір.",
      "action": "Встановіть прив’язку сну",
      "outcome": "Якір тримати 5 ночей",
      "steps": [
        "Виберіть реалістичний час відключення світла.",
        "Постав будильник за 15 хвилин до нього.",
        "Почніть вечірнє відключення по будильнику.",
        "Запишіть фактичний час відключення світла."
      ]
    },
    "movement-established": {
      "title": "Сталий руховий ритм",
      "description": "Ви створили свій перший ритм тіла.",
      "action": "Підтвердьте свій ритм тіла",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перегляньте місії, які ви виконали.",
        "Напишіть один ритм, якого ви можете дотримуватися наступного місяця."
      ]
    },
    "first-endurance-trial": {
      "title": "Перше випробування на витривалість",
      "description": "Одноразова перевірка майстерності створеної вами системи тіла.",
      "action": "Перевірка майстерності стандарту тіла",
      "outcome": "Завершіть перевірку майстерності тіла та енергії",
      "steps": [
        "Перегляньте місії Body & Energy і етапи, які ви завершили.",
        "Виконайте одну навмисну 30-хвилинну сесію руху.",
        "Напишіть свій мінімальний стандарт руху для наступного розділу.",
        "Напишіть одне правило сну та одне правило гідратації.",
        "Переконайтеся, що ці три правила є достатньо реалістичними для подальшого використання."
      ]
    },
    "mind-root": {
      "title": "Ментальна ясність",
      "description": "Створіть розумовий простір, перш ніж розсіяна увага займе верх.",
      "action": "3 хвилини психічного перезавантаження",
      "outcome": "Завершити за 5 днів",
      "steps": [
        "Сидіти або стояти на місці.",
        "Закрийте непов’язані вкладки або програми.",
        "Зробіть 5 повільних вдихів.",
        "Напишіть те, що привертає вашу увагу.",
        "Напишіть наступну маленьку дію."
      ]
    },
    "reading-ritual": {
      "title": "Ритуал читання",
      "description": "Читайте достатньо глибоко, щоб зберегти одну корисну ідею.",
      "action": "Прочитайте 10 сторінок або 15 хвилин",
      "outcome": "Пройдіть 8 сеансів",
      "steps": [
        "Виберіть книгу, серйозну статтю, текст курсу або документацію.",
        "Відкладіть телефон.",
        "Прочитайте 15 хвилин або 10 сторінок.",
        "Напишіть одне речення про те, що ви дізналися."
      ]
    },
    "focus-sprint": {
      "title": "Фокусний спринт",
      "description": "Захистіть одне чітке завдання за короткий блок.",
      "action": "25-хвилинний блок фокусування",
      "outcome": "Пройдіть 6 сеансів",
      "steps": [
        "Виберіть одне чітке завдання.",
        "Встановіть таймер на 25 хвилин.",
        "Усуньте відволікання телефону.",
        "Працюйте тільки над цим завданням.",
        "Напишіть, що виконано."
      ]
    },
    "reflection-note": {
      "title": "Нотатка-рефлексія",
      "description": "Перетворіть день на одне корисне налаштування.",
      "action": "Щоденні роздуми",
      "outcome": "Виконайте 7 днів",
      "steps": [
        "Напишіть, що додало вам енергії сьогодні.",
        "Напишіть, що забирає вашу енергію.",
        "Напишіть одне маленьке покращення на завтра."
      ]
    },
    "knowledge-seed": {
      "title": "Насіння знань",
      "description": "Переведіть прочитане в корисну ідею.",
      "action": "Збережіть одну корисну ідею",
      "outcome": "Збережіть 5 корисних ідей",
      "steps": [
        "Виберіть одну ідею з прочитаного.",
        "Запишіть це своїми словами.",
        "Додайте одне можливе використання в реальному житті."
      ]
    },
    "deep-work-gate": {
      "title": "Ворота глибокої роботи",
      "description": "Утримуйте увагу на одному значущому завданні.",
      "action": "45-хвилинний захищений сеанс",
      "outcome": "Пройдіть 3 сеанси",
      "steps": [
        "Виберіть одне змістовне завдання.",
        "Встановіть таймер на 45 хвилин.",
        "Без телефону, чату чи перемикання.",
        "Працюйте до закінчення таймера.",
        "Запишіть результат одним реченням."
      ]
    },
    "self-awareness": {
      "title": "Самосвідомість",
      "description": "Зверніть увагу на один повторюваний розумовий шаблон.",
      "action": "Назвіть один зразок",
      "outcome": "Запишіть 3 повторювані візерунки",
      "steps": [
        "Перегляньте свої нотатки для роздумів.",
        "Обведіть один повторний злив або тригер.",
        "Напишіть одну відповідь, яку хочете перевірити."
      ]
    },
    "mind-awake": {
      "title": "Пробудження розуму",
      "description": "Тепер ваша увага має основний робочий ритм.",
      "action": "Підтвердьте свій ритм уваги",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перегляньте виконані цільові завдання.",
        "Напишіть практику, яку ви будете продовжувати."
      ]
    },
    "attention-trial": {
      "title": "Випробування уваги",
      "description": "Одноразовий огляд захищеної уваги та рефлексії.",
      "action": "Перевірка майстерності захищеної уваги",
      "outcome": "Завершіть перевірку майстерності концентрації та розуму",
      "steps": [
        "Перегляньте свій прогрес у читанні, роздумах і зосередженості.",
        "Виберіть одне змістовне завдання.",
        "Пройдіть один захищений 45-хвилинний сеанс фокусування без перемикання.",
        "Напишіть, що допомогло, а що спробувало порушити вашу увагу.",
        "Напишіть одне правило особистого фокусування для наступного розділу."
      ]
    },
    "finance-root": {
      "title": "Обізнаність про гроші",
      "description": "Дивіться гроші чітко без тиску.",
      "action": "Створіть моментальний знімок грошей",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Напишіть поточний баланс рахунку.",
        "Напишіть очікуваний дохід цього місяця.",
        "Напишіть постійні витрати.",
        "Напишіть: Мій найбільший витік грошей може бути..."
      ]
    },
    "expense-tracking": {
      "title": "Відстеження витрат",
      "description": "Зробіть видимими щоденні витрати.",
      "action": "Відстежуйте кожен платіж сьогодні",
      "outcome": "Відстежуйте 10 повних днів",
      "steps": [
        "Перерахуйте всі платежі в кінці дня.",
        "Включіть готівку, картку та онлайн-платежі.",
        "Додайте категорію до кожного платежу."
      ]
    },
    "spending-categories": {
      "title": "Категорії витрат",
      "description": "Виділіть кожну витрату.",
      "action": "Створення категорій витрат",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Створіть категорії житло, їжа, транспорт, підписка, розваги, борги, заощадження та інші.",
        "Перенесіть до них останні витрати."
      ]
    },
    "savings-seed": {
      "title": "Початок заощаджень",
      "description": "Почніть буфер з реалістичної суми.",
      "action": "Відкладіть невелику суму",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Вибирайте будь-яку реальну суму.",
        "Перемістіть його в заощадження або окреме місце.",
        "Напишіть, чому цей буфер важливий."
      ]
    },
    "spending-pattern": {
      "title": "Шаблон витрат",
      "description": "Знайдіть поведінку за числами.",
      "action": "Перегляньте 7 відстежених днів",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перегляньте останні 7 відстежених днів.",
        "Знайдіть 3 найбільші категорії витрат.",
        "Напишіть одну звичку витрачати, на яку слід звернути увагу."
      ]
    },
    "budget-snapshot": {
      "title": "Знімок бюджету",
      "description": "Створіть простий місячний перегляд.",
      "action": "Створіть місячний бюджет",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перелічіть місячний дохід.",
        "Перелічіть постійні витрати.",
        "Оцініть змінні витрати.",
        "Напишіть доступну суму після витрат."
      ]
    },
    "emergency-buffer": {
      "title": "Резерв безпеки",
      "description": "Визначте невелику першу ціль безпеки.",
      "action": "Визначте свій перший буфер",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Виберіть маленьку першу мішень.",
        "Напишіть де будуть гроші.",
        "Напишіть, що вважається надзвичайною ситуацією."
      ]
    },
    "financial-visibility": {
      "title": "Фінансова ясність",
      "description": "Тепер ви можете побачити свою базову грошову систему.",
      "action": "Підтвердьте фінансову доступність",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перегляньте свій знімок і відстеження.",
        "Напишіть одне число, яке ви переглядатимете щотижня."
      ]
    },
    "money-clarity-trial": {
      "title": "Випробування фінансової ясності",
      "description": "Одноразовий огляд вашої першої практичної грошової системи.",
      "action": "Перевірка володіння ясністю грошей",
      "outcome": "Пройдіть перевірку майстерності «Гроші та свобода».",
      "steps": [
        "Перегляньте відстеження витрат і знімок поточного бюджету.",
        "Напишіть ваші три основні моделі витрат.",
        "Визначте схему з найбільшою вартістю або стресом.",
        "Створіть одне чітке грошове правило для наступного розділу.",
        "Підтвердьте, коли і як ви переглядатимете це правило."
      ]
    },
    "business-root": {
      "title": "Мислення творця",
      "description": "Перетворіть одну ідею на видимий результат.",
      "action": "Виберіть одну маленьку річ для будівництва",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Напишіть 3 ідеї невеликих проектів.",
        "Вибирайте найменший.",
        "Визначте закінчене одним реченням.",
        "Встановіть першу дію протягом 30 хвилин."
      ]
    },
    "project-definition": {
      "title": "Визначення проєкту",
      "description": "Надайте невеликому проекту чітку грань і фінішну лінію.",
      "action": "Напишіть односторінкове резюме проекту",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Назвіть людину, якій цей проект допомагає.",
        "Запишіть задачу одним реченням.",
        "Перелічіть найменший корисний результат.",
        "Напишіть те, що явно знаходиться за межами проекту."
      ]
    },
    "idea-capture": {
      "title": "Збір ідей",
      "description": "Створюйте варіанти, не оцінюючи їх занадто рано.",
      "action": "Зафіксуйте 10 необроблених ідей",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Відкрити нотатки.",
        "Напишіть 10 ідей з одного речення.",
        "Поки що не судіть і не досліджуйте їх."
      ]
    },
    "project-sprint": {
      "title": "Спринт проєкту",
      "description": "Перемістіть один проект вперед у захищеному блоці.",
      "action": "30-хвилинний проектний спринт",
      "outcome": "Пройдіть 5 сеансів",
      "steps": [
        "Виберіть один проект.",
        "Визначте один вихід перед початком.",
        "Працюйте 30 хвилин.",
        "Збережіть або напишіть, що змінилося."
      ]
    },
    "idea-filter": {
      "title": "Фільтр ідей",
      "description": "Вибирайте корисну ідею, а не найгучнішу.",
      "action": "Оцініть і виберіть одну ідею",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Оцініть корисність кожної ідеї від 1 до 5.",
        "Легкість оцінки.",
        "Оцініть особистий інтерес.",
        "Виберіть одну ідею, щоб продовжити."
      ]
    },
    "first-asset": {
      "title": "Перший актив",
      "description": "Створіть те, що може бачити інша людина.",
      "action": "Створіть один видимий ресурс",
      "outcome": "Створіть 2 видимі ресурси",
      "steps": [
        "Створіть документ, прототип, електронну таблицю, макет, демонстрацію, цільовий розділ або публічну замітку.",
        "Збережіть видиму версію."
      ]
    },
    "ship-tiny": {
      "title": "Малий запуск",
      "description": "Отримайте відгук перед поліруванням назавжди.",
      "action": "Покажіть роботу одній людині",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Виберіть один актив.",
        "Надішліть його одній людині.",
        "Запитайте: що незрозуміло?",
        "Збережіть відгук."
      ]
    },
    "creator-started": {
      "title": "Творець пробуджений",
      "description": "Тепер ви перетворюєте ідеї на видимі артефакти.",
      "action": "Підтвердьте свій ритм Builder",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перегляньте те, що ви побудували.",
        "Запишіть наступний найменший результат."
      ]
    },
    "tiny-launch-trial": {
      "title": "Випробування малого запуску",
      "description": "Одноразовий чек на доставку вашої першої системи побудови.",
      "action": "Перевірка майстерності Tiny Launch",
      "outcome": "Завершіть перевірку майстерності «Створювати та створювати».",
      "steps": [
        "Перегляньте проектну роботу та видимі активи, які ви завершили.",
        "Виберіть один корисний актив, який можна завершити або значно покращити сьогодні.",
        "Заповніть і збережіть видиму версію.",
        "Покажіть, опублікуйте або навмисно заархівуйте цю версію.",
        "Напишіть своє найменше повторюване правило доставки для наступного розділу."
      ]
    },
    "career-root": {
      "title": "Напрямок кар'єри",
      "description": "Чітко бачите свою професійну позицію.",
      "action": "Напишіть свій поточний напрямок",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Що мені тепер робити?",
        "Що я люблю робити?",
        "Що виснажує мене?",
        "Які навички можуть збільшити мої можливості?"
      ]
    },
    "opportunity-scan": {
      "title": "Сканування можливостей",
      "description": "Подивіться на реальні варіанти, перш ніж вибрати напрямок окремо.",
      "action": "Перегляньте три реальні можливості",
      "outcome": "Перегляньте 3 реалістичні можливості",
      "steps": [
        "Знайдіть три ролі, проекти або шляхи, які вас цікавлять.",
        "Напишіть повторювані навички, які вони вимагають.",
        "Обведіть одну модель, яку варто дослідити."
      ]
    },
    "skill-inventory": {
      "title": "Інвентаризація навичок",
      "description": "Зробіть видимими свої наявні здібності.",
      "action": "Створіть перелік навичок",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перелічіть технічні навики.",
        "Перелічіть комунікативні та організаційні навички.",
        "Перелічіть способи вирішення проблем, мови та інструменти."
      ]
    },
    "learning-block": {
      "title": "Навчальний блок",
      "description": "Вивчіть одну тему, яка розширить ваші можливості.",
      "action": "30-хвилинний навчальний блок",
      "outcome": "Пройдіть 5 сеансів",
      "steps": [
        "Виберіть одну актуальну для кар’єри тему.",
        "Навчіться 30 хвилин.",
        "Напишіть 3 ноти.",
        "Напишіть одне можливе використання."
      ]
    },
    "proof-item": {
      "title": "Доказовий елемент",
      "description": "Створюйте докази, а не лише заявляйте про вміння.",
      "action": "Створіть один доказ навичок",
      "outcome": "Створіть 3 докази",
      "steps": [
        "Створіть знімок екрана, міні-кейс, документ, коміт GitHub, примітку про процес або приклад до/після.",
        "Збережіть його там, де його можна знайти."
      ]
    },
    "skill-gap": {
      "title": "Прогалина в навичках",
      "description": "Виберіть одну корисну прогалину, щоб закрити.",
      "action": "Виберіть одну прогалину навичок",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перегляньте свій інвентар.",
        "Виберіть один навик, якого не вистачає.",
        "Визначте перший крок навчання.",
        "Заплануйте один навчальний блок."
      ]
    },
    "career-signal": {
      "title": "Кар'єрний сигнал",
      "description": "Оновіть одну професійну поверхню, яку бачать люди.",
      "action": "Оновіть один професійний сигнал",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Виберіть резюме, LinkedIn, портфоліо, GitHub README або розділ веб-сайту.",
        "Оновіть його одним чітким доказом або заявою про вказівку."
      ]
    },
    "direction-found": {
      "title": "Напрямок знайдено",
      "description": "У вас є напрямок і перші докази за ним.",
      "action": "Підтвердьте свій напрямок",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перегляньте свої навички та докази.",
        "Наступний професійний хід запишіть одним реченням."
      ]
    },
    "professional-signal-trial": {
      "title": "Професійне випробування сигналу",
      "description": "Одноразова перевірка готовності до професійного спрямування та доказів.",
      "action": "Перевірка професійного спрямування",
      "outcome": "Завершіть перевірку майстерності напряму та кар’єри",
      "steps": [
        "Перегляньте свої навички, контрольні елементи та завершені навчальні блоки.",
        "Виберіть професійний сигнал, який найбільше потребує покращення.",
        "Оновіть одне резюме, профіль, портфоліо, README або кейс-стаді.",
        "Напишіть одне речення, що описує напрямок, який підтримує цей сигнал.",
        "Напишіть наступний елемент перевірки, який ви створите в наступному розділі."
      ]
    },
    "relationships-root": {
      "title": "Соціальний сигнал",
      "description": "Створіть навмисний контакт без соціального тиску.",
      "action": "Надіслати одне навмисне повідомлення",
      "outcome": "Виконайте 5 разів",
      "steps": [
        "Виберіть одну людину.",
        "Надішліть справжнє повідомлення, а не лише емодзі.",
        "Задайте просте запитання або поділіться чимось актуальним.",
        "Не чекайте миттєвої відповіді."
      ]
    },
    "weekly-check-in": {
      "title": "Щотижневий контакт",
      "description": "Підтримуйте зв’язок із важливою людиною.",
      "action": "Зареєструватися з кимось",
      "outcome": "Виконайте 4 рази",
      "steps": [
        "Виберіть того, хто має значення.",
        "Надіслати: як справи останнім часом? або я запам'ятав тебе тому що..."
      ]
    },
    "meaningful-conversation": {
      "title": "Змістовна розмова",
      "description": "Приділіть одній розмові всю увагу.",
      "action": "15-хвилинна справжня розмова",
      "outcome": "Проведіть 3 розмови",
      "steps": [
        "Розмовляйте дзвінком, голосом, відео або особисто.",
        "Задайте хоча б одне реальне запитання.",
        "Слухайте без одночасної роботи.",
        "Напиши: я дізнався..."
      ]
    },
    "help-offered": {
      "title": "Запропонована допомога",
      "description": "Запропонуйте щось конкретне і корисне.",
      "action": "Запропонуйте конкретну допомогу",
      "outcome": "Виконайте 2 рази",
      "steps": [
        "Виберіть одну людину.",
        "Запропонуйте щось конкретне, наприклад ознайомлення з документом.",
        "Уникайте нечітких пропозицій, наприклад, дайте мені знати."
      ]
    },
    "gratitude-note": {
      "title": "Подяка",
      "description": "Зробіть оцінку конкретною, а не припущеною.",
      "action": "Надішліть одну конкретну подяку",
      "outcome": "Надішліть 2 подяки",
      "steps": [
        "Виберіть одну людину.",
        "Назвіть саме те, що вам подобається.",
        "Коротко поясніть, чому це важливо."
      ]
    },
    "shared-time": {
      "title": "Спільний час",
      "description": "Перетворіть добрі наміри на час у календарі.",
      "action": "Організуйте одну спільну мить",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Виберіть одну людину.",
        "Запропонуйте конкретний день і діяльність.",
        "Зберігайте план невеликим і низьким тиском."
      ]
    },
    "boundary-check": {
      "title": "Перевірка меж",
      "description": "Захистіть зв'язок від образ і перевантаження.",
      "action": "Напишіть одну чітку межу",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Назвіть одну взаємодію, яка виснажує вас.",
        "Напишіть те, що ви можете реально запропонувати.",
        "Напишіть одне шанобливе речення, яке можна використати."
      ]
    },
    "trusted-circle": {
      "title": "Довірене коло",
      "description": "Ви створили навмисний ритм зв’язку.",
      "action": "Підтвердьте свій ритм підключення",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перегляньте свої останні навмисні контакти.",
        "Виберіть одні стосунки, які потрібно підтримувати."
      ]
    },
    "connection-trial": {
      "title": "Випробування зв’язку",
      "description": "Одноразовий огляд стосунків, які ви вирішили підтримувати навмисно.",
      "action": "Перевірка навмисного підключення",
      "outcome": "Завершіть перевірку майстерності «Люди та спілкування».",
      "steps": [
        "Перегляньте навмисні контакти та розмови, які ви завершили.",
        "Виберіть стосунки, які заслуговують справжньої наступної дії.",
        "Надішліть одне значуще повідомлення або заплануйте одну справжню розмову.",
        "Напишіть одне правило відносин для наступного розділу.",
        "Підтвердьте межу, яка підтримує це правило."
      ]
    },
    "creativity-root": {
      "title": "Творча іскра",
      "description": "Почніть створювати, а не лише споживати.",
      "action": "Творіть протягом 10 хвилин",
      "outcome": "Пройдіть 5 сеансів",
      "steps": [
        "Виберіть ескіз, письмо, дизайн, музику, фотографію, відео, макет або концепцію.",
        "Творіть, не судячи протягом 10 хвилин.",
        "Збережіть результат."
      ]
    },
    "reference-study": {
      "title": "Вивчення прикладу",
      "description": "Вивчіть один твір, яким ви захоплюєтеся, не копіюючи його.",
      "action": "Розбийте одне посилання",
      "outcome": "Виконайте 3 довідкові дослідження",
      "steps": [
        "Виберіть одну роботу, якою ви захоплюєтеся.",
        "Напишіть три варіанти, зроблені творцем.",
        "Виберіть один принцип для перевірки у власній роботі."
      ]
    },
    "idea-sketch": {
      "title": "Нарис ідеї",
      "description": "Перетворіть одну ідею на приблизний видимий проект.",
      "action": "Зробіть один приблизний ескіз",
      "outcome": "Виконайте 5 ескізів",
      "steps": [
        "Виберіть одну ідею.",
        "Зробіть приблизний проект.",
        "Дозвольте бути негарним.",
        "Збережіть його."
      ]
    },
    "creative-session": {
      "title": "Творча сесія",
      "description": "Залишайтеся з одним шматком достатньо довго, щоб створити версію.",
      "action": "30-хвилинна творча сесія",
      "outcome": "Пройдіть 4 сеанси",
      "steps": [
        "Виберіть один творчий твір.",
        "Встановіть таймер на 30 хвилин.",
        "Не надто редагуйте.",
        "Створіть видиму версію."
      ]
    },
    "publish-small": {
      "title": "Мала публікація",
      "description": "Дайте невеликому результату чітке призначення.",
      "action": "Поділіться одним невеликим результатом",
      "outcome": "Виконайте 2 рази",
      "steps": [
        "Надішліть його другові, опублікуйте приватно, збережіть у портфоліо, опублікуйте чернетку або заархівуйте в папці проекту."
      ]
    },
    "creative-artifact": {
      "title": "Творчий артефакт",
      "description": "Завершіть один маленький творчий об’єкт.",
      "action": "Закінчити один маленький артефакт",
      "outcome": "Закінчити 2 артефакти",
      "steps": [
        "Виберіть зображення, текст, чернетку відео, дизайн, музичний цикл, концептуальну дошку чи чернетку статті.",
        "Завершіть версію, яку можна зберегти або поділитися."
      ]
    },
    "creative-flame": {
      "title": "Творче полум'я",
      "description": "Тепер ви створюєте видиму роботу неодноразово.",
      "action": "Підтвердьте свій творчий ритм",
      "outcome": "Виконайте 1 раз",
      "steps": [
        "Перегляньте збережені результати.",
        "Виберіть одну вправу, щоб продовжити."
      ]
    },
    "creation-trial": {
      "title": "Випробування творчістю",
      "description": "Одноразова перевірка майстерності для перетворення практики в готовий артефакт.",
      "action": "Перевірка майстерності творчого артефакту",
      "outcome": "Виконайте перевірку майстерності «Творча практика».",
      "steps": [
        "Перегляньте творчі результати, які ви завершили.",
        "Виберіть один артефакт, який може досягти чіткої завершеної версії.",
        "Завершіть або значуще відполіруйте цей артефакт.",
        "Збережіть, заархівуйте або поділіться остаточною версією.",
        "Напишіть одне правило творчої практики для наступного розділу."
      ]
    },
    "awakening-trial": {
      "title": "Випробування пробудження",
      "description": "Остання одноразова перевірка майстерності перед входом до внутрішнього порядку.",
      "action": "Перегляньте розділ, доведіть збалансовану дію та напишіть особисту систему, яку ви перенесете у внутрішній порядок.",
      "outcome": "Завершіть перевірку майстерності розділів принаймні в 4 галузях",
      "steps": [
        "Перегляньте принаймні чотири завершені віхи філії.",
        "Виберіть три практики, які ви перенесете у внутрішній порядок.",
        "Виконайте одну конкретну дію з трьох різних гілок під час цього випробування.",
        "Напишіть мінімальне правило для кожної обраної практики.",
        "Об’єднайте ці правила в одну персональну систему для наступного розділу.",
        "Підтвердьте те, що змусить вас зупинитися та переглянути систему, а не відмовлятися від неї."
      ]
    }
  }
} satisfies Record<"cs" | "uk", Record<string, CatalogTranslation>>;
