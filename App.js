// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ItensEstoque from './src/screens/ItensEstoqueScreen';
import AdicaoListaAuditoria from './src/screens/AddListasScreen';
import AdicaoItensLista from './src/screens/AddItemScreen';
import DetalhesLista from './src/screens/DetalhesListaScreen';
import { navHeaderStyles } from './navigationStyles';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
              initialParams={{ onLogin: handleLogin }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Registrar' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdicaoListaAuditoria"
              component={AdicaoListaAuditoria}
              options={{...navHeaderStyles, title: 'Adicionar Lista de Auditoria' }}
            />
            <Stack.Screen
              name="AdicaoItensLista"
              component={AdicaoItensLista}
              options={{...navHeaderStyles, title: 'Adição de Itens a Lista' }}
            />
            <Stack.Screen
              name="DetalhesLista"
              component={DetalhesLista}
              options={{...navHeaderStyles, title: 'Detalhes da Lista' }}
            />
            <Stack.Screen
              name="ItensEstoque"
              component={ItensEstoque}
              options={{...navHeaderStyles, title: 'Itens em Estoque' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
