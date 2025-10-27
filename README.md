# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.


<!-- todos -->

- complex lists
- 2.2.1
- complex lists


Hallo zusammen

Wir sind nun mit der Gestaltung und Programmierung des Handbuchs sehr weit und wir finden, es kommt sehr, sehr toll!

Wir sind jetzt an einem Punkt, an dem wir noch einige Inputs von euch brauchen und die Finale Version des Textes sollte bald so angepasst werden, dass er für das Programm konvertierbar wird. Es gibt zum einen noch einige die Fragen und Konzepte (siehe weiter unten) zu klären und zum andern, muss ich euch noch erklären, wie ihr den Text anpassen könnt.  Dazu würden wir vorschlagen, dass uns bald treffen, hier ist jetzt die Frage: Macht es Sinn, nächste Woche noch ein solches Meeting anzusetzen, bevor Céline aus den Ferien zurück ist (sodass ihr mit der Bearbeitung schon beginnen könnt) oder macht es Sinn, damit bis zu Woche vom 20. Oktober zu warten, bis die Ferien vorbei sind?

Liebe grüsse und bis bald
Jonas

———
Offene Fragen: 
--
Anpassungen am Docx-File:

Zeilenumbrüche
	Word unterscheidet nicht zwischen Return (New Paragraph) und Shift-Return (New Line)

	- muss im Text angepasst werden, damit keine Leerzeilen zwischen Texten entstehen

Links zu Glossar mit Fussnote
	Fussnote darf nicht im Link einbezogen werden, sonst funktioniert das Rendering nicht

	- Falsch: Das Thema [Dekolonisierung (1)]
	- Richtig: Das Thema [Dekolonisierung] (1)

