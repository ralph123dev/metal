import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, User, Phone, Globe, Home, Settings, Send, Bell } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';

// Initialisation de Firebase
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "AIzaSyA9fMT5Sj91Z3BzgcF8TvVvocRzide3nNc",
  authDomain: "datascrapr-d6250.firebaseapp.com",
  projectId: "datascrapr-d6250",
  storageBucket: "datascrapr-d6250.appspot.com",
  messagingSenderId: "861823831568",
  appId: "1:861823831568:web:f4f71e45c7d10d480d4495",
  measurementId: "G-7Q9L777MX6"
};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Définitions pour les codes de pays
const countryCallingCodes = {
  "1": "United States", "44": "United Kingdom", "33": "France", "49": "Germany", "81": "Japan", "86": "China",
  "91": "India", "27": "South Africa", "61": "Australia", "55": "Brazil", "52": "Mexico", "34": "Spain",
  "39": "Italy", "7": "Russia", "971": "United Arab Emirates", "966": "Saudi Arabia", "212": "Morocco",
  "213": "Algeria", "216": "Tunisia", "221": "Senegal", "225": "Ivory Coast", "234": "Nigeria",
  "243": "Congo (Kinshasa)", "254": "Kenya", "263": "Zimbabwe", "351": "Portugal", "353": "Ireland",
  "358": "Finland", "41": "Switzerland", "46": "Sweden", "47": "Norway", "48": "Poland", "60": "Malaysia",
  "62": "Indonesia", "63": "Philippines", "64": "New Zealand", "65": "Singapore", "66": "Thailand",
  "82": "South Korea", "90": "Turkey",
};

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Abkhazia', 'Artsakh', 'Cook Islands', 'Kosovo', 'Niue', 'Northern Cyprus', 'Sahrawi Arab Democratic Republic', 'Somaliland', 'South Ossetia', 'Taiwan', 'Transnistria', 'Vatican City', 'Åland Islands', 'American Samoa', 'Anguilla', 'Aruba', 'Bermuda', 'British Virgin Islands', 'Cayman Islands', 'Christmas Island', 'Cocos (Keeling) Islands', 'Cook Islands', 'Curaçao', 'Falkland Islands', 'Faroe Islands', 'French Guiana', 'French Polynesia', 'Gibraltar', 'Greenland', 'Guam', 'Guernsey', 'Isle of Man', 'Jersey', 'Kosovo', 'Macau', 'Martinique', 'Mayotte', 'Mayotte', 'Montserrat', 'New Caledonia', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Palestine', 'Pitcairn Islands', 'Puerto Rico', 'Réunion', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Martin (French part)', 'Saint Pierre and Miquelon', 'Sint Maarten (Dutch part)', 'South Georgia and the South Sandwich Islands', 'Svalbard and Jan Mayen', 'Tokelau', 'Turks and Caicos Islands', 'United States Minor Outlying Islands', 'U.S. Virgin Islands', 'Wallis and Futuna', 'Western Sahara', 'Zanzibar',
];

