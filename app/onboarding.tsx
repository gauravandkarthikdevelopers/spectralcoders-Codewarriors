import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppContext } from '../context/AppContext';

export default function OnboardingScreen() {
  const { saveProfile } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      setError('');
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (!birthday) {
        setError('Please select your birthday');
        return;
      }
      setError('');
      setCurrentStep(2);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleComplete = async () => {
    if (!name || !birthday) return;
    
    setLoading(true);
    setError('');
    
    try {
      await saveProfile({ name, birthday });
      router.replace('/(tabs)');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stepsIndicator}>
          {[0, 1, 2].map((step) => (
            <View
              key={step}
              style={[
                styles.stepDot,
                currentStep === step && styles.activeDot,
                currentStep > step && styles.completedDot,
              ]}
            />
          ))}
        </View>

        {currentStep === 0 && (
          <View style={styles.step}>
            <Text style={styles.title}>Welcome to Pressy!</Text>
            <Text style={styles.subtitle}>Let's get to know you a bit</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>What's your name?</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoFocus
              />
            </View>
          </View>
        )}

        {currentStep === 1 && (
          <View style={styles.step}>
            <Text style={styles.title}>When were you born?</Text>
            <Text style={styles.subtitle}>This helps us personalize your experience</Text>
            
            <TouchableOpacity 
              style={styles.datePickerButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {birthday ? format(birthday, 'MMMM d, yyyy') : 'Select your birthday'}
              </Text>
              <MaterialIcons name="calendar-today" size={24} color="#3FFFA8" />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={birthday || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.step}>
            <Text style={styles.title}>You're all set!</Text>
            <Text style={styles.subtitle}>Ready to start your cybersecurity journey?</Text>
            
            <View style={styles.appInfo}>
              <MaterialIcons name="security" size={64} color="#3FFFA8" />
              <Text style={styles.appInfoTitle}>Pressy: Cybersecurity Learning</Text>
              <Text style={styles.appInfoText}>
                Pressy will guide you through interactive challenges to help you
                learn essential cybersecurity skills. Complete challenges, earn badges,
                and become a code warrior!
              </Text>
              
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <MaterialIcons name="lock" size={24} color="#3FFFA8" />
                  <Text style={styles.featureText}>Learn about password security</Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialIcons name="computer" size={24} color="#3FFFA8" />
                  <Text style={styles.featureText}>Understand common cyber threats</Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialIcons name="shield" size={24} color="#3FFFA8" />
                  <Text style={styles.featureText}>Develop practical protection skills</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.buttonsContainer}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === 2 ? 'Get Started' : 'Next'}
                </Text>
                <MaterialIcons 
                  name={currentStep === 2 ? 'rocket-launch' : 'arrow-forward'} 
                  size={24} 
                  color="#fff" 
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#3FFFA8',
    width: 20,
    borderRadius: 10,
  },
  completedDot: {
    backgroundColor: 'rgba(63, 255, 168, 0.5)',
  },
  step: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    color: '#FF4D4F',
    marginBottom: 20,
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#7F00FF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  appInfo: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 12,
  },
  appInfoText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresContainer: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
  },
}); 