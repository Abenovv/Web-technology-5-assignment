# Assignment 5 JavaScript Basics

**Student:** Yerkebulan Abenov  
**Group:** IT-2511  
**Repository:** https://github.com/Abenovv/Web-technology-5-assignment

This assignment has three pages. I used HTML for the page structure, CSS for the design, and JavaScript for the game, board, and form. Each task has its own JavaScript file. The project does not use libraries.

## How to open the project

Download the files and open `index.html` in a browser. Keep the HTML files, `style.css`, and the `js` folder together. Use the navigation links to switch between tasks. Nothing needs to be installed.

## Files and chosen options

| File | Purpose |
| --- | --- |
| `index.html` | Task 1, option A: Higher or Lower |
| `board.html` | Task 2, option A: Kanban board |
| `character.html` | Task 3, option B: Character creator |
| `style.css` | Shared colors, spacing, and responsive layout |
| `js/task1.js` | Game rules and button events |
| `js/task2.js` | Task data, filtering, sorting, and card movement |
| `js/task3.js` | Live preview, validation, and final character card |

The scripts use `defer`, so the browser reads the HTML before running the JavaScript.

## Notes for explaining the code

### Variables and conditions

I use `const` when I do not need to assign a different value to a variable. I use `let` for values that change, such as lives and the current streak. A `const` array can still have its items updated; `const` prevents assigning a different array to that variable.

`===` checks equality without changing the types. `&&` means both conditions must be true. `||` means at least one condition must be true. The game uses these operators to check the selected direction and compare the numbers.

### Task 1

`randomNumber()` uses `Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + STEP)) + MIN_NUMBER`. Here, `STEP` is 1. `Math.random()` gives a value from 0 up to, but not including, 1. Multiplication sets the range, `Math.floor()` removes the decimal part, and adding the minimum sets the first possible number. The extra 1 includes the maximum.

`makeGuess(direction)` checks the move before changing the game. A correct guess increases the streak. An equal number also counts as correct. A wrong guess removes one life and resets the streak. `renderGame()` updates the numbers, counters, and buttons. `restartGame()` starts another round without reloading the page.

### Task 2

`tasks` is an array of ten objects. Each object describes one card with an id, title, tag, priority, status, required flag, and list of steps.

`render()` creates the board from that data. It uses `createElement()` to make elements and `textContent` to add text. The code changes a task's status first, then calls `render()` again. This keeps the displayed board matched to the array.

`countTasks(status)` uses a loop to count matching cards. The count controls the progress bar and the limit of three cards in progress. Hidden cards still count toward that limit.

Event delegation means one click listener on the board handles all card buttons. The clicked button's `dataset` gives the task id and action. `makeButton()` adds those values when it creates a button. `updateFilters()` refreshes the board after searching, changing the tag, or choosing a sort order.

### Task 3

`getTotalPoints()` adds the four skills. `getMainSkill()` finds the main skill for the selected class. `updatePreview()` changes the character preview while the user types.

The four custom rules are:

1. The name cannot match a taken name, ignoring capital letters and surrounding spaces.
2. The four skills must total exactly 20.
3. The main skill must be at least 6: strength for a Warrior, magic for a Mage, or speed for a Ranger.
4. No other skill can be higher than the main skill. Equal values are allowed.

`validateFields()` checks these rules. `setCustomValidity()` adds a custom error; an empty string clears it. HTML attributes still check required values, whole numbers, and the range from 1 to 10. `form.noValidate = true` turns off browser popups, while `checkValidity()` still checks the rules.

`blur` marks a field as touched. After that, `input` updates its error message while typing. `change` also handles selections. `showErrors()` displays the messages and sets `aria-invalid`. On `submit`, `preventDefault()` stops the reload. Errors are counted, and the first invalid field receives focus. Valid data goes to `createResult()`, then `resetForm()` restores the starting field values.

## Short demonstration

Play a few guesses and restart. On the board, move a third card into progress, then try adding a fourth. Try a search with no matches. In the form, try the taken name `Atlas`, then a new name. A valid Warrior uses strength 6, defense 5, magic 4, and speed 5.

There is no saved browser storage. Reloading restores the starting data. Game restart keeps the best streak on that page. Form reset keeps the latest result and names already used during that visit. Opening a task with its navigation link starts that page again.
"# Web-technology-5-assignment" 
