import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './layouts/Layout';
import { Dashboard } from './pages/Dashboard';
import { AuthModal } from './components/AuthModal/AuthModal';

// Baza aplicației
const App: React.FC = () => {
  return (
    <>
      {/* Oferă starea de autentificare (user, login, logout) */}
      <AuthProvider>
        {/* Oferă datele meteo pentru toată aplicația */}
        <WeatherProvider>
          <AuthModal />
          {/* Design-ul principal (fundal, cutie) */}
          <Layout>
            {/* Pagina principală care arată vremea */}
            <Dashboard />
          </Layout>
        </WeatherProvider>
      </AuthProvider>
    </>
  );
};

export default App;

