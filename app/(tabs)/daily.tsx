import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../../context/AppContext';

// Daily challenge data
const dailyChallenges = [
  // Password challenges
  {
    id: 'pwd1',
    title: "Spot the Strongest Password",
    description: "Which of these passwords is the strongest?",
    xpReward: 25,
    options: [
      {
        id: '1',
        text: 'password123',
        isCorrect: false,
      },
      {
        id: '2',
        text: 'Tr0ub4dor&3',
        isCorrect: true,
      },
      {
        id: '3',
        text: 'qwerty12345',
        isCorrect: false,
      }
    ],
    type: 'password'
  },
  {
    id: 'pwd2',
    title: "Password Security Check",
    description: "Which of these is the best practice for password security?",
    xpReward: 20,
    options: [
      {
        id: '1',
        text: 'Using the same password for all your accounts',
        isCorrect: false,
      },
      {
        id: '2',
        text: 'Writing down your passwords on a sticky note',
        isCorrect: false,
      },
      {
        id: '3',
        text: 'Using a password manager to store unique passwords',
        isCorrect: true,
      }
    ],
    type: 'password'
  },
  {
    id: 'pwd3',
    title: "Password Update Frequency",
    description: "How often should you change important passwords?",
    xpReward: 20,
    options: [
      {
        id: '1',
        text: 'Never, if they are strong enough',
        isCorrect: false,
      },
      {
        id: '2',
        text: 'Every few months and after any security breach',
        isCorrect: true,
      },
      {
        id: '3',
        text: 'Every day for maximum security',
        isCorrect: false,
      }
    ],
    type: 'password'
  },
  
  // Phishing challenges
  {
    id: 'phish1',
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
    ],
    type: 'phishing'
  },
  {
    id: 'phish2',
    title: "Phishing Red Flags",
    description: "Which of these is a common sign of a phishing email?",
    xpReward: 20,
    options: [
      {
        id: '1',
        text: 'Personalized greeting with your full name',
        isCorrect: false,
      },
      {
        id: '2',
        text: 'Urgent request for personal information',
        isCorrect: true,
      },
      {
        id: '3',
        text: 'Links that match the official company domain',
        isCorrect: false,
      }
    ],
    type: 'phishing'
  },
  {
    id: 'phish3',
    title: "Phishing Response",
    description: "What should you do if you receive a suspicious email from your bank?",
    xpReward: 20,
    options: [
      {
        id: '1',
        text: 'Click the link and check if the website looks legitimate',
        isCorrect: false,
      },
      {
        id: '2',
        text: 'Reply to the email asking for confirmation',
        isCorrect: false,
      },
      {
        id: '3',
        text: 'Contact your bank directly using their official website or phone number',
        isCorrect: true,
      }
    ],
    type: 'phishing'
  },
  
  // Website security challenges
  {
    id: 'web1',
    title: "Safe Website URL",
    description: "Which of these URLs is likely to be a legitimate and safe website?",
    xpReward: 25,
    options: [
      {
        id: '1',
        text: 'https://amazon-account-verify.com',
        isCorrect: false,
      },
      {
        id: '2',
        text: 'http://paypa1.com/login',
        isCorrect: false,
      },
      {
        id: '3',
        text: 'https://www.amazon.com',
        isCorrect: true,
      }
    ],
    type: 'website'
  },
  {
    id: 'web2',
    title: "Secure Connection Check",
    description: "How can you tell if a website has a secure connection?",
    xpReward: 20,
    options: [
      {
        id: '1',
        text: 'The URL begins with https:// and shows a padlock icon',
        isCorrect: true,
      },
      {
        id: '2',
        text: 'The website has a professional design and logo',
        isCorrect: false,
      },
      {
        id: '3',
        text: 'The domain name includes the word "secure"',
        isCorrect: false,
      }
    ],
    type: 'website'
  },
  {
    id: 'web3',
    title: "Fake Website Detection",
    description: "Which of these is a sign of a potentially fake website?",
    xpReward: 20,
    options: [
      {
        id: '1',
        text: 'The website has a privacy policy',
        isCorrect: false,
      },
      {
        id: '2',
        text: 'There are many grammatical errors and typos',
        isCorrect: true,
      },
      {
        id: '3',
        text: 'The website has a modern design',
        isCorrect: false,
      }
    ],
    type: 'website'
  },
  
  // Malware challenges
  {
    id: 'mal1',
    title: "Malware Warning Signs",
    description: "Which of these is a common sign that your device may be infected with malware?",
    xpReward: 25,
    options: [
      {
        id: '1',
        text: 'Your device is running at normal speed',
        isCorrect: false,
      },
      {
        id: '2',
        text: 'You receive automatic updates from your operating system',
        isCorrect: false,
      },
      {
        id: '3',
        text: "Your browser has new toolbars you didn't install",
        isCorrect: true,
      }
    ],
    type: 'malware'
  },
  {
    id: 'mal2',
    title: "Ransomware Defense",
    description: "What's the best defense against ransomware attacks?",
    xpReward: 20,
    options: [
      {
        id: '1',
        text: 'Keeping regular backups of your important files',
        isCorrect: true,
      },
      {
        id: '2',
        text: "Opening all email attachments to check if they're safe",
        isCorrect: false,
      },
      {
        id: '3',
        text: 'Paying the ransom quickly to get a discount',
        isCorrect: false,
      }
    ],
    type: 'malware'
  },
  {
    id: 'mal3',
    title: "Safe Download Practices",
    description: "Which of these is the safest approach when downloading software?",
    xpReward: 20,
    options: [
      {
        id: '1',
        text: 'Download from any site that offers the software for free',
        isCorrect: false,
      },
      {
        id: '2',
        text: 'Only download from the official developer website or trusted app store',
        isCorrect: true,
      },
      {
        id: '3',
        text: 'Disable your antivirus temporarily to speed up the download',
        isCorrect: false,
      }
    ],
    type: 'malware'
  }
];

