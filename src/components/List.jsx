import React from "react";
import { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import odooService from "../service/odooService";
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

function List() {
  const [orderSent, setOrderSent] = useState([]);
  const [uid, setUid] = useState(null);
  const [confirmedOrders, setConfirmedOrders] = useState({});

  useEffect(() => {
    const fetchOrderSent = async () => {
      try {
        const uid = await odooService.authenticate();
        if (uid) {
          setUid(uid);
          const orders = await odooService.getSaleOrdersSent(uid);
          setOrderSent(orders);
          console.log("Orders:", orders);
        }
      } catch (error) {
        console.error("Error fetching sent orders:", error);
      }
    };
    fetchOrderSent();
  }, []);

  const handleConfirmOrder = async (orderId) => {
    if (uid) {
      const orderToConfirm = orderSent.find(order => order.id === orderId);
      const confirmed = await odooService.confirmOrders(uid, [orderToConfirm]);
      if (confirmed) {
        setConfirmedOrders(prev => ({ ...prev, [orderId]: true }));
        Alert.alert("Success", "Order has been confirmed.");
      } else {
        Alert.alert("Error", "Failed to confirm order.");
      }
    } else {
      Alert.alert("Error", "User not authenticated.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.title}>Orders Sent List</Text>
      </View>
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={styles.headers}>Client</Text>
          <Text style={styles.headers}>Date</Text>
         {/*  <Text style={styles.headers}>Amount</Text> */}
          <Text style={styles.headers}>State</Text>
          <Text style={styles.headers}>Action</Text>
        </View>
        
        {orderSent.map((order, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{order.partner_id.join(' ')}</Text>
            <Text style={styles.cell}>{order.create_date}</Text>
           {/*  <Text style={styles.cell}>{order.amount_total}</Text> */}
            <Text style={styles.cell}>{order.state}</Text>
            <View style={styles.cell}>
              {!confirmedOrders[order.id] ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleConfirmOrder(order.id)}
                >
                  <FontAwesome5 name="tasks" size={24} color="blue" />
                </TouchableOpacity>
              ) : (
                <MaterialIcons name="task-alt" size={24} color="green" style={styles.icon} />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

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
    fontWeight: "bold",
    fontSize: 17
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    textAlign: 'center',
    marginTop: 10,
  },
});

export default List;
