import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { useAppContext } from '../../context/AppContext';
import PasswordLesson from '../../components/lessons/PasswordLesson';
import PhishingLesson from '../../components/lessons/PhishingLesson';
import MalwareLesson from '../../components/lessons/MalwareLesson';
import SecureBrowsingLesson from '../../components/lessons/SecureBrowsingLesson';

export default function LearnScreen() {
  const { progressData } = useAppContext();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  const moduleOrder = ['password', 'phishing', 'websites', 'malware', 'cyberbullying', 'personaldata', 'wifi', 'encryption', 'socialmedia'];
  
  // Map moduleId to display data
  const moduleDisplayData = {
    password: {
      title: 'Password Safety',
      icon: 'lock',
      description: 'Learn to create and manage strong passwords',
    },
    phishing: {
      title: 'Phishing Scam Identification',
      icon: 'email',
      description: 'Identify and avoid dangerous phishing attempts',
    },
    websites: {
      title: 'Spotting Fake Websites',
      icon: 'public',
      description: 'Learn to identify suspicious and fake websites',
    },
    malware: {
      title: 'Malware Protection',
      icon: 'bug-report',
      description: 'Defend against viruses, trojans, and other malicious software',
    },
    cyberbullying: {
      title: 'Cyberbullying Prevention',
      icon: 'shield',
      description: 'Protect yourself and others from online harassment',
    },
    personaldata: {
      title: 'Protecting Personal Data',
      icon: 'security',
      description: 'Keep your personal information safe online',
    },
    wifi: {
      title: 'Public Wi-Fi Security',
      icon: 'wifi',
      description: 'Stay safe when using public networks',
    },
    encryption: {
      title: 'Data Encryption',
      icon: 'enhanced-encryption',
      description: 'Understand how encryption protects your information',
    },
    socialmedia: {
      title: 'Social Media Safety',
      icon: 'people',
      description: 'Manage your privacy and security on social platforms',
    },
  };

  // Function to show the appropriate lesson based on module ID
  const showLesson = (moduleId: string) => {
    setActiveLesson(moduleId);
  };

  // Handle lesson completion
  const handleLessonComplete = () => {
    setActiveLesson(null);
  };

  // Show specific lesson component based on module ID
  if (activeLesson) {
    if (activeLesson === 'password') {
      return <PasswordLesson onComplete={handleLessonComplete} onBack={() => setActiveLesson(null)} />;
    } else if (activeLesson === 'phishing') {
      return <PhishingLesson onComplete={handleLessonComplete} onBack={() => setActiveLesson(null)} />;
    } else if (activeLesson === 'websites') {
      return <SecureBrowsingLesson onComplete={handleLessonComplete} onBack={() => setActiveLesson(null)} />;
    } else if (activeLesson === 'malware') {
      return <MalwareLesson onComplete={handleLessonComplete} onBack={() => setActiveLesson(null)} />;
    }
    // Future lessons would be handled here
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learning Modules</Text>
        </View>

        {moduleOrder.map((moduleId) => {
          const module = progressData.modules[moduleId];
          if (!module) return null; // Skip if module is not defined
          
          const displayData = moduleDisplayData[moduleId as keyof typeof moduleDisplayData];
          
          return (
            <View 
              key={moduleId} 
              style={[
                styles.moduleCard, 
                !module.unlocked && styles.lockedModule
              ]}
            >
              <View style={styles.moduleTop}>
                <View style={styles.moduleIconContainer}>
                  <MaterialIcons name={displayData.icon} size={30} color="#3FFFA8" />
                </View>
                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleTitle}>{displayData.title}</Text>
                  <Text style={styles.moduleDescription}>{displayData.description}</Text>
                </View>
                {!module.unlocked && (
                  <MaterialIcons name="lock" size={24} color="#7F00FF" style={styles.lockIcon} />
                )}
              </View>

              <View style={styles.moduleBottom}>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${module.progress}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {module.completed}/{module.totalLessons} Lessons
                  </Text>
                </View>
                
                {module.unlocked && (
                  <Pressable
                    style={[
                      styles.startButton,
                      module.progress === 100 ? styles.completedButton : null
                    ]}
                    onPress={() => showLesson(moduleId)}
                  >
                    <Text style={styles.startButtonText}>
                      {module.progress === 0 ? 'Start' : 
                        module.progress === 100 ? 'Review' : 'Continue'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}

        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonTitle}>More Modules Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            We're constantly adding new cybersecurity lessons to keep you safe online.
          </Text>
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
    marginBottom: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  moduleCard: {
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#7F00FF',
  },
  lockedModule: {
    opacity: 0.7,
  },
  moduleTop: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  moduleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  lockIcon: {
    marginLeft: 10,
  },
  moduleBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3FFFA8',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  startButton: {
    backgroundColor: '#3FFFA8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#0B132B',
    fontWeight: 'bold',
  },
  completedButton: {
    backgroundColor: '#7F00FF',
  },
  comingSoonCard: {
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  comingSoonText: {
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
}); 