# 📚 Content Creation Guide

## Creating New Game Packs for ShowOff

This guide explains how to create custom game packs using CSV files.

---

## CSV File Structure

Your CSV file should have three sections:

### 1. Metadata Header (Rows 1-2)

```csv
GameTitle_EN,GameTitle_HE,ThemeColor,IconName,BackgroundURL
Avatar Trivia,טריוויה אווטאר,#4A90E2,🌊,/assets/avatar_bg.png
```

**Fields:**
- `GameTitle_EN` - English title (required)
- `GameTitle_HE` - Hebrew title (optional, defaults to English)
- `ThemeColor` - Hex color code for UI (default: #4A90E2)
- `IconName` - Emoji or icon (default: 🎮)
- `BackgroundURL` - Path to background image (optional)

### 2. Questions Section

Leave a blank line after metadata, then add column headers:

```csv
Question,Answer1,Answer2,Answer3,Answer4,Difficulty,TimeLimit,ImageURL,Category
```

**Question Format:**
- `Question` - The question text (required)
- `Answer1` - **Correct answer** (required) - ALWAYS FIRST
- `Answer2-4` - Wrong answers (at least one required)
- `Difficulty` - 1 (Easy), 2 (Medium), or 3 (Hard)
- `TimeLimit` - Seconds to answer (default: 20)
- `ImageURL` - Optional image for question
- `Category` - Question category (default: "General")

**Example Questions:**

```csv
Question,Answer1,Answer2,Answer3,Answer4,Difficulty,TimeLimit,ImageURL,Category
Who is the Avatar?,Aang,Zuko,Sokka,Katara,1,20,,Characters
What element does Toph bend?,Earth,Fire,Water,Air,1,20,,Elements
How many chakras did Aang open?,Seven,Five,Nine,Six,2,20,,Advanced
```

### 3. Punishments Section

Add a separator line, then punishment tasks:

```csv

---PUNISHMENTS---
Text,Duration
Do 10 jumping jacks!,30
Sing a song loudly for 20 seconds,20
Act like a bender for 15 seconds,15
```

**Punishment Format:**
- `Text` - The punishment task description (required)
- `Duration` - Seconds to complete (default: 30)

---

## Best Practices

### Questions

✅ **DO:**
- Aim for 50 questions total (17 easy, 17 medium, 16 hard)
- Keep questions clear and concise
- Ensure one obviously correct answer
- Add variety in categories
- Test questions for clarity

❌ **DON'T:**
- Use ambiguous wording
- Create questions with multiple correct answers
- Make questions too long
- Use obscure references only experts know

### Difficulty Guidelines

**Easy (1):** Basic knowledge, mainstream facts
```
Example: "What color is the sky?" 
```

**Medium (2):** Requires more specific knowledge
```
Example: "What year did the Beatles release 'Hey Jude'?"
```

**Hard (3):** Expert-level, detailed knowledge
```
Example: "What was the original name of the band before they became The Beatles?"
```

### Punishments

✅ **DO:**
- Keep tasks fun and lighthearted
- Make them doable in the time limit
- Consider group dynamics
- Vary difficulty and physicality

❌ **DON'T:**
- Create embarrassing or harmful tasks
- Require props or equipment
- Make tasks too difficult or dangerous
- Include offensive content

**Good Punishment Examples:**
- "Do your best celebrity impression!"
- "Speak in rhymes for 20 seconds"
- "Dance like nobody's watching for 15 seconds"
- "Tell a corny dad joke"

**Bad Punishment Examples:**
- "Drink a whole bottle of water" (requires props)
- "Do 50 pushups" (too difficult)
- "Tell a secret" (potentially embarrassing)

---

## Example: Complete CSV File

```csv
GameTitle_EN,GameTitle_HE,ThemeColor,IconName,BackgroundURL
Harry Potter,הארי פוטר,#740001,⚡,/assets/hp_bg.png

Question,Answer1,Answer2,Answer3,Answer4,Difficulty,TimeLimit,ImageURL,Category
What house is Harry in?,Gryffindor,Slytherin,Hufflepuff,Ravenclaw,1,20,,Houses
Who is the potions master?,Severus Snape,Albus Dumbledore,Minerva McGonagall,Rubeus Hagrid,1,20,,Characters
What is Hermione's cat named?,Crookshanks,Scabbers,Hedwig,Fang,2,20,,Pets
What spell summons objects?,Accio,Expelliarmus,Lumos,Wingardium Leviosa,2,20,,Spells
How many Horcruxes did Voldemort create?,Seven,Six,Eight,Five,3,25,,Advanced

---PUNISHMENTS---
Text,Duration
Wave your wand and cast a spell!,20
Speak in a British accent for 30 seconds,30
Do your best Dumbledore impression,25
Pretend to fly on a broomstick,20
```

---

## Importing Your CSV

### Method 1: Using Content Manager (Code)

```javascript
import { importFromCSV } from './utils/contentManager.js';

const csvText = `...your CSV content...`;
const result = importFromCSV(csvText);

if (result.success) {
  console.log('Game pack created:', result.data);
} else {
  console.error('Errors:', result.errors);
}
```

### Method 2: Manual Conversion

1. Create CSV file following format above
2. Save as `mygame.csv`
3. Use content manager to convert to JSON
4. Save as `src/questions/mygame.js`
5. Import in `src/questions/index.js`:

```javascript
import { myGamePack } from './mygame';

export const gamePacks = {
  // ... existing games
  my_game: myGamePack
};
```

---

## Validation Checklist

Before publishing your game pack:

- [ ] 50 questions total (or at least 15 for legacy format)
- [ ] Balanced difficulty: ~17 easy, ~17 medium, ~16 hard
- [ ] 20 punishment tasks
- [ ] All questions have 2-4 answer options
- [ ] Answer1 is always the correct answer
- [ ] No duplicate questions
- [ ] Punishments are appropriate and fun
- [ ] Theme color is visible (#RRGGBB format)
- [ ] Icon displays correctly
- [ ] Titles in both languages (if bilingual)
- [ ] Categories are meaningful
- [ ] Time limits are reasonable (15-30 seconds)

---

## CSV Formatting Tips

### Handling Special Characters

If your text contains commas, wrap in quotes:

```csv
"Who said, ""To be or not to be?""",Shakespeare,Dickens,Austen,Hemingway,2,20,,Quotes
```

### Multi-line Text

Keep questions on single lines. Use `\n` for line breaks if needed:

```csv
What is the capital\nof France?,Paris,London,Berlin,Madrid,1,20,,Geography
```

### Hebrew Content

Save CSV as UTF-8 encoding to preserve Hebrew characters:

```csv
מי הוא גיבור הסדרה?,אנג,זוקו,סוקה,קטרה,1,20,,דמויות
```

---

## Testing Your Pack

1. Import your CSV
2. Run in **Debug Mode** (single-player)
3. Play through at least 5 questions
4. Verify:
   - Questions display correctly
   - Correct answer is marked right
   - Time limits work
   - Punishments are fun
   - Difficulty progression feels right

---

## Publishing & Sharing

Once your game pack is ready:

1. **Test thoroughly** in debug mode
2. **Play with friends** to get feedback
3. **Adjust** based on feedback
4. **Share** your CSV file or exported JSON

---

## Need Help?

- Check existing game packs for examples
- See `utils/contentManager.js` for import/export code
- Review `src/questions/avatar.js` as a reference
- Open an issue on GitHub for support

---

**Happy Game Creating! 🎮**

*Made with ❤️ by G.T AI Studio*
