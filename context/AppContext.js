import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  saveUserData as storeSaveUserData, 
  saveProgressData as storeSaveProgressData,
  getUserData,
  getProgressData
} from '../utils/storage';

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
    name: 'Data Protector',
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
  {
    id: '11',
    name: 'Malware Hunter',
    description: 'Completed the Malware Protection module',
    icon: 'bug-report',
    earned: false,
    color: '#7F00FF',
    unlockCondition: 'Complete the Malware Protection module',
  },
  {
    id: '12',
    name: 'Network Defender',
    description: 'Completed the Public Wi-Fi Security module',
    icon: 'wifi',
    earned: false,
    color: '#7F00FF',
    unlockCondition: 'Complete the Public Wi-Fi Security module',
  },
  {
    id: '13',
    name: 'Crypto Master',
    description: 'Completed the Data Encryption module',
    icon: 'enhanced-encryption',
    earned: false,
    color: '#7F00FF',
    unlockCondition: 'Complete the Data Encryption module',
  },
  {
    id: '14',
    name: 'Social Shield',
    description: 'Completed the Social Media Safety module',
    icon: 'people',
    earned: false,
    color: '#7F00FF',
    unlockCondition: 'Complete the Social Media Safety module',
  },
  {
    id: '15',
    name: 'Cyber Master',
    description: 'Reached Level 10',
    icon: 'workspace-premium',
    earned: false,
    color: '#FFD700',
    unlockCondition: 'Reach Level 10',
  },
  {
    id: '16',
    name: '14-Day Streak',
    description: 'Completed challenges for 14 days in a row',
    icon: 'whatshot',
    earned: false,
    color: '#FF8C00',
    unlockCondition: 'Complete challenges for 14 days in a row',
  },
  {
    id: '17',
    name: 'Security Champion',
    description: 'Completed all security modules',
    icon: 'verified',
    earned: false,
    color: '#FFD700',
    unlockCondition: 'Complete all security modules',
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

// Define initial module states
const initialModules = {
  password: {
    id: 'password',
    unlocked: true,
    progress: 0,
    completed: 0,
    totalLessons: 5
  },
  phishing: {
    id: 'phishing',
    unlocked: false,
    progress: 0,
    completed: 0,
    totalLessons: 5
  },
  websites: {
    id: 'websites',
    unlocked: false,
    progress: 0,
    completed: 0,
    totalLessons: 5
  },
  malware: {
    id: 'malware',
    unlocked: false,
    progress: 0,
    completed: 0,
    totalLessons: 6
  },
  cyberbullying: {
    id: 'cyberbullying',
    unlocked: false,
    progress: 0,
    completed: 0,
    totalLessons: 5
  },
  personaldata: {
    id: 'personaldata',
    unlocked: false,
    progress: 0,
    completed: 0,
    totalLessons: 5
  },
  wifi: {
    id: 'wifi',
    unlocked: false,
    progress: 0,
    completed: 0,
    totalLessons: 5
  },
  encryption: {
    id: 'encryption',
    unlocked: false,
    progress: 0,
    completed: 0,
    totalLessons: 5
  },
  socialmedia: {
    id: 'socialmedia',
    unlocked: false,
    progress: 0,
    completed: 0,
    totalLessons: 5
  }
};

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
    challenges: challengeLevels,
    modules: initialModules
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load user data from storage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Check if app has been launched before
        const firstLaunch = await AsyncStorage.getItem('firstLaunch');
        if (firstLaunch === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('firstLaunch', 'false');
        } else {
          setIsFirstLaunch(false);
        }
        
        // Load user data using the imported utility
        const parsedUserData = await getUserData();
        if (parsedUserData) {
          setUserData(parsedUserData);
          
          // Update login streak
          const today = new Date().toDateString();
          if (parsedUserData.lastActive && parsedUserData.lastActive !== today) {
            updateLoginStreak();
          }
        }
        
        // Load progress data using the imported utility
        const parsedProgressData = await getProgressData();
        if (parsedProgressData) {
          setProgressData(parsedProgressData);
        }
        
        // Check if we need to generate a daily challenge
        if (!parsedUserData.currentChallenge) {
          // No current challenge, generate one
          setTimeout(() => generateNewDailyChallenge(), 1000);
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Define the save functions at component level so they can be used across the component
  const saveUserData = async (data) => {
    try {
      const dataToSave = data || userData;
      await storeSaveUserData(dataToSave);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
  
  const saveProgressData = async (data) => {
    try {
      const dataToSave = data || progressData;
      await storeSaveProgressData(dataToSave);
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  };
  
  // Save user data to storage whenever it changes
  useEffect(() => {
    if (userData.name) {
      saveUserData();
    }
  }, [userData]);

  // Save progress data to storage whenever it changes
  useEffect(() => {
    saveProgressData();
  }, [progressData]);

  const completeOnboarding = async () => {
    try {
      // Set flag that app has been launched before
      await AsyncStorage.setItem('hasLaunchedBefore', 'true');
      setIsFirstLaunch(false);
      
      // Update first login badge
      const updatedBadges = [...progressData.badges];
      const firstLoginBadge = updatedBadges.find(badge => badge.id === '1');
      if (firstLoginBadge) {
        firstLoginBadge.earned = true;
      }
      
      setProgressData(prev => ({
        ...prev,
        badges: updatedBadges
      }));
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const saveProfile = async (nameOrProfile, birthday) => {
    try {
      let profileData = {};
      
      // Handle the case where we pass an object or just a name
      if (typeof nameOrProfile === 'object') {
        profileData = nameOrProfile;
      } else {
        profileData = { name: nameOrProfile, birthday };
      }
      
      // Update user data with profile info
      setUserData(prev => ({
        ...prev,
        ...profileData,
        lastActive: new Date().toISOString()
      }));
      
      // If this is first launch, complete onboarding
      if (isFirstLaunch) {
        await completeOnboarding();
      }
      
      // Update login streak
      updateLoginStreak();
      
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  };
  
  const updateLoginStreak = () => {
    try {
      const today = new Date();
      const lastActive = userData.lastActive ? new Date(userData.lastActive) : null;
      
      let newStreak = userData.streak || 0;
      
      if (lastActive) {
        const diffTime = Math.abs(today - lastActive);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day login
          newStreak += 1;
          
          // Update streak badges
          if (newStreak >= 3 || newStreak >= 7) {
            const updatedBadges = [...progressData.badges];
            
            if (newStreak >= 3) {
              const threeDayBadge = updatedBadges.find(badge => badge.id === '7');
              if (threeDayBadge && !threeDayBadge.earned) {
                threeDayBadge.earned = true;
              }
            }
            
            if (newStreak >= 7) {
              const sevenDayBadge = updatedBadges.find(badge => badge.id === '8');
              if (sevenDayBadge && !sevenDayBadge.earned) {
                sevenDayBadge.earned = true;
              }
            }
            
            setProgressData(prev => ({
              ...prev,
              badges: updatedBadges
            }));
          }
        } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
        }
      } else {
        // First login
        newStreak = 1;
      }
      
      setUserData(prev => ({
        ...prev,
        streak: newStreak,
        lastActive: today.toISOString()
      }));
    } catch (error) {
      console.error('Error updating login streak:', error);
    }
  };

  const resetProgress = async () => {
    try {
      // Keep user name but reset progress
      const name = userData.name;
      
      setUserData({
        name,
        level: 0,
        xp: 0,
        streak: 0,
        lastActive: new Date().toISOString(),
        currentChallenge: 0
      });
      
      setProgressData({
        completedLessons: [],
        completedChallenges: [],
        badges: initialBadges,
        challenges: challengeLevels,
        modules: initialModules
      });
      
      return true;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return false;
    }
  };

  const completeChallenge = (challengeId, xpEarned) => {
    try {
      // Make a copy of current data
      const updatedProgressData = { ...progressData };
      
      // Add the challenge to completed challenges if not already there
      if (!updatedProgressData.completedChallenges.includes(challengeId)) {
        updatedProgressData.completedChallenges.push(challengeId);
      }
      
      // Update streak
      updateLoginStreak();
      
      // Save progress data
      setProgressData(updatedProgressData);
      saveProgressData(updatedProgressData);
      
      // Update XP
      updateXPAndLevel(xpEarned);
      
      // Generate a new daily challenge for tomorrow
      generateNewDailyChallenge();
      
      return true;
    } catch (error) {
      console.error('Error completing challenge:', error);
      return false;
    }
  };

  // Generate a new daily challenge
  const generateNewDailyChallenge = () => {
    try {
      // Get available modules (unlocked)
      const unlockedModules = Object.keys(progressData.modules)
        .filter(moduleId => progressData.modules[moduleId].unlocked);
      
      // If no modules unlocked yet, return
      if (unlockedModules.length === 0) return;
      
      // Get all daily challenges
      const dailyChallenges = [
        // Password challenges
        { id: 'pwd1', type: 'password' },
        { id: 'pwd2', type: 'password' },
        { id: 'pwd3', type: 'password' },
        
        // Phishing challenges
        { id: 'phish1', type: 'phishing' },
        { id: 'phish2', type: 'phishing' },
        { id: 'phish3', type: 'phishing' },
        
        // Website security challenges
        { id: 'web1', type: 'website' },
        { id: 'web2', type: 'website' },
        { id: 'web3', type: 'website' },
        
        // Malware challenges
        { id: 'mal1', type: 'malware' },
        { id: 'mal2', type: 'malware' },
        { id: 'mal3', type: 'malware' },
      ];
      
      // Filter challenges based on unlocked modules
      const availableChallenges = dailyChallenges.filter(challenge => {
        if (challenge.type === 'password') return unlockedModules.includes('password');
        if (challenge.type === 'phishing') return unlockedModules.includes('phishing');
        if (challenge.type === 'website') return unlockedModules.includes('websites');
        if (challenge.type === 'malware') return unlockedModules.includes('malware');
        return false;
      });
      
      // Exclude challenges already completed today
      const eligibleChallenges = availableChallenges.filter(
        challenge => !progressData.completedChallenges.includes(challenge.id)
      );
      
      // If all challenges completed, choose from all available
      const challengePool = eligibleChallenges.length > 0 
        ? eligibleChallenges 
        : availableChallenges;
      
      // Pick a random challenge
      const randomIndex = Math.floor(Math.random() * challengePool.length);
      const selectedChallenge = challengePool[randomIndex];
      
      // Update user data with new challenge
      const updatedUserData = {
        ...userData,
        currentChallenge: selectedChallenge.id
      };
      
      setUserData(updatedUserData);
      saveUserData(updatedUserData);
      
      return selectedChallenge.id;
    } catch (error) {
      console.error('Error generating daily challenge:', error);
      return null;
    }
  };

  const completeLessonAndUpdateXP = (moduleId, lessonIndex = 0, xpEarned = 20) => {
    try {
      // Make a copy of the current progress data
      const updatedProgressData = { ...progressData };
      const updatedModules = { ...updatedProgressData.modules };
      
      // Check if the module exists
      if (!updatedModules[moduleId]) {
        console.error('Module not found:', moduleId);
        return false;
      }
      
      // Get the current module data
      const module = { ...updatedModules[moduleId] };
      
      // Update module progress
      const completionPercentage = ((lessonIndex + 1) / module.totalLessons) * 100;
      module.progress = Math.min(100, Math.max(module.progress, completionPercentage));
      
      // Update completed lessons count
      module.completed = Math.max(module.completed, lessonIndex + 1);
      
      // Update the modules object with the updated module
      updatedModules[moduleId] = module;
      
      // Mark relevant lessons as completed if not already marked
      const lessonKey = `${moduleId}_${lessonIndex}`;
      if (!updatedProgressData.completedLessons.includes(lessonKey)) {
        updatedProgressData.completedLessons.push(lessonKey);
      }
      
      // Update the badges based on module completion
      let updatedBadges = [...updatedProgressData.badges];
      
      if (module.progress >= 100) {
        // Module completed, update relevant badge
        switch (moduleId) {
          case 'password':
            // Find the Password Master badge and mark it as earned
            updatedBadges = updatedBadges.map(badge => 
              badge.id === '2' ? { ...badge, earned: true } : badge
            );
            break;
          case 'phishing':
            // Find the Phishing Expert badge and mark it as earned
            updatedBadges = updatedBadges.map(badge => 
              badge.id === '3' ? { ...badge, earned: true } : badge
            );
            break;
          case 'websites':
            // Find the Web Detective badge and mark it as earned
            updatedBadges = updatedBadges.map(badge => 
              badge.id === '4' ? { ...badge, earned: true } : badge
            );
            break;
          case 'malware':
            // Find the Security Specialist badge and mark it as earned
            updatedBadges = updatedBadges.map(badge => 
              badge.id === '11' ? { ...badge, earned: true } : badge
            );
            break;
          case 'cyberbullying':
            // Find the Digital Guardian badge and mark it as earned
            updatedBadges = updatedBadges.map(badge => 
              badge.id === '5' ? { ...badge, earned: true } : badge
            );
            break;
          case 'personaldata':
            // Find the Security Specialist badge and mark it as earned
            updatedBadges = updatedBadges.map(badge => 
              badge.id === '6' ? { ...badge, earned: true } : badge
            );
            break;
          case 'wifi':
            // Find the Network Defender badge and mark it as earned
            updatedBadges = updatedBadges.map(badge => 
              badge.id === '12' ? { ...badge, earned: true } : badge
            );
            break;
          case 'encryption':
            // Find the Crypto Master badge and mark it as earned
            updatedBadges = updatedBadges.map(badge => 
              badge.id === '13' ? { ...badge, earned: true } : badge
            );
            break;
          case 'socialmedia':
            // Find the Social Shield badge and mark it as earned
            updatedBadges = updatedBadges.map(badge => 
              badge.id === '14' ? { ...badge, earned: true } : badge
            );
            break;
        }
        
        // Unlock the next module in sequence if available
        const moduleOrder = ['password', 'phishing', 'websites', 'malware', 'cyberbullying', 'personaldata', 'wifi', 'encryption', 'socialmedia'];
        const currentIndex = moduleOrder.indexOf(moduleId);
        
        if (currentIndex !== -1 && currentIndex < moduleOrder.length - 1) {
          const nextModuleId = moduleOrder[currentIndex + 1];
          if (updatedModules[nextModuleId]) {
            updatedModules[nextModuleId] = {
              ...updatedModules[nextModuleId],
              unlocked: true
            };
          }
        }
      }
      
      // Save the updated progress data
      setProgressData({
        ...updatedProgressData,
        modules: updatedModules,
        badges: updatedBadges
      });
      
      // Save to storage
      saveProgressData({
        ...updatedProgressData,
        modules: updatedModules,
        badges: updatedBadges
      });
      
      // Update XP
      updateXPAndLevel(xpEarned);
      
      return true;
    } catch (error) {
      console.error('Error completing lesson:', error);
      return false;
    }
  };

  const updateXPAndLevel = (xpEarned) => {
    try {
      // Current user data
      const currentXP = userData.xp || 0;
      const currentLevel = userData.level || 0;
      
      // XP threshold for each level (increases with level)
      const calculateXPForNextLevel = (level) => {
        return 100 + (level * 50);
      };
      
      // Calculate new total XP
      const newTotalXP = currentXP + xpEarned;
      
      // Calculate the new level based on XP
      let newLevel = currentLevel;
      let remainingXP = newTotalXP;
      let levelUpOccurred = false;
      
      // Check if we've gained enough XP for a level up
      while (remainingXP >= calculateXPForNextLevel(newLevel)) {
        remainingXP -= calculateXPForNextLevel(newLevel);
        newLevel++;
        levelUpOccurred = true;
      }
      
      // Update badges based on XP milestones and level
      let updatedBadges = [...progressData.badges];
      
      // Quick Learner badge (100 XP in a day)
      if (xpEarned >= 100) {
        updatedBadges = updatedBadges.map(badge => 
          badge.id === '9' ? { ...badge, earned: true } : badge
        );
      }
      
      // Cyber Warrior badge (Reached Level 5)
      if (newLevel >= 5) {
        updatedBadges = updatedBadges.map(badge => 
          badge.id === '10' ? { ...badge, earned: true } : badge
        );
      }
      
      // Cyber Master badge (Reached Level 10)
      if (newLevel >= 10) {
        updatedBadges = updatedBadges.map(badge => 
          badge.id === '15' ? { ...badge, earned: true } : badge
        );
      }
      
      // Update user data
      const updatedUserData = {
        ...userData,
        xp: remainingXP,
        level: newLevel
      };
      
      // Save updated user data
      setUserData(updatedUserData);
      saveUserData(updatedUserData);
      
      // Update badges in progress data
      setProgressData({
        ...progressData,
        badges: updatedBadges
      });
      
      // Save updated badges to storage
      saveProgressData({
        ...progressData,
        badges: updatedBadges
      });
      
      return {
        newLevel,
        levelUp: levelUpOccurred,
        xpGained: xpEarned,
        remainingXP,
        nextLevelXP: calculateXPForNextLevel(newLevel)
      };
    } catch (error) {
      console.error('Error updating XP:', error);
      return null;
    }
  };
  
  const skipOnboarding = () => {
    setIsFirstLaunch(false);
  };

  return (
    <AppContext.Provider
      value={{
        userData,
        progressData,
        isFirstLaunch,
        loading,
        saveProfile,
        completeOnboarding,
        skipOnboarding,
        resetProgress,
        completeChallenge,
        completeLessonAndUpdateXP,
        updateXPAndLevel
      }}
    >
      {children}
    </AppContext.Provider>
  );
} 