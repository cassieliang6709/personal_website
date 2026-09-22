import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './Studio.jsx';
import './demo.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
