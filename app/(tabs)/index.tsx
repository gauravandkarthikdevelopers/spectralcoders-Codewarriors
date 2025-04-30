import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAppContext } from '../../context/AppContext';

export default function HomeScreen() {
  const { userData, progressData } = useAppContext();
  
  const getXPToNextLevel = () => {
    const levelThresholds = [
      0,     
      100,   
      250,   
      450,   
      700,   
      1000,  
      1350,  
      1750,  
      2200,  
      2700,  
      3250   
    ];
    
    const currentLevel = userData.level;
    const nextLevel = currentLevel + 1;
    
    if (nextLevel >= levelThresholds.length) {
      return 0; 
    }
    
    const currentLevelXP = levelThresholds[currentLevel];
    const nextLevelXP = levelThresholds[nextLevel];
    const xpToNextLevel = nextLevelXP - currentLevelXP;
    const xpProgress = userData.xp - currentLevelXP;
    
    return {
      current: xpProgress,
      total: xpToNextLevel,
      percentage: (xpProgress / xpToNextLevel) * 100
    };
  };
  
  const xpProgress = getXPToNextLevel();
  
  const completedModules = Object.values(progressData.modules).filter(
    module => module.progress === 100
  ).length;
  
  const totalModules = Object.values(progressData.modules).length;
  
  const getRankName = () => {
    if (userData.level >= 8) return 'Cyber Commander';
    if (userData.level >= 5) return 'Cyber Warrior';
    if (userData.level >= 3) return 'Cyber Guardian';
    return 'Cyber Cadet';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userData.name || 'Warrior'}!</Text>
          <View style={styles.streakContainer}>
            <MaterialIcons name="local-fire-department" size={20} color="#FF8C00" />
            <Text style={styles.streakText}>{userData.streak || 0} Day Streak</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.cardTitle}>Level {userData.level}</Text>
              <Text style={styles.rankName}>{getRankName()}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>{userData.level}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${xpProgress.percentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {xpProgress.current}/{xpProgress.total} XP to Level {userData.level + 1}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Daily Challenge</Text>
            <MaterialIcons name="today" size={22} color="#3FFFA8" />
          </View>
          <Text style={styles.cardDescription}>
            Complete today's challenge to earn bonus XP!
          </Text>
          <Link href="/(tabs)/daily" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Start Challenge</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.sectionTitle}>Continue Learning</Text>
        
        {progressData.modules.password && (
          <View style={styles.learningModule}>
            <View style={styles.moduleIconContainer}>
              <MaterialIcons name="lock" size={28} color="#3FFFA8" />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Password Safety</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressData.modules.password.progress}%` }]} />
                </View>
                <Text style={styles.moduleProgressText}>
                  {progressData.modules.password.progress === 100 ? 'Completed' : 
                    `${progressData.modules.password.completed}/${progressData.modules.password.totalLessons} Lessons`}
                </Text>
              </View>
            </View>
            <Link href="/(tabs)/learn" asChild>
              <Pressable style={styles.continueButton}>
                <MaterialIcons name="play-arrow" size={20} color="#0B132B" />
              </Pressable>
            </Link>
          </View>
        )}

        {progressData.modules.phishing && progressData.modules.phishing.unlocked && (
          <View style={styles.learningModule}>
            <View style={styles.moduleIconContainer}>
              <MaterialIcons name="email" size={28} color="#3FFFA8" />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Phishing Scam Identification</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressData.modules.phishing.progress}%` }]} />
                </View>
                <Text style={styles.moduleProgressText}>
                  {progressData.modules.phishing.progress === 100 ? 'Completed' : 
                    `${progressData.modules.phishing.completed}/${progressData.modules.phishing.totalLessons} Lessons`}
                </Text>
              </View>
            </View>
            <Link href="/(tabs)/learn" asChild>
              <Pressable style={styles.continueButton}>
                <MaterialIcons name="play-arrow" size={20} color="#0B132B" />
              </Pressable>
            </Link>
          </View>
        )}

        {progressData.modules.websites && progressData.modules.websites.unlocked && (
          <View style={styles.learningModule}>
            <View style={styles.moduleIconContainer}>
              <MaterialIcons name="public" size={28} color="#3FFFA8" />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Spotting Fake Websites</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressData.modules.websites.progress}%` }]} />
                </View>
                <Text style={styles.moduleProgressText}>
                  {progressData.modules.websites.progress === 100 ? 'Completed' : 
                    `${progressData.modules.websites.completed}/${progressData.modules.websites.totalLessons} Lessons`}
                </Text>
              </View>
            </View>
            <Link href="/(tabs)/learn" asChild>
              <Pressable style={styles.continueButton}>
                <MaterialIcons name="play-arrow" size={20} color="#0B132B" />
              </Pressable>
            </Link>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Achievements</Text>
            <MaterialIcons name="emoji-events" size={22} color="#3FFFA8" />
          </View>
          <View style={styles.badgeContainer}>
            {progressData.badges.filter(badge => badge.earned).slice(0, 2).map(badge => (
              <View key={badge.id} style={styles.badge}>
                <MaterialIcons name={badge.icon} size={24} color="#FFFFFF" />
                <Text style={styles.badgeText}>{badge.name}</Text>
              </View>
            ))}
          </View>
          <Link href="/(tabs)/achievements" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>View All Badges</Text>
            </Pressable>
          </Link>
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
  greeting: {
    fontSize: 24,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 15,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rankName: {
    fontSize: 14,
    color: '#3FFFA8',
    marginTop: 5,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7F00FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    marginVertical: 5,
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
  button: {
    backgroundColor: '#3FFFA8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0B132B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 15,
  },
  learningModule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
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
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  moduleProgressText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  continueButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3FFFA8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#3FFFA8',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3FFFA8',
    fontWeight: 'bold',
  }
});
