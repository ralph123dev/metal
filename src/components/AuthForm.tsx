import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Phone, Globe } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

// base de données importer sur mon email appeller DataScrapr
const firebaseConfig = {
  apiKey: "AIzaSyA9fMT5Sj91Z3BzgcF8TvVvocRzide3nNc",
  authDomain: "datascrapr-d6250.firebaseapp.com",
  projectId: "datascrapr-d6250",
  storageBucket: "datascrapr-d6250.appspot.com",
  messagingSenderId: "861823831568",
  appId: "1:861823831568:web:f4f71e45c7d10d480d4495",
  measurementId: "G-7Q9L777MX6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Liste des indicatifs téléphoniques et pays (simplifiée pour l'exemple)
// Vous pouvez trouver des listes plus complètes en ligne et les importer ici
const countryCallingCodes = {
  "1": "United States", // Inclut aussi le Canada et d'autres pays du NANP
  "44": "United Kingdom",
  "33": "France",
  "49": "Germany",
  "81": "Japan",
  "86": "China",
  "91": "India",
  "27": "South Africa",
  "61": "Australia",
  "55": "Brazil",
  "52": "Mexico",
  "34": "Spain",
  "39": "Italy",
  "7": "Russia", // et Kazakhstan
  "971": "United Arab Emirates",
  "966": "Saudi Arabia",
  "212": "Morocco",
  "213": "Algeria",
  "216": "Tunisia",
  "221": "Senegal",
  "225": "Ivory Coast",
  "234": "Nigeria",
  "243": "Congo (Kinshasa)",
  "254": "Kenya",
  "263": "Zimbabwe",
  "351": "Portugal",
  "353": "Ireland",
  "358": "Finland",
  "41": "Switzerland",
  "46": "Sweden",
  "47": "Norway",
  "48": "Poland",
  "60": "Malaysia",
  "62": "Indonesia",
  "63": "Philippines",
  "64": "New Zealand",
  "65": "Singapore",
  "66": "Thailand",
  "82": "South Korea",
  "90": "Turkey",
};


const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    pays: '' // L'utilisateur choisit manuellement, ou est rempli automatiquement
  });
  const [showPolicy, setShowPolicy] = useState(false);

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Abkhazia', 'Artsakh', 'Cook Islands', 'Kosovo', 'Niue', 'Northern Cyprus', 'Sahrawi Arab Democratic Republic', 'Somaliland', 'South Ossetia', 'Taiwan', 'Transnistria', 'Vatican City', 'Åland Islands', 'American Samoa', 'Anguilla', 'Aruba', 'Bermuda', 'British Virgin Islands', 'Cayman Islands', 'Christmas Island', 'Cocos (Keeling) Islands', 'Cook Islands', 'Curaçao', 'Falkland Islands', 'Faroe Islands', 'French Guiana', 'French Polynesia', 'Gibraltar', 'Greenland', 'Guam', 'Guernsey', 'Isle of Man', 'Jersey', 'Kosovo', 'Macau', 'Martinique', 'Mayotte', 'Mayotte', 'Montserrat', 'New Caledonia', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Palestine', 'Pitcairn Islands', 'Puerto Rico', 'Réunion', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Martin (French part)', 'Saint Pierre and Miquelon', 'Sint Maarten (Dutch part)', 'South Georgia and the South Sandwich Islands', 'Svalbard and Jan Mayen', 'Tokelau', 'Turks and Caicos Islands', 'United States Minor Outlying Islands', 'U.S. Virgin Islands', 'Wallis and Futuna', 'Western Sahara', 'Zanzibar',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Logique pour détecter l'indicatif téléphonique et remplir le pays
    if (name === 'telephone' && !isLogin) {
      let detectedCountry = '';
      // On essaie de trouver le plus long indicatif correspondant
      for (let code in countryCallingCodes) {
        if (value.startsWith('+' + code)) {
          detectedCountry = countryCallingCodes[code];
        }
      }
      setFormData(prev => ({
        ...prev,
        pays: detectedCountry,
        telephone: value // Assurez-vous que la valeur du téléphone est aussi mise à jour
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Connexion : vérifier si le numéro existe dans Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phoneNumber', '==', formData.telephone));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Utilisateur trouvé, connexion réussie
          const userData = querySnapshot.docs[0].data();
          console.log('User Data:', userData);
          alert("Connexion réussie !");
        } else {
          setError("Aucun compte trouvé avec ce numéro de téléphone.");
        }
      } else {
        // Inscription : enregistrer nom, téléphone, pays dans Firestore
        // Vérifier si le numéro existe déjà
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phoneNumber', '==', formData.telephone));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setError("Un compte existe déjà avec ce numéro de téléphone.");
        } else {
          // Créer un nouvel utilisateur
          const newUserRef = doc(usersRef);
          await setDoc(newUserRef, {
            name: formData.nom,
            phoneNumber: formData.telephone,
            country: formData.pays,
            createdAt: new Date()
          });
          alert("Inscription réussie ! Vous pouvez maintenant vous connecter avec votre numéro de téléphone.");
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error('Firebase error:', err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({
      nom: '',
      telephone: '',
      pays: '' // Réinitialise le pays lors du changement de mode
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZWYxPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAgMCBMIDAgMCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZWYxPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Z3I+')] opacity-30"></div>

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
            {isLogin ? 'Welcome back to us' : 'Join the community'}
          </p>
        </div>

        <div className="relative">
          <div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 transform transition-all duration-700 hover:shadow-3xl"
            style={{
              transform: isLogin ? 'perspective(1000px) rotateY(0deg)' : 'perspective(1000px) rotateY(0deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="flex mb-6 bg-slate-800/50 rounded-xl p-1">
              <button
                onClick={switchMode}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${!isLogin
                    ? 'bg-gradient-to-r from-silver-400 to-blue-500 text-white shadow-lg scale-105'
                    : 'text-slate-300 hover:text-white'
                  }`}
              >
                To register
              </button>
              <button
                onClick={switchMode}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${isLogin
                    ? 'bg-gradient-to-r from-silver-400 to-blue-500 text-white shadow-lg scale-105'
                    : 'text-slate-300 hover:text-white'
                  }`}
              >
                Login
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-lg mb-4 animate-fadeIn">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom (uniquement pour l'inscription) */}
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required={!isLogin}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                  />
                </div>
              )}

              {/* Téléphone (pour l'inscription et la connexion) */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="Phone number (e.g., +33 6 12 34 56 78)"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                />
              </div>

              {/* Pays (uniquement pour l'inscription) */}
              {!isLogin && (
                <div className="relative group transform transition-all duration-500 animate-fadeIn">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                  </div>
                  <select
                    name="pays"
                    value={formData.pays}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] appearance-none"
                  >
                    <option value="" disabled className="bg-slate-800">Select your country</option>
                    {countries.map((country, index) => (
                      <option key={`${country}-${index}`} value={country} className="bg-slate-800">
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-silver-500 via-slate-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 active:scale-[0.98] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créate account')}
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-xs">
                En continuant, vous acceptez nos{' '}
                <span
                  className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors duration-200"
                  onClick={() => setShowPolicy(true)}
                >
                  conditions d'utilisation
                </span>{' '}
                et notre{' '}
                <span
                  className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors duration-200"
                  onClick={() => setShowPolicy(true)}
                >
                  Privacy Policy
                </span>
              </p>
            </div>
            {/* Popup modal */}
            {showPolicy && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative">
                  <button
                    className="absolute top-2 right-2 text-slate-500 hover:text-blue-600 text-xl font-bold"
                    onClick={() => setShowPolicy(false)}
                  >
                    ×
                  </button>
                  <h2 className="text-lg font-bold mb-2 text-slate-800">Privacy Policy</h2>
                  <p className="text-slate-700 text-sm mb-2">
                    Your information (name, phone number, country) is used solely for the management of your Metal Exchange account. It will never be shared with third parties without your consent. For any questions, please contact us.

                    By using this service, you agree to our Terms of Use and Privacy Policy.
                  </p>
                  <p className="text-slate-700 text-xs">
                    By using this service, you consent to our Terms of Use and Privacy Policy.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-silver-400 to-blue-500 rounded-full opacity-40 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;