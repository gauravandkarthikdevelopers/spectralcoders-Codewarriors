import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
export const STORAGE_KEYS = {
  USER_DATA: 'cyber_warriors_user_data',
  PROGRESS_DATA: 'cyber_warriors_progress_data',
  CHALLENGE_DATA: 'cyber_warriors_challenge_data',
};

// Initial user data
export const initialUserData = {
  name: '',
  birthday: '',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  rank: 'Cyber Rookie',
  streakDays: 0,
  totalLessonsCompleted: 0,
  joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  isProfileComplete: false,
  onboardingComplete: false,
  lastActiveDate: new Date().toDateString(),
};

// Initial progress data
export const initialProgressData = {
  modules: {
    password: {
      id: 'password',
      progress: 0,
      completed: 0,
      totalLessons: 5,
      unlocked: true,
    },
    phishing: {
      id: 'phishing',
      progress: 0,
      completed: 0,
      totalLessons: 5,
      unlocked: false,
    },
    websites: {
      id: 'websites',
      progress: 0,
      completed: 0,
      totalLessons: 5,
      unlocked: false,
    },
    cyberbullying: {
      id: 'cyberbullying',
      progress: 0,
      completed: 0,
      totalLessons: 5,
      unlocked: false,
    },
    personaldata: {
      id: 'personaldata',
      progress: 0,
      completed: 0,
      totalLessons: 5,
      unlocked: false,
    },
  },
  badges: [
    {
      id: '1',
      name: 'First Login',
      description: 'Created your Cyber Warriors account',
      icon: 'verified-user',
      earned: true,
      earnedDate: new Date().toDateString(),
      color: '#3FFFA8',
    },
    {
      id: '2',
      name: 'Password Master',
      description: 'Completed the Password Safety module',
      icon: 'lock',
      earned: false,
      earnedDate: null,
      color: '#3FFFA8',
    },
    {
      id: '3',
      name: 'Phishing Expert',
      description: 'Completed the Phishing Identification module',
      icon: 'email',
      earned: false,
      earnedDate: null,
      color: '#7F00FF',
    },
    {
      id: '4',
      name: 'Web Detective',
      description: 'Completed the Spotting Fake Websites module',
      icon: 'public',
      earned: false,
      earnedDate: null,
      color: '#7F00FF',
    },
    {
      id: '5',
      name: 'Digital Guardian',
      description: 'Completed the Cyberbullying Prevention module',
      icon: 'shield',
      earned: false,
      earnedDate: null,
      color: '#7F00FF',
    },
    {
      id: '6',
      name: 'Security Specialist',
      description: 'Completed the Protecting Personal Data module',
      icon: 'security',
      earned: false,
      earnedDate: null,
      color: '#7F00FF',
    },
    {
      id: '7',
      name: '3-Day Streak',
      description: 'Completed challenges for 3 days in a row',
      icon: 'local-fire-department',
      earned: false,
      earnedDate: null,
      color: '#FF8C00',
    },
    {
      id: '8',
      name: '7-Day Streak',
      description: 'Completed challenges for 7 days in a row',
      icon: 'local-fire-department',
      earned: false,
      earnedDate: null,
      color: '#FF8C00',
    },
    {
      id: '9',
      name: 'Quick Learner',
      description: 'Earned 100 XP in a single day',
      icon: 'flash-on',
      earned: false,
      earnedDate: null,
      color: '#FFD700',
    },
    {
      id: '10',
      name: 'Cyber Warrior',
      description: 'Reached Level 5',
      icon: 'military-tech',
      earned: false,
      earnedDate: null,
      color: '#FFD700',
    },
  ],
  dailyChallengesCompleted: 0,
};

// Initialize challenge data
export const initialChallengeData = {
  dailyChallengeCompleted: false,
  lastChallengeDate: null,
  challengeStreak: 0,
};

// Save user data to AsyncStorage
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Get user data from AsyncStorage
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : initialUserData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return initialUserData;
  }
};

// Save progress data to AsyncStorage
export const saveProgressData = async (progressData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS_DATA, JSON.stringify(progressData));
  } catch (error) {
    console.error('Error saving progress data:', error);
  }
};

// Get progress data from AsyncStorage
export const getProgressData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS_DATA);
    return data ? JSON.parse(data) : initialProgressData;
  } catch (error) {
    console.error('Error getting progress data:', error);
    return initialProgressData;
  }
};

