import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample badges data
const initialBadges = [
  {
    id: '1',
    name: 'First Login',
    description: 'Created your Cyber Warriors account',
    icon: 'verified-user',
    earned: true,
    color: '#3FFFA8',
    unlockCondition: 'Create an account',
  },
  {
    id: '2',
    name: 'Password Master',
    description: 'Completed the Password Safety module',
    icon: 'lock',
    earned: false,
    color: '#3FFFA8',
    unlockCondition: 'Complete the Password Safety module',
  },
  {
    id: '3',
    name: 'Phishing Expert',
    description: 'Completed the Phishing Identification module',
    icon: 'email',
    earned: false,
    color: '#7F00FF',
    unlockCondition: 'Complete the Phishing Identification module',
  },
  {
    id: '4',
    name: 'Web Detective',
    description: 'Completed the Spotting Fake Websites module',
    icon: 'public',
    earned: false,
    color: '#7F00FF',
    unlockCondition: 'Complete the Spotting Fake Websites module',
  },
  {
    id: '5',
    name: 'Digital Guardian',
    description: 'Completed the Cyberbullying Prevention module',
    icon: 'shield',
    earned: false,
    color: '#7F00FF',
    unlockCondition: 'Complete the Cyberbullying Prevention module',
  },
  {
    id: '6',
    name: 'Security Specialist',
    description: 'Completed the Protecting Personal Data module',
    icon: 'security',
    earned: false,
    color: '#7F00FF',
    unlockCondition: 'Complete the Protecting Personal Data module',
  },
  {
    id: '7',
    name: '3-Day Streak',
    description: 'Completed challenges for 3 days in a row',
    icon: 'local-fire-department',
    earned: false,
    color: '#FF8C00',
    unlockCondition: 'Complete challenges for 3 days in a row',
  },
  {
    id: '8',
    name: '7-Day Streak',
    description: 'Completed challenges for 7 days in a row',
    icon: 'local-fire-department',
    earned: false,
    color: '#FF8C00',
    unlockCondition: 'Complete challenges for 7 days in a row',
  },
  {
    id: '9',
    name: 'Quick Learner',
    description: 'Earned 100 XP in a single day',
    icon: 'flash-on',
    earned: false,
    color: '#FFD700',
    unlockCondition: 'Earn 100 XP in a single day',
  },
  {
    id: '10',
    name: 'Cyber Warrior',
    description: 'Reached Level 5',
    icon: 'military-tech',
    earned: false,
    color: '#FFD700',
    unlockCondition: 'Reach Level 5',
  },
];

