import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

function SettingsCredentials() {
  return (
    <View style={styles.content}>
      <View style={styles.contentForm}>
        <View>
          <Text>Credentials</Text>
        </View>
        <View>
          <TextInput style={styles.textInputs} keyboardType="text" placeholder="url" />
          <TextInput style={styles.textInputs} keyboardType="text" placeholder="db name" />
          <TextInput style={styles.textInputs} keyboardType="email-address" placeholder="username" />
          <TextInput style={styles.textInputs} secureTextEntry={true} placeholder="password" />
        </View>
        <View>
        <TouchableOpacity
            style={{
              marginTop: 40,
              backgroundColor: "green",
              padding: 10,
              borderRadius: 5,
            }}
            
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius:10,
    
  },
  contentForm: {
    width: 350,
    height: 300,
    backgroundColor: "grey",

  },
  textInputs:{
    borderColor:"black",
    borderWidth:1,
    backgroundColor:"white"
  },
});
export default SettingsCredentials;
