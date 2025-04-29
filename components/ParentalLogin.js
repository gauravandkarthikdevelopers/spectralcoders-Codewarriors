import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const ParentalLogin = ({ onSuccess, onCancel }) => {
  const { parentalControls, verifyParentalPassword } = useAppContext();
  const [password, setPassword] = useState('');
  
  const handleSubmit = () => {
    Keyboard.dismiss();
    
    // Verifying existing password
    if (verifyParentalPassword(password)) {
      onSuccess();
    } else {
      Alert.alert('Error', 'Incorrect password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="security" size={60} color="#3FFFA8" />
      </View>
      
      <Text style={styles.title}>Enter Parental Password</Text>
      
      <Text style={styles.description}>
        This area is protected. Enter your password to continue.
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B132B',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignSelf: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3FFFA8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#0B132B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelText: {
    color: '#999',
    fontSize: 14,
  },
});

export default ParentalLogin; 