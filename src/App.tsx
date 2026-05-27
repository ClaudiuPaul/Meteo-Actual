import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import { Layout } from './layouts/Layout';
import { Dashboard } from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <WeatherProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </WeatherProvider>
  );
};

export default App;
