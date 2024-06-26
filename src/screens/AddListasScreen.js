import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddAuditListPage({ navigation, route }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');

  const { updateLists } = route.params;

  function generateUniqueId() {
    const timestamp = Date.now().toString(36); 
    const randomValue = Math.random().toString(36).substr(2, 5); 
    return `${timestamp}-${randomValue}`;
  }
  
  const isValidDate = (dateString) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateString);
  };

  const handleDateChange = (inputDate) => {
    const formattedDate = inputDate
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2}\/\d{2}\/\d{4})\d+?$/, '$1');
    setDate(formattedDate);
  };

  const handleSave = async () => {
    if (!name || !date || !unit) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (!isValidDate(date)) {
      setError('Por favor, insira uma data válida no formato DD/MM/AAAA.');
      return;
    }

    try {
      const newList = {
        id: generateUniqueId(),
        name: name,
        date: date,
        unit: unit,
        items: []
      };
      await saveList(newList);
      updateLists();
      navigation.navigate('AdicaoItensLista', { list: newList });
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  };

  const saveList = async (list) => {
    try {
      let existingLists = await AsyncStorage.getItem('auditLists');
      existingLists = existingLists ? JSON.parse(existingLists) : [];

      existingLists.push(list);

      await AsyncStorage.setItem('auditLists', JSON.stringify(existingLists));
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Adicionar Lista de Auditoria</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Nome da Lista"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Data (DD/MM/AAAA)"
        value={date}
        onChangeText={handleDateChange}
        keyboardType="numeric"
        maxLength={10}
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
    backgroundColor: '#eee',
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
