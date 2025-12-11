import { useEffect } from 'react';
import { useAuthStore } from './stores/auth';
import AppRoutes from './router';

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AppRoutes />;
}

export default App;

