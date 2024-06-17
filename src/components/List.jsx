import React from 'react'
import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '../service/api';

function List() {
 const [users, setUsers] = useState([]);

 useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View >
    <Text >Usres from JSONPlaceholder</Text>
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View >
          <Text >{item.name}</Text>
        </View>
      )}
    />
  </View>
  )
}

export default List