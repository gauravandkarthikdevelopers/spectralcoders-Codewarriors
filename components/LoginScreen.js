import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const LoginScreen = ({ onChildLogin, onParentLogin }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="security" size={80} color="#3FFFA8" />
          <Text style={styles.appName}>CyberWarriors</Text>
          <Text style={styles.appTagline}>Learn. Protect. Secure.</Text>
        </View>
        
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.subtitle}>Please select your account type</Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={onChildLogin}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons name="child-care" size={48} color="#3FFFA8" />
            </View>
            <Text style={styles.optionTitle}>I am a Kid</Text>
            <Text style={styles.optionDescription}>
              Learn about cybersecurity in a fun, interactive way
            </Text>
            <MaterialIcons 
              name="arrow-forward" 
              size={24} 
              color="#3FFFA8" 
              style={styles.optionArrow}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={onParentLogin}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons name="supervisor-account" size={48} color="#7F00FF" />
            </View>
            <Text style={styles.optionTitle}>I am a Parent</Text>
            <Text style={styles.optionDescription}>
              Monitor and manage your child's cybersecurity learning
            </Text>
            <MaterialIcons 
              name="arrow-forward" 
              size={24} 
              color="#7F00FF" 
              style={styles.optionArrow}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  appTagline: {
    fontSize: 16,
    color: '#3FFFA8',
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 32,
  },
  optionsContainer: {
    width: '100%',
    gap: 20,
  },
  optionCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    position: 'relative',
  },
  optionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
    paddingRight: 40,
  },
  optionArrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default LoginScreen; 