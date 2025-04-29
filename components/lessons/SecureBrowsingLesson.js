import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const SecureBrowsingLesson = ({ onComplete, onBack }) => {
  const { completeLessonAndUpdateXP } = useAppContext();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // URL analyzer game
  const [gameActive, setGameActive] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [gameScore, setGameScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(5);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [urlAnalysis, setUrlAnalysis] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];
  
  // Animate component entry
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);
  
  // Sample URLs for the game
  const urls = [
    {
      id: '1',
      url: 'https://www.amazon.com/account/login',
      isSafe: true,
      reasons: ['Uses HTTPS', 'Legitimate domain', 'Expected path structure'],
    },
    {
      id: '2',
      url: 'http://paypal-account-security.com/login',
      isSafe: false,
      reasons: ['Uses HTTP instead of HTTPS', 'Suspicious domain (not paypal.com)', 'Attempting to look legitimate'],
    },
    {
      id: '3',
      url: 'https://www.google.com/search?q=cybersecurity+tips',
      isSafe: true,
      reasons: ['Uses HTTPS', 'Legitimate domain', 'Standard search query format'],
    },
    {
      id: '4',
      url: 'https://bank0famerica.com/account/verify',
      isSafe: false,
      reasons: ['Suspicious domain (uses "0" instead of "o")', 'Typosquatting attempt', 'Trying to trick users'],
    },
    {
      id: '5',
      url: 'https://mail.google.com/mail/u/0/#inbox',
      isSafe: true,
      reasons: ['Uses HTTPS', 'Legitimate subdomain of google.com', 'Standard Gmail URL format'],
    },
    {
      id: '6',
      url: 'http://facebook-login.securepage.net/verify',
      isSafe: false,
      reasons: ['Uses HTTP instead of HTTPS', 'Not the real Facebook domain', 'Contains brand name to appear legitimate'],
    },
    {
      id: '7',
      url: 'https://www.microsoft.com/en-us/download',
      isSafe: true,
      reasons: ['Uses HTTPS', 'Legitimate domain', 'Official Microsoft download page'],
    },
    {
      id: '8',
      url: 'https://appleid.apple.com-verify-account.com',
      isSafe: false,
      reasons: ['Deceptive domain structure', 'apple.com is part of a longer fake domain', 'Phishing attempt'],
    },
  ];
  
  // Start the URL analyzer game
  const startUrlGame = () => {
    // Reset game state
    setGameActive(true);
    setGameComplete(false);
    setGameScore(0);
    setAttempts(0);
    setUserInput('');
    setUrlAnalysis(null);
    
    // Select a random URL to analyze
    const randomIndex = Math.floor(Math.random() * urls.length);
    setCurrentUrl(urls[randomIndex]);
  };
  
  // Handle URL analysis submission
  const handleAnalyzeUrl = (isSafe) => {
    if (!currentUrl) return;
    
    // Check if user's analysis is correct
    const isCorrect = (isSafe === currentUrl.isSafe);
    
    // Update score and attempts
    if (isCorrect) {
      setGameScore(prev => prev + 10);
    }
    
    setAttempts(prev => prev + 1);
    setUrlAnalysis({ 
      isCorrect, 
      isSafe: currentUrl.isSafe, 
      reasons: currentUrl.reasons 
    });
    
    // Check if game is complete (reached max attempts)
    if (attempts + 1 >= maxAttempts) {
      setTimeout(() => {
        setGameComplete(true);
        setGameActive(false);
      }, 2000);
    } else {
      // Move to next URL after 2 seconds
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * urls.length);
        setCurrentUrl(urls[randomIndex]);
        setUrlAnalysis(null);
      }, 2000);
    }
  };

  const lessons = [
    {
      title: 'Secure Browsing Basics',
      content: [
        'Secure browsing involves protecting your personal data while online.',
        'Main threats include phishing sites, malware, and insecure connections.',
        'Understanding how to identify secure websites is essential for online safety.',
      ],
      icon: 'public',
    },
    {
      title: 'HTTPS and Secure Connections',
      content: [
        'Always look for HTTPS in website URLs:',
        '• The "S" stands for Secure',
        '• HTTPS encrypts data between your browser and the website',
        '• Modern browsers show a padlock icon for secure sites',
        '• Never enter sensitive information on sites without HTTPS',
      ],
      icon: 'https',
    },
    {
      title: 'Identifying Suspicious URLs',
      content: [
        'Be cautious of these URL red flags:',
        '• Misspelled domain names (amaz0n.com, g00gle.com)',
        '• Unusual domains (.tk, .buzz instead of .com, .org)',
        '• Long, confusing subdomains (secure-paypal.login-account.com)',
        '• URLs with random characters or numbers',
        '• Brand names in unusual places (paypal.secure-login.com)',
      ],
      icon: 'gpp-bad',
    },
    {
      title: 'URL Analyzer Game',
      content: [
        "Let's practice identifying secure and dangerous URLs!",
        "You'll be shown different website URLs.",
        "Your job is to analyze each URL and decide if it's safe or suspicious.",
        "Look for the secure browsing indicators we've discussed.",
      ],
      icon: 'travel-explore',
      isGame: true,
    },
    {
      title: 'Browser Safety Features',
      content: [
        'Modern browsers include security features:',
        '• Safe Browsing warnings for dangerous sites',
        '• Automatic HTTPS upgrades when available',
        '• Pop-up blocking to prevent unwanted windows',
        '• Privacy modes for sensitive browsing',
        '• Extensions that can enhance security',
      ],
      icon: 'security',
    },
    {
      title: 'Knowledge Check',
      quiz: {
        question: 'Which of these URLs is most likely secure and legitimate?',
        options: [
          { id: 1, text: 'http://paypal-secure-login.com/verify' },
          { id: 2, text: 'https://login.microsoftonline.com' },
          { id: 3, text: 'https://www.amaz0n.com/account' },
          { id: 4, text: 'http://www.bankofamerica.com.verify.net' },
        ],
        correctAnswer: 2,
        explanation: 'The Microsoft URL is legitimate and secure. It uses HTTPS and has the correct domain structure. The others show classic signs of phishing: using look-alike domains, HTTP instead of HTTPS, or deceptive domain structures.',
      },
      icon: 'quiz',
      isQuiz: true,
    },
  ];
  
  const handleNext = async () => {
    if (step === lessons.length - 1) {
      // Last step - complete lesson
      setLoading(true);
      try {
        // Mark the 'websites' module lesson as complete with 35 XP reward
        const success = await completeLessonAndUpdateXP('websites', step, 35);
        if (success) {
          onComplete?.();
        }
      } catch (error) {
        console.error('Error completing lesson:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Move to next step
      setStep(step + 1);
      setShowFeedback(false);
      setSubmitted(false);
      setGameActive(false);
      
      // Mark each step as a lesson completion for progressive XP
      if (step >= 0 && step < lessons.length - 1) {
        try {
          // 15 XP per intermediate step
          await completeLessonAndUpdateXP('websites', step, 15);
        } catch (error) {
          console.error('Error marking step completion:', error);
        }
      }
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setShowFeedback(false);
      setSubmitted(false);
      setGameActive(false);
    } else {
      onBack?.();
    }
  };
  
  const handleQuizSubmit = () => {
    setSubmitted(true);
    setShowFeedback(true);
  };
  
  const currentLesson = lessons[step];
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Secure Browsing</Text>
        <View style={styles.progressText}>
          <Text style={styles.progressTextContent}>{step + 1}/{lessons.length}</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <Animated.View 
          style={[
            styles.lessonContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name={currentLesson.icon} size={48} color="#3FFFA8" />
          </View>
          
          <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
          
          {!currentLesson.isQuiz && !currentLesson.isGame && (
            <View style={styles.lessonContent}>
              {currentLesson.content.map((item, index) => (
                <Text key={index} style={styles.contentText}>{item}</Text>
              ))}
            </View>
          )}
          
          {currentLesson.isGame && (
            <View style={styles.gameContainer}>
              {currentLesson.content.map((item, index) => (
                <Text key={index} style={styles.contentText}>{item}</Text>
              ))}
              
              {!gameActive && !gameComplete && (
                <Pressable style={styles.gameStartButton} onPress={startUrlGame}>
                  <MaterialIcons name="play-arrow" size={24} color="#0B132B" />
                  <Text style={styles.gameStartButtonText}>Start Game</Text>
                </Pressable>
              )}
              
              {gameActive && currentUrl && (
                <>
                  <View style={styles.gameHeader}>
                    <View style={styles.gameScore}>
                      <MaterialIcons name="stars" size={20} color="#FFD700" />
                      <Text style={styles.gameScoreText}>Score: {gameScore}</Text>
                    </View>
                    <View style={styles.gameAttempts}>
                      <MaterialIcons name="format-list-numbered" size={20} color="#3FFFA8" />
                      <Text style={styles.gameAttemptsText}>URL {attempts + 1}/{maxAttempts}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.urlContainer}>
                    <Text style={styles.urlLabel}>Analyze this URL:</Text>
                    <View style={styles.urlBox}>
                      <Text selectable style={styles.urlText}>{currentUrl.url}</Text>
                    </View>
                    
                    <View style={styles.urlActions}>
                      <Pressable 
                        style={[styles.urlButton, styles.dangerButton]}
                        onPress={() => handleAnalyzeUrl(false)}
                        disabled={!!urlAnalysis}
                      >
                        <MaterialIcons name="dangerous" size={20} color="#FFF" />
                        <Text style={styles.urlButtonText}>Dangerous</Text>
                      </Pressable>
                      
                      <Pressable 
                        style={[styles.urlButton, styles.safeButton]}
                        onPress={() => handleAnalyzeUrl(true)}
                        disabled={!!urlAnalysis}
                      >
                        <MaterialIcons name="verified" size={20} color="#FFF" />
                        <Text style={styles.urlButtonText}>Safe</Text>
                      </Pressable>
                    </View>
                    
                    {urlAnalysis && (
                      <View style={[
                        styles.analysisFeedback,
                        urlAnalysis.isCorrect ? styles.correctAnalysis : styles.incorrectAnalysis
                      ]}>
                        <MaterialIcons 
                          name={urlAnalysis.isCorrect ? "check-circle" : "cancel"} 
                          size={24} 
                          color={urlAnalysis.isCorrect ? "#3FFFA8" : "#FF5252"} 
                        />
                        <Text style={styles.analysisTitle}>
                          {urlAnalysis.isCorrect 
                            ? "Correct analysis!" 
                            : "Incorrect analysis!"}
                        </Text>
                        <Text style={styles.analysisResult}>
                          This URL is {urlAnalysis.isSafe ? "safe" : "dangerous"}
                        </Text>
                        
                        <View style={styles.reasonsList}>
                          <Text style={styles.reasonsTitle}>Reasons:</Text>
                          {urlAnalysis.reasons.map((reason, index) => (
                            <View key={index} style={styles.reasonItem}>
                              <MaterialIcons 
                                name="arrow-right" 
                                size={16} 
                                color={urlAnalysis.isSafe ? "#3FFFA8" : "#FF5252"} 
                              />
                              <Text style={styles.reasonText}>{reason}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </>
              )}
              
              {gameComplete && (
                <View style={styles.gameComplete}>
                  <View style={styles.gameCompleteHeader}>
                    <MaterialIcons 
                      name={gameScore >= 30 ? 'emoji-events' : 'stars'} 
                      size={48} 
                      color={gameScore >= 30 ? '#FFD700' : '#3FFFA8'} 
                    />
                    <Text style={styles.gameCompleteTitle}>
                      {gameScore === 50 ? 'Perfect!' : gameScore >= 30 ? 'Great job!' : 'Nice try!'}
                    </Text>
                    <Text style={styles.gameCompleteScore}>Final Score: {gameScore}</Text>
                  </View>
                  
                  <Text style={styles.gameCompleteFeedback}>
                    {gameScore === 50 
                      ? 'Amazing! You correctly identified all URLs. Your secure browsing skills are exceptional!'
                      : gameScore >= 30
                      ? 'Good work! You have a good eye for spotting most secure and dangerous URLs.'
                      : 'Keep practicing! Remember to check for HTTPS, verify domain names, and look for suspicious elements in URLs.'}
                  </Text>
                  
                  <Pressable style={styles.gameResetButton} onPress={startUrlGame}>
                    <MaterialIcons name="replay" size={20} color="#0B132B" />
                    <Text style={styles.gameResetButtonText}>Play Again</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
          
          {currentLesson.isQuiz && (
            <View style={styles.quizContainer}>
              <Text style={styles.quizQuestion}>{currentLesson.quiz.question}</Text>
              
              <View style={styles.quizOptions}>
                {currentLesson.quiz.options.map((option) => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.quizOption,
                      quizAnswer === option.id && styles.quizOptionSelected,
                      showFeedback && option.id === currentLesson.quiz.correctAnswer && styles.quizOptionCorrect,
                      showFeedback && quizAnswer === option.id && option.id !== currentLesson.quiz.correctAnswer && styles.quizOptionIncorrect,
                    ]}
                    onPress={() => !submitted && setQuizAnswer(option.id)}
                    disabled={submitted}
                  >
                    <Text style={[
                      styles.quizOptionText,
                      showFeedback && option.id === currentLesson.quiz.correctAnswer && styles.quizOptionTextCorrect,
                      showFeedback && quizAnswer === option.id && option.id !== currentLesson.quiz.correctAnswer && styles.quizOptionTextIncorrect,
                    ]}>
                      {option.text}
                    </Text>
                    
                    {showFeedback && option.id === currentLesson.quiz.correctAnswer && (
                      <MaterialIcons name="check-circle" size={24} color="#3FFFA8" />
                    )}
                    {showFeedback && quizAnswer === option.id && option.id !== currentLesson.quiz.correctAnswer && (
                      <MaterialIcons name="cancel" size={24} color="#FF5252" />
                    )}
                  </Pressable>
                ))}
              </View>
              
              {!submitted ? (
                <Pressable
                  style={[styles.quizSubmitButton, !quizAnswer && styles.quizSubmitButtonDisabled]}
                  onPress={handleQuizSubmit}
                  disabled={!quizAnswer}
                >
                  <Text style={styles.quizSubmitButtonText}>Submit Answer</Text>
                </Pressable>
              ) : (
                <View style={styles.quizFeedback}>
                  <Text style={styles.quizFeedbackTitle}>
                    {quizAnswer === currentLesson.quiz.correctAnswer ? 'Correct!' : 'Incorrect!'}
                  </Text>
                  <Text style={styles.quizFeedbackText}>{currentLesson.quiz.explanation}</Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>
      
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator color="#3FFFA8" size="small" />
        ) : (
          <Pressable 
            style={[
              styles.nextButton,
              currentLesson.isQuiz && !submitted && styles.nextButtonDisabled
            ]} 
            onPress={handleNext}
            disabled={currentLesson.isQuiz && !submitted}
          >
            <Text style={styles.nextButtonText}>
              {step === lessons.length - 1 ? 'Complete Lesson' : 'Continue'}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#0B132B" />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(127, 0, 255, 0.2)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginLeft: -32, // Offset the back button to center text
  },
  progressText: {
    backgroundColor: 'rgba(63, 255, 168, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressTextContent: {
    color: '#3FFFA8',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  lessonContainer: {
    borderRadius: 16,
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
    padding: 20,
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  lessonContent: {
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(127, 0, 255, 0.2)',
  },
  nextButton: {
    backgroundColor: '#3FFFA8',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(63, 255, 168, 0.4)',
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#0B132B',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  // Quiz Styles
  quizContainer: {
    marginTop: 10,
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  quizOptions: {
    marginBottom: 20,
  },
  quizOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizOptionSelected: {
    backgroundColor: 'rgba(127, 0, 255, 0.3)',
    borderColor: '#7F00FF',
    borderWidth: 1,
  },
  quizOptionCorrect: {
    backgroundColor: 'rgba(63, 255, 168, 0.3)',
    borderColor: '#3FFFA8',
    borderWidth: 1,
  },
  quizOptionIncorrect: {
    backgroundColor: 'rgba(255, 82, 82, 0.3)',
    borderColor: '#FF5252',
    borderWidth: 1,
  },
  quizOptionText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  quizOptionTextCorrect: {
    color: '#3FFFA8',
    fontWeight: 'bold',
  },
  quizOptionTextIncorrect: {
    color: '#FF5252',
    fontWeight: 'bold',
  },
  quizSubmitButton: {
    backgroundColor: '#7F00FF',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  quizSubmitButtonDisabled: {
    backgroundColor: 'rgba(127, 0, 255, 0.3)',
  },
  quizSubmitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quizFeedback: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  quizFeedbackTitle: {
    color: '#3FFFA8',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quizFeedbackText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
  },
  // Game Styles
  gameContainer: {
    marginTop: 10,
  },
  gameStartButton: {
    backgroundColor: '#3FFFA8',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  gameStartButtonText: {
    color: '#0B132B',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  gameScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameScoreText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  gameAttempts: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameAttemptsText: {
    color: '#3FFFA8',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  urlContainer: {
    marginBottom: 20,
  },
  urlLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  urlBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  urlText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  urlActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  urlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  dangerButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.3)',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  safeButton: {
    backgroundColor: 'rgba(63, 255, 168, 0.3)',
    borderWidth: 1,
    borderColor: '#3FFFA8',
  },
  urlButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  analysisFeedback: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  correctAnalysis: {
    backgroundColor: 'rgba(63, 255, 168, 0.2)',
    borderWidth: 1,
    borderColor: '#3FFFA8',
  },
  incorrectAnalysis: {
    backgroundColor: 'rgba(255, 82, 82, 0.2)',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  analysisTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  analysisResult: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 12,
  },
  reasonsList: {
    width: '100%',
    padding: 10,
  },
  reasonsTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reasonText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  gameComplete: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  gameCompleteHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  gameCompleteTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  gameCompleteScore: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameCompleteFeedback: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  gameResetButton: {
    backgroundColor: '#3FFFA8',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  gameResetButtonText: {
    color: '#0B132B',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SecureBrowsingLesson; 