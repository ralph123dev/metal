import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import AuthForm from './components/AuthForm';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 transition-opacity duration-500">
          <LoadingScreen onComplete={handleLoadingComplete} />
        </div>
      )}

      {/* Auth Form */}
      <div 
        className={`transition-all duration-700 ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <AuthForm />
      </div>
    </div>
  );
}

export default App;