// Save challenge data to AsyncStorage
export const saveChallengeData = async (challengeData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_DATA, JSON.stringify(challengeData));
  } catch (error) {
    console.error('Error saving challenge data:', error);
  }
};

// Get challenge data from AsyncStorage
export const getChallengeData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_DATA);
    return data ? JSON.parse(data) : initialChallengeData;
  } catch (error) {
    console.error('Error getting challenge data:', error);
    return initialChallengeData;
  }
};

// Update XP and level
export const updateXP = async (xpToAdd) => {
  try {
    const userData = await getUserData();
    let newXP = userData.xp + xpToAdd;
    let newLevel = userData.level;
    let newXpToNextLevel = userData.xpToNextLevel;
    
    // Check if leveling up
    while (newXP >= newXpToNextLevel) {
      newXP -= newXpToNextLevel;
      newLevel++;
      newXpToNextLevel = 100 * newLevel; // Scale XP required with level
      
      // Check if "Cyber Warrior" badge should be unlocked
      if (newLevel >= 5) {
        const progressData = await getProgressData();
        const updatedBadges = progressData.badges.map(badge => 
          badge.id === '10' ? { ...badge, earned: true, earnedDate: new Date().toDateString() } : badge
        );
        
        await saveProgressData({
          ...progressData,
          badges: updatedBadges
        });
      }
    }
    
    // Update rank based on level
    let newRank = 'Cyber Rookie';
    if (newLevel >= 5) newRank = 'Cyber Warrior';
    else if (newLevel >= 4) newRank = 'Cyber Guardian';
    else if (newLevel >= 3) newRank = 'Cyber Knight';
    else if (newLevel >= 2) newRank = 'Cyber Cadet';
    
    const updatedUserData = {
      ...userData,
      xp: newXP,
      level: newLevel,
      xpToNextLevel: newXpToNextLevel,
      rank: newRank
    };
    
    await saveUserData(updatedUserData);
    return updatedUserData;
  } catch (error) {
    console.error('Error updating XP:', error);
  }
};

// Update streak days
export const updateStreak = async () => {
  try {
    const userData = await getUserData();
    const today = new Date().toDateString();
    
    // If already checked in today, return current data
    if (userData.lastActiveDate === today) {
      return userData;
    }
    
    // Check if it's consecutive day
    const lastActive = new Date(userData.lastActiveDate);
    const currentDate = new Date();
    
    // Calculate the difference in days
    const timeDiff = currentDate.getTime() - lastActive.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    let newStreakDays = userData.streakDays;
    
    if (dayDiff === 1) {
      // Consecutive day, increase streak
      newStreakDays += 1;
      
      // Check if 3-day streak badge should be unlocked
      if (newStreakDays >= 3) {
        const progressData = await getProgressData();
        let updatedBadges = progressData.badges;
        
        // Update 3-day streak badge
        updatedBadges = updatedBadges.map(badge => 
          badge.id === '7' ? { ...badge, earned: true, earnedDate: today } : badge
        );
        
        // Update 7-day streak badge if applicable
        if (newStreakDays >= 7) {
          updatedBadges = updatedBadges.map(badge => 
            badge.id === '8' ? { ...badge, earned: true, earnedDate: today } : badge
          );
        }
        
        await saveProgressData({
          ...progressData,
          badges: updatedBadges
        });
      }
    } else if (dayDiff > 1) {
      // Streak broken
      newStreakDays = 1;
    }
    
    const updatedUserData = {
      ...userData,
      streakDays: newStreakDays,
      lastActiveDate: today
    };
    
    await saveUserData(updatedUserData);
    return updatedUserData;
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

// Reset all data (for testing or user requested reset)
export const resetAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.PROGRESS_DATA,
      STORAGE_KEYS.CHALLENGE_DATA
    ]);
    
    // Re-initialize with first login badge
    const newProgressData = { ...initialProgressData };
    await saveProgressData(newProgressData);
    
    return {
      userData: initialUserData,
      progressData: newProgressData,
      challengeData: initialChallengeData
    };
  } catch (error) {
    console.error('Error resetting data:', error);
  }
};

