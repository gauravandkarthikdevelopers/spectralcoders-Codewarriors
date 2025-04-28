import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const { saveProfile } = useAppContext();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    {
      title: 'Welcome to Cyber Warriors!',
      description: 'Learn cybersecurity skills in a fun, interactive way. Protect yourself and your data online with daily challenges and missions.',
      icon: 'security',
    },
    {
      title: 'Gamified Learning',
      description: 'Earn XP, level up, and unlock badges as you master essential cybersecurity skills.',
      icon: 'emoji-events',
    },
    {
      title: 'Daily Missions',
      description: 'Complete daily challenges to test your knowledge and maintain your streak.',
      icon: 'today',
    },
    {
      title: 'Create Your Profile',
      description: 'Tell us a bit about yourself. This information is stored only on your device.',
      icon: 'person',
      isProfileForm: true,
    },
  ];

  const handleNameChange = (text) => {
    setName(text);
    if (error) setError('');
  };

  const handleBirthdayChange = (text) => {
    // Format as MM/DD/YYYY
    let formatted = text.replace(/[^0-9]/g, '');
    if (formatted.length > 8) {
      formatted = formatted.substring(0, 8);
    }
    
    if (formatted.length > 4) {
      formatted = `${formatted.substring(0, 2)}/${formatted.substring(2, 4)}/${formatted.substring(4)}`;
    } else if (formatted.length > 2) {
      formatted = `${formatted.substring(0, 2)}/${formatted.substring(2)}`;
    }
    
    setBirthday(formatted);
    if (error) setError('');
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    
    if (!birthday.trim() || birthday.length < 10) {
      setError('Please enter a valid date (MM/DD/YYYY)');
      return false;
    }
    
    return true;
  };

  const handleNext = async () => {
    if (step === steps.length - 1) {
      // Last step - save profile and complete onboarding
      if (!validateForm()) return;
      
      setLoading(true);
      try {
        const success = await saveProfile(name, birthday);
        if (success) {
          onComplete();
        } else {
          setError('Something went wrong. Please try again.');
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Move to next step
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentStep = steps[step];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressDot, 
              index === step ? styles.activeDot : null
            ]} 
          />
        ))}
      </View>
      
      <View style={styles.iconContainer}>
        <MaterialIcons name={currentStep.icon} size={80} color="#3FFFA8" />
      </View>
      
      <Text style={styles.title}>{currentStep.title}</Text>
      <Text style={styles.description}>{currentStep.description}</Text>
      
      {currentStep.isProfileForm ? (
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={handleNameChange}
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birthday</Text>
            <TextInput
              style={styles.input}
              value={birthday}
              onChangeText={handleBirthdayChange}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Text style={styles.privacyText}>
            Your information is stored only on your device. We don't collect or share any personal data.
          </Text>
        </View>
      ) : null}
      
      <View style={styles.buttonsContainer}>
        {step > 0 ? (
          <Pressable style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
        ) : <View style={{ width: 60 }} />}
        
        <Pressable 
          style={styles.nextButton} 
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0B132B" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {step === steps.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <MaterialIcons name="arrow-forward" size={24} color="#0B132B" />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
    padding: 20,
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#3FFFA8',
    width: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
  },
  errorText: {
    color: '#FF5252',
    marginTop: 8,
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  backButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#3FFFA8',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 160,
  },
  nextButtonText: {
    color: '#0B132B',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default OnboardingScreen; 