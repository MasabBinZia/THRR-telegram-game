import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThirdwebProvider } from 'thirdweb/react';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider>
      <Toaster position="top-center" expand={true} richColors />
      <App />
    </ThirdwebProvider>
  </StrictMode>,
);
