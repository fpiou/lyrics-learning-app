// JavaScript pour l'application d'apprentissage de paroles

// Classe principale pour gérer l'application d'apprentissage de paroles
class LyricsLearningApp {
  constructor() {
    this.lyrics = '';
    this.parsedLines = [];
    this.currentLineIndex = 0;
    this.isLearningMode = false;
    this.currentSongId = null;
    this.songTitle = '';
    
    this.initializeElements();
    this.bindEvents();
    this.loadSavedSongs();
  }

  // Optimisations mobiles simplifiées
  setupMobileOptimizations() {
    // Uniquement sur mobile : prévenir le zoom automatique sur iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
          input.style.fontSize = '16px';
        }
      });
    }
  }

  initializeElements() {
    this.songTitleInput = document.getElementById('song-title');
    this.lyricsInput = document.getElementById('lyrics-input');
    this.startButton = document.getElementById('start-learning');
    this.saveSongButton = document.getElementById('save-song');
    this.lyricsDisplay = document.getElementById('lyrics-display');
    this.progressSection = document.querySelector('.progress-section');
    this.linesCompletedSpan = document.getElementById('lines-completed');
    this.totalLinesSpan = document.getElementById('total-lines');
    this.currentLevelSpan = document.getElementById('current-level');
    this.savedSongsList = document.getElementById('saved-songs');
    
    // Éléments pour l'indicateur flottant
    this.floatingProgress = document.getElementById('floating-progress');
    this.floatingPercentage = document.getElementById('floating-percentage');
    this.floatingLines = document.getElementById('floating-lines');
  }

  bindEvents() {
    this.startButton.addEventListener('click', () => this.startLearning());
    this.saveSongButton.addEventListener('click', () => this.saveSong());
    
    // Sauvegarde automatique lors des changements
    this.songTitleInput.addEventListener('input', () => this.autoSave());
    this.lyricsInput.addEventListener('input', () => this.autoSave());
    
    // Appeler les optimisations mobiles après que les éléments soient initialisés
    this.setupMobileOptimizations();
  }

  startLearning() {
    const lyrics = this.lyricsInput.value.trim();
    const title = this.songTitleInput.value.trim();
    
    if (!lyrics) {
      alert('Veuillez entrer des paroles de chanson');
      return;
    }
    
    if (!title) {
      alert('Veuillez entrer un titre pour la chanson');
      return;
    }

    this.lyrics = lyrics;
    this.songTitle = title;
    this.parsedLines = this.parseText(lyrics);
    this.currentLineIndex = 0;
    this.isLearningMode = true;
    
    // Générer un ID unique pour la chanson basé sur le titre et le contenu
    this.currentSongId = this.generateSongId(title, lyrics);
    
    // Charger la progression sauvegardée si elle existe
    this.loadSongProgress();
    
    // Initialiser chaque ligne avec le dernier mot caché
    this.initializeLines();
    this.renderLyrics();
    this.updateProgress();
    this.progressSection.style.display = 'block';
    this.floatingProgress.style.display = 'flex';
    this.scrollToCurrentLine();
    
    // Sauvegarder automatiquement la chanson
    this.autoSave();
  }

  parseText(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, lineIndex) => {
      const words = [];
      const parts = line.split(/(\s+)/);
      
      for (const part of parts) {
        if (part.trim() === '') {
          words.push({ type: 'space', content: part });
        } else {
          // Regex amélioré pour les caractères français + caractères spéciaux dans les mots (R&B, B&Bs, etc.)
          const match = part.match(/^([^\p{L}\p{N}'''&-]*)([\p{L}\p{N}'''&-]+)([^\p{L}\p{N}'''&-]*)$/u);
          if (match) {
            const [, prefix, word, suffix] = match;
            if (prefix) words.push({ type: 'punctuation', content: prefix });
            if (word) words.push({ type: 'word', content: word, hidden: false, revealed: false });
            if (suffix) words.push({ type: 'punctuation', content: suffix });
          } else {
            // Si le regex ne match pas, traiter comme ponctuation pure
            words.push({ type: 'punctuation', content: part });
          }
        }
      }
      
      const wordElements = words.filter(w => w.type === 'word');
      
      return {
        words,
        wordElements,
        hiddenCount: wordElements.length > 0 ? 1 : 0, // Commencer avec 1 mot caché (le dernier)
        isCompleted: false,
        hasValidationButtons: false,
        hasBeenRevealed: false, // Nouvelle propriété pour tracker si la ligne a été révélée
        isLearned: false // Nouvelle propriété pour tracker si la ligne est apprise (tous mots cachés + trouvé)
      };
    });
  }

  initializeLines() {
    this.parsedLines.forEach((line, lineIndex) => {
      this.applyHiddenWordsToLine(lineIndex);
    });
  }

  applyHiddenWordsToLine(lineIndex) {
    const line = this.parsedLines[lineIndex];
    const wordElements = line.wordElements;
    
    if (wordElements.length === 0) return;
    
    // Réinitialiser tous les mots
    wordElements.forEach(word => {
      word.hidden = false;
      word.revealed = false;
    });
    
    // Cacher les mots depuis la fin selon hiddenCount
    const wordsToHide = Math.min(line.hiddenCount, wordElements.length);
    for (let i = 0; i < wordsToHide; i++) {
      const wordIndex = wordElements.length - 1 - i;
      wordElements[wordIndex].hidden = true;
    }
  }

  renderLyrics() {
    if (!this.parsedLines.length) {
      this.lyricsDisplay.innerHTML = '';
      return;
    }

    const lyricsHTML = this.parsedLines.map((line, lineIndex) => {
      const isCurrentLine = lineIndex === this.currentLineIndex;
      const lineClasses = ['lyrics-line'];
      if (isCurrentLine) lineClasses.push('current-line');
      if (line.isCompleted) lineClasses.push('completed-line');

      const lineHTML = line.words.map(word => {
        if (word.type === 'word') {
          const classes = ['word'];
          if (word.hidden && !word.revealed) {
            classes.push('hidden');
            // Ajouter la classe clickable seulement pour la ligne courante
            if (isCurrentLine) classes.push('clickable');
          }
          if (word.revealed) classes.push('revealed');
          
          let displayText = word.content;
          if (word.hidden && !word.revealed) {
            // Créer un cache avec la même largeur que le mot original
            // Utilise une estimation basée sur la longueur du mot
            const estimatedWidth = this.estimateWordWidth(word.content);
            displayText = `<span class="word-placeholder" style="width: ${estimatedWidth}ch;"></span>`;
          }
          
          return `<span class="${classes.join(' ')}" data-word="${word.content}" data-line="${lineIndex}">${displayText}</span>`;
        }
        return word.content;
      }).join('');

      // Ajouter les boutons de validation seulement si la ligne a été révélée
      let validationHTML = '';
      if (this.isLearningMode && isCurrentLine && line.hasValidationButtons) {
        validationHTML = `
          <div class="line-validation" data-line="${lineIndex}">
            <button class="validation-btn fail-btn" data-action="not-found" title="Je n'ai pas trouvé">👎</button>
            <button class="validation-btn success-btn" data-action="found" title="J'ai trouvé">👍</button>
          </div>
        `;
      }

      return `
        <div class="${lineClasses.join(' ')}" data-line="${lineIndex}">
          <div class="line-content">${lineHTML}</div>
          ${validationHTML}
        </div>
      `;
    }).join('');

    this.lyricsDisplay.innerHTML = lyricsHTML;

    // Attacher les événements aux mots cliquables de la ligne courante
    this.lyricsDisplay.querySelectorAll('.word.clickable, .word.clickable .word-placeholder').forEach(element => {
      element.addEventListener('click', (e) => {
        // Si on clique sur le placeholder, trouver le span parent qui contient les données
        const wordElement = e.target.closest('.word[data-line]');
        if (wordElement) {
          this.revealLineWords({ target: wordElement });
        }
      });
    });

    // Attacher les événements aux boutons de validation
    this.lyricsDisplay.querySelectorAll('.validation-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleValidation(e));
    });
  }

  revealLineWords(event) {
    const wordSpan = event.target;
    const lineIndex = parseInt(wordSpan.dataset.line);
    
    if (lineIndex !== this.currentLineIndex) return;
    
    const line = this.parsedLines[lineIndex];
    
    // Marquer que cette ligne a été révélée (donc ne peut plus être considérée comme réussie)
    line.hasBeenRevealed = true;
    
    // Révéler tous les mots cachés de cette ligne
    line.wordElements.forEach(word => {
      if (word.hidden) {
        word.revealed = true;
      }
    });
    
    // Afficher les boutons de validation
    line.hasValidationButtons = true;
    
    this.renderLyrics();
  }

  handleValidation(event) {
    const button = event.target;
    const lineIndex = parseInt(button.closest('.line-validation').dataset.line);
    const action = button.dataset.action;
    const line = this.parsedLines[lineIndex];

    if (action === 'found') {
      // Vérifier si tous les mots étaient cachés avant de dire "J'ai trouvé"
      const allWordsWereHidden = line.hiddenCount >= line.wordElements.length;
      
      if (allWordsWereHidden) {
        // Marquer la ligne comme apprise
        line.isLearned = true;
      }
      
      // L'utilisateur a trouvé : cacher un mot de plus (le précédent du premier caché)
      if (line.hiddenCount < line.wordElements.length) {
        line.hiddenCount++;
      }
    } else if (action === 'not-found') {
      // L'utilisateur n'a pas trouvé : cacher un mot de moins (mais minimum 1)
      if (line.hiddenCount > 1) {
        line.hiddenCount--;
      }
    }

    // Marquer la ligne comme complétée et passer à la suivante
    line.isCompleted = true;
    line.hasValidationButtons = false;
    
    // Sauvegarder automatiquement la progression
    this.autoSave();
    
    // Passer à la ligne suivante
    this.moveToNextLine();
  }

  moveToNextLine() {
    this.currentLineIndex++;
    
    // Si on a fini toutes les lignes, revenir à la première ligne
    if (this.currentLineIndex >= this.parsedLines.length) {
      this.currentLineIndex = 0;
      
      // Réinitialiser l'état de completion pour le nouveau cycle
      this.parsedLines.forEach(line => {
        line.isCompleted = false;
      });
    }
    
    // Vérifier si on a atteint 100% d'apprentissage (toutes les lignes apprises)
    const totalLines = this.parsedLines.length;
    const learnedLines = this.parsedLines.filter(line => line.isLearned).length;
    const linesPercentage = totalLines > 0 ? Math.round((learnedLines / totalLines) * 100) : 0;
    
    if (linesPercentage >= 100) {
      this.showCompletion();
      return;
    }
    
    // Sauvegarder automatiquement la progression
    this.autoSave();
    
    // Réappliquer les mots cachés pour toutes les lignes
    this.initializeLines();
    this.renderLyrics();
    this.updateProgress();
    
    // Défilement automatique vers la nouvelle ligne courante
    setTimeout(() => {
      this.scrollToCurrentLine();
    }, 100); // Petit délai pour que le rendu soit terminé
  }

  estimateWordWidth(word) {
    // Estimation de la largeur en caractères (ch)
    // Prend en compte que certaines lettres sont plus larges que d'autres
    let width = 0;
    for (let char of word) {
      if ('iIl|!'.includes(char)) {
        width += 0.5; // Caractères étroits
      } else if ('mMwW'.includes(char)) {
        width += 1.2; // Caractères larges
      } else {
        width += 1; // Caractères normaux
      }
    }
    return Math.max(width, 1); // Minimum 1ch
  }

  scrollToCurrentLine() {
    const currentLineElement = document.querySelector('.current-line');
    if (currentLineElement) {
      currentLineElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }

  updateProgress() {
    const totalLines = this.parsedLines.length;
    const learnedLines = this.parsedLines.filter(line => line.isLearned).length;
    const linesPercentage = totalLines > 0 ? Math.round((learnedLines / totalLines) * 100) : 0;
    
    // Mettre à jour la section de progression principale
    this.linesCompletedSpan.textContent = learnedLines;
    this.totalLinesSpan.textContent = totalLines;
    
    // Mettre à jour l'indicateur flottant
    this.floatingPercentage.textContent = `${linesPercentage}%`;
    this.floatingLines.textContent = `${learnedLines}/${totalLines}`;
    
    // Mettre à jour l'angle du cercle de progression (CSS custom property)
    const progressAngle = (linesPercentage / 100) * 360;
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
      progressCircle.style.setProperty('--progress-angle', `${progressAngle}deg`);
    }
    
    if (this.currentLineIndex < totalLines) {
      const currentLine = this.parsedLines[this.currentLineIndex];
      this.currentLevelSpan.textContent = `${linesPercentage}% de la chanson apprise`;
    } else {
      this.currentLevelSpan.textContent = `${linesPercentage}% de la chanson apprise`;
    }
  }

  showCompletion() {
    setTimeout(() => {
      alert('Félicitations ! Vous avez terminé l\'apprentissage de cette chanson ! 🎉');
    }, 500);
  }

  // Méthodes de sauvegarde et gestion des chansons
  
  generateSongId(title, lyrics) {
    // Générer un ID unique basé sur le titre et un hash simple du contenu
    const hash = lyrics.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Math.abs(hash)}`;
  }
  
  getSavedSongs() {
    const saved = localStorage.getItem('lyricsLearningApp_songs');
    return saved ? JSON.parse(saved) : {};
  }
  
  saveSong() {
    const title = this.songTitleInput.value.trim();
    const lyrics = this.lyricsInput.value.trim();
    
    if (!title || !lyrics) {
      alert('Veuillez entrer un titre et des paroles');
      return;
    }
    
    const songId = this.generateSongId(title, lyrics);
    const savedSongs = this.getSavedSongs();
    
    const songData = {
      id: songId,
      title: title,
      lyrics: lyrics,
      progress: this.parsedLines || [],
      currentLineIndex: this.currentLineIndex || 0,
      isLearningMode: this.isLearningMode || false,
      lastModified: new Date().toISOString()
    };
    
    savedSongs[songId] = songData;
    localStorage.setItem('lyricsLearningApp_songs', JSON.stringify(savedSongs));
    
    this.loadSavedSongs();
    alert('Chanson sauvegardée avec succès !');
  }
  
  autoSave() {
    // Sauvegarde automatique uniquement si une chanson est en cours d'apprentissage
    if (this.isLearningMode && this.currentSongId) {
      const savedSongs = this.getSavedSongs();
      if (savedSongs[this.currentSongId]) {
        savedSongs[this.currentSongId].progress = this.parsedLines;
        savedSongs[this.currentSongId].currentLineIndex = this.currentLineIndex;
        savedSongs[this.currentSongId].lastModified = new Date().toISOString();
        localStorage.setItem('lyricsLearningApp_songs', JSON.stringify(savedSongs));
      }
    }
  }
  
  loadSong(songId) {
    const savedSongs = this.getSavedSongs();
    const songData = savedSongs[songId];
    
    if (!songData) {
      alert('Chanson non trouvée');
      return;
    }
    
    // Charger les données de la chanson
    this.songTitleInput.value = songData.title;
    this.lyricsInput.value = songData.lyrics;
    this.songTitle = songData.title;
    this.lyrics = songData.lyrics;
    this.currentSongId = songId;
    
    // Parser les paroles et charger la progression
    this.parsedLines = this.parseText(songData.lyrics);
    this.currentLineIndex = 0; // Toujours recommencer à la première ligne
    this.isLearningMode = true;
    
    // Charger la progression sauvegardée si elle existe
    if (songData.progress && songData.progress.length > 0) {
      // Fusionner la progression sauvegardée avec les nouvelles données parsées
      this.parsedLines.forEach((line, index) => {
        if (songData.progress[index]) {
          line.hiddenCount = songData.progress[index].hiddenCount || 1;
          line.isLearned = songData.progress[index].isLearned || false;
          line.hasBeenRevealed = songData.progress[index].hasBeenRevealed || false;
        }
      });
    }
    
    // Initialiser les lignes avec les mots cachés
    this.initializeLines();
    
    // Démarrer l'apprentissage automatiquement
    this.renderLyrics();
    this.updateProgress();
    this.progressSection.style.display = 'block';
    this.floatingProgress.style.display = 'flex';
    
    // Faire défiler vers le haut puis vers la ligne courante
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Délai pour s'assurer que le rendu est terminé avant de centrer sur la ligne courante
    setTimeout(() => {
      this.scrollToCurrentLine();
    }, 300);
  }
  
  loadSongProgress() {
    if (!this.currentSongId) return;
    
    const savedSongs = this.getSavedSongs();
    const songData = savedSongs[this.currentSongId];
    
    if (songData && songData.progress && songData.progress.length > 0) {
      // Fusionner la progression sauvegardée avec les nouvelles données parsées
      this.parsedLines.forEach((line, index) => {
        if (songData.progress[index]) {
          line.hiddenCount = songData.progress[index].hiddenCount || 1;
          line.isLearned = songData.progress[index].isLearned || false;
        }
      });
      
      this.currentLineIndex = songData.currentLineIndex || 0;
    }
  }
  
  deleteSong(songId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette chanson ?')) {
      const savedSongs = this.getSavedSongs();
      delete savedSongs[songId];
      localStorage.setItem('lyricsLearningApp_songs', JSON.stringify(savedSongs));
      this.loadSavedSongs();
      
      // Si c'est la chanson actuellement chargée, la réinitialiser
      if (this.currentSongId === songId) {
        this.lyrics = '';
        this.parsedLines = [];
        this.currentLineIndex = 0;
        this.isLearningMode = false;
        this.currentSongId = null;
        this.songTitle = '';
        
        this.songTitleInput.value = '';
        this.lyricsInput.value = '';
        this.lyricsDisplay.innerHTML = '<p class="placeholder-text">Les paroles apparaîtront ici une fois que vous aurez collé du texte et cliqué sur "Commencer l\'apprentissage"</p>';
        this.progressSection.style.display = 'none';
        this.floatingProgress.style.display = 'none';
        
        this.updateProgress();
      }
    }
  }
  
  loadSavedSongs() {
    const savedSongs = this.getSavedSongs();
    const songIds = Object.keys(savedSongs);
    
    if (songIds.length === 0) {
      this.savedSongsList.innerHTML = '<div class="empty-songs-message">Aucune chanson sauvegardée</div>';
      return;
    }
    
    // Trier par date de modification (plus récent en premier)
    songIds.sort((a, b) => {
      const dateA = new Date(savedSongs[a].lastModified || 0);
      const dateB = new Date(savedSongs[b].lastModified || 0);
      return dateB - dateA;
    });
    
    const songsHTML = songIds.map(songId => {
      const song = savedSongs[songId];
      const progress = song.progress || [];
      const learnedLines = progress.filter(line => line.isLearned).length;
      const totalLines = progress.length;
      const percentage = totalLines > 0 ? Math.round((learnedLines / totalLines) * 100) : 0;
      
      return `
        <div class="saved-song-item">
          <div class="saved-song-info">
            <div class="saved-song-title">${song.title}</div>
            <div class="saved-song-progress">
              Progression : ${percentage}% (${learnedLines}/${totalLines} lignes)
            </div>
          </div>
          <div class="saved-song-actions">
            <button class="load-song-btn" onclick="app.loadSong('${songId}')">
              Charger
            </button>
            <button class="delete-song-btn" onclick="app.deleteSong('${songId}')">
              Supprimer
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    this.savedSongsList.innerHTML = songsHTML;
  }
}

// Démarrer l'application
let app; // Référence globale pour les boutons onclick
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new LyricsLearningApp();
  });
} else {
  app = new LyricsLearningApp();
}
