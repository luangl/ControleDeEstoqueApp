// Exemplo de tela inicial
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Página Inicial</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'blue', // Altere a cor para a cor desejada
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default HomeScreen;
