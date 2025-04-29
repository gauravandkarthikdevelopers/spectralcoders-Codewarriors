import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../../context/AppContext';
import ParentalLogin from '../../components/ParentalLogin';
import ParentalControl from '../../components/ParentalControl';
import SleepModeScreen from '../../components/SleepModeScreen';
import WebBrowser from '../../components/WebBrowser';
import LockScreen from '../../components/LockScreen';
import { registerBackgroundTasks } from '../../utils/backgroundTasks';

export default function ExploreScreen() {
  const { parentalControls, logActivity, logAppUsage } = useAppContext();
  const [secretTapCount, setSecretTapCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showParentalControls, setShowParentalControls] = useState(false);
  const [showWebBrowser, setShowWebBrowser] = useState(false);
  
  // Track if sleep mode is active
  const [isSleepModeActive, setIsSleepModeActive] = useState(parentalControls.sleepModeEnabled);
  // Track if device is locked
  const [isDeviceLocked, setIsDeviceLocked] = useState(parentalControls.deviceLocked || false);
  
  // Animation values
  const robotAnimation = useRef(new Animated.Value(0)).current;
  const gearAnimation = useRef(new Animated.Value(0)).current;
  
  // Update sleep mode and device lock status when parentalControls changes
  useEffect(() => {
    setIsSleepModeActive(parentalControls.sleepModeEnabled);
    setIsDeviceLocked(parentalControls.deviceLocked || false);
    
    // Register the app usage tracking background task
    registerBackgroundTasks();
    
    // Log app usage for Explore section
    const interval = setInterval(() => {
      if (!parentalControls.sleepModeEnabled && !parentalControls.deviceLocked) {
        logAppUsage('Explore', 1);  // Log 1 minute of usage
      }
    }, 60000);  // Every minute
    
    return () => clearInterval(interval);
  }, [parentalControls]);
  
  // Start the animations when the component mounts
  React.useEffect(() => {
    // Robot animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(robotAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Gear animation
    Animated.loop(
      Animated.timing(gearAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  // Transform the animations into styles
  const robotStyle = {
    transform: [
      {
        translateY: robotAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };
  
  const gearStyle = {
    transform: [
      {
        rotate: gearAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };
  
  const handleSecretAreaTap = useCallback(() => {
    // Increment tap count
    setSecretTapCount((prev) => {
      const newCount = prev + 1;
      
      // If 3 taps, show password modal
      if (newCount >= 3) {
        setTimeout(() => {
          setShowPasswordModal(true);
          setSecretTapCount(0);
        }, 300);
        return 0;
      }
      
      // Reset after 2 seconds if not tapped again
      setTimeout(() => {
        setSecretTapCount(0);
      }, 2000);
      
      return newCount;
    });
  }, []);
  
  const handlePasswordSuccess = useCallback(() => {
    setShowPasswordModal(false);
    setShowParentalControls(true);
    logActivity('Accessed parental controls');
  }, [logActivity]);
  
  const handlePasswordCancel = useCallback(() => {
    setShowPasswordModal(false);
    setSecretTapCount(0);
  }, []);
  
  const handleCloseParentalControls = useCallback(() => {
    setShowParentalControls(false);
    logActivity('Exited parental controls');
  }, [logActivity]);
  
  const handleExitSleepMode = useCallback(() => {
    setIsSleepModeActive(false);
  }, []);
  
  const handleOpenWebBrowser = useCallback(() => {
    setShowWebBrowser(true);
    logActivity('Opened web browser');
  }, [logActivity]);
  
  const handleCloseWebBrowser = useCallback(() => {
    setShowWebBrowser(false);
    logActivity('Closed web browser');
  }, [logActivity]);
  
  // If device is locked, show lock screen
  if (isDeviceLocked) {
    return <LockScreen />;
  }
  
  // If sleep mode is active, show the sleep mode screen
  if (isSleepModeActive) {
    return <SleepModeScreen onUnlock={handleExitSleepMode} />;
  }
  
  // If web browser is shown
  if (showWebBrowser) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.browserHeader}>
          <TouchableOpacity onPress={handleCloseWebBrowser} style={styles.closeButton}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.closeButtonText}>Back to Explore</Text>
          </TouchableOpacity>
        </View>
        <WebBrowser />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Learning Resources</Text>
        
        <TouchableOpacity 
          style={styles.webBrowserButton}
          onPress={handleOpenWebBrowser}
        >
          <MaterialIcons name="public" size={28} color="#fff" />
          <Text style={styles.webBrowserButtonText}>Open Safe Web Browser</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#3FFFA8" />
        </TouchableOpacity>
        
        <View style={styles.constructionContainer}>
          <Animated.View style={[styles.robotContainer, robotStyle]}>
            <MaterialIcons name="android" size={80} color="#3FFFA8" />
          </Animated.View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              We're building something awesome for you!
            </Text>
            
            <Text style={styles.description}>
              More interactive content coming soon.{'\n'}
              Check back for new adventures!
            </Text>
          </View>
          
          <View style={styles.decorationContainer}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleSecretAreaTap}
            >
              <Animated.View style={[styles.gear, gearStyle]}>
                <MaterialIcons name="settings" size={50} color="#7F00FF" />
              </Animated.View>
            </TouchableOpacity>
            <View style={styles.toolIcon}>
              <MaterialIcons name="build" size={40} color="#3FFFA8" />
            </View>
          </View>
        </View>
        
        <View style={styles.comingSoonFeatures}>
          <Text style={styles.featuresTitle}>Future Features:</Text>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="explore" size={24} color="#3FFFA8" />
            <Text style={styles.featureText}>Interactive Cyber Adventures</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="videogame-asset" size={24} color="#3FFFA8" />
            <Text style={styles.featureText}>Security Mini-Games</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="extension" size={24} color="#3FFFA8" />
            <Text style={styles.featureText}>Cybersecurity Puzzles</Text>
          </View>
        </View>
      </View>
      
      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={handlePasswordCancel}
      >
        <View style={styles.modalOverlay}>
          <ParentalLogin 
            onSuccess={handlePasswordSuccess} 
            onCancel={handlePasswordCancel} 
          />
        </View>
      </Modal>
      
      {/* Parental Controls Modal */}
      <Modal
        visible={showParentalControls}
        animationType="slide"
        onRequestClose={handleCloseParentalControls}
      >
        <ParentalControl onClose={handleCloseParentalControls} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3FFFA8',
    marginBottom: 24,
  },
  webBrowserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1D2B53',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  webBrowserButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
  },
  constructionContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  robotContainer: {
    marginBottom: 16,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
  },
  decorationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  gear: {
    marginHorizontal: 20,
    padding: 10,
  },
  toolIcon: {
    marginHorizontal: 20,
  },
  comingSoonFeatures: {
    width: '100%',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 16,
    padding: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  browserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D2B53',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
