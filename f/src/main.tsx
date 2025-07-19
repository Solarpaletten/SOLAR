import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AssistantProvider } from './components/assistant/AssistantContext';

import './index.css';
import App from './App';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AssistantProvider>
        <App />
      </AssistantProvider>
    </BrowserRouter>
  </StrictMode>
);
