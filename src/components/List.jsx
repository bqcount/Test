import React from "react";
import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import odooService from "../service/odooService";
//import api from "../service/api";

function List() {
  const [employees, setEmployees] = useState([]);
  const [orderSent, setOrderSent]= useState([]);

 /*  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const uid = await odooService.authenticate();
        if (uid) {
          const empList = await odooService.getEmployees(uid);
          setEmployees(empList);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }; 

    fetchEmployees();
  }, []);*/

  useEffect(()=>{
    const fetchOrderSent = async ()=>{
      try {
        const uid = await odooService.authenticate();
        if (uid) {
          const orders = await odooService.getSaleOrdersSent(uid)
          setOrderSent(orders);
          console.log("Orders:",orders);
        }
        
      } catch (error) {
        console.error("Error fetching sent orders:", error);
      }
    }
    fetchOrderSent()
  },[]);

/*   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); */

/*   return (
    <View style={{marginTop:30}}>
     <Text style={{fontSize:22,fontWeight:"bold"}}>Employee List</Text>
      {employees.map((emp, index) => (
        <Text key={index}>
          {emp.name} - {emp.work_email}
        </Text>
      ))}
    </View>
  );
}
 */
return (
  <View style={styles.container}>
    <View style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
     <Text style={styles.title}>Employee List</Text>
    </View>
    {/* <View style={styles.table}>
   
      <View style={[styles.row, styles.header]}>
        <Text style={styles.headers}>Nombre</Text>
        <Text style={styles.headers}>Email</Text>
      </View>
    
      {employees.map((emp, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{emp.name}</Text>
          <Text style={styles.cell}>{emp.work_email}</Text>
        </View>
      ))}
    </View> */}

    <View style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
     <Text style={styles.title}>Orders Sent List</Text>
    </View>
    <View style={styles.table}>
      {/* Encabezados de la tabla */}
      <View style={[styles.row, styles.header]}>
        <Text style={styles.headers}>Cliente</Text>
        <Text style={styles.headers}>Fecha </Text>
        <Text style={styles.headers}>Cantidad </Text>
        <Text style={styles.headers}>Estado </Text>
      </View>
      {/* Filas de empleados */}

      {orderSent.map((order, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{order.partner_id}</Text> 
          <Text style={styles.cell}>{order.create_date}</Text>
          <Text style={styles.cell}>{order.amount_total}</Text>
          <Text style={styles.cell}>{order.state}</Text>
        </View>
      ))}
    </View>
  </View>
);
};


const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#f1f1f1',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
  
  },
  headers: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    fontWeight:"bold",
    fontSize:17
  },
});
export default List;
