import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddAuditListPage({ navigation, route }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [unit, setUnit] = useState('');

  const { updateLists } = route.params;

  const handleSave = async () => {
    try {
      // Criar objeto com os dados da lista
      const newList = {
        name: name,
        date: date,
        unit: unit,
        items: [] // Inicializar a lista de itens como um array vazio
      };
      // Salvar lista localmente
      await saveList(newList);
      // Atualizar as listas na página inicial
      updateLists();
      // Navegar para a tela de adição de itens/produtos à lista
      navigation.navigate('AdicaoItensLista', { list: newList });
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  };

  const saveList = async (list) => {
    try {
      // Obter as listas existentes
      let existingLists = await AsyncStorage.getItem('auditLists');
      existingLists = existingLists ? JSON.parse(existingLists) : [];
      // Adicionar a nova lista à lista existente
      existingLists.push(list);
      // Salvar a lista atualizada
      await AsyncStorage.setItem('auditLists', JSON.stringify(existingLists));
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Adicionar Lista de Auditoria</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Lista"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Data"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Unidade"
        value={unit}
        onChangeText={setUnit}
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
