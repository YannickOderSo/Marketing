// Musterbeispiel: ein komplett ausgefüllter Arbeitsbereich zum Nachschauen.
// Marke und Zielgruppe von hier werden bei der Auslosung nicht gezogen.
// Inhalte lassen sich hier direkt anpassen.
window.RR_MUSTER = {
  brand: "Haribo",
  target: "Fitness-Bubble",
  team: "Musterteam",
  heute: "Kinder & Familien",
  branche: "Süßwaren",
  info: "Gym-Gänger:innen, Proteinfokus, Gymtok & Instagram",

  analyse: {
    zielgruppeHeute: "Kinder und Familien, dazu Erwachsene, die sich ein Stück Kindheit gönnen",
    wettbewerber: ["Katjes", "Trolli", "Proteinriegel"],
    heute: {
      kompetenz: "Fruchtgummi-Pionier aus Bonn, seit 1920 am Markt, einer der bekanntesten Süßwarenhersteller",
      attribute: "Bunte Fruchtgummis, viel Zucker, große Sortenvielfalt, günstig im Supermarkt",
      nutzen: "Funktional: süßer Snack für zwischendurch. Emotional: Spaß, Belohnung, Kindheitserinnerung",
      tonalitaet: "fröhlich, verspielt, familiär, unbeschwert",
      bild: "Goldbär, bunte Tüten, Werbung mit Kindern und Erwachsenen, Slogan „Haribo macht Kinder froh“"
    }
  },

  persona: {
    name: "Jana Berger",
    alter: 27,
    alltag: "Physiotherapeutin aus Kaiserslautern, trainiert fünfmal pro Woche im Gym",
    beduerfnisse: "Muskelaufbau, ohne ganz auf Süßes zu verzichten\nSnacks, die in die Sporttasche passen\nInhaltsstoffe, die zu ihren Makros passen",
    painpoints: "Proteinriegel schmecken oft nach Pappe\nNormale Süßigkeiten haben zu viel Zucker\nSchlechtes Gewissen nach dem Naschen",
    motive: ["Gesundheit", "Genuss", "Leistung", "Zugehörigkeit"],
    medien: ["Instagram", "TikTok", "YouTube", "Podcasts"],
    zitat: "Ich will naschen, ohne meine Makros zu sprengen."
  },

  strategie: {
    fit: 35,
    risiko: 70,
    wahl: "submarke",
    begruendung: "Die Matrix empfiehlt eine neue Marke, weil Haribo für Kindheit und Zucker steht und kaum zur Fitness-Bubble passt. Wir weichen bewusst ab: Eine Submarke bekommt einen eigenen sportlichen Auftritt, nutzt aber das Vertrauen und die Bekanntheit des Goldbären als Absender. Die klassische Haribo-Kundschaft bleibt davon unberührt."
  },

  markenkern: {
    kompetenz: "Der Fruchtgummi-Experte, der Naschen und Training zusammenbringt",
    attribute: "20 g Eiweiß pro 100-g-Tüte, halb so viel Zucker, Fruchtgummis in Bären- und Hantelform",
    nutzen: "Funktional: Eiweiß als Snack nach dem Training. Emotional: Genuss ohne schlechtes Gewissen",
    tonalitaet: "motivierend, verspielt, selbstironisch, ehrlich",
    bild: "Goldbär mit Hantel, Gold und Anthrazit, sportliche Typografie, Gym-Fotos statt Kinderzimmer",
    worte: ["energiegeladen", "ehrlich", "gemeinsam"]
  },

  positionierung: {
    achsen: { links: "preiswert", rechts: "premium", unten: "funktional", oben: "emotional" },
    punkte: {
      heute: { x: 0.3, y: 0.78 },
      neu: { x: 0.72, y: 0.68 },
      "w:Katjes": { x: 0.38, y: 0.6 },
      "w:Trolli": { x: 0.18, y: 0.52 },
      "w:Proteinriegel": { x: 0.68, y: 0.18 }
    },
    bewegt: true,
    satz: {
      zielgruppe: "Fitness-Begeisterte",
      beduerfnis: "beim Naschen ihre Makros im Blick behalten",
      marke: "Haribo Protein",
      kategorie: "Fruchtgummi-Marke",
      nutzen: "20 g Eiweiß pro Tüte liefert",
      wettbewerber: "Proteinriegeln",
      rtb: "den Geschmack, den sie seit ihrer Kindheit kennen"
    }
  },

  mix: {
    produkt: "Protein-Fruchtgummis mit 20 g Eiweiß und halb so viel Zucker, in den Sorten Beere, Zitrone und Cola",
    verpackung: "Wiederverschließbarer 100-g-Beutel für die Sporttasche, matte Optik in Gold und Anthrazit",
    preisStrategie: "Premium",
    preis: "2,49 € pro 100-g-Beutel",
    place: ["Fitnessstudio", "Drogerie", "Online-Shop", "Automaten"],
    placeText: "Kooperation mit einer Fitnessstudio-Kette, Kühlschrank direkt an der Theke",
    promotion: ["Influencer", "Instagram", "TikTok", "Sampling", "Sponsoring"],
    botschaft: "Naschen gehört zum Training."
  },

  pitch: {
    name: "Haribo Protein",
    claim: "Naschen mit Plan.",
    motiv: "Der Goldbär stemmt im Gym eine Hantel, daneben die Tüte und der Claim. Läuft als Plakat in Fitnessstudios und als Gymtok-Reel mit Fitness-Influencer:innen.",
    gruende: ["Die bekannte Marke schafft sofort Vertrauen", "Protein-Snacks sind ein wachsender Markt", "Selbstironie passt zur Gymtok-Kultur"],
    farbe: "#FFD23F"
  },

  logo: {
    typ: "Wort-Bildmarke",
    stile: ["sportlich", "verspielt", "flach"],
    symbol: "Goldbär, der eine Hantel stemmt",
    farben: "Gold und Anthrazit",
    richtung: "Evolution",
    extra: "Muss auch auf einer kleinen Snacktüte gut erkennbar sein",
    sprache: "en",
    entwuerfe: [
      { id: "muster-1", src: "assets/muster-logo-1.svg" },
      { id: "muster-2", src: "assets/muster-logo-2.svg" }
    ],
    favorit: "muster-1"
  }
};
