import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddItemsToList({ navigation, route }) {
  const [barcode, setBarcode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantityPerPackage, setQuantityPerPackage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const { list } = route.params;

  function generateUniqueId() {
    const timestamp = Date.now().toString(36); // Usando timestamp como parte do ID
    const randomValue = Math.random().toString(36).substr(2, 5); // Adicionando um valor aleatório
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

  const handleSave = async () => {
    if (!barcode || !expiryDate || !quantityPerPackage || !quantity) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (expiryDate.length !== 10) {
        setError('Por favor, preencha a data de validade corretamente.');
        return;
      }

    try {
      // Criar objeto com os dados do item
      const newItem = {
        id: generateUniqueId(),
        barcode: barcode,
        expiryDate: expiryDate,
        quantityPerPackage: quantityPerPackage,
        quantity: quantity
      };

      // Adicionar o novo item à lista de itens
      list.items.push(newItem);

      // Salvar a lista atualizada localmente
      await saveUpdatedList(list);

      // Perguntar ao usuário se deseja adicionar mais itens
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
      // Obter as listas existentes
      let existingLists = await AsyncStorage.getItem('auditLists');
      existingLists = existingLists ? JSON.parse(existingLists) : [];

      // Encontrar a lista atualizada na lista existente
      const index = existingLists.findIndex(item => item.name === updatedList.name && item.date === updatedList.date && item.unit === updatedList.unit);

      // Substituir a lista existente pela lista atualizada
      if (index !== -1) {
        existingLists[index] = updatedList;
      } else {
        existingLists.push(updatedList);
      }

      // Salvar a lista atualizada
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
