import React, { useState } from 'react';
import { MessageCircle, User, Phone, Globe, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    pays: '',
    password: ''
  });

  const countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo (Brazzaville)',
    'Congo (Kinshasa)',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czechia',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
    'Abkhazia',
    'Artsakh',
    'Cook Islands',
    'Kosovo',
    'Niue',
    'Northern Cyprus',
    'Sahrawi Arab Democratic Republic',
    'Somaliland',
    'South Ossetia',
    'Taiwan',
    'Transnistria',
    'Vatican City',
    'Åland Islands',
    'American Samoa',
    'Anguilla',
    'Aruba',
    'Bermuda',
    'British Virgin Islands',
    'Cayman Islands',
    'Christmas Island',
    'Cocos (Keeling) Islands',
    'Cook Islands',
    'Curaçao',
    'Falkland Islands',
    'Faroe Islands',
    'French Guiana',
    'French Polynesia',
    'Gibraltar',
    'Greenland',
    'Guam',
    'Guernsey',
    'Isle of Man',
    'Jersey',
    'Kosovo',
    'Macau',
    'Martinique',
    'Mayotte',
    'Montserrat',
    'New Caledonia',
    'Niue',
    'Norfolk Island',
    'Northern Mariana Islands',
    'Palestine',
    'Pitcairn Islands',
    'Puerto Rico',
    'Réunion',
    'Saint Helena, Ascension and Tristan da Cunha',
    'Saint Martin (French part)',
    'Saint Pierre and Miquelon',
    'Sint Maarten (Dutch part)',
    'South Georgia and the South Sandwich Islands',
    'Svalbard and Jan Mayen',
    'Tokelau',
    'Turks and Caicos Islands',
    'United States Minor Outlying Islands',
    'U.S. Virgin Islands',
    'Wallis and Futuna',
    'Western Sahara',
    'Zanzibar',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      nom: '',
      prenom: '',
      telephone: '',
      pays: '',
      password: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Logo Header */}
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
            {isLogin ? 'Bon retour parmi nous' : 'Rejoignez la communauté'}
          </p>
        </div>

        {/* Form Container with 3D effect */}
        <div className="relative">
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 transform transition-all duration-700 hover:shadow-3xl"
            style={{
              transform: isLogin ? 'perspective(1000px) rotateY(0deg)' : 'perspective(1000px) rotateY(0deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Mode Switch */}
            <div className="flex mb-6 bg-slate-800/50 rounded-xl p-1">
              <button
                onClick={switchMode}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-silver-400 to-blue-500 text-white shadow-lg scale-105' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                S'inscrire
              </button>
              <button
                onClick={switchMode}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${
                  isLogin 
                    ? 'bg-gradient-to-r from-silver-400 to-blue-500 text-white shadow-lg scale-105' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Se connecter
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                />
              </div>

              {/* Prénom (only for signup) */}
              {!isLogin && (
                <div className="relative group transform transition-all duration-500 animate-fadeIn">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    placeholder="Prénom"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                  />
                </div>
              )}

              {/* Téléphone */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="Numéro de téléphone"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                />
              </div>

              {/* Pays (only for signup) */}
              {!isLogin && (
                <div className="relative group transform transition-all duration-500 animate-fadeIn">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                  </div>
                  <select
                    name="pays"
                    value={formData.pays}
                    onChange={handleInputChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] appearance-none"
                  >
                    <option value="" disabled className="bg-slate-800">Sélectionnez votre pays</option>
                    {countries.map((country) => (
                      <option key={country} value={country} className="bg-slate-800">
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-silver-500 via-slate-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 active:scale-[0.98] relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLogin ? 'Se connecter' : 'Créer mon compte'}
                </span>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-xs">
                En continuant, vous acceptez nos{' '}
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors duration-200">
                  conditions d'utilisation
                </span>{' '}
                et notre{' '}
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors duration-200">
                  politique de confidentialité
                </span>
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-silver-400 to-blue-500 rounded-full opacity-40 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;