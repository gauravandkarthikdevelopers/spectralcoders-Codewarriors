import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../../context/AppContext';

// Sample badges data
const badges = [
  {
    id: '1',
    name: 'First Login',
    description: 'Created your Cyber Warriors account',
    icon: 'verified-user',
    earned: true,
    color: '#3FFFA8',
  },
  {
    id: '2',
    name: 'Password Master',
    description: 'Completed the Password Safety module',
    icon: 'lock',
    earned: true,
    color: '#3FFFA8',
  },
  {
    id: '3',
    name: 'Phishing Expert',
    description: 'Completed the Phishing Identification module',
    icon: 'email',
    earned: false,
    color: '#7F00FF',
  },
  {
    id: '4',
    name: 'Web Detective',
    description: 'Completed the Spotting Fake Websites module',
    icon: 'public',
    earned: false,
    color: '#7F00FF',
  },
  {
    id: '5',
    name: 'Digital Guardian',
    description: 'Completed the Cyberbullying Prevention module',
    icon: 'shield',
    earned: false,
    color: '#7F00FF',
  },
  {
    id: '6',
    name: 'Security Specialist',
    description: 'Completed the Protecting Personal Data module',
    icon: 'security',
    earned: false,
    color: '#7F00FF',
  },
  {
    id: '7',
    name: '3-Day Streak',
    description: 'Completed challenges for 3 days in a row',
    icon: 'local-fire-department',
    earned: true,
    color: '#FF8C00',
  },
  {
    id: '8',
    name: '7-Day Streak',
    description: 'Completed challenges for 7 days in a row',
    icon: 'local-fire-department',
    earned: false,
    color: '#FF8C00',
  },
  {
    id: '9',
    name: 'Quick Learner',
    description: 'Earned 100 XP in a single day',
    icon: 'flash-on',
    earned: false,
    color: '#FFD700',
  },
  {
    id: '10',
    name: 'Cyber Warrior',
    description: 'Reached Level 5',
    icon: 'military-tech',
    earned: false,
    color: '#FFD700',
  },
];

export default function AchievementsScreen() {
  const { progressData, userData } = useAppContext();
  const badges = progressData?.badges || [];
  
  // Calculate stats
  const earnedBadges = badges.filter(badge => badge.earned);
  const lockedBadges = badges.filter(badge => !badge.earned);
  const completionRate = badges.length > 0 ? (earnedBadges.length / badges.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Badges</Text>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{earnedBadges.length}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{lockedBadges.length}</Text>
            <Text style={styles.statLabel}>Locked</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completionRate.toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>
        
        <View style={styles.levelCard}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>Current Level</Text>
            <Text style={styles.levelNumber}>{userData.level}</Text>
          </View>
          <View style={styles.xpContainer}>
            <Text style={styles.xpLabel}>XP: {userData.xp}</Text>
            <View style={styles.xpProgress}>
              <View 
                style={[
                  styles.xpFill, 
                  { 
                    width: `${Math.min(100, (userData.xp / Math.max(100, userData.xp + 100)) * 100)}%` 
                  }
                ]} 
              />
            </View>
          </View>
        </View>
        
        {earnedBadges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Badges</Text>
            <View style={styles.badgesGrid}>
              {earnedBadges.map(badge => (
                <View key={badge.id} style={styles.badgeCard}>
                  <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                    <MaterialIcons name={badge.icon} size={32} color="#fff" />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDescription}>{badge.description}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {lockedBadges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Locked Badges</Text>
            <View style={styles.badgesGrid}>
              {lockedBadges.map(badge => (
                <View key={badge.id} style={[styles.badgeCard, styles.lockedBadge]}>
                  <View style={[styles.badgeIcon, styles.lockedIcon]}>
                    <MaterialIcons name="lock" size={32} color="rgba(255,255,255,0.3)" />
                  </View>
                  <Text style={styles.lockedBadgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDescription}>{badge.unlockCondition}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <View style={styles.comingSoonCard}>
            <MaterialIcons name="rocket-launch" size={40} color="#3FFFA8" />
            <Text style={styles.comingSoonTitle}>More Badges Coming!</Text>
            <Text style={styles.comingSoonText}>
              Complete daily challenges and learning modules to unlock more badges!
            </Text>
          </View>
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
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#3FFFA8',
    fontSize: 14,
  },
  levelCard: {
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#3FFFA8',
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3FFFA8',
  },
  xpContainer: {
    width: '100%',
  },
  xpLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  xpProgress: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#3FFFA8',
    borderRadius: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  lockedBadge: {
    opacity: 0.7,
  },
  badgeIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  lockedIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  lockedBadgeName: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  badgeDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  comingSoonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  comingSoonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  comingSoonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  }
}); 