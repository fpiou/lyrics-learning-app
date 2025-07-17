# 📚 Apprentissage de Paroles - Guide de Développement

## 📁 Structure du Projet

```
lyrics-learning-app/
├── index.html          # Point d'entrée HTML principal
├── manifest.json       # Manifest PWA pour éviter les erreurs 404
├── css/
│   └── styles.css     # Styles CSS de l'application
├── js/
│   └── app.js         # Logique JavaScript principale
├── README.md          # Documentation utilisateur
├── DEV_GUIDE.md       # Guide de développement (ce fichier)
├── LICENSE            # Licence MIT
└── .github/
    └── copilot-instructions.md  # Instructions pour GitHub Copilot
```

## 🔧 Architecture Technique

### Structure des Fichiers

#### `index.html`
- **Rôle** : Point d'entrée de l'application
- **Contenu** : Structure HTML sémantique et liens vers les ressources
- **Dépendances** : `css/styles.css` et `js/app.js`

#### `css/styles.css`
- **Rôle** : Styles et animations de l'interface
- **Contenu** : 
  - Reset CSS
  - Styles des composants
  - Animations et transitions
  - Responsive design (mobile, tablette, desktop)
  - Optimisations d'accessibilité

#### `js/app.js`
- **Rôle** : Logique métier de l'application
- **Contenu** :
  - Classe `LyricsLearningApp` (logique principale)
  - Parsing des paroles
  - Gestion des états d'apprentissage
  - Interaction utilisateur
  - Gestion de la progression

## 🏗️ Architecture Logicielle

### Classe Principale : `LyricsLearningApp`

```javascript
class LyricsLearningApp {
  constructor()           // Initialisation
  parseText()            // Parsing des paroles
  renderLyrics()         // Rendu de l'interface
  handleValidation()     // Gestion des réponses utilisateur
  updateProgress()       // Mise à jour de la progression
  // ... autres méthodes
}
```

### Structure des Données

#### Chanson Sauvegardée
```javascript
{
  id: 'chanson_unique_id',           // ID unique généré
  title: 'Titre de la chanson',     // Titre saisi par l'utilisateur
  lyrics: 'Paroles complètes...',   // Texte des paroles
  progress: [...],                   // Progression des lignes
  currentLineIndex: 0,               // Index de la ligne courante
  isLearningMode: false,             // Mode apprentissage actif
  lastModified: '2025-01-01T00:00:00.000Z' // Date de dernière modification
}
```

#### Ligne Parsée
```javascript
{
  words: [],              // Mots et espaces/ponctuation
  wordElements: [],       // Mots seuls (filtrés)
  hiddenCount: 1,         // Nombre de mots cachés
  isCompleted: false,     // Ligne terminée dans le cycle actuel
  hasValidationButtons: false,  // Boutons de validation affichés
  hasBeenRevealed: false, // Ligne révélée (donc non réussie)
  isLearned: false        // Ligne maîtrisée (100% des mots cachés + trouvé)
}
```

#### Mot
```javascript
{
  type: 'word',           // Type : 'word', 'space', 'punctuation'
  content: 'exemple',     // Contenu textuel
  hidden: false,          // Mot caché
  revealed: false         // Mot révélé après clic
}
```

## 🎯 Fonctionnalités Clés

### 1. Système d'Apprentissage Progressif
- **Masquage inverse** : Mots cachés du dernier au premier
- **Adaptation dynamique** : Difficulté ajustée selon les réponses
- **Cycle continu** : Retour à la première ligne après la dernière

### 2. Interface Utilisateur
- **Ligne courante** : Mise en évidence visuelle
- **Placeholders adaptatifs** : Taille calculée selon la longueur des mots
- **Validation interactive** : Boutons 👍/👎 pour l'auto-évaluation

### 3. Parsing Intelligent
- **Unicode complet** : Support des caractères accentués français
- **Caractères spéciaux** : Gestion des mots comme R&B, B&Bs
- **Ponctuation** : Séparation correcte des mots et de la ponctuation
- **Espaces** : Préservation de la mise en forme originale

### 4. Gestion des Chansons Sauvegardées
- **Titre de chanson** : Champ obligatoire pour identifier chaque chanson
- **Sauvegarde automatique** : Progression sauvée en temps réel dans localStorage
- **Liste des chansons** : Affichage des chansons avec progression
- **Chargement** : Reprise de l'apprentissage où on s'était arrêté
- **Suppression** : Gestion des chansons non désirées

### 5. Suivi de Progression
- **Pourcentage global** : Basé sur les lignes maîtrisées
- **Indicateur flottant** : Progression en temps réel
- **Défilement automatique** : Centrage sur la ligne courante
- **Persistance** : Sauvegarde automatique de la progression

## 🔨 Développement

### Configuration de l'Environnement

```bash
# Cloner le projet
git clone <url-du-repo>
cd lyrics-learning-app

# Serveur local simple (optionnel)
python -m http.server 8000
# OU
npx serve .
```

### Workflow de Développement

