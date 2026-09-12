# My Crossbar Workout

Persönliche Crossbar-Trainingswebseite für Muskelaufbau.

## GitHub Pages aktivieren

1. Repository auf **Public** stellen: `Settings` → `General` → `Danger Zone` → `Change repository visibility` → `Public`.
2. Danach: `Settings` → `Pages`.
3. Unter **Build and deployment** als Source **Deploy from a branch** wählen.
4. Branch **main** und Ordner **/(root)** auswählen und speichern.
5. Nach kurzer Wartezeit ist die Seite typischerweise unter `https://danielbergmann-dev.github.io/My-Crossbar-Workout/` erreichbar.

## Datenspeicherung

Die Trainingsdaten werden im Browser über `localStorage` gespeichert und **nicht** ins GitHub-Repository hochgeladen. Deshalb regelmäßig das JSON-Backup aus der App exportieren, besonders vor Browserwechsel, Gerätewechsel oder dem Löschen von Browserdaten.

## Dateien

- `index.html` – Crossbar Coach Web-App
- `.nojekyll` – sorgt dafür, dass GitHub Pages die Seite unverändert als statische Website ausliefert
