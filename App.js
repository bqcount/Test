import React, { useState, useEffect } from 'react';
import {View } from 'react-native';
import Main from './src/components/Main';
import getAllEmployees from './src/service/odooService'


export default function App() {
  useEffect(() => {
    const fetchData = async () => {
        try {
            const employees = await getAllEmployees();
            console.log('Employees from Odoo:', employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    fetchData();
}, []);

  return (
    <View>
     <Main/>
    </View>
  );
}