export default function DailyScreen() {
  const { userData, progressData, completeChallenge, updateXPAndLevel } = useAppContext();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  
  // Get available challenge types based on user progress
  const getAvailableChallengeTypes = () => {
    const unlockedModules = Object.keys(progressData.modules)
      .filter(moduleId => progressData.modules[moduleId].unlocked);
    
    // Filter challenges based on unlocked modules
    return dailyChallenges.filter(challenge => {
      if (challenge.type === 'password') return unlockedModules.includes('password');
      if (challenge.type === 'phishing') return unlockedModules.includes('phishing');
      if (challenge.type === 'website') return unlockedModules.includes('websites');
      if (challenge.type === 'malware') return unlockedModules.includes('malware');
      return false;
    });
  };
  
  // Get current challenge based on user progress
  useEffect(() => {
    // Get available challenges
    const availableChallenges = getAvailableChallengeTypes();
    
    if (availableChallenges.length === 0) {
      // No challenges available yet
      return;
    }
    
    // Check if user already has a daily challenge assigned
    const currentChallengeId = userData.currentChallenge;
    
    if (currentChallengeId) {
      // Find the existing challenge
      const existingChallenge = dailyChallenges.find(c => c.id === currentChallengeId);
      if (existingChallenge) {
        setDailyChallenge(existingChallenge);
      } else {
        // If challenge not found (possibly from an older version), assign a new one
        assignNewDailyChallenge(availableChallenges);
      }
    } else {
      // Assign a new random challenge
      assignNewDailyChallenge(availableChallenges);
    }
  }, [userData.currentChallenge, progressData.modules]);
  
  // Assign a new daily challenge
  const assignNewDailyChallenge = (availableChallenges) => {
    // Randomly select a challenge
    const randomIndex = Math.floor(Math.random() * availableChallenges.length);
    const selectedChallenge = availableChallenges[randomIndex];
    
    // Update user data with the new challenge
    setDailyChallenge(selectedChallenge);
    
    // Save the new challenge ID (in a real app, would update userData in storage)
    // This is simplified for this implementation
  };
  
  // Check if current challenge was already completed today
  useEffect(() => {
    if (!dailyChallenge) return;
    
    const isChallengeCompleted = progressData.completedChallenges.includes(dailyChallenge.id);
    setCompleted(isChallengeCompleted);
  }, [progressData.completedChallenges, dailyChallenge]);
  
  const handleSelectOption = (id) => {
    if (!showResult && !completed && dailyChallenge) {
      setSelectedOption(id);
    }
  };
  
  const handleSubmit = () => {
    if (selectedOption && !completed && dailyChallenge) {
      setShowResult(true);
    }
  };
  
  const handleComplete = async () => {
    if (completed || !dailyChallenge) return;
    
    setLoading(true);
    try {
      // Different handling based on challenge type
      if (dailyChallenge.type === 'phishing') {
        const isCorrect = selectedOption && 
          dailyChallenge.options.find(opt => opt.id === selectedOption)?.isPhishing;
        
        if (isCorrect) {
          await completeChallenge(dailyChallenge.id, dailyChallenge.xpReward);
          setCompleted(true);
        }
      } else {
        const isCorrect = selectedOption && 
          dailyChallenge.options.find(opt => opt.id === selectedOption)?.isCorrect;
        
        if (isCorrect) {
          await completeChallenge(dailyChallenge.id, dailyChallenge.xpReward);
          setCompleted(true);
        }
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setSelectedOption(null);
    setShowResult(false);
  };
  
  // Determine if user's answer is correct
  const isCorrect = (() => {
    if (!dailyChallenge) return false;
    
    if (dailyChallenge.type === 'phishing') {
      return selectedOption && 
        dailyChallenge.options.find(opt => opt.id === selectedOption)?.isPhishing;
    } else {
      return selectedOption && 
        dailyChallenge.options.find(opt => opt.id === selectedOption)?.isCorrect;
    }
  })();
  
  // Render loading state if no challenge is available yet
  if (!dailyChallenge) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3FFFA8" />
          <Text style={styles.loadingText}>Loading daily challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Challenge</Text>
          <View style={styles.streakContainer}>
            <MaterialIcons name="local-fire-department" size={20} color="#FF8C00" />
            <Text style={styles.streakText}>{userData.streak || 0} Day Streak</Text>
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
        
        {completed ? (
          <View style={styles.completedCard}>
            <MaterialIcons name="check-circle" size={48} color="#3FFFA8" />
            <Text style={styles.completedTitle}>Challenge Completed!</Text>
            <Text style={styles.completedText}>You've already completed today's challenge. Come back tomorrow for a new one!</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {dailyChallenge.type === 'phishing' ? 'Select the phishing email:' : 'Select the correct answer:'}
            </Text>
            
            {dailyChallenge.type === 'phishing' ? (
              // Render phishing email options
              dailyChallenge.options.map((option) => (
                <Pressable 
                  key={option.id}
                  style={[
                    styles.emailOption,
                    selectedOption === option.id && styles.selectedOption,
                    showResult && option.isPhishing && styles.correctOption,
                    showResult && selectedOption === option.id && !option.isPhishing && styles.incorrectOption,
                  ]}
                  onPress={() => handleSelectOption(option.id)}
                  disabled={showResult}
                >
                  <View style={styles.emailHeader}>
                    <Text style={styles.emailSender}>{option.sender}</Text>
                    {showResult && option.isPhishing && (
                      <MaterialIcons name="check" size={20} color="#3FFFA8" />
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
              ))
            ) : (
              // Render regular multiple choice options
              dailyChallenge.options.map((option) => (
                <Pressable 
                  key={option.id}
                  style={[
                    styles.answerOption,
                    selectedOption === option.id && styles.selectedOption,
                    showResult && option.isCorrect && styles.correctOption,
                    showResult && selectedOption === option.id && !option.isCorrect && styles.incorrectOption,
                  ]}
                  onPress={() => handleSelectOption(option.id)}
                  disabled={showResult}
                >
                  <Text style={styles.answerOptionText}>{option.text}</Text>
                  
                  {showResult && option.isCorrect && (
                    <MaterialIcons name="check-circle" size={24} color="#3FFFA8" />
                  )}
                  {showResult && selectedOption === option.id && !option.isCorrect && (
                    <MaterialIcons name="cancel" size={24} color="#FF5252" />
                  )}
                </Pressable>
              ))
            )}
            
            {!showResult ? (
              <Pressable 
                style={[styles.submitButton, !selectedOption && styles.submitButtonDisabled]} 
                onPress={handleSubmit}
                disabled={!selectedOption}
              >
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              </Pressable>
            ) : (
              <>
                <View style={styles.resultContainer}>
                  <View style={[
                    styles.resultBadge,
                    isCorrect ? styles.correctBadge : styles.incorrectBadge
                  ]}>
                    <MaterialIcons 
                      name={isCorrect ? "check-circle" : "cancel"} 
                      size={24} 
                      color="#FFF" 
                    />
                    <Text style={styles.resultText}>
                      {isCorrect ? "Correct!" : "Incorrect!"}
                    </Text>
                  </View>
                  
                  <Text style={styles.resultExplanation}>
                    {isCorrect
                      ? `Great job! You've earned ${dailyChallenge.xpReward} XP.`
                      : "That's not right. Review the lesson material and try again!"}
                  </Text>
                </View>
                
                <View style={styles.actionButtonsContainer}>
                  {isCorrect ? (
                    <Pressable 
                      style={[styles.actionButton, styles.completeButton]} 
                      onPress={handleComplete}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <>
                          <MaterialIcons name="emoji-events" size={20} color="#FFF" />
                          <Text style={styles.actionButtonText}>Claim Reward</Text>
                        </>
                      )}
                    </Pressable>
                  ) : (
                    <Pressable 
                      style={[styles.actionButton, styles.retryButton]} 
                      onPress={handleReset}
                    >
                      <MaterialIcons name="refresh" size={20} color="#FFF" />
                      <Text style={styles.actionButtonText}>Try Again</Text>
                    </Pressable>
                  )}
                </View>
              </>
            )}
          </>
        )}
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
  completedCard: {
    backgroundColor: 'rgba(63, 255, 168, 0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3FFFA8',
    marginTop: 16,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  emailOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  answerOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedOption: {
    borderColor: '#7F00FF',
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
  },
  correctOption: {
    borderColor: '#3FFFA8',
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
  },
  incorrectOption: {
    borderColor: '#FF5252',
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
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
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  phishingAlert: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  phishingAlertText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#3FFFA8',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#0B132B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginVertical: 24,
  },
  resultBadge: {
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultExplanation: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#3FFFA8',
  },
  retryButton: {
    backgroundColor: '#FF5252',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 16,
    fontSize: 16,
  },
}); 