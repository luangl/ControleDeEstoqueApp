import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import FingerprintScanner from 'react-native-fingerprint-scanner';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Tentativa de autenticação biométrica ao montar o componente
    FingerprintScanner.isSensorAvailable()
      .then(biometryType => {
        if (biometryType) {
          authenticateBiometric();
        }
      })
      .catch(error => console.log('Biometria não disponível', error));
    
    return () => {
      FingerprintScanner.release();
    };
  }, []);

  const firebaseConfig = {
    apiKey: "AIzaSyAnqEt84M8V_Cq0iBHJOkGHZ5vSSDEsBhk",
    authDomain: "controledeestoqueapp-42d39.firebaseapp.com",
    projectId: "controledeestoqueapp-42d39",
    storageBucket: "controledeestoqueapp-42d39.appspot.com",
    messagingSenderId: "174710331347",
    appId: "1:174710331347:web:f0ee1bcbd358292f488126",
    measurementId: "G-NZNTSQK9M8"
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);
  const auth = getAuth();

  const handleAuthentication = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuário logado:", user.uid);
      if (onLogin) {
        onLogin(user.uid);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
    }
  };

  const authenticateBiometric = () => {
    FingerprintScanner.authenticate({ description: 'Scan your fingerprint on the device scanner to continue' })
      .then(() => {
        Alert.alert('Autenticação bem-sucedida');
        // Aqui você pode chamar a função de autenticação do Firebase ou prosseguir com o login.
        if (onLogin) {
          onLogin('user-uid-from-biometric-auth');
        }
      })
      .catch(error => {
        console.error('Erro de autenticação biométrica', error);
      });
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Sign In</Text>
      
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={handleAuthentication} color="#3498db" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Biometric Login" onPress={authenticateBiometric} color="#3498db" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText}>Need an account? Sign Up</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  bottomContainer: {
    marginTop: 20,
  },
  toggleText: {
    color: '#3498db',
  },
});

export default LoginScreen;
