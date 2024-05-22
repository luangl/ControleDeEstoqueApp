import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SentItemsScreen({ navigation }) {
  const [sentLists, setSentLists] = useState([]);

  const fetchSentLists = async () => {
    try {
      const savedLists = await AsyncStorage.getItem('auditLists');
      if (savedLists) {
        const parsedLists = JSON.parse(savedLists);
        const filteredLists = parsedLists.filter(list => list.sent);
        setSentLists(filteredLists);
      }
    } catch (error) {
      console.error('Erro ao obter listas:', error);
    }
  };

  useEffect(() => {
    fetchSentLists();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSentLists();
    }, [])
  );

  const navigateToItemList = (list) => {
    navigation.navigate('ItemList', { list });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToItemList(item)}>
      <View style={styles.listItem}>
        <Text style={styles.listName}>{item.name}</Text>
        <Text>Código de Barras: {item.barcode}</Text>
        <Text>Quantidade: {item.quantity}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigateToItemList(item)}>
            <Text style={styles.buttonText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
      <FlatList
        data={sentLists}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  listName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
