import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const SleepModeScreen = ({ onUnlock }) => {
  const { parentalControls, verifyParentalPassword, toggleSleepMode } = useAppContext();
  const [password, setPassword] = useState('');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState('');
  
  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate time remaining until sleep mode ends
      if (parentalControls.sleepModeEnabled) {
        const endTime = parseTimeString(parentalControls.sleepModeEndTime);
        if (endTime) {
          const endDateTime = new Date(now);
          endDateTime.setHours(endTime.hours);
          endDateTime.setMinutes(endTime.minutes);
          endDateTime.setSeconds(0);
          
          // If end time is earlier than current time, it means it's for tomorrow
          if (endDateTime < now) {
            endDateTime.setDate(endDateTime.getDate() + 1);
          }
          
          // Calculate time difference
          const diffMs = endDateTime - now;
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          
          setTimeRemaining(`${diffHrs}h ${diffMins}m`);
          
          // Auto unlock when sleep time is over
          if (diffMs <= 0) {
            toggleSleepMode(false);
            if (onUnlock) onUnlock();
          }
        }
      }
    }, 60000); // Update every minute
    
    // Run once immediately to initialize
    const now = new Date();
    setCurrentTime(now);
    
    return () => clearInterval(timer);
  }, []);
  
  const parseTimeString = (timeStr) => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      return {
        hours: parseInt(match[1], 10),
        minutes: parseInt(match[2], 10)
      };
    }
    return null;
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleUnlockAttempt = () => {
    if (verifyParentalPassword(password)) {
      toggleSleepMode(false);
      setShowUnlockModal(false);
      setPassword('');
      if (onUnlock) onUnlock();
    } else {
      Alert.alert('Error', 'Incorrect password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.moonContainer}>
          <MaterialIcons name="nightlight-round" size={80} color="#7F00FF" style={styles.moonIcon} />
        </View>
        
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        
        <Text style={styles.title}>Sleep Mode Active</Text>
        
        <Text style={styles.message}>
          This device is currently in sleep mode.
        </Text>
        
        {timeRemaining ? (
          <Text style={styles.timeRemaining}>
            Time remaining: {timeRemaining}
          </Text>
        ) : null}
        
        <TouchableOpacity 
          style={styles.unlockButton}
          onPress={() => setShowUnlockModal(true)}
        >
          <MaterialIcons name="lock-open" size={24} color="#fff" />
          <Text style={styles.unlockText}>Parental Unlock</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={showUnlockModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.unlockModal}>
            <View style={styles.unlockIconContainer}>
              <MaterialIcons name="security" size={40} color="#3FFFA8" />
            </View>
            
            <Text style={styles.unlockTitle}>Parental Unlock</Text>
            
            <Text style={styles.unlockDescription}>
              Enter your parental password to disable sleep mode
            </Text>
            
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
            />
            
            <View style={styles.unlockButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowUnlockModal(false);
                  setPassword('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleUnlockAttempt}
              >
                <Text style={styles.confirmText}>Unlock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  moonContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(127, 0, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  moonIcon: {
    opacity: 0.9,
  },
  timeText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '200',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7F00FF',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  timeRemaining: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3FFFA8',
    marginBottom: 48,
  },
  unlockButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  unlockText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockModal: {
    backgroundColor: '#0B132B',
    borderRadius: 16,
    padding: 24,
    width: '85%',
  },
  unlockIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  unlockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  unlockDescription: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  passwordInput: {
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  unlockButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelText: {
    color: '#999',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#3FFFA8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#0B132B',
    fontWeight: 'bold',
  },
});

export default SleepModeScreen; 