Headings
	Müssen alle als Style im Word hinterlegt sein (es macht keinen Unterschied, wie sie aussehen, müssen nur von "Heading 1-4" definiert sein)
		Typen:
			Heading 1 → Kapitel 
				- Steuert Navigation per URL
				- speziell: [[kurzer title]] kann in Doppelten “[“ am Schluss des Titels hinzugefügt werden.
				- Bsp: 2 Erste Schritte einer rassismus und diskriminierungskritischen Dokumentation [[erste Schritte]]
		
			Heading 2 → Unter-Kapitel 
				- Steuert Navigation per Scroll 
				- Bsp: 2.1 Was ist Rassismus?

			Heading 3 → Unter-Unter-Kapitel
				- Nur Viusell, keine Navigation
				- Bsp: 2.1.1 Rassismus auf der individuellen Ebene
		
			Heading 4 → Absatz-Titel
				- Nur visuell, keine Navigation
				- Bsp: Beispiele Positionierung der Institution, weitere Anlaufstellen, weiterführende Literatur, Autorin, Abstract

		Fragen: 
			- Externe Texte Bsp: Kapitel 3 → soll “Dekolonialisierung der Museen” etc. nicht H2 sein?

Allgemein
	- einfüen von Inline befehlen für die Computer-lesbarkeit des Textes (z. B. [[sart:literature]])
	- Kontrolle, dass alle Format richtig und einheitlich gesetzt sind (Headings, Listen, Blocks etc.)

Designvorschläge und Formatierungen: 

Literatur
	Ist im Text nicht Einheitlich, (manchmal Liste, manchmal nur Text, verschiedene Formatierung von Header)

	- Vorschlage: Als Liste und die Header sind Bold
	bsp: Im Kapitel: Editorial – Weiterführende Literatur, Erste Schritte – Weiterführende Literatur

Boxen:  z. B. Ende von „Erste Schritte“
	Hier war eine einspaltige Tabelle (das kann in Markdown nicht gerendert werden) 
	
	- Vorschlag: umformatieren zu Box ( [[start:block]] [[end:block]] )
	bsp: Im Kapitel: Erste Schritte – Beispiele Positionierung der Institution

Kapitel: 10 Lösungsansätze aus den Sammlungen – Fallbeispiele	
	Vorschalge:
	- Metadaten -> Formatierung mit [[start:metadata]] [[start:before]] [[start:after]]
	- Kontext -> Lauftext
	- Bearbeitung in der Datenbank -> Block (box)
	- bsp: Fallbeispiel 1

Fragen und Unklarheiten:

	- Braucht es die Kapitel Nummerierung im Menu?
	- im Kapitel 7: "Interne Verwendung von Daten – Metadaten in Online-Sammlungen: 5 Ansätze"
		→ Gestaltung und Gliederung ist etwas unklar und sollte besprochen werden
	- Kapitel 11: Vertiefung
		- Ist das nur ein Rahmen für die folgenden Kapitel oder sollten diese unter dem Kapitel sein? Oder folgt noch Text?
	- im About, können die Mitglieder nicht als Tabelle (2 Spaltig), sondern einspaltig dargestellt werden?
 —
———





<!-- 

Anpassungen am Docx-File
	- Zeilenumbrüche
		Word unterscheidet nicht zwischen Return (New Paragraph) und Shift-Return (New Line)
		
	-  muss im Text angepasst werden, damit keine Lehrzeilen zwischen Texten entstehen

	- Links zu Glossar mit Fussnote
		Fussnote darf nicht im Link einbezogen werden, sonst funktioniert das rendering nicht
			Richtig: Das Thema [Dekolonisierung](1)
			Falsch: Das Thema [Dekolonisierung(1)]
		- bsp: Das Thema Dekolonisierung (1) 
		
	- Formatierungen Literatur
		Ist im Text nicht Einheitlich, (manchmal Liste, manchmal nur Text, verschidene Formatierung von Header)
		
		- Vorschlage: Als Liste und die Header sind bold
			bsp: Im Kapitel: Editorial – Weiterführende Literatur, Erste Schritte – Weiterführende Literatur
	
	- formatierung Spezialfall am Ende von “Erste Schritte”
		Hier war eine Tabelle 
	
		- Vorschlag: umformatieren zu block ( [[start:block]] [[end:block]] )

	-Headings
		Müssen alle als Style im Word hinterlegt sein (es macht keinen unterschide wie sie aussehen, müssen nur von heading 1 - 4 definiert sein)
		Arten:

			Heading 1 -> Kapitel 
				- Steuert navigation per URL
				- speziell: [[kurzer title]] kann in Doppelten “[“ am Schluss des Titels hinzugefügt werden.
				- bsp: 2 Erste Schritte einer rassismus und diskriminierungskritischen Dokumentation [[erste Schritte]]
		
			Heading 2 -> Unterkapitel 
				- Steuert Navigation per Scroll 
				- bsp: 2.1 Was ist Rassismus?

			Heading 3 -> Unter - Unterkapitel
				- Nur Viusell, keine Navigation
				- bsp: 2.1.1 Rassismus auf der individuellen Ebene

		
			Heading 4 -> Absatz Titel
				- Nur Viusell, keine Navigation
				- bsp: Beispiele Positionierung der Institution, Weitere Anlaufstellen, Weiterführende Literatur, Autorin, Abstract

		Fragen: 
			- Kapitel 3 -> soll “Dekolonialisierung der Museen” etc nicht H2 sein?

	- Kapitel: 10 Lösungsansätze aus den Sammlungen – Fallbeispiele
		- Metadaten -> Formatierung mit [[start:metadata]] [[start:before]] [[start:after]]
		- Kontext -> Lauftext
		- Bearbeitung in der Datenbank -> Block (box)
		- bsp: Fallbeispiel 1


Fragen und Unklarheiten:
	- Braucht es die Kapitel Nummerierung im Menu?
	- im Kapitel 7 Interne Verwendung von Daten: Metadaten in Online-Sammlungen: 5 Ansätze
		-> Gestaltung und gliederung ist etwas unklar und sollte besprochen werden
	- Kapitel 11: Vertiefung
		- Ist das nur eine Ramen für die folgenden Kapitel oder sollten dise unter dem Kapitel sein? oder folgt noch text?
	- im About, können die Mitglieder nicht als Tablelle (2 Spaltig) sondern einspaltig dargetsellt werden?
 



	- Blocks
		- block [[start:block]]
		- literatur [[start:literature]]
		- Externe Texte 
		- Bibliografie [[start:bib]]
		- Vergleiche [[start:comp]] [[start:plus]] [[end:plus]] [[start:minus]]  [[end:minus]] [[end:comp]]
		- Metadaten [[start:metadata]] [[start:before]]  [[end:before]] [[start:after]] [[end:after]] [[end: metadata]]

		- Table of Cotent [[start:toc]]
		- Vorwort [[start:preface]]
		- About [[start:about]]
		- Infobox [[start:disclaimer]]
		- Haupttitel mit Bild, Version und Urber:in [[start:heading]]
 -->
