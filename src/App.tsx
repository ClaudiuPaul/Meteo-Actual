// React
import React from 'react';
// Oferă datele despre vreme
import { WeatherProvider } from './context/WeatherContext';
// Oferă starea de logare a utilizatorului
import { AuthProvider } from './context/AuthContext';
// Design-ul aplicației (bara de sus)
import { Layout } from './layouts/Layout';
// Pagina care afișează vremea efectivă
import { Dashboard } from './pages/Dashboard';
// Fereastra pop-up de logare/înregistrare
import { AuthModal } from './components/AuthModal/AuthModal';

// Componenta de bază a site-ului
const App: React.FC = () => {
  return (
    <>
      {/* Ține minte dacă ești logat */}
      <AuthProvider>
        {/* Ține minte orașul ales și vremea */}
        <WeatherProvider>
          {/* Fereastra de logare (ascunsă inițial) */}
          <AuthModal />
          {/* Designul și fundalul */}
          <Layout>
            {/* Pagina principală (vremea și atracțiile turistice) */}
            <Dashboard />
          </Layout>
        </WeatherProvider>
      </AuthProvider>
    </>
  );
};

export default App;
