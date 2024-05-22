import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyAnqEt84M8V_Cq0iBHJOkGHZ5vSSDEsBhk",
    authDomain: "controledeestoqueapp-42d39.firebaseapp.com",
    projectId: "controledeestoqueapp-42d39",
    storageBucket: "controledeestoqueapp-42d39.appspot.com",
    messagingSenderId: "174710331347",
    appId: "1:174710331347:web:f0ee1bcbd358292f488126",
    measurementId: "G-NZNTSQK9M8"
  };

  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  const auth = getAuth();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuário registrado:', user.uid);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao registrar:', error.message);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Cadastro</Text>
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme a Senha"
          secureTextEntry={!confirmPasswordVisible}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
          <Icon name={confirmPasswordVisible ? "eye" : "eye-slash"} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Registrar" onPress={handleRegister} color="#3498db" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => navigation.navigate('Login')}>
          Já tem uma conta? Faça login!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 10,
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
  },
  bottomContainer: {
    marginTop: 20,
  },
  toggleText: {
    color: '#3498db',
  },
});

export default RegisterScreen;
