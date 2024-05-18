import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ItemListScreen({ route }) {
  const { list } = route.params;
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem(`@items_${list.id}`);
        if (storedItems) {
          setItems(JSON.parse(storedItems));
        } else {
          setItems(list.items);
        }
      } catch (error) {
        console.error('Failed to load items from storage', error);
        setItems(list.items);
      }
    };
    loadItems();
  }, [list.id, list.items]);

  const saveItemsToStorage = async (updatedItems) => {
    try {
      await AsyncStorage.setItem(`@items_${list.id}`, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Failed to save items to storage', error);
    }
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setIsViewModalVisible(true);
  };

  const handleEditItem = (item) => {
    if (!list.sent) {
      setEditedItem({ ...item });
      setIsEditModalVisible(true);
    } else {
      Alert.alert('Erro', 'Você não pode editar itens de uma lista enviada.');
    }
  };

  const handleDeleteItem = (item) => {
    if (!list.sent) {
      Alert.alert(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir este item?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: () => deleteItem(item) }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert('Erro', 'Você não pode excluir itens de uma lista enviada.');
    }
  };

  const deleteItem = (item) => {
    const updatedItems = items.filter(i => i.id !== item.id);
    setItems(updatedItems);
    saveItemsToStorage(updatedItems);
  };

  const closeModal = () => {
    setIsViewModalVisible(false);
    setIsEditModalVisible(false);
  };

  const saveEditedItem = () => {
    const updatedItems = items.map((item) => {
      if (item.id === editedItem.id) {
        return editedItem;
      }
      return item;
    });
    setItems(updatedItems);
    saveItemsToStorage(updatedItems);
    closeModal();
  };

  const handleEditChange = (key, value) => {
    // Para o campo de data, mantemos a formatação enquanto permitimos apenas números
    if (key === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length > 2 && value.length <= 4) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
      } else if (value.length > 4) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
      }
    } else {
      // Para os outros campos, permitimos apenas números
      value = value.replace(/\D/g, '');
    }
    setEditedItem(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Itens da Lista: {list.name}</Text>
      {items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>Código de Barras: {item.barcode}</Text>
              <Text>Data de Validade: {item.expiryDate}</Text>
              <Text>Quantidade por Embalagem: {item.quantityPerPackage}</Text>
              <Text>Quantidade: {item.quantity}</Text>
              {!list.sent && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => handleViewItem(item)}>
                    <Text style={styles.buttonText}>Ver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => handleEditItem(item)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => handleDeleteItem(item)}>
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noItems}>Nenhum item nesta lista</Text>
      )}

      {/* Modal de visualização */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isViewModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Detalhes do Item:</Text>
            <Text>Código de Barras: {selectedItem?.barcode}</Text>
            <Text>Data de Validade: {selectedItem?.expiryDate}</Text>
            <Text>Quantidade por Embalagem: {selectedItem?.quantityPerPackage}</Text>
            <Text>Quantidade: {selectedItem?.quantity}</Text>
            <Button title="Fechar" onPress={closeModal} />
          </View>
        </View>
      </Modal>

      {/* Modal de edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={closeModal}
      >
    <View style={styles.modalContainer}>
  <View style={styles.modalContent}>
    <Text>Editar Item:</Text>
    <TextInput
      style={styles.input}
      placeholder="Código de Barras"
      value={editedItem?.barcode}
      onChangeText={(text) => handleEditChange('barcode', text)}
      keyboardType="numeric"
    />
    <TextInput
      style={styles.input}
      placeholder="Data de Validade (DD/MM/AAAA)"
      value={editedItem?.expiryDate}
      onChangeText={(text) => handleEditChange('expiryDate', text)}
      keyboardType="numeric"
    />
    <TextInput
      style={styles.input}
      placeholder="Quantidade por Embalagem"
      value={editedItem?.quantityPerPackage}
      onChangeText={(text) => handleEditChange('quantityPerPackage', text)}
      keyboardType="numeric"
    />
    <TextInput
      style={styles.input}
      placeholder="Quantidade"
      value={editedItem?.quantity}
      onChangeText={(text) => handleEditChange('quantity', text)}
      keyboardType="numeric"
    />
    <Button title="Salvar" onPress={saveEditedItem} />
    <Button title="Cancelar" onPress={closeModal} />
  </View>
</View>
</Modal>
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
item: {
  marginBottom: 20,
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
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
noItems: {
  fontSize: 16,
  color: '#999',
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
  elevation: 5,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  marginBottom: 10,
  padding: 8,
},
});
