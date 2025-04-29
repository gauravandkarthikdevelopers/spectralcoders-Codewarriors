import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image, ActivityIndicator, Animated, PanResponder } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, SafeAreaView } from 'react-native';

const PhishingLesson = ({ onComplete, onBack }) => {
  const { completeLessonAndUpdateXP } = useAppContext();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Interactive email analyzer game
  const [gameActive, setGameActive] = useState(false);
  const [emailItems, setEmailItems] = useState([]);
  const [droppedItems, setDroppedItems] = useState({ phishing: [], legitimate: [] });
  const [currentDrag, setCurrentDrag] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Screen dimensions for drag calculations
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(0.95))[0];
  
  // Animate component entry
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);
  
  // Initialize phishing game with sample emails
  const startPhishingGame = () => {
    const emails = [
      {
        id: '1',
        sender: 'Amazon Customer Service <support@amazon-secure.net>',
        subject: 'Action Required: Verify Your Account',
        content: 'Dear valued customer, we have detected suspicious activity on your account. Click here to verify your account information immediately or your account will be suspended.',
        isPhishing: true,
        clues: ['Suspicious domain name', 'Creates urgency', 'Generic greeting', 'Request for personal information'],
      },
      {
        id: '2',
        sender: 'Netflix <info@netflix.com>',
        subject: 'Your monthly subscription',
        content: 'Hello [username], your monthly subscription payment was processed successfully. Your next billing date is November 15, 2023. Visit netflix.com if you have any questions.',
        isPhishing: false,
        clues: ['Correct domain name', 'No urgent action required', 'Personalized greeting', 'No suspicious links'],
      },
      {
        id: '3',
        sender: 'Apple Support <no-reply@apple-id-services.com>',
        subject: 'Your Apple ID was used to sign in to iCloud',
        content: "Your Apple ID was used to sign in to iCloud on a new iPhone. If this wasn't you, click here to secure your account now.",
        isPhishing: true,
        clues: ['Suspicious domain name', 'Creates fear', 'Vague details', 'Contains urgent call to action'],
      },
      {
        id: '4',
        sender: 'PayPal <service@paypal.com>',
        subject: 'Receipt for your payment',
        content: "Hello, we've processed your payment of $45.99 to DigitalStore Inc. View the transaction details in your PayPal account at paypal.com.",
        isPhishing: false,
        clues: ['Legitimate domain name', 'Specific transaction details', 'Directs to official website', 'No suspicious requests'],
      },
      {
        id: '5',
        sender: 'IRS Refund <refund@irs-gov.org>',
        subject: 'Tax Refund Available Now',
        content: 'You have a tax refund of $1,289.42 waiting to be claimed. Download the attached form, fill your bank account details and send it back to process your refund.',
        isPhishing: true,
        clues: ['Suspicious domain name', 'Too good to be true', 'Requests financial details', 'Contains attachment'],
      },
      {
        id: '6',
        sender: 'LinkedIn <messages-noreply@linkedin.com>',
        subject: 'John Smith has endorsed you for Project Management',
        content: 'John Smith has endorsed you for Project Management. Login to LinkedIn to view your profile and new endorsements.',
        isPhishing: false,
        clues: ['Correct domain name', 'Specific person mentioned', 'Expected activity', 'No urgent request'],
      },
    ];
    
    // Shuffle the emails
    const shuffled = [...emails].sort(() => 0.5 - Math.random());
    setEmailItems(shuffled.slice(0, 4)); // Show 4 random emails for the game
    setDroppedItems({ phishing: [], legitimate: [] });
    setGameActive(true);
    setGameComplete(false);
    setGameScore(0);
    setMistakes(0);
    setFeedbackMessage('');
  };
  
  // Handle email classification
  const handleClassifyEmail = (emailId, classification) => {
    const email = emailItems.find(item => item.id === emailId);
    
    // Check if correct classification
    let isCorrect = false;
    if ((classification === 'phishing' && email.isPhishing) || 
        (classification === 'legitimate' && !email.isPhishing)) {
      isCorrect = true;
      setGameScore(prev => prev + 10);
      setFeedbackMessage('Correct classification! +10 points');
    } else {
      setMistakes(prev => prev + 1);
      setFeedbackMessage("Incorrect! That was " + (email.isPhishing ? "a phishing email." : "a legitimate email."));
    }
    
    // Move email to classified list
    setDroppedItems(prev => ({
      ...prev,
      [classification]: [...prev[classification], {...email, isCorrect}]
    }));
    
    // Remove email from active list
    setEmailItems(prev => prev.filter(item => item.id !== emailId));
    
    // Check if game is complete
    if (emailItems.length === 1) {
      setTimeout(() => {
        setGameComplete(true);
      }, 500);
    }
  };

  const lessons = [
    {
      title: 'Understanding Phishing',
      content: [
        'Phishing is a type of cyber attack where attackers disguise themselves as trustworthy entities to steal sensitive information.',
        'These attacks often come through emails, text messages, or fake websites that look legitimate.',
        'Phishing attempts can target personal information, login credentials, or financial details.',
      ],
      icon: 'email',
    },
    {
      title: 'Common Phishing Tactics',
      content: [
        'Phishing attacks often use these red flags:',
        '• Urgent calls to action ("Act now or your account will be suspended")',
        '• Suspicious sender addresses (like amazon-support.com instead of amazon.com)',
        '• Grammatical errors or unusual wording',
        '• Requests for personal information or credentials',
        '• Suspicious attachments or unexpected links',
      ],
      icon: 'warning',
    },
    {
      title: 'Real-World Examples',
      content: [
        'Common phishing scenarios include:',
        '• Fake bank emails claiming "suspicious account activity"',
        '• Tech support scams claiming your device is infected',
        '• Fake delivery notifications with malicious tracking links',
        '• Tax/government impersonation requesting personal details',
        '• Prize or lottery winnings you never entered',
      ],
      icon: 'visibility',
    },
    {
      title: 'Email Classifier Game',
      content: [
        "Let's practice identifying phishing emails!",
        "In this game, you'll analyze emails and determine which are legitimate and which are phishing attempts.",
        'Drag each email to either the "Phishing" or "Legitimate" area based on your analysis.',
        "Look for the telltale signs we've discussed to make your decision.",
      ],
      icon: 'drag-indicator',
      isGame: true,
    },
    {
      title: 'How to Protect Yourself',
      content: [
        'Follow these best practices to avoid phishing scams:',
        '• Never click suspicious links or download unexpected attachments',
        "• Check the sender's full email address, not just the display name",
        "• Look for spelling and grammar mistakes that legitimate organizations wouldn't make",
        "• Don't provide personal information in response to an email request",
        '• When in doubt, contact the organization directly through their official website or phone number',
      ],
      icon: 'security',
    },
    {
      title: 'Knowledge Check',
      quiz: {
        question: 'Which of these is NOT a common sign of a phishing email?',
        options: [
          { id: 1, text: 'Misspelled company name or domain (e.g., "amaz0n.com")' },
          { id: 2, text: 'A personalized greeting using your full correct name' },
          { id: 3, text: 'Urgency ("Your account will be closed in 24 hours")' },
          { id: 4, text: 'Requests for your password or financial information' },
        ],
        correctAnswer: 2,
        explanation: 'Phishing emails typically use generic greetings like "Dear Customer" or "Dear User" because they\'re sent in bulk. Legitimate organizations that already have your information will usually address you by your correct name.',
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
        // Mark the 'phishing' module lesson as complete with 35 XP reward
        const success = await completeLessonAndUpdateXP('phishing', step, 35);
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
          await completeLessonAndUpdateXP('phishing', step, 15);
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
  
  // Create email item components for drag and drop
  const renderEmailItem = (email, index) => {
    return (
      <Animated.View 
        key={email.id} 
        style={[styles.emailItem, { zIndex: 100 - index }]}
      >
        <View style={styles.emailHeader}>
          <MaterialIcons name="email" size={16} color="#3FFFA8" />
          <Text style={styles.emailSender} numberOfLines={1}>{email.sender}</Text>
        </View>
        <Text style={styles.emailSubject} numberOfLines={1}>{email.subject}</Text>
        <Text style={styles.emailContent} numberOfLines={3}>{email.content}</Text>
        
        <View style={styles.emailControls}>
          <Pressable 
            style={[styles.emailButton, styles.phishingButton]}
            onPress={() => handleClassifyEmail(email.id, 'phishing')}
          >
            <MaterialIcons name="dangerous" size={16} color="#FFF" />
            <Text style={styles.emailButtonText}>Phishing</Text>
          </Pressable>
          <Pressable 
            style={[styles.emailButton, styles.legitimateButton]}
            onPress={() => handleClassifyEmail(email.id, 'legitimate')}
          >
            <MaterialIcons name="check-circle" size={16} color="#FFF" />
            <Text style={styles.emailButtonText}>Legitimate</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  };
  
  const renderClassifiedEmail = (email, type) => {
    return (
      <View 
        key={email.id} 
        style={[
          styles.classifiedEmailItem,
          type === 'phishing' ? styles.phishingClassified : styles.legitimateClassified,
          !email.isCorrect && styles.incorrectClassified
        ]}
      >
        <View style={styles.classifiedEmailHeader}>
          <Text style={styles.classifiedEmailSender} numberOfLines={1}>{email.sender}</Text>
          <MaterialIcons 
            name={email.isCorrect ? "check-circle" : "cancel"} 
            size={16} 
            color={email.isCorrect ? "#3FFFA8" : "#FF5252"} 
          />
        </View>
        <Text style={styles.classifiedEmailSubject} numberOfLines={1}>{email.subject}</Text>
        
        {!email.isCorrect && (
          <View style={styles.incorrectFeedback}>
            <MaterialIcons name="info" size={14} color="#FF5252" />
            <Text style={styles.incorrectFeedbackText}>
              This was actually a {email.isPhishing ? "phishing email" : "legitimate email"}
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Phishing Defense</Text>
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
              transform: [{ scale: scale }]
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
                <Pressable style={styles.gameStartButton} onPress={startPhishingGame}>
                  <MaterialIcons name="play-arrow" size={24} color="#0B132B" />
                  <Text style={styles.gameStartButtonText}>Start Game</Text>
                </Pressable>
              )}
              
              {gameActive && (
                <>
                  {feedbackMessage ? (
                    <View style={styles.feedbackContainer}>
                      <Text style={styles.feedbackText}>{feedbackMessage}</Text>
                    </View>
                  ) : null}
                  
                  <View style={styles.gameHeader}>
                    <View style={styles.gameScore}>
                      <MaterialIcons name="stars" size={20} color="#FFD700" />
                      <Text style={styles.gameScoreText}>Score: {gameScore}</Text>
                    </View>
                    <View style={styles.gameMistakes}>
                      <MaterialIcons name="error-outline" size={20} color="#FF5252" />
                      <Text style={styles.gameMistakesText}>Mistakes: {mistakes}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.emailContainer}>
                    <Text style={styles.emailsTitle}>Analyze these emails:</Text>
                    {emailItems.map((email, index) => renderEmailItem(email, index))}
                  </View>
                  
                  <View style={styles.classifiedContainer}>
                    <View style={styles.phishingContainer}>
                      <Text style={styles.containerTitle}>Phishing</Text>
                      {droppedItems.phishing.map(email => renderClassifiedEmail(email, 'phishing'))}
                    </View>
                    
                    <View style={styles.legitimateContainer}>
                      <Text style={styles.containerTitle}>Legitimate</Text>
                      {droppedItems.legitimate.map(email => renderClassifiedEmail(email, 'legitimate'))}
                    </View>
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
                      {mistakes === 0 ? 'Perfect!' : gameScore >= 20 ? 'Great job!' : 'Nice try!'}
                    </Text>
                    <Text style={styles.gameCompleteScore}>Final Score: {gameScore}</Text>
                    <Text style={styles.gameCompleteMistakes}>Mistakes: {mistakes}</Text>
                  </View>
                  
                  <Text style={styles.gameCompleteFeedback}>
                    {mistakes === 0 
                      ? 'Excellent work! You correctly identified all emails. You have a keen eye for phishing attempts!'
                      : mistakes <= 1
                      ? 'Good job! You identified most emails correctly. Keep practicing to perfect your skills.'
                      : 'You missed some phishing emails. Remember to look for suspicious sender addresses, urgent language, and requests for personal information.'}
                  </Text>
                  
                  <Pressable style={styles.gameResetButton} onPress={startPhishingGame}>
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
  gameMistakes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameMistakesText: {
    color: '#FF5252',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  feedbackContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  feedbackText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  emailsTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emailContainer: {
    marginBottom: 16,
  },
  emailItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  emailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  emailSender: {
    color: '#3FFFA8',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
    flex: 1,
  },
  emailSubject: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emailContent: {
    color: '#FFF',
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 12,
  },
  emailControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  phishingButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.3)',
  },
  legitimateButton: {
    backgroundColor: 'rgba(63, 255, 168, 0.3)',
  },
  emailButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  classifiedContainer: {
    flexDirection: 'row',
  },
  phishingContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginRight: 6,
  },
  legitimateContainer: {
    flex: 1,
    backgroundColor: 'rgba(63, 255, 168, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginLeft: 6,
  },
  containerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  classifiedEmailItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  phishingClassified: {
    backgroundColor: 'rgba(255, 82, 82, 0.2)',
  },
  legitimateClassified: {
    backgroundColor: 'rgba(63, 255, 168, 0.2)',
  },
  incorrectClassified: {
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  classifiedEmailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  classifiedEmailSender: {
    color: '#FFF',
    fontSize: 12,
    flex: 1,
  },
  classifiedEmailSubject: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  incorrectFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  incorrectFeedbackText: {
    color: '#FF5252',
    fontSize: 10,
    marginLeft: 4,
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
  gameCompleteMistakes: {
    color: '#FF5252',
    fontSize: 16,
    marginTop: 4,
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

export default PhishingLesson; 