1. **Ouvrir `index.html`** dans un navigateur
2. **Modifier les fichiers** selon le besoin :
   - `css/styles.css` pour les styles
   - `js/app.js` pour la logique
   - `index.html` pour la structure
3. **Recharger la page** pour voir les changements

### Tests Manuels

#### Tests de Base
- [ ] Saisie et parsing des paroles
- [ ] Saisie du titre de chanson
- [ ] Navigation ligne par ligne
- [ ] Révélation des mots cachés
- [ ] Validation 👍/👎
- [ ] Progression de la difficulté
- [ ] Cycle complet jusqu'à 100%
- [ ] Sauvegarde automatique
- [ ] Chargement des chansons sauvegardées
- [ ] Suppression des chansons

#### Tests Responsive
- [ ] Mobile (< 480px)
- [ ] Tablette (< 768px)
- [ ] Desktop (> 768px)

#### Tests Unicode
- [ ] Caractères accentués français (é, à, ç...)
- [ ] Apostrophes typographiques
- [ ] Traits d'union
- [ ] Caractères spéciaux dans les mots (R&B, B&Bs, etc.)

## 📱 Optimisations Mobiles

### Touches Tactiles
- **Taille minimum** : 44px pour les éléments cliquables
- **Zones de clic étendues** : Placeholders adaptatifs
- **Prévention du zoom** : fontSize 16px sur iOS

### Performance
- **Animations fluides** : Transitions CSS optimisées
- **Défilement intelligent** : `scrollIntoView` avec `behavior: 'smooth'`
- **Réduction des reflows** : Calculs de largeur optimisés

## 🎨 Personnalisation

### Couleurs Principales
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --error-color: #dc3545;
}
```

### Breakpoints Responsive
```css
/* Mobile */
@media (max-width: 768px) { ... }

/* Tablette */
@media (min-width: 769px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
```

## 🚀 Ajout de Fonctionnalités

### Exemple : Nouvelle Fonctionnalité

1. **Planification** : Définir le comportement souhaité
2. **Données** : Modifier la structure des données si nécessaire
3. **Logique** : Ajouter la méthode dans `LyricsLearningApp`
4. **Interface** : Ajouter les styles CSS nécessaires
5. **Intégration** : Connecter avec les événements existants

### Bonnes Pratiques

- **Méthodes courtes** : Une responsabilité par méthode
- **Nommage explicite** : Variables et méthodes claires
- **Commentaires** : Documentation des algorithmes complexes
- **Tests** : Vérifier sur différents navigateurs et tailles d'écran

## 🐛 Débogage

### Outils de Développement
- **Console navigateur** : Erreurs JavaScript
- **Inspecteur DOM** : Structure et styles
- **Responsive design** : Tests multi-écrans

### Problèmes Courants
- **Parsing Unicode** : Vérifier la regex des caractères
- **Ordre des caractères dans regex** : Le trait d'union `-` doit être en fin de classe
- **Événements mobiles** : Tester les interactions tactiles
- **Performance** : Optimiser les rendus fréquents
- **Manifest.json** : Fichier nécessaire pour éviter les erreurs 404

## 🔍 Parsing des Mots - Détails Techniques

### Regex Utilisée
```javascript
/^([^\p{L}\p{N}'''&-]*)([\p{L}\p{N}'''&-]+)([^\p{L}\p{N}'''&-]*)$/u
```

### Caractères Supportés dans les Mots
- **Lettres Unicode** : `\p{L}` (toutes les lettres, y compris accents)
- **Chiffres** : `\p{N}` (0-9 et chiffres Unicode)
- **Apostrophes** : `'` et `'` (simple et typographique)
- **Esperluette** : `&` (pour R&B, B&Bs, etc.)
- **Traits d'union** : `-` (placé en fin de classe pour éviter les conflits)

### Exemples de Parsing

#### Mots Standards
```
"Hello" → mot: "Hello"
"café" → mot: "café"
"rock'n'roll" → mot: "rock'n'roll"
```

#### Mots avec Caractères Spéciaux
```
"R&B" → mot: "R&B"
"B&Bs" → mot: "B&Bs"
"AT&T" → mot: "AT&T"
```

#### Mots avec Ponctuation
```
"Hello!" → prefix: "", mot: "Hello", suffix: "!"
"(café)" → prefix: "(", mot: "café", suffix: ")"
"«bonjour»" → prefix: "«", mot: "bonjour", suffix: "»"
```

#### Cas Complexes
```
"...R&B!" → prefix: "...", mot: "R&B", suffix: "!"
"(rock'n'roll)" → prefix: "(", mot: "rock'n'roll", suffix: ")"
```

### Gestion des Erreurs
Si la regex ne trouve pas de correspondance, le texte est traité comme ponctuation pure :
```javascript
// Exemple : "!!!" sera traité comme ponctuation
words.push({ type: 'punctuation', content: part });
```

## 📚 Resources Utiles

- **MDN Web Docs** : Documentation JavaScript/CSS
- **Can I Use** : Compatibilité navigateurs
- **CSS-Tricks** : Techniques CSS avancées
- **Accessibility Guidelines** : WCAG 2.1

---

**Bon développement ! 🎉**
