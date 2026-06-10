import React, { createContext, useContext, useState, useEffect } from 'react';

// Structura utilizatorului
interface User {
  id: number;
  username: string;
  city: string;
}

// Interfața pentru contextul de autentificare
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

// Crearea contextului
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider-ul care va înveli aplicația
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Verificăm dacă există un utilizator salvat în localStorage la pornire
  useEffect(() => {
    const savedUser = localStorage.getItem('meteo_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Eroare la parsarea datelor utilizatorului salvat');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('meteo_user', JSON.stringify(userData));
    setIsAuthModalOpen(false); // Închidem fereastra după logare
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('meteo_user');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizat pentru a folosi contextul
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth trebuie utilizat în interiorul unui AuthProvider');
  }
  return context;
};
