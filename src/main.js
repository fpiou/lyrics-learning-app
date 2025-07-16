import './style.css'

// Classe principale pour gérer l'application d'apprentissage de paroles
class LyricsLearningApp {
  constructor() {
    this.lyrics = '';
    this.parsedLines = [];
    this.currentLineIndex = 0;
    this.isLearningMode = false;
    
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.lyricsInput = document.getElementById('lyrics-input');
    this.startButton = document.getElementById('start-learning');
    this.resetButton = document.getElementById('reset-button');
    this.lyricsDisplay = document.getElementById('lyrics-display');
    this.progressSection = document.querySelector('.progress-section');
    this.linesCompletedSpan = document.getElementById('lines-completed');
    this.totalLinesSpan = document.getElementById('total-lines');
    this.currentLevelSpan = document.getElementById('current-level');
    
    // Éléments pour l'indicateur flottant
    this.floatingProgress = document.getElementById('floating-progress');
    this.floatingPercentage = document.getElementById('floating-percentage');
    this.floatingLines = document.getElementById('floating-lines');
  }

  bindEvents() {
    this.startButton.addEventListener('click', () => this.startLearning());
    this.resetButton.addEventListener('click', () => this.reset());
  }

  startLearning() {
    const lyrics = this.lyricsInput.value.trim();
    if (!lyrics) {
      alert('Veuillez entrer des paroles de chanson');
      return;
    }

    this.lyrics = lyrics;
    this.parsedLines = this.parseText(lyrics);
    this.currentLineIndex = 0;
    this.isLearningMode = true;
    
    // Initialiser chaque ligne avec le dernier mot caché
    this.initializeLines();
    this.renderLyrics();
    this.updateProgress();
    this.progressSection.style.display = 'block';
    this.floatingProgress.style.display = 'flex';
    this.scrollToCurrentLine();
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
          // Regex amélioré pour les caractères français (lettres, chiffres, apostrophes, traits d'union, accents)
          const match = part.match(/^([^\p{L}\p{N}'''-]*)([\p{L}\p{N}'''-]+)([^\p{L}\p{N}'''-]*)$/u);
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
    
    // Réappliquer les mots cachés pour toutes les lignes
    this.initializeLines();
    this.renderLyrics();
    this.updateProgress();
    
    // Défilement automatique vers la nouvelle ligne courante
    setTimeout(() => {
      this.scrollToCurrentLine();
    }, 100); // Petit délai pour que le rendu soit terminé
  }

  calculateProgress() {
    let totalWords = 0;
    let masteredWords = 0;
    
    this.parsedLines.forEach(line => {
      const lineWordCount = line.wordElements.length;
      totalWords += lineWordCount;
      
      // Pour le calcul de progression, on prend en compte le niveau atteint par la ligne
      // même si elle n'est pas "completed" dans le cycle actuel
      if (line.hiddenCount > 1 || line.isCompleted) {
        // Si la ligne a un hiddenCount > 1, cela signifie qu'elle a été travaillée
        // On considère qu'elle contribue à la progression selon son niveau
        masteredWords += Math.min(line.hiddenCount, lineWordCount);
      }
    });
    
    const learningPercentage = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;
    
    return { totalWords, masteredWords, learningPercentage };
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

  reset() {
    this.lyrics = '';
    this.parsedLines = [];
    this.currentLineIndex = 0;
    this.isLearningMode = false;
    
    this.lyricsInput.value = '';
    this.lyricsDisplay.innerHTML = '';
    this.progressSection.style.display = 'none';
    this.floatingProgress.style.display = 'none';
    
    this.updateProgress();
  }
}

// Démarrer l'application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LyricsLearningApp();
  });
} else {
  new LyricsLearningApp();
}
