import { RouterProvider } from 'react-router-dom';
import { router } from './core/router/router';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './core/components/ui/Toast';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
