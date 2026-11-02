# 蒼月草

**Live site:** [ray-xxv.github.io/portfolio-frieren-themed](https://ray-xxv.github.io/portfolio-frieren-themed/)

## About me

Hi, I'm Nathan. I'm an IT student at Bulacan State University, from Bulacan, Philippines. I mostly build full-stack web apps with React, TypeScript and Node.js. This is my portfolio, and since I'm a big fan of Frieren, I based the whole design on it.

## How I made it

**1. Setting up the project.** I used Vite, React and TypeScript. For animation I used GSAP, and Lenis for smooth scrolling. I put all the text in one file (`src/data/content.ts`) so I can update my info without touching the components.

**2. Drawing the art.** All the flowers, leaves and sparkles are made with SVG and canvas instead of images. That keeps the site light, lets me animate everything.

**5. Animating it.** Headings slide in as you scroll, the flower stems draw themselves and bloom, the project cards scroll sideways, and a spell circle turns the page to night before the Journey section.

**6. Testing and fixing.** I took screenshots at desktop, tablet and phone sizes to catch layout problems, and fixed things like petals covering the headline and animations fighting each other. I also made sure the site works with "reduced motion" turned on, where the animations switch off and the flowers just appear already bloomed.

**7. Polishing.** After seeing it in a real browser, everything felt too big, so I scaled down the text and spacing. I also added vines connecting the first two sections and fixed a bug where the nav highlighted the wrong tab.

## Running it

```bash
npm install
npm run dev
```

## Contact

- Email: marqueznathanreigh@gmail.com
- GitHub: [ray-xxv](https://github.com/ray-xxv)
- LinkedIn: [nathan-reigh-marquez](https://linkedin.com/in/nathan-reigh-marquez/)
