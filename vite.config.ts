import { filament } from '@filament/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';


// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), filament(), checker({ typescript: true })],
  base: command === 'build' ? '/WeConnect_PhaseII/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5175,
  },
}));
