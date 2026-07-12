# HydroCompose 💧

Application Android native de suivi d'hydratation, développée en **Kotlin** avec **Jetpack Compose**.

## Présentation

HydroCompose permet de suivre sa consommation d'eau quotidienne par rapport à un objectif de 2L, via une interface simple : un cercle de progression, un bouton d'ajout rapide (+250ml), et un bouton de réinitialisation.

## Stack technique

| Composant | Version |
|---|---|
| Langage | Kotlin 2.0.x |
| UI | Jetpack Compose (Material 3) |
| Android Gradle Plugin | 8.9.x |
| Compose BOM | 2024.10.01 |
| compileSdk / targetSdk | 35 |
| minSdk | 24 |
| Gestion des dépendances | Gradle Version Catalog (`libs.versions.toml`) |
| Architecture | MVVM (ViewModel + StateFlow) |
| IDE | Android Studio Meerkat Feature Drop \| 2024.3.2 Patch 1 |

## Fonctionnalités

- Écran principal avec cercle de progression circulaire (objectif 2L)
- Bouton "+" pour ajouter 250ml
- Bouton de réinitialisation du compteur
- Thème sombre Material 3 avec accents turquoise (`#2AC0BC`)
- Gestion de l'état via ViewModel (architecture moderne recommandée par Google)

## Prérequis

- Android Studio Meerkat Feature Drop | 2024.3.2 Patch 1 (ou plus récent)
- JDK 11
- Un appareil Android (minSdk 24+) ou un émulateur configuré

## Installation et lancement

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/<ton-compte>/HydroCompose.git
   ```
2. Ouvrir le dossier dans Android Studio
3. Laisser Gradle synchroniser automatiquement les dépendances (première synchro : plusieurs minutes)
4. Brancher un appareil Android en mode débogage USB, ou créer un émulateur via le **Device Manager**
5. Lancer l'application avec le bouton ▶️ Run

> Le fichier `local.properties` (chemin du SDK) est généré automatiquement par Android Studio à l'ouverture du projet — il est propre à chaque machine et n'est jamais versionné (voir `.gitignore`).

## Structure du projet

```
app/src/main/
├── java/com/example/hydration/
│   ├── ui/              → composants @Composable (écrans)
│   └── viewmodel/        → gestion d'état (ViewModel)
├── res/
│   ├── values/           → themes.xml, colors
│   └── mipmap-*/         → icônes de l'application
└── AndroidManifest.xml
```

## Historique de développement

Ce projet a été initialement généré via **Google AI Studio**, qui a produit une base React/Node.js au lieu d'un projet Android natif. Le projet a ensuite été entièrement reconstruit en Kotlin/Jetpack Compose natif.

Pour le détail des problèmes rencontrés pendant la mise en place du projet (erreurs de build, configuration Gradle, Git) et leurs solutions, voir [`DOCUMENTATION_PROBLEMES.md`](./DOCUMENTATION_PROBLEMES.md).

## Auteur

Tossah Fafa — Pigier Côte d'Ivoire, LPRGL3A (2025–2026)
