import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SentItemsScreen({ navigation }) {
  const [sentItems, setSentItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchSentItems = async () => {
    try {
      const savedLists = await AsyncStorage.getItem('auditLists');
      if (savedLists) {
        const parsedLists = JSON.parse(savedLists);
        const filteredItems = parsedLists
          .filter(list => list.sent)
          .reduce((accumulator, currentList) => [...accumulator, ...currentList.items], []);
        setSentItems(filteredItems);
      }
    } catch (error) {
      console.error('Erro ao obter itens enviados:', error);
    }
  };

  useEffect(() => {
    fetchSentItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSentItems();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={styles.listItem}>
        <Text>Código de Barras: {item.barcode}</Text>
        <Text>Quantidade: {item.quantity}</Text>
        <Text>Quantidade por Embalagem: {item.quantityPerPackage}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleItemPress(item)}>
            <Text style={styles.buttonText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
      <FlatList
        data={sentItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text>Código de Barras: {selectedItem.barcode}</Text>
                <Text>Quantidade: {selectedItem.quantity}</Text>
              <Text>Data de Validade: {selectedItem.expiryDate}</Text>
              <Text>Quantidade por Embalagem: {selectedItem.quantityPerPackage}</Text>
                <Button title="Fechar" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
});
