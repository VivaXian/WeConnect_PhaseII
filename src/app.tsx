import { appStyles } from './app.css';
import { RoleSwitcher } from './components/role-switcher';
import { AppShell } from './pages/app-shell';
import { Toast } from './components/toast';
import { useDemoPhoneScale } from './hooks/use-demo-phone-scale';

function App() {
  const { stageRef, frameRef } = useDemoPhoneScale();

  return (
    <div className={appStyles.overlay}>
      <div className={appStyles.presentation}>
        <RoleSwitcher />
        <div ref={stageRef} className={appStyles.stage}>
          <div ref={frameRef} className={appStyles.phoneFrame}>
            <div className={appStyles.shellWrapper}>
              <AppShell />
              <Toast />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
