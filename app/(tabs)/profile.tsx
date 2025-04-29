import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAppContext } from '../../context/AppContext';
import { format } from 'date-fns';

// Sample user data - in a real app, this would be stored in local storage
const initialUserData = {
  name: '',
  birthday: '',
  level: 2,
  xp: 145,
  xpToNextLevel: 200,
  rank: 'Cyber Cadet',
  streakDays: 3,
  totalLessonsCompleted: 7,
  joinDate: 'October 2023',
  isProfileComplete: false,
};

export default function ProfileScreen() {
  const { userData, progressData, resetProgress, saveProfile } = useAppContext();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userData.name || '');
  const [birthday, setBirthday] = useState(
    userData.birthday ? format(new Date(userData.birthday), 'MM/dd/yyyy') : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Update local state when userData changes
    setName(userData.name || '');
    setBirthday(
      userData.birthday ? format(new Date(userData.birthday), 'MM/dd/yyyy') : ''
    );
  }, [userData]);
  
  const handleBirthdayChange = (text) => {
    // Format as MM/DD/YYYY
    let formatted = text.replace(/[^0-9]/g, '');
    if (formatted.length > 8) {
      formatted = formatted.substring(0, 8);
    }
    
    if (formatted.length > 4) {
      formatted = `${formatted.substring(0, 2)}/${formatted.substring(2, 4)}/${formatted.substring(4)}`;
    } else if (formatted.length > 2) {
      formatted = `${formatted.substring(0, 2)}/${formatted.substring(2)}`;
    }
    
    setBirthday(formatted);
    if (error) setError('');
  };

  const handleNameChange = (text) => {
    setName(text);
    if (error) setError('');
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    
    if (!birthday.trim() || birthday.length < 10) {
      setError('Please enter a valid date (MM/DD/YYYY)');
      return false;
    }
    
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Convert MM/DD/YYYY to a Date object
      const [month, day, year] = birthday.split('/');
      const birthdayDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      const success = await saveProfile({ 
        name,
        birthday: birthdayDate 
      });
      
      if (success) {
        setEditMode(false);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const success = await resetProgress();
              if (!success) {
                Alert.alert('Error', 'Failed to reset progress. Please try again.');
              }
            } catch (error) {
              console.error('Reset progress error:', error);
              Alert.alert('Error', 'An error occurred while resetting progress.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Calculate XP to next level based on the level thresholds
  const getXPToNextLevel = () => {
    const levelThresholds = [
      0,     // Level 0
      100,   // Level 1
      250,   // Level 2
      450,   // Level 3
      700,   // Level 4
      1000,  // Level 5
      1350,  // Level 6
      1750,  // Level 7
      2200,  // Level 8
      2700,  // Level 9
      3250   // Level 10
    ];
    
    const currentLevel = userData.level;
    const nextLevel = currentLevel + 1;
    
    if (nextLevel >= levelThresholds.length) {
      return {
        current: 0,
        total: 0,
        percentage: 100
      };
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
  
  // Get rank name based on level
  const getRankName = () => {
    if (userData.level >= 8) return 'Cyber Commander';
    if (userData.level >= 5) return 'Cyber Warrior';
    if (userData.level >= 3) return 'Cyber Guardian';
    return 'Cyber Cadet';
  };
  
  // Count total completed lessons
  const totalLessonsCompleted = progressData.completedLessons?.length || 0;
  
  // Count earned badges
  const earnedBadgesCount = progressData.badges?.filter(badge => badge.earned)?.length || 0;
  
  // Format join date
  const formatJoinDate = () => {
    if (!userData.lastActive) return 'Recently';
    
    const date = new Date(userData.lastActive);
    return format(date, 'MMMM yyyy');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable 
            style={styles.editButton} 
            onPress={() => setEditMode(!editMode)}
          >
            <MaterialIcons name={editMode ? "close" : "edit"} size={20} color="#3FFFA8" />
          </Pressable>
        </View>

        {editMode ? (
          <View style={styles.editProfileCard}>
            <Text style={styles.editTitle}>Edit Profile</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={handleNameChange}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Birthday</Text>
              <TextInput
                style={styles.input}
                value={birthday}
                onChangeText={handleBirthdayChange}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Text style={styles.privacyNote}>
              Note: Your information is stored locally on your device only. We don't collect any personal data.
            </Text>
            
            <Pressable 
              style={[styles.saveButton, (!name.trim() || !birthday.trim() || loading) && styles.disabledButton]} 
              onPress={handleSaveProfile}
              disabled={!name.trim() || !birthday.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#0B132B" />
              ) : (
                <Text style={styles.saveButtonText}>Save Profile</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <MaterialIcons name="person" size={60} color="#3FFFA8" />
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{userData.level}</Text>
                </View>
              </View>
              
              <Text style={styles.userName}>{userData.name || 'Cyber Warrior'}</Text>
              <Text style={styles.userRank}>{getRankName()}</Text>
              
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
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <MaterialIcons name="local-fire-department" size={28} color="#FF8C00" />
                <Text style={styles.statValue}>{userData.streak || 0}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              
              <View style={styles.statCard}>
                <MaterialIcons name="school" size={28} color="#3FFFA8" />
                <Text style={styles.statValue}>{totalLessonsCompleted}</Text>
                <Text style={styles.statLabel}>Lessons</Text>
              </View>
              
              <View style={styles.statCard}>
                <MaterialIcons name="emoji-events" size={28} color="#7F00FF" />
                <Text style={styles.statValue}>{earnedBadgesCount}</Text>
                <Text style={styles.statLabel}>Badges</Text>
              </View>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Account Info</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Birthday</Text>
                <Text style={styles.infoValue}>
                  {userData.birthday ? format(new Date(userData.birthday), 'MMMM d, yyyy') : 'Not set'}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Started</Text>
                <Text style={styles.infoValue}>{formatJoinDate()}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Storage</Text>
                <Text style={styles.infoValue}>Local Device</Text>
              </View>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Privacy Statement</Text>
              <Text style={styles.cardText}>
                Cyber Warriors stores all of your data locally on your device. We do not collect, store, or share any of your personal information.
              </Text>
            </View>
          </>
        )}
        
        <Pressable 
          style={styles.resetButton}
          onPress={handleResetProgress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FF5252" />
          ) : (
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          )}
        </Pressable>
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
  editButton: {
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#7F00FF',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7F00FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0B132B',
  },
  levelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userRank: {
    fontSize: 16,
    color: '#3FFFA8',
    marginBottom: 15,
  },
  progressContainer: {
    width: '100%',
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
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    width: '31%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  infoCard: {
    backgroundColor: 'rgba(63, 255, 168, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    color: '#fff',
    opacity: 0.8,
  },
  infoValue: {
    color: '#fff',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cardText: {
    color: '#fff',
    opacity: 0.8,
    lineHeight: 20,
  },
  editProfileCard: {
    backgroundColor: 'rgba(63, 255, 168, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  editTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  privacyNote: {
    color: '#fff',
    opacity: 0.7,
    marginVertical: 15,
    fontSize: 12,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: '#3FFFA8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#0B132B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    color: '#FF5252',
    marginTop: 5,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#FF5252',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  resetButtonText: {
    color: '#FF5252',
    fontWeight: 'bold',
  }
}); 