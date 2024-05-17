// screens/AddItemsToList.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddItemsToList({ navigation, route }) {
  const [barcode, setBarcode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantityPerPackage, setQuantityPerPackage] = useState('');
  const [quantity, setQuantity] = useState('');

  const { list } = route.params;

  const handleSave = async () => {
    try {
      // Criar objeto com os dados do item
      const newItem = {
        barcode: barcode,
        expiryDate: expiryDate,
        quantityPerPackage: quantityPerPackage,
        quantity: quantity
      };
      // Adicionar o novo item à lista de itens
      list.items.push(newItem);
      // Atualizar a lista na memória (não persistente)
      console.log('Lista com novo item:', list);
      // Salvar a lista atualizada localmente
      await saveUpdatedList(list);
      // Voltar para a página inicial (Home page)
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
    }
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
      <TextInput
        style={styles.input}
        placeholder="Código de Barras"
        value={barcode}
        onChangeText={setBarcode}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Validade"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade por Embalagem"
        value={quantityPerPackage}
        onChangeText={setQuantityPerPackage}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
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

