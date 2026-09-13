# Azure Glass – Design-Test 0.1

Separate Testoberfläche auf Basis von Crossbar Coach 3.6 (d7bcddf).
Die bestehende App im Repository-Hauptverzeichnis bleibt unverändert.

- Vorschau: /My-Crossbar-Workout/preview/azure-glass/
- Eigener localStorage-Schlüssel: crossbarCoachAzureGlassTestV1
- Übernahme der Originaldaten nur auf ausdrücklichen Klick als Kopie oder über Backup-Import.
- Keine persönlichen Backups oder Trainingsdaten im Repository.
- Archivstand: archive/v3.6-2026-09-13

## Stand

Azur-/Fliederverläufe, helle Flächen, getrennte Planansicht, mobile Satzeingabe,
aufklappbare Technikhilfe, bestehende A/B-Workouts, Timer, Verlauf, Berichte und Backup.
Beim Abschluss werden Satzdaten kopiert und Entwürfe der abgeschlossenen Einheit entfernt.

## Später

- Gerätesynchronisierung zwischen Handy und Laptop (bewusst zurückgestellt).
- UI-Feedback von Daniel zur Testversion einarbeiten.
- Vor Übernahme in die Haupt-App Datenmigration und Browserkompatibilität prüfen.

## Prüfung der ersten Testversion

JavaScript-Syntax sowie DOM-basierte Funktionsprüfung bestanden: alle Ansichten,
Datenkopie, Backup-Import, Ablehnung eines Auswertungsberichts als Backup,
Workout-Abschluss, unveränderter Originalspeicher, unabhängige Trainingshistorie,
Backup-/Berichtsexport, Einstellungen und Timer.
Visuelle Chromium-Prüfung nicht durchgeführt: Browserdownload fehlgeschlagen.
Layout auf echten Handy- und Laptop-Browsern noch zu beurteilen.