// Complete a module lesson
export const completeModuleLesson = async (moduleId) => {
  try {
    const progressData = await getProgressData();
    const userData = await getUserData();
    
    if (!progressData.modules[moduleId]) {
      return { progressData, userData };
    }
    
    const module = progressData.modules[moduleId];
    const newCompleted = module.completed + 1;
    const newProgress = Math.min(100, Math.floor((newCompleted / module.totalLessons) * 100));
    
    // Update the module progress
    const updatedModules = {
      ...progressData.modules,
      [moduleId]: {
        ...module,
        completed: newCompleted,
        progress: newProgress
      }
    };
    
    // Check if module is completed and unlock next module
    if (newCompleted >= module.totalLessons) {
      // Determine which module to unlock next
      const moduleOrder = ['password', 'phishing', 'websites', 'cyberbullying', 'personaldata'];
      const currentIndex = moduleOrder.indexOf(moduleId);
      
      if (currentIndex < moduleOrder.length - 1) {
        const nextModuleId = moduleOrder[currentIndex + 1];
        updatedModules[nextModuleId] = {
          ...updatedModules[nextModuleId],
          unlocked: true
        };
      }
      
      // Award appropriate badge
      let updatedBadges = [...progressData.badges];
      
      // Find the corresponding badge for this module
      const badgeMap = {
        'password': '2', // Password Master
        'phishing': '3', // Phishing Expert
        'websites': '4', // Web Detective
        'cyberbullying': '5', // Digital Guardian
        'personaldata': '6', // Security Specialist
      };
      
      if (badgeMap[moduleId]) {
        updatedBadges = updatedBadges.map(badge => 
          badge.id === badgeMap[moduleId] 
            ? { ...badge, earned: true, earnedDate: new Date().toDateString() } 
            : badge
        );
      }
      
      // Award XP for completing module
      await updateXP(50);
      
      const updatedProgressData = {
        ...progressData,
        modules: updatedModules,
        badges: updatedBadges
      };
      
      await saveProgressData(updatedProgressData);
      const updatedUserData = {
        ...userData,
        totalLessonsCompleted: userData.totalLessonsCompleted + 1
      };
      
      await saveUserData(updatedUserData);
      
      return { 
        progressData: updatedProgressData,
        userData: updatedUserData
      };
    } else {
      // If module not complete, just update progress and award XP for the lesson
      await updateXP(15);
      
      const updatedProgressData = {
        ...progressData,
        modules: updatedModules
      };
      
      await saveProgressData(updatedProgressData);
      
      const updatedUserData = {
        ...userData,
        totalLessonsCompleted: userData.totalLessonsCompleted + 1
      };
      
      await saveUserData(updatedUserData);
      
      return { 
        progressData: updatedProgressData,
        userData: updatedUserData
      };
    }
  } catch (error) {
    console.error('Error completing module lesson:', error);
  }
};

// Complete daily challenge
export const completeDailyChallenge = async (success) => {
  try {
    const challengeData = await getChallengeData();
    const today = new Date().toDateString();
    
    // If already completed today, return current data
    if (challengeData.dailyChallengeCompleted && challengeData.lastChallengeDate === today) {
      return challengeData;
    }
    
    // Check if it's a consecutive day
    let newStreak = challengeData.challengeStreak;
    
    if (challengeData.lastChallengeDate) {
      const lastDate = new Date(challengeData.lastChallengeDate);
      const currentDate = new Date();
      
      // Calculate the difference in days
      const timeDiff = currentDate.getTime() - lastDate.getTime();
      const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day
        newStreak++;
      } else if (dayDiff > 1) {
        // Streak broken
        newStreak = 1;
      }
    } else {
      // First time completion
      newStreak = 1;
    }
    
    const updatedChallengeData = {
      dailyChallengeCompleted: true,
      lastChallengeDate: today,
      challengeStreak: newStreak
    };
    
    // Save challenge data
    await saveChallengeData(updatedChallengeData);
    
    // Update progress data
    const progressData = await getProgressData();
    const updatedProgressData = {
      ...progressData,
      dailyChallengesCompleted: progressData.dailyChallengesCompleted + 1
    };
    
    await saveProgressData(updatedProgressData);
    
    // Award XP if successful
    if (success) {
      await updateXP(25);
    }
    
    // Update streak
    await updateStreak();
    
    return updatedChallengeData;
  } catch (error) {
    console.error('Error completing daily challenge:', error);
  }
}; 