import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/caveat/500.css';
import '@fontsource/shippori-mincho/500.css';
import 'lenis/dist/lenis.css';

import './styles/tokens.css';
import './styles/global.css';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