// Challenge levels data
const challengeLevels = [
  {
    id: '0',
    title: 'Level 0: Introduction',
    description: 'Get started with cybersecurity concepts',
    xpReward: 20,
    completed: false
  },
  {
    id: '1',
    title: 'Level 1: Password Basics',
    description: 'Learn the fundamentals of password security',
    xpReward: 30,
    completed: false
  },
  {
    id: '2',
    title: 'Level 2: Password Strength',
    description: 'Create strong passwords that are difficult to crack',
    xpReward: 35,
    completed: false
  },
  {
    id: '3',
    title: 'Level 3: Phishing Detection',
    description: 'Identify and avoid phishing attempts',
    xpReward: 40,
    completed: false
  },
  {
    id: '4',
    title: 'Level 4: Email Security',
    description: 'Protect your email from cyber threats',
    xpReward: 45,
    completed: false
  },
  {
    id: '5',
    title: 'Level 5: Social Media Safety',
    description: 'Stay safe on social media platforms',
    xpReward: 50,
    completed: false
  },
  {
    id: '6',
    title: 'Level 6: Public Wi-Fi Risks',
    description: 'Understand the dangers of public networks',
    xpReward: 55,
    completed: false
  },
  {
    id: '7',
    title: 'Level 7: Malware Protection',
    description: 'Defend against malicious software',
    xpReward: 60,
    completed: false
  },
  {
    id: '8',
    title: 'Level 8: Data Encryption',
    description: 'Learn how to encrypt sensitive information',
    xpReward: 65,
    completed: false
  },
  {
    id: '9',
    title: 'Level 9: Secure Browsing',
    description: 'Browse the web safely and securely',
    xpReward: 70,
    completed: false
  },
  {
    id: '10',
    title: 'Level 10: Comprehensive Security',
    description: 'Apply all learned concepts to create a security plan',
    xpReward: 100,
    completed: false
  }
];

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export default function AppProvider({ children }) {
  const [userData, setUserData] = useState({
    name: '',
    avatar: '',
    level: 0,
    xp: 0,
    streak: 0,
    lastActive: null,
    currentChallenge: 0
  });
  
  const [progressData, setProgressData] = useState({
    completedLessons: [],
    completedChallenges: [],
    badges: initialBadges,
    challenges: challengeLevels
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load user data from storage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Check if app has been launched before
        const hasLaunchedBefore = await AsyncStorage.getItem('hasLaunchedBefore');
        setIsFirstLaunch(hasLaunchedBefore !== 'true');
        
        const storedUserData = await AsyncStorage.getItem('userData');
        const storedProgressData = await AsyncStorage.getItem('progressData');
        
        if (storedUserData) {
          // Override with initial values for reset
          const parsedData = JSON.parse(storedUserData);
          setUserData({
            ...parsedData,
            level: 0,
            xp: 0,
            currentChallenge: 0
          });
        }
        
        if (storedProgressData) {
          // Reset progress data but keep user's name and profile
          const parsedProgress = JSON.parse(storedProgressData);
          setProgressData({
            completedLessons: [],
            completedChallenges: [],
            badges: initialBadges,
            challenges: challengeLevels
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Save user data to storage whenever it changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };
    
    if (userData.name) {
      saveUserData();
    }
  }, [userData]);

  // Save progress data to storage whenever it changes
  useEffect(() => {
    const saveProgressData = async () => {
      try {
        await AsyncStorage.setItem('progressData', JSON.stringify(progressData));
      } catch (error) {
        console.error('Error saving progress data:', error);
      }
    };
    
    saveProgressData();
  }, [progressData]);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasLaunchedBefore', 'true');
      setIsFirstLaunch(false);
      
      // Redirect to first challenge (level 0)
      setUserData(prevData => ({
        ...prevData,
        currentChallenge: 0
      }));
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Handle saving profile with multiple call patterns
  const saveProfile = async (nameOrProfile, birthday) => {
    try {
      let profileData;
      
      // Handle both calling patterns
      if (typeof nameOrProfile === 'object') {
        // Called with profile object: saveProfile({ name, birthday })
        profileData = nameOrProfile;
      } else {
        // Called with separate parameters: saveProfile(name, birthday)
        profileData = {
          name: nameOrProfile,
          birthday
        };
      }
      
      setUserData(prevData => ({
        ...prevData,
        ...profileData,
        level: 0,
        xp: 0,
        currentChallenge: 0
      }));

      await AsyncStorage.setItem('userData', JSON.stringify({
        ...userData,
        ...profileData,
        level: 0,
        xp: 0,
        currentChallenge: 0
      }));
      
      // Ensure only first login badge is earned
      setProgressData(prevData => ({
        ...prevData,
        completedLessons: [],
        completedChallenges: [],
        badges: initialBadges // This already has first login as earned
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  };

  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('progressData');
      
      setUserData({
        name: userData.name || '',
        avatar: userData.avatar || '',
        level: 0,
        xp: 0,
        streak: 0,
        lastActive: null,
        currentChallenge: 0
      });
      
      setProgressData({
        completedLessons: [],
        completedChallenges: [],
        badges: initialBadges,
        challenges: challengeLevels
      });
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const completeChallenge = (challengeId, xpEarned) => {
    // Update completed challenges
    setProgressData(prevData => {
      const updatedChallenges = prevData.challenges.map(challenge => 
        challenge.id === challengeId ? { ...challenge, completed: true } : challenge
      );
      
      const updatedCompletedChallenges = [...prevData.completedChallenges];
      if (!updatedCompletedChallenges.includes(challengeId)) {
        updatedCompletedChallenges.push(challengeId);
      }
      
      return {
        ...prevData,
        completedChallenges: updatedCompletedChallenges,
        challenges: updatedChallenges
      };
    });
    
    // Update XP and level
    updateXPAndLevel(xpEarned);
    
    // Move to next challenge
    setUserData(prevData => {
      const nextChallengeId = parseInt(challengeId) + 1;
      return {
        ...prevData,
        currentChallenge: nextChallengeId > 10 ? 10 : nextChallengeId
      };
    });
  };

  const completeLessonAndUpdateXP = (lessonId, xpEarned) => {
    // Update completed lessons
    setProgressData(prevData => {
      const updatedCompletedLessons = [...prevData.completedLessons];
      if (!updatedCompletedLessons.includes(lessonId)) {
        updatedCompletedLessons.push(lessonId);
      }
      
      // Check for badges to unlock based on completed lessons
      const updatedBadges = prevData.badges.map(badge => {
        if (!badge.earned) {
          // Logic to determine if this badge should be earned
          if ((badge.id === '2' && lessonId === 'passwordSafety') ||
              (badge.id === '3' && lessonId === 'phishingIdentification') ||
              (badge.id === '4' && lessonId === 'spotFakeWebsites') ||
              (badge.id === '5' && lessonId === 'cyberbullyingPrevention') ||
              (badge.id === '6' && lessonId === 'protectingPersonalData')) {
            return { ...badge, earned: true };
          }
        }
        return badge;
      });
      
      return {
        ...prevData,
        completedLessons: updatedCompletedLessons,
        badges: updatedBadges
      };
    });
    
    // Update XP and level
    updateXPAndLevel(xpEarned);
  };
  
  const updateXPAndLevel = (xpEarned) => {
    setUserData(prevData => {
      const newXP = prevData.xp + xpEarned;
      
      // Simple level calculation (100 XP per level)
      const newLevel = Math.floor(newXP / 100);
      
      // Check if user reached level 5 to unlock the Cyber Warrior badge
      if (newLevel >= 5) {
        setProgressData(prevProgress => ({
          ...prevProgress,
          badges: prevProgress.badges.map(badge => 
            badge.id === '10' ? { ...badge, earned: true } : badge
          )
        }));
      }
      
      // Update streak
      const today = new Date().toDateString();
      const wasActiveToday = prevData.lastActive === today;
      const wasActiveYesterday = prevData.lastActive === 
        new Date(Date.now() - 86400000).toDateString();
      
      let newStreak = prevData.streak;
      if (!wasActiveToday) {
        if (wasActiveYesterday) {
          newStreak += 1;
          
          // Check if user has reached streak goals
          if (newStreak >= 3) {
            setProgressData(prevProgress => ({
              ...prevProgress,
              badges: prevProgress.badges.map(badge => 
                badge.id === '7' ? { ...badge, earned: true } : badge
              )
            }));
          }
          
          if (newStreak >= 7) {
            setProgressData(prevProgress => ({
              ...prevProgress,
              badges: prevProgress.badges.map(badge => 
                badge.id === '8' ? { ...badge, earned: true } : badge
              )
            }));
          }
        } else {
          newStreak = 1;
        }
      }
      
      // Check if user earned 100 XP in a day
      if (xpEarned >= 100) {
        setProgressData(prevProgress => ({
          ...prevProgress,
          badges: prevProgress.badges.map(badge => 
            badge.id === '9' ? { ...badge, earned: true } : badge
          )
        }));
      }
      
      return {
        ...prevData,
        xp: newXP,
        level: newLevel,
        streak: newStreak,
        lastActive: today
      };
    });
  };

  // Skip onboarding for returning users
  const skipOnboarding = () => {
    setIsFirstLaunch(false);
  };

  return (
    <AppContext.Provider value={{ 
      userData, 
      progressData, 
      saveProfile, 
      resetProgress, 
      completeLessonAndUpdateXP,
      completeChallenge,
      isFirstLaunch,
      loading,
      completeOnboarding,
      skipOnboarding
    }}>
      {children}
    </AppContext.Provider>
  );
} 