const AuthForm = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ nom: '', telephone: '', pays: '' });
  const [showPolicy, setShowPolicy] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'telephone' && !isLogin) {
      let detectedCountry = '';
      for (let code in countryCallingCodes) {
        if (value.startsWith('+' + code)) {
          detectedCountry = countryCallingCodes[code];
        }
      }
      setFormData(prev => ({ ...prev, pays: detectedCountry, telephone: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');
      const q = query(usersRef, where('phoneNumber', '==', formData.telephone));
      const querySnapshot = await getDocs(q);

      if (isLogin) {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          onLoginSuccess({ id: userDoc.id, ...userDoc.data() });
        } else {
          setError("Aucun compte trouvé avec ce numéro de téléphone.");
        }
      } else {
        if (!querySnapshot.empty) {
          setError("Un compte existe déjà avec ce numéro de téléphone.");
        } else {
          const newUserRef = doc(usersRef);
          await setDoc(newUserRef, {
            name: formData.nom,
            phoneNumber: formData.telephone,
            country: formData.pays,
            createdAt: serverTimestamp()
          });
          const userDoc = await getDocs(query(usersRef, where('phoneNumber', '==', formData.telephone)));
          const newUser = userDoc.docs[0];
          onLoginSuccess({ id: newUser.id, ...newUser.data() });
        }
      }
    } catch (err) {
      console.error('Erreur Firebase:', err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ nom: '', telephone: '', pays: '' });
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-silver-400 to-blue-500 rounded-xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-silver-200 via-white to-blue-300 bg-clip-text text-transparent">
            Metal Exchange
          </span>
        </h1>
        <p className="text-slate-400 text-sm">
          {isLogin ? 'Bienvenue à nouveau' : 'Rejoignez la communauté'}
        </p>
      </div>
      <div className="relative">
        <div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 transform transition-all duration-700 hover:shadow-3xl"
          style={{ transform: 'perspective(1000px) rotateY(0deg)', transformStyle: 'preserve-3d' }}
        >
          <div className="flex mb-6 bg-slate-800/50 rounded-xl p-1">
            <button
              onClick={switchMode}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${!isLogin ? 'bg-gradient-to-r from-silver-400 to-blue-500 text-white shadow-lg scale-105' : 'text-slate-300 hover:text-white'}`}
            >
              S'inscrire
            </button>
            <button
              onClick={switchMode}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${isLogin ? 'bg-gradient-to-r from-silver-400 to-blue-500 text-white shadow-lg scale-105' : 'text-slate-300 hover:text-white'}`}
            >
              Se connecter
            </button>
          </div>
          {error && (
            <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-lg mb-4 animate-fadeIn">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Nom" required={!isLogin} className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]" />
              </div>
            )}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} placeholder="Numéro de téléphone (ex: +33 6 12 34 56 78)" required className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]" />
            </div>
            {!isLogin && (
              <div className="relative group transform transition-all duration-500 animate-fadeIn">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <select name="pays" value={formData.pays} onChange={handleInputChange} required={!isLogin} className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] appearance-none">
                  <option value="" disabled className="bg-slate-800">Sélectionnez votre pays</option>
                  {countries.map((country, index) => (<option key={`${country}-${index}`} value={country} className="bg-slate-800">{country}</option>))}
                </select>
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-silver-500 via-slate-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 active:scale-[0.98] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="relative z-10">
                {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer un compte')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-xs">
              En continuant, vous acceptez nos{' '}
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors duration-200" onClick={() => setShowPolicy(true)}>
                conditions d'utilisation
              </span>{' '}
              et notre{' '}
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors duration-200" onClick={() => setShowPolicy(true)}>
                politique de confidentialité
              </span>
            </p>
          </div>
          {showPolicy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative">
                <button className="absolute top-2 right-2 text-slate-500 hover:text-blue-600 text-xl font-bold" onClick={() => setShowPolicy(false)}>&times;</button>
                <h2 className="text-lg font-bold mb-2 text-slate-800">Politique de confidentialité</h2>
                <p className="text-slate-700 text-sm mb-2">Vos informations sont utilisées uniquement pour la gestion de votre compte. Elles ne seront jamais partagées sans votre consentement.</p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-silver-400 to-blue-500 rounded-full opacity-40 animate-bounce"></div>
      </div>
    </div>
  );
};

const UserList = ({ users, onUserSelect, title = "Utilisateurs", unreadCounts = {} }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20 w-full">
      <h2 className="text-lg font-bold text-white mb-4">
        <span className="bg-gradient-to-r from-silver-200 via-white to-blue-300 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '60vh' }}>
        {users.length > 0 ? (
          users.map(user => (
            <button key={user.id} onClick={() => onUserSelect(user)} className="flex items-center space-x-3 w-full p-3 rounded-xl bg-slate-800/50 text-left hover:bg-slate-700/50 transition-colors duration-200 relative">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <p className="text-white font-medium">{user.name}</p>
              {/* Afficher le badge des messages non lus */}
              {unreadCounts[user.id] > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center p-1">
                  {unreadCounts[user.id]}
                </span>
              )}
            </button>
          ))
        ) : (
          <p className="text-slate-400 text-center text-sm">Aucun utilisateur trouvé.</p>
        )}
      </div>
    </div>
  );
};

