import { filament } from '@filament/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), filament(), checker({ typescript: true })],
  base: '/WeConnect_PhaseII/',
  server: {
    host: '0.0.0.0',
    port: 5175,
  },
});
