import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddItemsToList({ navigation, route }) {
  const [barcode, setBarcode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantityPerPackage, setQuantityPerPackage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [list, setList] = useState(route.params.list);

  function generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const randomValue = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomValue}`;
  }

  const handleDateChange = (inputDate) => {
    const formattedDate = inputDate
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2}\/\d{2}\/\d{4})\d+?$/, '$1');
    setExpiryDate(formattedDate);
  };

  const validateDate = (date) => {
    const [day, month, year] = date.split('/');
    const isValidDate = new Date(`${year}-${month}-${day}`);
    return isValidDate && isValidDate.getFullYear() === parseInt(year, 10);
  };

  const handleSave = async () => {
    setError('');
    if (!barcode || !expiryDate || !quantityPerPackage || !quantity) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (expiryDate.length !== 10 || !validateDate(expiryDate)) {
      setError('Por favor, preencha a data de validade corretamente.');
      return;
    }

    try {
      const newItem = {
        id: generateUniqueId(),
        barcode: barcode,
        expiryDate: expiryDate,
        quantityPerPackage: quantityPerPackage,
        quantity: quantity
      };

      const updatedList = {
        ...list,
        items: [...list.items, newItem]
      };

      setList(updatedList);
      await saveUpdatedList(updatedList);

      Alert.alert(
        'Item Adicionado',
        'Deseja adicionar mais itens?',
        [
          { text: 'Não', onPress: () => navigation.navigate('Home') },
          { text: 'Sim', onPress: clearInputs }
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  };

  const clearInputs = () => {
    setBarcode('');
    setExpiryDate('');
    setQuantityPerPackage('');
    setQuantity('');
    setError('');
  };

  const saveUpdatedList = async (updatedList) => {
    try {
      let existingLists = await AsyncStorage.getItem('auditLists');
      existingLists = existingLists ? JSON.parse(existingLists) : [];

      const index = existingLists.findIndex(
        item => item.name === updatedList.name && item.date === updatedList.date && item.unit === updatedList.unit
      );

      if (index !== -1) {
        existingLists[index] = updatedList;
      } else {
        existingLists.push(updatedList);
      }

      await AsyncStorage.setItem('auditLists', JSON.stringify(existingLists));
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Adicionar Item à Lista</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Código de Barras"
        value={barcode}
        onChangeText={setBarcode}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Validade (DD/MM/AAAA)"
        value={expiryDate}
        onChangeText={handleDateChange}
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade por Embalagem"
        value={quantityPerPackage}
        onChangeText={setQuantityPerPackage}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
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
