import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Starea formularului
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    city: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // curățăm eroarea când utilizatorul tastează
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // Autentificare cu Firebase
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('../../services/firebase');
        
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        closeAuthModal();
      } else {
        // Înregistrare cu Firebase
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const { doc, setDoc } = await import('firebase/firestore');
        const { auth, db } = await import('../../services/firebase');

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Salvăm numele și orașul în baza de date Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          username: formData.username,
          city: formData.city,
          email: formData.email,
          createdAt: new Date()
        });
        
        closeAuthModal();
      }
    } catch (err: any) {
      // Mesaje de eroare mai prietenoase
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Acest email este deja folosit!');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('Email sau parolă incorectă!');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Parola trebuie să aibă minim 6 caractere.');
      } else {
        setErrorMsg('A apărut o eroare la conectare. Verifică datele.');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Fundal întunecat (Overlay) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />
      
      {/* Fereastra Modală (Glassmorphism) */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl overflow-hidden transform transition-all">
        {/* Efect de lumină subtilă de fundal */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />

        <div className="relative p-8">
          {/* Buton Închidere */}
          <button 
            onClick={closeAuthModal}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Titlu și Comutare (Tabs) */}
          <div className="flex gap-6 border-b border-white/10 mb-8 pb-2">
            <button 
              className={`text-xl font-bold pb-2 transition-colors relative ${isLogin ? 'text-white' : 'text-white/50'}`}
              onClick={() => setIsLogin(true)}
            >
              Autentificare
              {isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400" />}
            </button>
            <button 
              className={`text-xl font-bold pb-2 transition-colors relative ${!isLogin ? 'text-white' : 'text-white/50'}`}
              onClick={() => setIsLogin(false)}
            >
              Cont Nou
              {!isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400" />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input 
                  type="text" 
                  name="username"
                  placeholder="Nume utilizator"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input 
                type="email" 
                name="email"
                placeholder="Adresa de email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input 
                type="password" 
                name="password"
                placeholder="Parola"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input 
                  type="text" 
                  name="city"
                  placeholder="Oraș de reședință (ex: București)"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                />
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm font-medium text-center">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-indigo-500/25 transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed scale-100' : 'hover:scale-[1.02]'
              }`}
            >
              {isLoading ? 'Se conectează...' : (isLogin ? 'Intră în cont' : 'Creează cont')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
