import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import odooService from './src/service/odooService';
import Main from './src/components/Main';

const App = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const uid = await odooService.authenticate();
        if (uid) {
          const empList = await odooService.getEmployees(uid);
          setEmployees(empList);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    }; 

    fetchEmployees();
  }, []);

  return (
    <View>
      <Main />
      <Text>Employee List</Text>
      {employees.map((emp, index) => (
        <Text key={index}>{emp.name} - {emp.work_email}</Text>
      ))}
    </View>
  );
}

export default App;
