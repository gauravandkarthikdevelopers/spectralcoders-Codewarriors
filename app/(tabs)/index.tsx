import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

// Sample data - in a real app, this would come from local storage or state management
const userProgress = {
  level: 2,
  xp: 145,
  xpToNextLevel: 200,
  streak: 3,
  completedModules: 2,
  totalModules: 5,
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Warrior!</Text>
          <View style={styles.streakContainer}>
            <MaterialIcons name="local-fire-department" size={20} color="#FF8C00" />
            <Text style={styles.streakText}>{userProgress.streak} Day Streak</Text>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.card}>
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.cardTitle}>Level {userProgress.level}</Text>
              <Text style={styles.rankName}>Cyber Cadet</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>{userProgress.level}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(userProgress.xp / userProgress.xpToNextLevel) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {userProgress.xp}/{userProgress.xpToNextLevel} XP
            </Text>
          </View>
        </View>

        {/* Daily Challenge */}
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

        {/* Continue Learning */}
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        
        <View style={styles.learningModule}>
          <View style={styles.moduleIconContainer}>
            <MaterialIcons name="lock" size={28} color="#3FFFA8" />
          </View>
          <View style={styles.moduleContent}>
            <Text style={styles.moduleTitle}>Password Safety</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '100%' }]} />
              </View>
              <Text style={styles.moduleProgressText}>Completed</Text>
            </View>
          </View>
        </View>

        <View style={styles.learningModule}>
          <View style={styles.moduleIconContainer}>
            <MaterialIcons name="email" size={28} color="#3FFFA8" />
          </View>
          <View style={styles.moduleContent}>
            <Text style={styles.moduleTitle}>Phishing Scam Identification</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
              <Text style={styles.moduleProgressText}>2/5 Lessons</Text>
            </View>
          </View>
          <Link href="/(tabs)/learn" asChild>
            <Pressable style={styles.continueButton}>
              <MaterialIcons name="play-arrow" size={20} color="#0B132B" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.learningModule}>
          <View style={styles.moduleIconContainer}>
            <MaterialIcons name="public" size={28} color="#3FFFA8" />
          </View>
          <View style={styles.moduleContent}>
            <Text style={styles.moduleTitle}>Spotting Fake Websites</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
              <Text style={styles.moduleProgressText}>0/5 Lessons</Text>
            </View>
          </View>
          <Link href="/(tabs)/learn" asChild>
            <Pressable style={styles.continueButton}>
              <MaterialIcons name="play-arrow" size={20} color="#0B132B" />
            </Pressable>
          </Link>
        </View>

        {/* Achievement Progress */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Achievements</Text>
            <MaterialIcons name="emoji-events" size={22} color="#3FFFA8" />
          </View>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <MaterialIcons name="verified-user" size={24} color="#FFFFFF" />
              <Text style={styles.badgeText}>First Login</Text>
            </View>
            <View style={styles.badge}>
              <MaterialIcons name="school" size={24} color="#FFFFFF" />
              <Text style={styles.badgeText}>First Lesson</Text>
            </View>
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
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#3FFFA8',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B132B',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#3FFFA8',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3FFFA8',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  learningModule: {
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  moduleProgressText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  continueButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3FFFA8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  badge: {
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});
