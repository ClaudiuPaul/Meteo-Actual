import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import { Layout } from './layouts/Layout';
import { Dashboard } from './pages/Dashboard';

// Baza aplicației
const App: React.FC = () => {
  return (
    // Oferă datele meteo pentru toată aplicația
    <WeatherProvider>
      {/* Design-ul principal (fundal, cutie) */}
      <Layout>
        {/* Pagina principală care arată vremea */}
        <Dashboard />
      </Layout>
    </WeatherProvider>
  );
};

export default App;
