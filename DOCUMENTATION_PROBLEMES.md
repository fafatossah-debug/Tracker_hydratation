# Documentation — Problèmes rencontrés et résolutions

Ce document retrace les difficultés techniques rencontrées lors de la mise en place du projet **HydroCompose** et la manière dont elles ont été résolues. Objectif : garder une trace claire pour référence future ou pour la documentation du projet.

---

## 1. Projet généré en React au lieu d'Android natif

**Contexte :** le projet a été initialement généré via Google AI Studio, qui a produit une application web (React/Node.js) alors que l'objectif était une application Android native.

**Cause :** le prompt initial ne précisait pas explicitement le langage, le framework et les contraintes de compatibilité avec Android Studio.

**Solution :**
- Réécriture du prompt en précisant explicitement : Kotlin natif, Jetpack Compose, aucune référence à React/Flutter/web
- Ajout de contraintes techniques précises : versions AGP/Kotlin/SDK, structure de projet Android standard, Gradle Version Catalog
- Régénération complète du projet avec le nouveau prompt plutôt qu'une tentative de conversion du projet React existant

---

## 2. Échec de synchronisation Gradle — références de bibliothèques manquantes

**Erreur observée :**
```
Unresolved reference. None of the following candidates is applicable because of receiver type mismatch:
public val NamedDomainObjectContainer<KotlinSourceSet>.test...
Script compilation errors: :58
```

**Cause réelle :** le fichier `build.gradle.kts` référençait deux bibliothèques (`libs.androidx.compose.ui.test.junit4` et `libs.androidx.compose.ui.test.manifest`) qui n'étaient pas déclarées dans `libs.versions.toml`. Le message d'erreur Gradle, peu explicite, orientait à tort vers un conflit Kotlin Multiplatform.

**Solution :** ajout des déclarations manquantes dans la section `[libraries]` du fichier `libs.versions.toml` :
```toml
androidx-compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-compose-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
```

**Leçon retenue :** une erreur Gradle mentionnant `NamedDomainObjectContainer<KotlinSourceSet>` n'indique pas forcément un problème de Kotlin Multiplatform — vérifier d'abord que tous les alias `libs.xxx` utilisés existent bien dans le `.toml`.

---

## 3. AndroidX non activé

**Erreur observée :**
```
Configuration ':app:debugRuntimeClasspath' contains AndroidX dependencies, but the 'android.useAndroidX' property is not enabled
```

**Cause :** le fichier `gradle.properties`, censé activer AndroidX, était absent du projet.

**Solution :** création du fichier `gradle.properties` à la **racine du projet** (même niveau que `app/`, `gradle/`, `.idea/`) avec le contenu :
```properties
android.useAndroidX=true
android.enableJetifier=true
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
```

**Point d'attention rencontré :** le fichier avait d'abord été créé au mauvais endroit (`app/src/`), ce qui ne résolvait pas l'erreur. Un fichier `gradle.properties` doit impérativement être à la racine du projet — à ne pas confondre avec `local.properties` (chemin du SDK, propre à chaque machine, jamais versionné).

---

## 4. Échec de liaison des ressources — thème Material3 introuvable

**Erreur observée :**
```
AAPT: error: resource style/Theme.Material3.DayNight.NoActionBar not found
error: failed linking references.
```

**Cause :** le fichier `themes.xml` référençait un style (`Theme.Material3.DayNight.NoActionBar`) appartenant à la bibliothèque **Material Components for Android** (XML classique), alors que le projet ne dépendait que de `androidx.compose.material3` (Compose pur) — les deux systèmes sont distincts.

**Solution retenue :** simplification du thème XML pour n'en faire qu'une coquille système (statusBar/navigationBar), l'ensemble du thème visuel étant géré par Compose (`Theme.kt`) :
```xml
<style name="Theme.HydroCompose" parent="android:Theme.Material.NoActionBar">
    <item name="android:statusBarColor">#111318</item>
    <item name="android:navigationBarColor">#111318</item>
</style>
```

---

## 5. Icônes de l'application manquantes

**Erreur observée :**
```
AAPT: error: resource mipmap/ic_launcher not found
```

**Cause :** les dossiers `mipmap-*` (icônes de l'app à différentes résolutions) n'avaient pas été générés par le template initial.

**Solution :** génération des icônes via l'assistant intégré d'Android Studio :
`clic droit sur res` → **New > Image Asset** → Launcher Icons (Adaptive and Legacy) → choix d'un visuel (goutte d'eau turquoise `#2AC0BC` sur fond sombre `#111318`, cohérent avec le thème de l'app).

---

## 6. Erreurs de compilation Kotlin — référence non résolue

**Erreur observée :**
```
Unresolved reference: primaryColor
```
(à plusieurs endroits dans `HydrationScreen.kt`)

**Cause :** le code généré utilisait `primaryColor` comme s'il s'agissait d'une variable prédéfinie, alors que ce n'est pas un identifiant Compose valide.

**Solution :** remplacement de toutes les occurrences par la syntaxe correcte d'accès au thème Compose :
```kotlin
MaterialTheme.colorScheme.primary
```

---

## 7. Fichiers de cache Gradle poussés sur Git

**Constat :** lors d'un commit, Git proposait d'envoyer des fichiers comme `.gradle/8.12/checksums`, `executionHistory.bin`, `fileHashes.lock` — des fichiers de cache interne à Gradle, qui n'ont rien à faire dans un dépôt.

**Cause :** le fichier `.gitignore` du projet était celui généré par défaut par Google AI Studio pour un projet React/Node.js (`node_modules/`, `dist/`, etc.) — il ne contenait aucune règle d'exclusion propre à un projet Android.

**Solution :**
1. Mise à jour du `.gitignore` avec les règles Android standard :
```
.gradle/
/build
/app/build
/local.properties
/.idea/
*.iml
captures/
.cxx/
*.apk
*.aab
```
2. Retrait des fichiers déjà suivis par Git avant la correction :
```bash
git rm -r --cached .gradle
git rm -r --cached .idea
git commit -m "Nettoyage du gitignore pour projet Android natif"
```

**Leçon retenue :** un `.gitignore` ajouté après coup n'arrête pas de suivre des fichiers déjà commités — il faut les retirer explicitement du suivi avec `git rm --cached`.

---

## 8. Travail sur poste partagé (salle machine)

**Point de vigilance :** en environnement partagé (salle machine à l'école), deux précautions ont été prises :

- **Identité Git locale au projet** (et non globale), pour éviter d'attribuer les commits à un autre étudiant :
  ```bash
  git config user.name "Tossah Fafa"
  git config user.email "fafatossah@gmail.com"
  ```
- **Nettoyage des identifiants après usage** : suppression du credential helper et des entrées enregistrées dans le Gestionnaire d'identification Windows après le push, pour ne pas laisser de token d'accès actif sur une machine partagée.

---

## Résumé des bonnes pratiques retenues

1. Toujours préciser explicitement la stack technique attendue dans un prompt de génération de code (langage, framework, versions), pour éviter les générations hors-sujet
2. Vérifier la cohérence entre les dépendances déclarées (`libs.versions.toml`) et celles utilisées dans le code (`build.gradle.kts`)
3. Ne pas confondre `gradle.properties` (config du build, à la racine) et `local.properties` (config locale à la machine, jamais versionné)
4. Un `.gitignore` doit être adapté à la nature réelle du projet (Android ≠ Node/React) — vérifier ce point tôt plutôt qu'après plusieurs commits
5. Sur poste partagé : toujours configurer l'identité Git localement au projet et nettoyer ses identifiants après usage
