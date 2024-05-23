import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ItensEstoque({ navigation }) {
  const [sentLists, setSentLists] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterText, setFilterText] = useState('');

  const fetchSentLists = async () => {
    try {
      const savedLists = await AsyncStorage.getItem('auditLists');
      if (savedLists) {
        const lists = JSON.parse(savedLists);
        let filteredLists = lists.filter(list => list.sent);

        // Filtrar por intervalo de datas
        if (startDate && endDate) {
          const filteredStartDate = convertToDate(startDate);
          const filteredEndDate = convertToDate(endDate);

          filteredLists = filteredLists.filter(list => {
            const listDate = convertToDate(list.date);
            return listDate >= filteredStartDate && listDate <= filteredEndDate;
          });
        }

        // Filtrar por nome da lista
        if (filterText) {
          filteredLists = filteredLists.filter(list =>
            list.name.toLowerCase().includes(filterText.toLowerCase())
          );
        }

        setSentLists(filteredLists);
      }
    } catch (error) {
      console.error('Erro ao obter listas enviadas:', error);
    }
  };

  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    fetchSentLists();
  }, [startDate, endDate, filterText]);

  useFocusEffect(
    useCallback(() => {
      fetchSentLists();
    }, [startDate, endDate, filterText])
  );

  const navigateToListDetails = async (list) => {
    navigation.navigate('DetalhesLista', { list });
  };

  // Função para adicionar automaticamente as barras enquanto o usuário digita
  const autoFormatDate = (inputDate) => {
    // Remove todos os caracteres que não são números
    let formattedDate = inputDate.replace(/\D/g, '');

    // Adiciona barras nas posições corretas
    if (formattedDate.length > 2) {
      formattedDate = formattedDate.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (formattedDate.length > 5) {
      formattedDate = formattedDate.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    return formattedDate;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>
      <View style={styles.dateFilter}>
        <TextInput
          style={styles.input}
          placeholder="Filtrar Data (Data Inicial)"
          value={startDate}
          onChangeText={text => text.length <= 10 && setStartDate(autoFormatDate(text))}
        />
        <TextInput
          style={styles.input}
          placeholder="Data final (DD/MM/AAAA)"
          value={endDate}
          onChangeText={text => text.length <= 10 && setEndDate(autoFormatDate(text))}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Filtrar por nome da lista"
        value={filterText}
        onChangeText={setFilterText}
      />
      <ScrollView>
        {sentLists.map((list, index) => (
          <TouchableOpacity key={index} onPress={() => navigateToListDetails(list)}>
            <View style={styles.listItem}>
              <Text style={styles.listName}>{list.name}</Text>
              <Text>Data: {list.date}</Text>
              <Text>Unidade: {list.unit}</Text>
              <Text style={styles.quantidade}>Quantidade de itens cadastrados na lista: {list.items.length}</Text> 
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  quantidade: {
    fontWeight: 'bold',
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
    fontSize: 17,
  },
  dateFilter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  }
});
