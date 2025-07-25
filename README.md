# 📚 Apprentissage de Paroles

Une application web interactive pour apprendre les paroles de chansons ligne par ligne avec un système de validation progressif.

## 🎯 Objectif

Cette application permet d'apprendre efficacement les paroles de chansons en utilisant un système d'apprentissage ligne par ligne. Les mots sont cachés dans l'ordre inverse (du dernier au premier) et l'utilisateur valide sa compréhension pour progresser vers la ligne suivante.

## ✨ Fonctionnalités

- **Apprentissage ligne par ligne** : Une seule ligne active à la fois pour un apprentissage concentré
- **Masquage intelligent** : Les mots sont cachés dans l'ordre inverse avec des placeholders de taille adaptée, le dernier mot étant toujours caché
- **Révélation par clic** : Cliquez sur n'importe quel mot caché pour révéler toute la ligne
- **Validation interactive** : Boutons "👎" et "👍" pour s'auto-évaluer
- **Progression adaptative** : Plus vous réussissez, plus de mots sont cachés dans les lignes suivantes
- **Cycle continu** : Retour automatique à la première ligne après la dernière pour un apprentissage jusqu'à 100%
- **Suivi de progression** : Pourcentage de mots de la chanson maîtrisés et nombre de lignes complétées
- **Défilement automatique** : La page se centre automatiquement sur la ligne courante
- **Support Unicode** : Gestion parfaite des caractères accentués français (émoi, ça, déjà...)
- **Interface moderne** : Design responsive et convivial avec mise en évidence claire de la ligne courante

## 🚀 Utilisation

1. **Coller les paroles** : Saisissez ou collez les paroles de votre chanson dans la zone de texte
2. **Commencer l'apprentissage** : Cliquez sur "Commencer l'apprentissage"
3. **Ligne courante** : La première ligne est mise en surbrillance et devient interactive
4. **Révéler les mots** : Cliquez sur n'importe quel placeholder coloré pour révéler toute la ligne
5. **Auto-évaluation** : 
   - **👍** : Si vous aviez deviné les mots → un mot de plus sera caché dans les prochaines lignes
   - **👎** : Si vous n'aviez pas deviné → un mot de moins sera caché (minimum 1)
6. **Progression automatique** : Passage automatique à la ligne suivante avec défilement centré
7. **Cycle complet** : Après la dernière ligne, retour à la première pour continuer l'apprentissage jusqu'à 100%
8. **Suivi** : Observez le pourcentage de lignes de la chanson que vous maîtrisez augmenter progressivement

## 📈 Système d'apprentissage

### Règles de base :
- **Ligne courante** : Une seule ligne active à la fois (première ligne au début)
- **Masquage** : Mots cachés dans l'ordre inverse, dernier mot toujours caché
- **Révélation** : Clic sur un mot → révèle tous les mots cachés de la ligne
- **Validation** : Choix entre 👍 (si vous aviez deviné) ou 👎 (si vous n'aviez pas deviné)
- **Adaptation** : Le niveau de difficulté s'ajuste selon vos réussites
- **Continuité** : Retour à la première ligne après la dernière pour un apprentissage jusqu'à maîtrise complète (100%)

### Progression :
- **Réussite** : Cache un mot supplémentaire (progression vers le début de ligne)
- **Échec** : Cache un mot de moins (mais garde toujours le dernier mot caché)
- **Pourcentage** : Calcul en temps réel basé sur le nombre de mots maîtrisés par rapport au total de mots de la chanson
- **Maîtrise** : Une ligne complétée avec N mots cachés = N mots maîtrisés pour cette ligne

## 🛠️ Développement

### Prérequis

- Un navigateur web moderne
- Un serveur web local (optionnel pour le développement)

### Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd lyrics-learning-app

# Ouvrir directement index.html dans un navigateur
# OU utiliser un serveur local simple
python -m http.server 8000
# OU
npx serve .
```

### Développement

L'application est entièrement contenue dans un seul fichier `index.html` avec CSS et JavaScript intégrés. Pour développer :

1. Ouvrez `index.html` dans votre éditeur
2. Modifiez le code directement dans le fichier
3. Rechargez la page dans le navigateur pour voir les changements

### Scripts disponibles

Aucun script de build n'est nécessaire. L'application fonctionne directement dans le navigateur.

## 🏗️ Structure du projet

```
lyrics-learning-app/
├── index.html           # Point d'entrée HTML
├── css/
│   └── styles.css      # Styles CSS de l'application
├── js/
│   └── app.js          # Logique JavaScript
├── README.md           # Documentation utilisateur
├── DEV_GUIDE.md        # Guide de développement
├── LICENSE             # Licence du projet
└── .github/
    └── copilot-instructions.md  # Instructions Copilot
```

## 🎨 Technologies utilisées

- **HTML5** : Structure sémantique et application complète
- **CSS3** : Animations et design responsive intégrés
- **Vanilla JavaScript** : Logique pure sans frameworks
- **Application standalone** : Aucun build tool requis

## 📱 Responsive Design

L'application s'adapte à tous les écrans :
- 📱 Mobile (< 480px)
- 📱 Tablette (< 768px)
- 💻 Desktop (> 768px)

## 🔧 Fonctionnalités techniques

- **Parsing intelligent Unicode** : Préservation parfaite des caractères accentués français
- **Système de validation progressif** : Adaptation automatique de la difficulté
- **Défilement automatique** : Centrage intelligent sur la ligne courante
- **Cycle d'apprentissage** : Retour automatique au début pour un apprentissage jusqu'à 100% de maîtrise
- **Calcul de progression** : Pourcentage de mots maîtrisés par rapport au total de la chanson
- **Gestion d'état avancée** : Suivi précis des lignes maîtrisées et du niveau de difficulté
- **Animations fluides** : Transitions CSS pour une expérience utilisateur optimale avec placeholders adaptatifs et focus visuel sur la ligne active
- **Responsive design** : Adaptation parfaite à tous les écrans
- **Application standalone** : Fonctionne directement dans le navigateur sans installation

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Optimiser le code

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

---

**Créé avec ❤️ pour faciliter l'apprentissage des paroles de chansons**
