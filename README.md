# FIU Eats

Welcome to FIU Eats! This is a website designed to help you understand
**databases vs. static/hardcoded data vs. React state** and why we
actually need a database.

Right now, restaurants are hardcoded in `data/restaurants.ts`, and
adding a restaurant through the "Add a Restaurant" form only updates
React state in the browser. If you refresh the page it's gone. We will fix
that by connecting a real database.

## Getting Started

1. Make sure you're on the `main` branch
2. Open the project in VS Code
3. Open a terminal in VS Code (`` Ctrl+` `` or `` Cmd+` ``)
4. Clone the repo:
   ```bash
   git clone https://github.com/zmaraj/fiu-eats.git
   cd fiu-eats
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result
