import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EstoqueScreen() {
  const [stockItems, setStockItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const savedLists = await AsyncStorage.getItem('auditLists');
        if (savedLists) {
          const auditLists = JSON.parse(savedLists);
          const sentLists = auditLists.filter(list => list.sent);
          const items = [];
          for (const list of sentLists) {
            const storedItems = await AsyncStorage.getItem(`@items_${list.id}`);
            if (storedItems) {
              items.push(...JSON.parse(storedItems));
            }
          }
          const sortedItems = items.sort((a, b) => a.barcode.localeCompare(b.barcode));
          setStockItems(sortedItems);
        }
      } catch (error) {
        console.error('Erro ao obter itens de estoque:', error);
      }
    };

    fetchStockItems();
  }, []);

  const filteredItems = stockItems.filter(item => item.barcode.includes(searchQuery));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar por código de barras"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listName}>{item.name}</Text>
            <Text>Código de Barras: {item.barcode}</Text>
            <Text>Quantidade: {item.quantity}</Text>
            <Text>Quantidade Por Embalagem: {item.quantityPerPackage}</Text>
            <Text>Data de Validade: {item.expiryDate}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eee',
    marginTop: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  listItem: {
    backgroundColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listName: {
    marginTop: "-8%",
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
});
