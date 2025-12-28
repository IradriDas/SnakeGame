# Snake Game — Vanilla JavaScript

A classic **Snake Game** built using **HTML, CSS, and vanilla JavaScript**, featuring grid-based movement, real-time controls, scoring, timer tracking, and persistent high scores using `localStorage`.

This project focuses on **game loop logic**, **state management**, and **DOM-driven rendering** without external libraries.

---

## Features

- Grid-based Snake movement
- Keyboard controls (Arrow Keys)
- Food generation with collision avoidance
- Score tracking
- Persistent **High Score** using `localStorage`
- Game timer (minutes : seconds)
- Start and Restart game modals
- Game over detection:
    - Wall collision
    - Self-collision
- Responsive board generated dynamically

---

## Live Usage

Open `index.html` directly in a browser.

No build tools, no dependencies.

---

## Controls

| Key | Action |
| --- | --- |
| Arrow Up | Move Up |
| Arrow Down | Move Down |
| Arrow Left | Move Left |
| Arrow Right | Move Right |

The snake **cannot reverse direction directly** (prevents instant self-collision).

---

## Project Structure

```
.
├── index.html  # Game layout and UI
├── style.css   # Styling, grid, and theme variables
└── script.js   # Game logic, rendering, and state
```

---

## Game Architecture

### Grid System

- Each cell is `30 × 30` pixels
- The board is filled dynamically based on screen size
- Each cell is mapped using a coordinate key:

```jsx
blocks["row-col"]
```

This allows constant-time access to any grid cell.

---

### Snake State

The snake is stored as an array of coordinate objects:

```jsx
let snake = [
  {x:1,y:4 },
  {x:1,y:5 },
  {x:1,y:6 }
];
```

- `snake[0]` is always the **head**
- New head positions are calculated each frame
- Tail segments are removed unless food is eaten

---

### Food Generation

Food is generated at random positions, with safeguards to ensure it **never spawns on the snake body**:

```jsx
snake.some(segment =>
  segment.x === food.x && segment.y === food.y
)
```

---

### Game Loop

The game runs using `setInterval`:

- **Render loop:** every 200ms
- **Timer loop:** every 1000ms

Each render cycle:

1. Calculate next head position
2. Check wall collision
3. Check self collision
4. Handle food consumption
5. Update score and high score
6. Redraw snake and food

---

### Game Over Conditions

The game ends when:

- The snake hits the wall
- The snake collides with its own body

A modal is displayed showing:

- Reason for game over
- Final score
- Restart option

---

### High Score Persistence

High scores are stored using:

```jsx
localStorage.getItem("highScore")
```

They persist across browser sessions automatically.

---

## Styling

- CSS Grid used for board layout
- CSS variables define colors, spacing, and radius
- Modal overlay with backdrop blur
- Clear visual distinction between:
    - Snake body
    - Snake head
    - Food

---

## Design Principles

- Real-time rendering with deterministic state
- Clear separation of:
    - Game logic
    - Rendering
    - Input handling
- No external dependencies
- Predictable, debuggable control flow

---

## Possible Improvements

- Difficulty levels (speed scaling)
- Mobile touch controls
- Pause / Resume feature
- Sound effects
- Animated transitions
- Refactor into a class-based architecture
