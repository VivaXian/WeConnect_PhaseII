import { appStyles } from './app.css';
import { RoleSwitcher } from './components/role-switcher';
import { AppShell } from './pages/app-shell';

function App() {
  return (
    <div className={appStyles.overlay}>
      <div className={appStyles.phoneFrame}>
        <RoleSwitcher />
        <div className={appStyles.shellWrapper}>
          <AppShell />
        </div>
      </div>
    </div>
  );
}

export default App;
