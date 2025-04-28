import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Sample daily challenge data
const dailyChallenge = {
  title: "Spot the Phishing Email",
  description: "Can you identify which of these emails is a phishing attempt?",
  xpReward: 25,
  options: [
    {
      id: '1',
      sender: 'Amazon Customer Service',
      subject: 'Action Required: Verify Your Account',
      preview: 'Dear valued customer, we have detected suspicious activity on your account. Click here to verify your account information immediately or your account will be suspended.',
      isPhishing: true,
    },
    {
      id: '2',
      sender: 'Netflix',
      subject: 'Your monthly subscription',
      preview: 'Hello, your monthly subscription payment was processed successfully. Your next billing date is November 15, 2023. Visit netflix.com if you have any questions.',
      isPhishing: false,
    },
    {
      id: '3',
      sender: 'Your Bank',
      subject: 'Important Security Alert',
      preview: 'We have detected unusual activity on your account. Please log in at yourbank.com and verify your recent transactions.',
      isPhishing: false,
    }
  ]
};

// Streak data
const streakData = {
  current: 3,
  highest: 5,
};

export default function DailyScreen() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  const handleSelectOption = (id) => {
    setSelectedOption(id);
  };
  
  const handleSubmit = () => {
    if (selectedOption) {
      setShowResult(true);
    }
  };
  
  const isCorrect = selectedOption && 
    dailyChallenge.options.find(opt => opt.id === selectedOption)?.isPhishing;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Challenge</Text>
          <View style={styles.streakContainer}>
            <MaterialIcons name="local-fire-department" size={20} color="#FF8C00" />
            <Text style={styles.streakText}>{streakData.current} Day Streak</Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.challengeHeader}>
            <MaterialIcons name="stars" size={24} color="#3FFFA8" />
            <Text style={styles.challengeTitle}>{dailyChallenge.title}</Text>
          </View>
          
          <Text style={styles.challengeDescription}>{dailyChallenge.description}</Text>
          
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardText}>Reward:</Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{dailyChallenge.xpReward} XP</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Select the phishing email:</Text>
        
        {dailyChallenge.options.map((option) => (
          <Pressable 
            key={option.id}
            style={[
              styles.emailOption,
              selectedOption === option.id && styles.selectedOption,
              showResult && option.isPhishing && styles.correctOption,
              showResult && selectedOption === option.id && !option.isPhishing && styles.incorrectOption,
            ]}
            onPress={() => !showResult && handleSelectOption(option.id)}
            disabled={showResult}
          >
            <View style={styles.emailHeader}>
              <Text style={styles.emailSender}>{option.sender}</Text>
              {showResult && option.isPhishing && (
                <MaterialIcons name="warning" size={18} color="#FF5252" />
              )}
            </View>
            <Text style={styles.emailSubject}>{option.subject}</Text>
            <Text style={styles.emailPreview}>{option.preview}</Text>
            
            {showResult && option.isPhishing && (
              <View style={styles.phishingAlert}>
                <MaterialIcons name="warning" size={16} color="#FF5252" />
                <Text style={styles.phishingAlertText}>
                  This is a phishing attempt! It uses urgency and threats to manipulate you.
                </Text>
              </View>
            )}
          </Pressable>
        ))}
        
        {!showResult ? (
          <Pressable 
            style={[styles.submitButton, !selectedOption && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={!selectedOption}
          >
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </Pressable>
        ) : (
          <View style={styles.resultCard}>
            <View style={styles.resultIconContainer}>
              <MaterialIcons 
                name={isCorrect ? "check-circle" : "cancel"} 
                size={40} 
                color={isCorrect ? "#3FFFA8" : "#FF5252"}
              />
            </View>
            <Text style={styles.resultTitle}>
              {isCorrect 
                ? "Correct! Good job spotting the phishing attempt."
                : "Incorrect. Look for urgent language and suspicious requests."}
            </Text>
            <Text style={styles.resultDescription}>
              Phishing emails often create a sense of urgency, have suspicious links, and request sensitive information.
            </Text>
            {isCorrect && (
              <View style={styles.earnedReward}>
                <Text style={styles.earnedRewardText}>You earned:</Text>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpText}>+{dailyChallenge.xpReward} XP</Text>
                </View>
              </View>
            )}
            <Pressable style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Continue</Text>
            </Pressable>
          </View>
        )}
        
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonTitle}>Tomorrow's Challenge</Text>
          <Text style={styles.comingSoonText}>Come back tomorrow for a new cybersecurity challenge!</Text>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 140, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    color: '#FFF',
    marginLeft: 5,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#7F00FF',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  challengeDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 15,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginRight: 8,
  },
  xpBadge: {
    backgroundColor: 'rgba(63, 255, 168, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: '#3FFFA8',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  emailOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#3FFFA8',
    backgroundColor: 'rgba(63, 255, 168, 0.1)',
  },
  correctOption: {
    borderColor: '#3FFFA8',
    backgroundColor: 'rgba(63, 255, 168, 0.1)',
  },
  incorrectOption: {
    borderColor: '#FF5252',
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emailSender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  emailSubject: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 8,
  },
  emailPreview: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  phishingAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  phishingAlertText: {
    color: '#FF5252',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#3FFFA8',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B132B',
  },
  resultCard: {
    backgroundColor: 'rgba(63, 255, 168, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3FFFA8',
  },
  resultIconContainer: {
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 15,
  },
  earnedReward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  earnedRewardText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 8,
  },
  nextButton: {
    backgroundColor: '#3FFFA8',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B132B',
  },
  comingSoon: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'rgba(127, 0, 255, 0.1)',
    borderRadius: 16,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
}); 