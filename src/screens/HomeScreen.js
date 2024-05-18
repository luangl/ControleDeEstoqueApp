import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomePage({ navigation }) {
  const [auditLists, setAuditLists] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState('pendentes');
    
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

  const updateLists = useCallback(async () => {
    fetchAuditLists();
  }, []);

  useEffect(() => {
    fetchAuditLists();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAuditLists();
    }, [])
  );

  const navigateToListDetails = (list) => {
    navigation.navigate('DetalhesLista', { list });
  };

  const handleCreateNewList = () => {
    navigation.navigate('AdicaoListaAuditoria', { updateLists });
  };

  const handleVerEstoque = () => {
    navigation.navigate('ItensEstoque');
  };

  const deleteList = async (list) => {
    try {
      const updatedLists = auditLists.filter(item => item !== list);
      await AsyncStorage.setItem('auditLists', JSON.stringify(updatedLists));
      setAuditLists(updatedLists);
    } catch (error) {
      console.error('Erro ao excluir lista:', error);
    }
  };

  const syncList = async (list) => {
    try {
      // Sua lógica de sincronização aqui
      // Após a sincronização, você pode mover a lista para a seção 'enviadas'
      list.sent = true;
      await AsyncStorage.setItem('auditLists', JSON.stringify(auditLists));
      setAuditLists([...auditLists]);
    } catch (error) {
      console.error('Erro ao sincronizar lista:', error);
    }
  };

  const renderListSegment = () => {
    if (selectedSegment === 'pendentes') {
      return auditLists.filter(list => !list.sent);
    } else if (selectedSegment === 'enviadas') {
      return auditLists.filter(list => list.sent);
    }
    return [];
  };

  return (
    <View style={styles.container}>
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segment, selectedSegment === 'pendentes' && styles.selectedSegment]}
          onPress={() => setSelectedSegment('pendentes')}
        >
          <Text style={styles.segmentText}>Listas Pendentes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, selectedSegment === 'enviadas' && styles.selectedSegment]}
          onPress={() => setSelectedSegment('enviadas')}
        >
          <Text style={styles.segmentText}>Listas Enviadas</Text>
        </TouchableOpacity>
      </View>
      <Button
        title="Criar Nova Lista"
        onPress={handleCreateNewList}
      />
      <Button
        title="Ver itens/Produtos do estoque"
        onPress={handleVerEstoque}
      />
      <FlatList
        data={renderListSegment()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToListDetails(item)}>
            <View style={styles.listItem}>
              <Text style={styles.listName}>{item.name}</Text>
              <Text>Data: {item.date}</Text>
              <Text>Unidade: {item.unit}</Text>
              {selectedSegment === 'pendentes' && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => navigateToListDetails(item)}>
                    <Text style={styles.buttonText}>Ver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => deleteList(item)}>
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => syncList(item)}>
                    <Text style={styles.buttonText}>Sincronizar</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedSegment: {
    borderBottomColor: '#007bff',
  },
  segmentText: {
    fontSize: 16,
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
});