const Chat = ({ currentUserId, selectedUser, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const readStatusTimeoutRef = useRef(null);

  // Déterminer un ID de conversation unique
  const conversationId = [currentUserId, selectedUser.id].sort().join('_');

  useEffect(() => {
    // Écouter les messages de la conversation
    const messagesRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages', conversationId, 'chat');
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      messagesList.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
      setMessages(messagesList);
      scrollToBottom();
    });
    return () => unsubscribe();
  }, [conversationId]);

  // Écouter l'indicateur d'écriture de l'autre utilisateur
  useEffect(() => {
    const typingRef = doc(db, 'artifacts', appId, 'public', 'data', 'typingStatus', conversationId);
    const unsubscribe = onSnapshot(typingRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().typingUserId !== currentUserId) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });
    return () => unsubscribe();
  }, [conversationId, currentUserId]);

  // Marquer les messages comme lus lorsque le chat est ouvert
  useEffect(() => {
    const updateReadStatus = async () => {
      if (currentUserId && conversationId) {
        const readStatusRef = doc(db, 'artifacts', appId, 'public', 'data', 'readStatus', currentUserId);
        // Utilise un timestamp du serveur pour la précision
        await setDoc(readStatusRef, { [conversationId]: serverTimestamp() }, { merge: true });
      }
    };
    updateReadStatus();
    // Met également à jour après un court délai pour s'assurer que les messages récents sont bien marqués
    readStatusTimeoutRef.current = setTimeout(updateReadStatus, 1000);
    return () => {
        clearTimeout(readStatusTimeoutRef.current);
    }
  }, [currentUserId, conversationId]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages', conversationId, 'chat');
      await addDoc(messagesRef, {
        senderId: currentUserId,
        text: newMessage,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
      const typingRef = doc(db, 'artifacts', appId, 'public', 'data', 'typingStatus', conversationId);
      await setDoc(typingRef, { typingUserId: '' }, { merge: true });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };
  
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    const typingRef = doc(db, 'artifacts', appId, 'public', 'data', 'typingStatus', conversationId);
    setDoc(typingRef, { typingUserId: currentUserId }, { merge: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setDoc(typingRef, { typingUserId: '' }, { merge: true });
    }, 2000);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
      <div className="flex items-center space-x-2 pb-4 border-b border-white/20">
        <button onClick={onBack} className="md:hidden text-white hover:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {selectedUser.name[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{selectedUser.name}</h2>
          {isTyping && (
            <div className="flex items-center space-x-1 mt-1 animate-pulse">
              <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animation-delay-150"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animation-delay-300"></span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto my-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-xl max-w-xs md:max-w-md break-words ${msg.senderId === currentUserId ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
              <span className="block text-right text-xs text-gray-400 mt-1">
                {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <input type="text" value={newMessage} onChange={handleTyping} placeholder="Écrire un message..." className="flex-1 pl-4 pr-3 py-2 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <button type="submit" className="p-3 bg-blue-600 rounded-xl text-white shadow-lg hover:bg-blue-500 transition-colors duration-200">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

// Composant pour afficher la liste des messages non lus
const NewsPage = ({ unreadUsers, onUserSelect }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20 w-full h-full flex flex-col">
      <h2 className="text-lg font-bold text-white mb-4">
        <span className="bg-gradient-to-r from-silver-200 via-white to-blue-300 bg-clip-text text-transparent">
          Nouveaux messages
        </span>
      </h2>
      <div className="space-y-2 flex-1 overflow-y-auto">
        {unreadUsers.length > 0 ? (
          unreadUsers.map(user => (
            <button key={user.id} onClick={() => onUserSelect(user)} className="flex items-center justify-between space-x-3 w-full p-3 rounded-xl bg-slate-800/50 text-left hover:bg-slate-700/50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                <p className="text-white font-medium">{user.name}</p>
              </div>
              <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {user.unreadCount}
              </span>
            </button>
          ))
        ) : (
          <div className="text-center text-slate-400 text-sm mt-8">
            <Bell className="w-12 h-12 mx-auto mb-2 text-slate-500" />
            <p>Aucun nouveau message pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsPage = () => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center h-full flex flex-col justify-center items-center">
    <Settings className="w-16 h-16 text-blue-400 mb-4" />
    <h2 className="text-xl font-bold text-white mb-2">Paramètres</h2>
    <p className="text-slate-400">Fonctionnalités à venir : notifications, profil, etc.</p>
  </div>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [recentChatUsers, setRecentChatUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Authentification initiale
  useEffect(() => {
    const authUser = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Erreur lors de l'authentification :", e);
      }
    };
    authUser();
  }, []);

  // Détecter la taille de l'écran pour le responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Récupérer les utilisateurs et les messages non lus après la connexion
  useEffect(() => {
    if (!isLoggedIn || !currentUser) return;

    // 1. Écouter la liste de tous les utilisateurs
    const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');
    const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllUsers(usersList.filter(u => u.id !== currentUser.id));
    });

    // 2. Écouter le statut de lecture pour calculer les messages non lus
    const readStatusRef = doc(db, 'artifacts', appId, 'public', 'data', 'readStatus', currentUser.id);
    const unsubscribeReadStatus = onSnapshot(readStatusRef, async (readStatusDoc) => {
      const lastReads = readStatusDoc.exists() ? readStatusDoc.data() : {};
      
      const unreadCountsMap = {};
      const recentUserIds = new Set();
      const messagesRef = collection(db, 'artifacts', appId, 'public', 'data', 'messages');
      const messagesSnapshot = await getDocs(messagesRef);

      // Obtenir tous les IDs de conversation et les IDs des participants
      const conversationIds = messagesSnapshot.docs.map(doc => doc.id);
      conversationIds.forEach(id => {
        const parts = id.split('_');
        if (parts.includes(currentUser.id)) {
          const otherUserId = parts.find(uid => uid !== currentUser.id);
          if (otherUserId) recentUserIds.add(otherUserId);
        }
      });
      
      // Pour chaque conversation, compter les messages non lus
      for (const otherUserId of recentUserIds) {
        const convId = [currentUser.id, otherUserId].sort().join('_');
        const lastReadTimestamp = lastReads[convId];
        
        // Requête pour compter les messages de l'autre utilisateur après le dernier message lu
        const q = lastReadTimestamp 
          ? query(collection(db, 'artifacts', appId, 'public', 'data', 'messages', convId, 'chat'), where('createdAt', '>', lastReadTimestamp), where('senderId', '==', otherUserId))
          : query(collection(db, 'artifacts', appId, 'public', 'data', 'messages', convId, 'chat'), where('senderId', '==', otherUserId));

        const unreadDocs = await getDocs(q);
        const count = unreadDocs.size;
        if (count > 0) {
          unreadCountsMap[otherUserId] = count;
        }
      }
      
      setUnreadCounts(unreadCountsMap);
      
      // Mettre à jour la liste des conversations récentes pour afficher les non lus en premier
      const allUsersMap = new Map(allUsers.map(u => [u.id, u]));
      const usersWithUnread = Object.keys(unreadCountsMap).map(id => ({
          ...allUsersMap.get(id),
          unreadCount: unreadCountsMap[id]
      }));
      const usersWithoutUnread = allUsers.filter(u => !unreadCountsMap[u.id] && recentChatUsers.some(rcu => rcu.id === u.id));
      setRecentChatUsers([...usersWithUnread, ...usersWithoutUnread]);
      
    });

    return () => {
      unsubscribeUsers();
      unsubscribeReadStatus();
    };
  }, [isLoggedIn, currentUser, allUsers]);

  const onLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setCurrentPage('chat');
  };

  const handleBack = () => {
    setSelectedUser(null);
    setCurrentPage('home');
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <AuthForm onLoginSuccess={onLoginSuccess} />;
    }

    if (isMobile) {
      switch (currentPage) {
        case 'home':
          return <UserList users={recentChatUsers} onUserSelect={handleUserSelect} title="Conversations récentes" unreadCounts={unreadCounts} />;
        case 'users':
          return <UserList users={allUsers} onUserSelect={handleUserSelect} />;
        case 'news':
          const unreadUsers = allUsers.filter(u => unreadCounts[u.id] > 0).map(u => ({...u, unreadCount: unreadCounts[u.id]}));
          return <NewsPage unreadUsers={unreadUsers} onUserSelect={handleUserSelect} />;
        case 'settings':
          return <SettingsPage />;
        case 'chat':
          return <Chat currentUserId={currentUser.id} selectedUser={selectedUser} onBack={handleBack} />;
        default:
          return <UserList users={recentChatUsers} onUserSelect={handleUserSelect} title="Conversations récentes" unreadCounts={unreadCounts} />;
      }
    } else {
      return (
        <div className="flex w-full h-full rounded-2xl shadow-2xl overflow-hidden">
          <div className="w-2/3 p-4">
            {selectedUser ? (
              <Chat currentUserId={currentUser.id} selectedUser={selectedUser} onBack={handleBack} />
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center h-full flex items-center justify-center">
                <p className="text-slate-400">Sélectionnez une conversation récente ou un utilisateur pour commencer à chatter.</p>
              </div>
            )}
          </div>
          <div className="w-1/3 p-4 bg-slate-900/50">
            {currentPage === 'news' ? (
                <NewsPage unreadUsers={allUsers.filter(u => unreadCounts[u.id] > 0).map(u => ({...u, unreadCount: unreadCounts[u.id]}))} onUserSelect={handleUserSelect} />
            ) : currentPage === 'users' ? (
                <UserList users={allUsers} onUserSelect={handleUserSelect} />
            ) : (
                <UserList users={recentChatUsers} onUserSelect={handleUserSelect} title="Conversations récentes" unreadCounts={unreadCounts} />
            )}
            
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZWYxPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAgMCBMIDAgMCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZWYxPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Z3I+')] opacity-30"></div>
      <div className="flex-1 w-full max-w-6xl z-10 p-4">
        {renderContent()}
      </div>

      {isLoggedIn && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/50 backdrop-blur-lg border-t border-white/20 flex justify-around p-2 z-20">
          <button onClick={() => setCurrentPage('home')} className={`relative flex flex-col items-center text-xs font-medium ${currentPage === 'home' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
            <Home className="w-6 h-6" />
            <span>Accueil</span>
          </button>
          <button onClick={() => setCurrentPage('users')} className={`flex flex-col items-center text-xs font-medium ${currentPage === 'users' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
            <User className="w-6 h-6" />
            <span>Utilisateurs</span>
          </button>
          <button onClick={() => setCurrentPage('news')} className={`relative flex flex-col items-center text-xs font-medium ${currentPage === 'news' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
            <Bell className="w-6 h-6" />
            <span>Nouveautés</span>
            {/* Affiche un badge de notification avec le nombre total de messages non lus */}
            {Object.keys(unreadCounts).length > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
          <button onClick={() => setCurrentPage('settings')} className={`flex flex-col items-center text-xs font-medium ${currentPage === 'settings' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
            <Settings className="w-6 h-6" />
            <span>Paramètres</span>
          </button>
        </div>
      )}
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
};

export default App;
