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

  const handleEstoque = () => {
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
      <View><Text style={styles.title}>Teste Mobile - Controle de Estoque</Text></View>
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
          <View style={styles.buttonContainer}>
      <Button
        title="Criar Nova Lista"
        onPress={handleCreateNewList}
        style={styles.buttonCriar}
        color="blue"
      />
      <Button
        title="Controle de Estoque"
        onPress={handleEstoque}
        style={styles.buttonControle}
        color="green"
      />
    </View>

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
                  <TouchableOpacity style={styles.buttonVer} onPress={() => navigateToListDetails(item)}>
                    <Text style={styles.buttonText}>Ver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity backgroundColor="red" style={styles.buttonExcluir} onPress={() => deleteList(item)}>
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonSincronizar} onPress={() => syncList(item)}>
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
    paddingTop: 60,
    backgroundColor: '#ccc'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
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
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  listName: {
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: "100%",
  },  
  buttonVer: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonExcluir: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonSincronizar: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
