# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a web application for learning song lyrics by progressively hiding words. This is an interactive lyrics learning application with line-by-line progressive masking system.

## Core Learning System Requirements:

### Line Management:
- **Current line**: Only one active line at a time (first line at initialization)
- **Line highlighting**: Clear visual indication of the current active line
- **Auto-scroll**: Automatic centering on the current line
- **Cycle system**: Return to first line after last line for continuous learning until 100% mastery

### Word Masking Rules:
- **Reverse order masking**: Words are hidden in reverse order (last word first)
- **Last word always hidden**: The last word of each line is always masked
- **Adaptive placeholders**: Placeholders should match the approximate size of hidden words
- **Unicode support**: Perfect handling of French accented characters (émoi, ça, déjà...)

### Interaction Flow:
1. **Click to reveal**: Click on any hidden word reveals ALL hidden words of the current line
2. **Self-evaluation**: Present 👍 (found it) and 👎 (didn't find it) buttons after revealing
3. **Adaptive difficulty**: 
   - 👍 → Hide one more word (progress toward line beginning)
   - 👎 → Hide one less word (but always keep last word hidden)
4. **Line progression**: Automatically move to next line after validation
5. **Progress tracking**: Calculate percentage of mastered words vs total words in song

### Technical Features:
- **Responsive design**: Mobile, tablet, and desktop compatibility
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Text input**: Large textarea for lyrics input
- **Progress display**: Real-time percentage of mastered words and completed lines
- **State management**: Track mastered lines and difficulty level per line
- **Smooth transitions**: CSS animations for better user experience

### Technologies:
- Vanilla JavaScript (no frameworks)
- CSS3 with animations and responsive design
- HTML5 semantic structure
- Single-file application (no build tool required)

### User Journey:
1. Paste lyrics in textarea
2. Click "Commencer l'apprentissage" (Start learning)
3. First line becomes active with last word hidden
4. Click on hidden word to reveal all hidden words of the line
5. Self-evaluate with 👍 or 👎
6. Automatic progression to next line
7. Continuous cycle until 100% mastery

The application should maintain perfect French character support and provide an engaging, progressive learning experience.
