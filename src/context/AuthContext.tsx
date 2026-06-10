import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Structura utilizatorului
export interface User {
  id: string;
  username: string;
  city: string;
  email: string;
}

// Interfața pentru contextul de autentificare
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

// Crearea contextului
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider-ul care va înveli aplicația
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Ascultăm schimbările de stare de la Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obținem informațiile suplimentare (username, city) din Firestore
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: data.username || 'Utilizator',
              city: data.city || ''
            });
          } else {
            // Caz de siguranță dacă nu s-a creat profilul în Firestore
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: 'Utilizator',
              city: ''
            });
          }
        } catch (error) {
          console.error("Eroare la citirea datelor utilizatorului:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Eroare la delogare:", error);
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAuthModalOpen, openAuthModal, closeAuthModal }}>
      {/* Nu afișăm interfața până nu știm dacă utilizatorul este logat sau nu */}
      {!loading && children}
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
