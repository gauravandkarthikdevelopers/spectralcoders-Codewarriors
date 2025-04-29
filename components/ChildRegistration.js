import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { registerChildAccount } from '../utils/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

const ChildRegistration = ({ onBack, onComplete }) => {
  const { setUserTypeAndAccount, USER_TYPE } = useAppContext();
  
  const [childName, setChildName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(Date.now() - 315576000000)); // Default 10 years ago
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };
  
  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };
  
  const validateForm = () => {
    if (!childName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    if (age < 6 || age > 17) {
      Alert.alert('Error', 'Age must be between 6 and 17 years');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Register child in Firebase
      const result = await registerChildAccount({
        name: childName,
        dateOfBirth: dateOfBirth.toISOString(),
      });
      
      if (result.success) {
        setAccessCode(result.accessCode);
        
        // Set user type and account in context
        await setUserTypeAndAccount(USER_TYPE.CHILD, {
          id: result.childId,
          name: childName,
          dateOfBirth: dateOfBirth.toISOString(),
          accessCode: result.accessCode,
          approved: false,
        });
        
        setShowAccessCode(true);
      } else {
        Alert.alert('Error', 'Failed to create your account. Please try again.');
      }
    } catch (error) {
      console.error('Error creating child account:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Your Account</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="child-care" size={64} color="#3FFFA8" />
          </View>
          
          <Text style={styles.welcomeText}>
            Welcome young cyber warrior!
          </Text>
          
          <Text style={styles.description}>
            Let's set up your account so you can start learning about cybersecurity.
          </Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={childName}
              onChangeText={setChildName}
            />
            
            <Text style={styles.label}>Your Birthday</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDate(dateOfBirth)}
              </Text>
              <MaterialIcons name="calendar-today" size={24} color="#3FFFA8" />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(Date.now() - 567648000000)} // 18 years ago
              />
            )}
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0B132B" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Access Code Modal */}
      <Modal
        visible={showAccessCode}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successIconContainer}>
              <MaterialIcons name="check-circle" size={64} color="#3FFFA8" />
            </View>
            
            <Text style={styles.modalTitle}>Account Created!</Text>
            
            <Text style={styles.modalDescription}>
              Your account has been created successfully. Here's your access code:
            </Text>
            
            <View style={styles.accessCodeContainer}>
              <Text style={styles.accessCode}>{accessCode}</Text>
            </View>
            
            <Text style={styles.instructionText}>
              Please share this code with your parent/guardian. They will need to enter 
              this code in the parent app to approve your account.
            </Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleComplete}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 32,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  dateInput: {
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#3FFFA8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B132B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#1D2B53',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    maxWidth: 400,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 16,
    textAlign: 'center',
  },
  accessCodeContainer: {
    backgroundColor: 'rgba(63, 255, 168, 0.1)',
    borderWidth: 1,
    borderColor: '#3FFFA8',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  accessCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3FFFA8',
    letterSpacing: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default ChildRegistration; 