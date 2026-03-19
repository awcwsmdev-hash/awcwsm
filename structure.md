# Structure & Architecture Guidelines

1. **Semantic HTML5 Layout:**
   - Strictly separate the layout into three top-level areas:
     - `<header>`: Dedicated to navigation, logo, and top-bar elements.
     - `<main>`: Wraps the core page content. Inside `<main>`, place the Hero section using `<section id="hero">`.
     - `<footer>`: Dedicated to the bottom area, secondary links, and copyright.

2. **Modularity & Independence:**
   - Ensure every section (Header, Hero, Features, Footer) is independent.
   - **Constraint:** Do not nest the Hero section inside the Header.
   - Each section should have its own CSS block and comments.

3. **Code Organization:**
   - Add clear, visual comments in both HTML and CSS to separate blocks:
     - HTML: ``
     - CSS: `/* --- Section Name --- */`
   - Use CSS Variables (`:root`) defined at the top of the CSS file for all repeated values.

4. **Global Layout & Containers:**
   - Use a common `.container` class to align content centrally across all sections.
   - Standardize max-width (e.g., 1200px) and side padding to ensure a consistent visual vertical line.
   - Use Flexbox for navigation and Grid for complex content sections.