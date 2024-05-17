import React, { useState } from 'react';
import { View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <View style={{ flex: 1 }}>
      {user ? <HomeScreen /> : <LoginScreen onLogin={handleLogin} />}
    </View>
  );
}
