import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeSecureStorage } from "bvault-js";

import {Thumbmark} from '@thumbmarkjs/thumbmarkjs';

const thumbmark = new Thumbmark();

const fingerprint: string = await thumbmark.get();

initializeSecureStorage(fingerprint)
  .then(() => {

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  })
  .catch(error => {
    console.error('Secure storage initialization failed:', error);
    // Render error UI or fallback
  });
