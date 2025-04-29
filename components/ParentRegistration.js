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
import { verifyAccessCode, registerParentAccount } from '../utils/firebase';

const ParentRegistration = ({ onBack, onComplete }) => {
  const { setUserTypeAndAccount, USER_TYPE } = useAppContext();
  
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [childInfo, setChildInfo] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const validateForm = () => {
    if (!parentName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    
    if (!parentEmail.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parentEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!accessCode.trim() || accessCode.length < 6) {
      Alert.alert('Error', 'Please enter a valid access code');
      return false;
    }
    
    return true;
  };
  
  const handleVerifyAccessCode = async () => {
    if (!accessCode.trim()) {
      Alert.alert('Error', 'Please enter the access code provided by your child');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await verifyAccessCode(accessCode);
      
      if (result.success) {
        setChildInfo(result.childData);
        
        // If email and name already filled, proceed with registration
        if (parentName.trim() && parentEmail.trim()) {
          handleRegisterParent(result.childId, result.childData);
        }
      } else {
        Alert.alert('Error', 'Invalid access code. Please check and try again.');
      }
    } catch (error) {
      console.error('Error verifying access code:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegisterParent = async (childId, childData) => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Register parent in Firebase
      const result = await registerParentAccount({
        name: parentName,
        email: parentEmail,
      }, childId || childInfo.id);
      
      if (result.success) {
        // Set user type and account in context
        await setUserTypeAndAccount(USER_TYPE.PARENT, {
          id: result.parentId,
          name: parentName,
          email: parentEmail,
          childrenIds: [childId || childInfo.id],
        });
        
        setShowSuccessModal(true);
      } else {
        Alert.alert('Error', 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error registering parent account:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = () => {
    if (childInfo) {
      handleRegisterParent(childInfo.id, childInfo);
    } else {
      handleVerifyAccessCode();
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
          <Text style={styles.title}>Parent Registration</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="supervisor-account" size={64} color="#7F00FF" />
          </View>
          
          <Text style={styles.welcomeText}>
            Welcome Parent!
          </Text>
          
          <Text style={styles.description}>
            Please enter your information and the access code provided by your child.
          </Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={parentName}
              onChangeText={setParentName}
            />
            
            <Text style={styles.label}>Your Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={parentEmail}
              onChangeText={setParentEmail}
            />
            
            <Text style={styles.label}>Child's Access Code</Text>
            <View style={styles.codeInputContainer}>
              <TextInput
                style={styles.codeInput}
                placeholder="Enter 6-character code"
                placeholderTextColor="#999"
                autoCapitalize="characters"
                value={accessCode}
                onChangeText={setAccessCode}
                maxLength={6}
              />
              {!childInfo && (
                <TouchableOpacity 
                  style={styles.verifyButton}
                  onPress={handleVerifyAccessCode}
                  disabled={loading}
                >
                  <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {childInfo && (
              <View style={styles.childInfoContainer}>
                <MaterialIcons name="check-circle" size={24} color="#3FFFA8" />
                <View style={styles.childInfoText}>
                  <Text style={styles.childVerifiedText}>
                    Child verified: {childInfo.name}
                  </Text>
                  <Text style={styles.childDobText}>
                    Birthday: {new Date(childInfo.dateOfBirth).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0B132B" />
              ) : (
                <Text style={styles.buttonText}>
                  {childInfo ? 'Complete Registration' : 'Continue'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successIconContainer}>
              <MaterialIcons name="check-circle" size={64} color="#3FFFA8" />
            </View>
            
            <Text style={styles.modalTitle}>Registration Complete!</Text>
            
            <Text style={styles.modalDescription}>
              You have successfully registered as a parent and approved {childInfo?.name}'s account.
              You now have access to parental controls to monitor and manage your child's cybersecurity learning.
            </Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleComplete}
            >
              <Text style={styles.buttonText}>Continue to Dashboard</Text>
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
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
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
  codeInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },
  verifyButton: {
    backgroundColor: '#7F00FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  childInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(63, 255, 168, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  childInfoText: {
    marginLeft: 12,
    flex: 1,
  },
  childVerifiedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  childDobText: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
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
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default ParentRegistration; 