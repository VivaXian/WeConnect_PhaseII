import './normalize-layer.css';

import { backgroundPrimary } from '@filament/react/atomic-styles';
import { base } from '@filament/react/base-styles';
import '@filament/react/fonts/latin';
import '@filament/react/fonts/chinese-simplified';
import { blue } from '@filament/react/themes/blue.css';
import { light } from '@filament/react/themes/light.css';
import { medium } from '@filament/react/themes/medium.css';
import { Portal } from '@filament/react/utils';
import clsx from 'clsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { appFontFamily } from './app-font.css';
import { Toast } from './components/toast';

const AppWithTheme = () => (
  <div
    className={clsx(blue, light, medium, base, backgroundPrimary, appFontFamily)}
  >
    <Portal>
      <App />
    </Portal>
    <Toast />
  </div>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppWithTheme />
  </React.StrictMode>
);
