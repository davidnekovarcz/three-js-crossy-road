import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import Game from './components/Game';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<Game />);
}
