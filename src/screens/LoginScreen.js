import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as LocalAuthentication from 'expo-local-authentication';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    checkForBiometrics();
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

  initializeApp(firebaseConfig);
  const auth = getAuth();

  const handleAuthentication = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuário logado:", user.uid);
      if (route.params?.onLogin) {
        route.params.onLogin(user.uid);
      }
      navigation.navigate('Home');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        Alert.alert('Erro', 'Email não cadastrado.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Erro', 'Senha incorreta.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'Email inválido.');
      } else {
        Alert.alert('Erro', error.message);
      }
      console.error("Erro ao fazer login:", error.message);
    }
  };

  const checkForBiometrics = async () => {
    try {
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
      if (isBiometricAvailable) {
        authenticateBiometric();
      }
    } catch (error) {
      console.log('Biometria não disponível', error);
    }
  };

  const authenticateBiometric = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticação Biométrica',
      });
      if (biometricAuth.success) {
        Alert.alert('Autenticação bem-sucedida');
        if (route.params?.onLogin) {
          route.params.onLogin('user-uid-from-biometric-auth');
        }
        navigation.navigate('Home');
      } else {
        Alert.alert('Autenticação falhou');
      }
    } catch (error) {
      console.error('Erro de autenticação biométrica', error);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Teste Mobile</Text>
      <Text style={styles.controle}>Controle de Estoque</Text>
      <Text style={styles.desenvolvido}>Desenvolvido por Luan Glaab Fagundes</Text>
      <Text style={styles.title}>Fazer Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Icon name={passwordVisible ? "eye" : "eye-slash"} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.botaoLogin} title="Login" onPress={handleAuthentication} color="#3498db" />
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.botaoLogin} title="Login por biometria/face-id" onPress={authenticateBiometric} color="blue" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => navigation.navigate('Register')}>
          Não tem uma conta? Cadastre-se!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Alinhando os itens no início da tela
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 24,
    marginBottom: 10, 
    marginTop: 140,
  },
  desenvolvido: {
    fontSize: 12,
  },
  controle: {
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
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  inputPassword: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    borderRadius: 60,
  },
  bottomContainer: {
    marginTop: 20,
  },
  toggleText: {
    color: '#3498db',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoLogin: {
    padding: 20,
    height: 50,
  }
});

export default LoginScreen;
