import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import odooService from "../service/odooService";
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "../context/AuthContext";

function List({ orders }) {
  const { isAuthenticated, connectionDetails, uid } = useAuth();
  const [confirmedOrders, setConfirmedOrders] = useState({});

  const handleConfirmOrder = async (orderId) => {
    try {
      if (isAuthenticated && uid && orders && orders.length > 0) {
        // Buscar la orden correspondiente al orderId en el array orders
        const orderToConfirm = orders.find(order => order.id === orderId);

        // Verificar si la orden fue encontrada
        if (!orderToConfirm) {
          throw new Error(`Order with ID ${orderId} not found.`);
        }

        // Confirmar la orden utilizando el servicio de Odoo
        const { url, dbName, password } = connectionDetails; // Obtener detalles de conexión desde el contexto

        const confirmed = await odooService.confirmOrders(url, dbName, uid, password, [orderToConfirm]);

        if (confirmed) {
          // Actualizar el estado local para reflejar que la orden ha sido confirmada
          setConfirmedOrders(prevConfirmedOrders => ({
            ...prevConfirmedOrders,
            [orderToConfirm.id]: true
          }));
          Alert.alert("Success", "Order has been confirmed.");
        } else {
          Alert.alert("Error", "Failed to confirm order.");
        }
      } else {
        Alert.alert("Error", "User not authenticated or orders not loaded.");
      }
    } catch (error) {
      console.error("Confirm order error", error.message);
      Alert.alert("Error", "Failed to confirm order.");
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
          <Text style={styles.headers}>State</Text>
          <Text style={styles.headers}>Action</Text>
        </View>
        
        {orders.length === 0 ? (
          <View style={styles.row}>
            <Text style={styles.noOrders}>No hay ninguna orden.</Text>
          </View>
        ) : (
          orders.map((order, index) => (
            <View key={index} style={styles.row}>
              {/* Mostrar el nombre del cliente */}
              <Text style={styles.cell}>{order.partner_id[1]}</Text>
              {/* Mostrar la fecha de creación */}
              <Text style={styles.cell}>{order.create_date}</Text>
              {/* Mostrar el estado de la orden */}
              <Text style={styles.cell}>{order.state}</Text>
              <View style={styles.cell}>
                {/* Botón para confirmar la orden */}
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
          ))
        )}
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
    fontSize: 17,
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
  noOrders: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    fontStyle: "italic",
  }
});

export default List;
