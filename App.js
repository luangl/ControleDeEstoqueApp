// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdicaoListaAuditoria from './src/screens/AddListScreen';
import AdicaoItensLista from './src/screens/AddItemScreen';
import DetalhesLista from './src/screens/DetalhesLista';

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
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
            initialParams={{ onLogin: handleLogin }}
          />
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
              options={{ title: 'Adicionar Lista de Auditoria' }}
            />
            <Stack.Screen
              name="AdicaoItensLista"
              component={AdicaoItensLista}
              options={{ title: 'Adição de Itens/Produtos a Lista' }}
            />
            <Stack.Screen
              name="DetalhesLista"
              component={DetalhesLista}
              options={{ title: 'Detalhes da Lista' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
