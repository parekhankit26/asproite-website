# Asproite — Dynamic React Website

A full-featured, dynamic React + Vite website for Asproite Cloud and Consultancy.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
# Output will be in the /dist folder — ready to deploy
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Fixed nav with active route detection
│   ├── Footer.jsx       # Footer with newsletter form state
│   └── index.jsx        # Cursor, PageHeader, Marquee, SectionHeader, CTABox, AnimatedCounter
├── pages/
│   ├── Home.jsx         # Neural canvas, typing animation, stats, services preview
│   ├── About.jsx        # Hex bg, animated counters, timeline, team grid
│   ├── Services.jsx     # Circuit canvas, all 9 services, process steps
│   ├── Portfolio.jsx    # Dynamic filter, project grid, testimonials
│   └── Contact.jsx      # Globe canvas, form validation, FAQ accordion
├── data/
│   └── siteData.js      # ⭐ All content data — edit this to update the site
├── hooks/
│   └── index.js         # useScrollReveal, useCounter, useNeuralCanvas, useTyping
├── styles/
│   └── global.css       # All shared CSS variables and global styles
├── App.jsx              # Router + Layout
└── main.jsx             # Entry point
```

## ✏️ How to Update Content

All website content lives in **`src/data/siteData.js`** — no need to touch page components:

- **Services**: Edit the `services` array to add/remove/change services
- **Portfolio projects**: Edit `portfolioProjects` to update case studies
- **Team members**: Edit `team` array
- **Company timeline**: Edit `timeline` array
- **Testimonials**: Edit `testimonials` array
- **FAQ**: Edit `faqs` array
- **Tech stack**: Edit `techStack` array

## 🎨 Theme Customisation

CSS variables in `src/styles/global.css`:

```css
:root {
  --cyan:  #00d4ff;   /* Primary accent */
  --gold:  #f4b942;   /* Secondary accent / New badge */
  --bg:    #070b12;   /* Main background */
  --text:  #dde4f0;   /* Body text */
  --muted: #6a7d99;   /* Muted text */
}
```

## ⚡ Dynamic Features

| Feature | Implementation |
|---|---|
| Page routing | React Router v6 |
| Typing animation | Custom `useTyping` hook |
| Neural network canvas | Custom `useNeuralCanvas` hook |
| Portfolio filtering | React `useState` + `useMemo` |
| Animated number counters | `IntersectionObserver` + RAF |
| Form validation | Controlled form with real-time error clearing |
| FAQ accordion | `useState` toggle |
| Scroll reveal | `IntersectionObserver` |
| Custom cursor | `mousemove` event listener |
| Newsletter subscription | Local state (connect to API) |

## 🌐 Deployment

The built `/dist` folder is a static SPA — deploy to any host:

- **Netlify**: `netlify deploy --dir=dist`
- **Vercel**: `vercel --prod`
- **GitHub Pages**: push `/dist` to `gh-pages` branch
- **Any web host**: upload `/dist` contents

> ⚠️ For proper React Router to work on your host, configure URL rewriting so all paths serve `index.html`.

## 📧 Connecting the Contact Form

In `src/pages/Contact.jsx`, replace the simulated API call:

```js
// Replace this:
await new Promise(r => setTimeout(r, 1200));

// With your real API call, e.g.:
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form)
});
```

---

Built with React 18 + React Router 6 + Vite 5
