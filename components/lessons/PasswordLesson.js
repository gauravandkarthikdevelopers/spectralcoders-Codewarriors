import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const PasswordLesson = ({ onComplete, onBack }) => {
  const { completeLessonAndUpdateXP } = useAppContext();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const lessons = [
    {
      title: 'Why Strong Passwords Matter',
      content: [
        'Passwords are your first line of defense against hackers.',
        'Weak passwords can be cracked in seconds using modern technology.',
        'A strong password helps protect your personal information from theft.',
      ],
      icon: 'lock',
    },
    {
      title: 'Common Password Mistakes',
      content: [
        '• Using personal information (birthdays, names)',
        '• Simple patterns (123456, qwerty)',
        '• Using the same password everywhere',
        '• Short passwords (less than 8 characters)',
        '• Not changing passwords regularly',
      ],
      icon: 'error',
    },
    {
      title: 'Create A Strong Password',
      content: [
        'A strong password should:',
        '• Be at least 12 characters long',
        '• Include uppercase and lowercase letters',
        '• Have numbers and special characters',
        '• Not contain obvious personal information',
      ],
      icon: 'enhanced-encryption',
      isInteractive: true,
    },
    {
      title: 'Password Manager Benefits',
      content: [
        'Password managers help you:',
        '• Generate strong, unique passwords',
        '• Store passwords securely',
        '• Autofill passwords on websites',
        '• Alert you of security breaches',
      ],
      icon: 'app-registration',
    },
    {
      title: 'Knowledge Check',
      quiz: {
        question: 'Which of these is the strongest password?',
        options: [
          { id: 1, text: 'football123' },
          { id: 2, text: 'Password2023' },
          { id: 3, text: 'P@$$w0rd!2023' },
          { id: 4, text: 'johndoe1990' },
        ],
        correctAnswer: 3,
        explanation: 'P@$$w0rd!2023 is the strongest because it contains uppercase and lowercase letters, numbers, special characters, and is longer than 12 characters.',
      },
      icon: 'quiz',
      isQuiz: true,
    },
  ];
  
  useEffect(() => {
    if (step === 2 && password) {
      // Calculate password strength
      let strength = 0;
      
      // Length check
      if (password.length >= 12) {
        strength += 25;
      } else if (password.length >= 8) {
        strength += 15;
      } else {
        strength += 5;
      }
      
      // Complexity checks
      if (/[A-Z]/.test(password)) strength += 15; // Uppercase
      if (/[a-z]/.test(password)) strength += 15; // Lowercase
      if (/[0-9]/.test(password)) strength += 15; // Numbers
      if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Special chars
      
      // Detect obvious patterns
      if (/^123|password|qwerty|abc|admin/i.test(password)) {
        strength = Math.max(10, strength - 25);
      }
      
      setPasswordStrength(Math.min(100, strength));
    }
  }, [password, step]);
  
  const handleNext = async () => {
    if (step === lessons.length - 1) {
      // Last step - complete lesson
      setLoading(true);
      try {
        // Mark the 'password' module lesson as complete with 25 XP reward
        const success = await completeLessonAndUpdateXP('password', step, 25);
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
      
      // Mark each step as a lesson completion for progressive XP
      if (step >= 0 && step < lessons.length - 1) {
        try {
          // 15 XP per intermediate step (smaller reward than final completion)
          await completeLessonAndUpdateXP('password', step, 15);
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
    } else {
      onBack?.();
    }
  };
  
  const handleQuizSubmit = () => {
    setSubmitted(true);
    setShowFeedback(true);
  };
  
  const getStrengthColor = () => {
    if (passwordStrength >= 70) return '#3FFFA8';
    if (passwordStrength >= 40) return '#FFD700';
    return '#FF5252';
  };
  
  const getStrengthText = () => {
    if (passwordStrength >= 70) return 'Strong';
    if (passwordStrength >= 40) return 'Medium';
    return 'Weak';
  };
  
  const currentLesson = lessons[step];
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Password Safety</Text>
        <View style={styles.progressText}>
          <Text style={styles.progressTextContent}>{step + 1}/{lessons.length}</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.lessonContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={currentLesson.icon} size={48} color="#3FFFA8" />
          </View>
          
          <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
          
          {!currentLesson.isQuiz && (
            <View style={styles.lessonContent}>
              {currentLesson.content.map((item, index) => (
                <Text key={index} style={styles.contentText}>{item}</Text>
              ))}
            </View>
          )}
          
          {currentLesson.isInteractive && (
            <View style={styles.interactiveContainer}>
              <Text style={styles.interactiveLabel}>Try creating a strong password:</Text>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter a password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                secureTextEntry={true}
              />
              
              <View style={styles.strengthMeterContainer}>
                <View style={styles.strengthMeter}>
                  <View
                    style={[
                      styles.strengthFill,
                      { width: `${passwordStrength}%`, backgroundColor: getStrengthColor() }
                    ]}
                  />
                </View>
                <View style={styles.strengthLabels}>
                  <Text style={styles.strengthLabel}>Weak</Text>
                  <Text style={styles.strengthLabel}>Medium</Text>
                  <Text style={styles.strengthLabel}>Strong</Text>
                </View>
              </View>
              
              {password ? (
                <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                  Password Strength: {getStrengthText()}
                </Text>
              ) : null}
              
              {password && (
                <View style={styles.tipContainer}>
                  <MaterialIcons name="lightbulb" size={20} color="#FFD700" />
                  <Text style={styles.tipText}>
                    {passwordStrength < 40 ? "Your password is too weak. Try adding length, numbers, and special characters." : 
                      passwordStrength < 70 ? "Good start! Add more complexity with special characters and varying case." : 
                      "Excellent password! Remember to use different passwords for different accounts."}
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {currentLesson.isQuiz && (
            <View style={styles.quizContainer}>
              <Text style={styles.quizQuestion}>{currentLesson.quiz.question}</Text>
              
              {currentLesson.quiz.options.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.quizOption,
                    quizAnswer === option.id && styles.selectedOption,
                    submitted && option.id === currentLesson.quiz.correctAnswer && styles.correctOption,
                    submitted && quizAnswer === option.id && quizAnswer !== currentLesson.quiz.correctAnswer && styles.incorrectOption,
                  ]}
                  onPress={() => !submitted && setQuizAnswer(option.id)}
                  disabled={submitted}
                >
                  <Text style={[
                    styles.quizOptionText,
                    quizAnswer === option.id && styles.selectedOptionText,
                    submitted && option.id === currentLesson.quiz.correctAnswer && styles.correctOptionText,
                  ]}>
                    {option.text}
                  </Text>
                </Pressable>
              ))}
              
              {!submitted ? (
                <Pressable 
                  style={[styles.submitButton, !quizAnswer && styles.disabledButton]} 
                  onPress={handleQuizSubmit}
                  disabled={!quizAnswer}
                >
                  <Text style={styles.submitButtonText}>Check Answer</Text>
                </Pressable>
              ) : (
                <View style={styles.feedbackContainer}>
                  <MaterialIcons 
                    name={quizAnswer === currentLesson.quiz.correctAnswer ? "check-circle" : "cancel"} 
                    size={24} 
                    color={quizAnswer === currentLesson.quiz.correctAnswer ? "#3FFFA8" : "#FF5252"} 
                  />
                  <Text style={styles.feedbackText}>
                    {quizAnswer === currentLesson.quiz.correctAnswer ? 
                      "Correct!" : 
                      "Not quite right."}
                  </Text>
                  <Text style={styles.explanationText}>
                    {currentLesson.quiz.explanation}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.nextButton,
            (currentLesson.isQuiz && !submitted) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={loading || (currentLesson.isQuiz && !submitted)}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {step === lessons.length - 1 ? "Complete" : "Next"}
              </Text>
              <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
            </>
          )}
        </Pressable>
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
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  progressText: {
    backgroundColor: 'rgba(63, 255, 168, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  progressTextContent: {
    color: '#3FFFA8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  lessonContainer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  lessonContent: {
    width: '100%',
  },
  contentText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
    lineHeight: 24,
  },
  interactiveContainer: {
    width: '100%',
    marginTop: 16,
  },
  interactiveLabel: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
  },
  passwordInput: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  strengthMeterContainer: {
    width: '100%',
    marginBottom: 16,
  },
  strengthMeter: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 4,
  },
  strengthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strengthLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  strengthText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  tipText: {
    color: '#FFF',
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  quizContainer: {
    width: '100%',
  },
  quizQuestion: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  quizOption: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: 'rgba(127, 0, 255, 0.3)',
    borderWidth: 1,
    borderColor: '#7F00FF',
  },
  correctOption: {
    backgroundColor: 'rgba(63, 255, 168, 0.3)',
    borderWidth: 1,
    borderColor: '#3FFFA8',
  },
  incorrectOption: {
    backgroundColor: 'rgba(255, 82, 82, 0.3)',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  quizOptionText: {
    color: '#FFF',
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  correctOptionText: {
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#7F00FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  feedbackText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  explanationText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  nextButton: {
    backgroundColor: '#3FFFA8',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#0B132B',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default PasswordLesson; 