import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddAuditListPage from './AddListScreen';

export default function HomePage({ navigation }) {
  const [auditLists, setAuditLists] = useState([]);

  useEffect(() => {
    const fetchAuditLists = async () => {
      try {
        const savedLists = await AsyncStorage.getItem('auditLists');
        if (savedLists) {
          setAuditLists(JSON.parse(savedLists));
        }
      } catch (error) {
        console.error('Erro ao obter listas:', error);
      }
    };

    fetchAuditLists();
  }, []);

  const navigateToListDetails = (list) => {
    navigation.navigate('DetalhesLista', { list });
  };

  const updateLists = async () => {
    try {
      const savedLists = await AsyncStorage.getItem('auditLists');
      if (savedLists) {
        setAuditLists(JSON.parse(savedLists));
      }
    } catch (error) {
      console.error('Erro ao obter listas:', error);
    }
  };

  const handleCreateNewList = () => {
    navigation.navigate('AdicaoListaAuditoria', { updateLists });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Barra de Segmentos</Text>
      <Button
        title="Criar Nova Lista"
        onPress={handleCreateNewList}
      />
      <FlatList
        data={auditLists}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            updateLists(); // Atualize a lista antes de navegar
            navigateToListDetails(item);
          }}>
            <View style={styles.listItem}>
              <Text style={styles.listName}>{item.name}</Text>
              <Text>Data: {item.date}</Text>
              <Text>Unidade: {item.unit}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
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
});
