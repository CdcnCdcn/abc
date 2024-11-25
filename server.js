const express = require("express"); // Express-Framework importieren
const { createClient } = require("@supabase/supabase-js"); // Supabase-Client importieren
const bodyParser = require("body-parser"); // Für JSON-Verarbeitung (wichtig für POST-Daten)

// Supabase-Daten
const supabaseUrl = "https://ltzvbzpeplnjlokvbuit.supabase.co"; // Ersetze mit deiner Supabase-URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0enZienBlcGxuamxva3ZidWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1Mjc5MjksImV4cCI6MjA0ODEwMzkyOX0.7iXtEDPdsQIko7wvn7p5m922FOR5WLE96cYbt2lm2GY"; // Ersetze mit deinem anon key
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express(); // Express-App erstellen
const port = process.env.PORT || 3000; // Verwende den Vercel-Port

// Middleware für JSON-Verarbeitung
app.use(bodyParser.json());

// Grundlegende Route
app.get("/", (req, res) => {
    res.send("Server läuft! Willkommen bei deinem Node.js-Projekt.");
});

// API-Route für das Speichern von Ergebnissen
app.post("/api/saveResults", async (req, res) => {
    const answers = req.body; // Die Antworten des Nutzers (als JSON-Objekt)

    try {
        const entries = Object.entries(answers).map(([question_key, answer]) => ({
            question_key,
            answer,
        }));

        const { data, error } = await supabase.from("results").insert(entries);

        if (error) {
            console.error("Fehler beim Speichern:", error);
            res.status(500).send("Fehler beim Speichern der Ergebnisse.");
        } else {
            res.status(200).send({ message: "Ergebnisse erfolgreich gespeichert." });
        }
    } catch (err) {
        console.error("Server-Fehler:", err);
        res.status(500).send("Ein Fehler ist aufgetreten.");
    }
});

// API-Route für das Abrufen der Ergebnisse
app.get("/api/getResults", async (req, res) => {
    try {
        const { data, error } = await supabase.from("results").select("*");

        if (error) {
            console.error("Fehler beim Abrufen der Ergebnisse:", error);
            return res.status(500).send("Fehler beim Abrufen der Ergebnisse.");
        }

        res.status(200).send(data); // Ergebnisse zurückgeben
    } catch (err) {
        console.error("Server-Fehler:", err);
        res.status(500).send("Ein Fehler ist aufgetreten.");
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
