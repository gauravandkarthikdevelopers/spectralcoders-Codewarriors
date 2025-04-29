import React from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const LockScreen = () => {
  const { parentalControls } = useAppContext();
  
  // Format lock time for display
  const formatLockTime = () => {
    if (!parentalControls.deviceLockedTimestamp) return '';
    
    try {
      const lockDate = new Date(parentalControls.deviceLockedTimestamp);
      return lockDate.toLocaleString();
    } catch (error) {
      return '';
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.lockIconContainer}>
          <MaterialIcons name="lock" size={100} color="#FF3B30" />
        </View>
        
        <Text style={styles.title}>Device Locked</Text>
        
        <Text style={styles.message}>
          This device has been locked by a parent or guardian.
        </Text>
        
        <Text style={styles.lockInfo}>
          Locked at: {formatLockTime()}
        </Text>
        
        <View style={styles.infoContainer}>
          <MaterialIcons name="info-outline" size={24} color="#fff" />
          <Text style={styles.instructions}>
            Please contact your parent or guardian to unlock the device.
          </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  lockIconContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  lockInfo: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 32,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  instructions: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
});

export default LockScreen; 