import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  FlatList,
  Switch,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';

// Component for the activity log item
const ActivityLogItem = ({ item }) => {
  const date = new Date(item.timestamp);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  
  return (
    <View style={styles.activityItem}>
      <Text style={styles.activityTimestamp}>{formattedDate}</Text>
      <Text style={styles.activityText}>{item.action}</Text>
    </View>
  );
};

// Component for the blocked website item
const BlockedWebsiteItem = ({ website, onRemove }) => {
  return (
    <View style={styles.websiteItem}>
      <Text style={styles.websiteText}>{website}</Text>
      <TouchableOpacity onPress={() => onRemove(website)} style={styles.removeButton}>
        <MaterialIcons name="delete" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
};

// Component for app usage stats
const AppUsageItem = ({ app, usage }) => {
  return (
    <View style={styles.appUsageItem}>
      <View style={styles.appInfoContainer}>
        <MaterialIcons name="apps" size={24} color="#3FFFA8" />
        <Text style={styles.appName}>{app}</Text>
      </View>
      <Text style={styles.usageTime}>{usage} min</Text>
    </View>
  );
};

// Component for app restriction item
const AppRestrictionItem = ({ app, limit, onRemove }) => {
  return (
    <View style={styles.websiteItem}>
      <View style={styles.appInfoContainer}>
        <MaterialIcons name="apps" size={20} color="#3FFFA8" />
        <Text style={styles.websiteText}>{app}</Text>
      </View>
      <Text style={styles.limitText}>{limit} min/day</Text>
      <TouchableOpacity onPress={() => onRemove(app)} style={styles.removeButton}>
        <MaterialIcons name="delete" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
};

const ParentalControl = ({ onClose }) => {
  const { 
    parentalControls, 
    logActivity,
    addBlockedWebsite, 
    removeBlockedWebsite,
    setScreenTimeLimit,
    toggleSleepMode,
    setSleepModeSchedule,
    setAppTimeRestriction,
    removeAppTimeRestriction
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('activity');
  const [newWebsite, setNewWebsite] = useState('');
  const [timeLimit, setTimeLimit] = useState(parentalControls.screenTimeLimit.toString());
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(
    parentalControls.screenTimeLimit > 0
  );
  const [sleepModeEnabled, setSleepModeEnabled] = useState(parentalControls.sleepModeEnabled);
  const [sleepStart, setSleepStart] = useState(parentalControls.sleepModeStartTime);
  const [sleepEnd, setSleepEnd] = useState(parentalControls.sleepModeEndTime);
  const [newApp, setNewApp] = useState('');
  const [appLimit, setAppLimit] = useState('60');
  const [deviceInfo, setDeviceInfo] = useState({});

  // Get device info
  useEffect(() => {
    const getDeviceInfo = async () => {
      const brand = Device.brand || 'Unknown';
      const modelName = Device.modelName || 'Device';
      const osName = Device.osName || 'Unknown OS';
      const osVersion = Device.osVersion || '';
      
      setDeviceInfo({
        brand,
        modelName,
        osName,
        osVersion,
        deviceName: `${brand} ${modelName}`,
        platform: Platform.OS
      });
    };
    
    getDeviceInfo();
    logActivity('Parent accessed control panel');
    
    // Register for notification permissions
    registerForPushNotificationsAsync();
  }, []);
  
  // Function to register for push notifications (for sleep mode alerts)
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('sleepMode', {
        name: 'Sleep Mode',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Push notifications are needed for sleep mode alerts');
      return;
    }
  }

  const handleAddWebsite = () => {
    if (newWebsite.trim() === '') {
      Alert.alert('Error', 'Please enter a website to block');
      return;
    }
    
    // Simple validation for website format
    if (!newWebsite.includes('.')) {
      Alert.alert('Error', 'Please enter a valid website');
      return;
    }
    
    const success = addBlockedWebsite(newWebsite.toLowerCase().trim());
    if (success) {
      logActivity(`Blocked website: ${newWebsite}`);
      setNewWebsite('');
    } else {
      Alert.alert('Info', 'This website is already blocked');
    }
  };

  const handleRemoveWebsite = (website) => {
    Alert.alert(
      'Confirm Removal',
      `Are you sure you want to unblock ${website}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unblock', 
          onPress: () => {
            removeBlockedWebsite(website);
            logActivity(`Unblocked website: ${website}`);
          }
        }
      ]
    );
  };

  const handleTimeLimit = () => {
    if (timeLimitEnabled) {
      const minutes = parseInt(timeLimit, 10);
      if (isNaN(minutes) || minutes <= 0) {
        Alert.alert('Error', 'Please enter a valid time limit');
        return;
      }
      setScreenTimeLimit(minutes);
      logActivity(`Set screen time limit to ${minutes} minutes`);
    } else {
      setScreenTimeLimit(0);
      logActivity('Disabled screen time limit');
    }
  };
  
  const handleSleepModeToggle = (value) => {
    setSleepModeEnabled(value);
    toggleSleepMode(value);
  };
  
  const handleSleepSchedule = () => {
    // Basic validation for time format (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    
    if (!timeRegex.test(sleepStart) || !timeRegex.test(sleepEnd)) {
      Alert.alert('Error', 'Please enter valid times in HH:MM format');
      return;
    }
    
    setSleepModeSchedule(sleepStart, sleepEnd);
    Alert.alert('Success', 'Sleep mode schedule updated');
  };
  
  const handleAddAppRestriction = () => {
    if (newApp.trim() === '') {
      Alert.alert('Error', 'Please enter an app name');
      return;
    }
    
    const minutes = parseInt(appLimit, 10);
    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert('Error', 'Please enter a valid time limit');
      return;
    }
    
    setAppTimeRestriction(newApp, minutes);
    setNewApp('');
    setAppLimit('60');
  };
  
  const handleRemoveAppRestriction = (app) => {
    Alert.alert(
      'Confirm Removal',
      `Are you sure you want to remove the time limit for ${app}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          onPress: () => {
            removeAppTimeRestriction(app);
          }
        }
      ]
    );
  };
  
  const activateSleepMode = () => {
    Alert.alert(
      'Activate Sleep Mode',
      'This will lock the device until the sleep period ends or until you enter your parental password.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Activate', 
          onPress: () => {
            // Schedule a notification for sleep mode activation
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Sleep Mode Activated',
                body: 'The device is now in sleep mode until the scheduled end time.',
                data: { type: 'sleepMode' },
              },
              trigger: null, // Send immediately
            });
            
            toggleSleepMode(true);
            logActivity('Manually activated sleep mode');
            
            // Close parental controls panel and show sleep mode screen
            onClose();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parental Controls</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.deviceInfoContainer}>
        <MaterialIcons name="smartphone" size={18} color="#3FFFA8" />
        <Text style={styles.deviceInfoText}>
          {deviceInfo.deviceName} • {deviceInfo.osName} {deviceInfo.osVersion}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'activity' && styles.activeTab]} 
          onPress={() => setActiveTab('activity')}
        >
          <MaterialIcons 
            name="history" 
            size={24} 
            color={activeTab === 'activity' ? '#3FFFA8' : '#fff'} 
          />
          <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
            Activity
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'websites' && styles.activeTab]} 
          onPress={() => setActiveTab('websites')}
        >
          <MaterialIcons 
            name="block" 
            size={24} 
            color={activeTab === 'websites' ? '#3FFFA8' : '#fff'} 
          />
          <Text style={[styles.tabText, activeTab === 'websites' && styles.activeTabText]}>
            Block Sites
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'usage' && styles.activeTab]} 
          onPress={() => setActiveTab('usage')}
        >
          <MaterialIcons 
            name="phone-android" 
            size={24} 
            color={activeTab === 'usage' ? '#3FFFA8' : '#fff'} 
          />
          <Text style={[styles.tabText, activeTab === 'usage' && styles.activeTabText]}>
            Usage
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]} 
          onPress={() => setActiveTab('settings')}
        >
          <MaterialIcons 
            name="settings" 
            size={24} 
            color={activeTab === 'settings' ? '#3FFFA8' : '#fff'} 
          />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'activity' && (
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Activity Log</Text>
          {parentalControls.activityLog.length === 0 ? (
            <Text style={styles.emptyText}>No activity recorded yet</Text>
          ) : (
            <FlatList
              data={[...parentalControls.activityLog].reverse()}
              renderItem={({ item }) => <ActivityLogItem item={item} />}
              keyExtractor={(item, index) => `activity-${index}`}
              style={styles.list}
            />
          )}
        </View>
      )}

      {activeTab === 'websites' && (
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Blocked Websites</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newWebsite}
              onChangeText={setNewWebsite}
              placeholder="Enter website (e.g., example.com)"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={handleAddWebsite} style={styles.addButton}>
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {parentalControls.blockedWebsites.length === 0 ? (
            <Text style={styles.emptyText}>No websites blocked yet</Text>
          ) : (
            <FlatList
              data={parentalControls.blockedWebsites}
              renderItem={({ item }) => (
                <BlockedWebsiteItem website={item} onRemove={handleRemoveWebsite} />
              )}
              keyExtractor={(item, index) => `website-${index}`}
              style={styles.list}
            />
          )}
        </View>
      )}
      
      {activeTab === 'usage' && (
        <View style={styles.contentContainer}>
          <View style={styles.usageSections}>
            <TouchableOpacity 
              style={styles.usageActionButton}
              onPress={activateSleepMode}
            >
              <MaterialIcons name="nightlight-round" size={24} color="#fff" />
              <Text style={styles.usageActionButtonText}>
                Activate Sleep Mode Now
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>App Usage Statistics</Text>
          
          {Object.keys(parentalControls.appUsageStats).length === 0 ? (
            <Text style={styles.emptyText}>No app usage data available yet</Text>
          ) : (
            <FlatList
              data={Object.entries(parentalControls.appUsageStats).map(([app, time]) => ({ app, time }))}
              renderItem={({ item }) => (
                <AppUsageItem app={item.app} usage={item.time} />
              )}
              keyExtractor={(item) => `app-${item.app}`}
              style={styles.list}
            />
          )}
          
          <Text style={styles.sectionTitle}>App Time Restrictions</Text>
          
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 2 }]}
              value={newApp}
              onChangeText={setNewApp}
              placeholder="App name"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, { flex: 1, marginHorizontal: 8 }]}
              value={appLimit}
              onChangeText={setAppLimit}
              placeholder="Minutes"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
            <TouchableOpacity onPress={handleAddAppRestriction} style={styles.addButton}>
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {Object.keys(parentalControls.appTimeRestrictions).length === 0 ? (
            <Text style={styles.emptyText}>No app restrictions set yet</Text>
          ) : (
            <FlatList
              data={Object.entries(parentalControls.appTimeRestrictions).map(([app, limit]) => ({ app, limit }))}
              renderItem={({ item }) => (
                <AppRestrictionItem 
                  app={item.app} 
                  limit={item.limit}
                  onRemove={handleRemoveAppRestriction}
                />
              )}
              keyExtractor={(item) => `restriction-${item.app}`}
              style={styles.list}
            />
          )}
        </View>
      )}

      {activeTab === 'settings' && (
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Screen Time Settings</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Daily Screen Time Limit</Text>
              <Text style={styles.settingDescription}>
                Limit total daily app usage time
              </Text>
            </View>
            <Switch
              value={timeLimitEnabled}
              onValueChange={(value) => {
                setTimeLimitEnabled(value);
                if (!value) {
                  setScreenTimeLimit(0);
                  logActivity('Disabled screen time limit');
                }
              }}
              trackColor={{ false: '#767577', true: '#3FFFA880' }}
              thumbColor={timeLimitEnabled ? '#3FFFA8' : '#f4f3f4'}
            />
          </View>
          
          {timeLimitEnabled && (
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                value={timeLimit}
                onChangeText={setTimeLimit}
                placeholder="Minutes"
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
              <TouchableOpacity onPress={handleTimeLimit} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Sleep Mode</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Enable Sleep Mode Schedule</Text>
              <Text style={styles.settingDescription}>
                Block device usage during sleep hours
              </Text>
            </View>
            <Switch
              value={sleepModeEnabled}
              onValueChange={handleSleepModeToggle}
              trackColor={{ false: '#767577', true: '#3FFFA880' }}
              thumbColor={sleepModeEnabled ? '#3FFFA8' : '#f4f3f4'}
            />
          </View>
          
          {sleepModeEnabled && (
            <View style={styles.sleepScheduleContainer}>
              <View style={styles.timeInputRow}>
                <Text style={styles.timeLabel}>Start Time:</Text>
                <TextInput
                  style={styles.sleepTimeInput}
                  value={sleepStart}
                  onChangeText={setSleepStart}
                  placeholder="HH:MM"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={styles.timeInputRow}>
                <Text style={styles.timeLabel}>End Time:</Text>
                <TextInput
                  style={styles.sleepTimeInput}
                  value={sleepEnd}
                  onChangeText={setSleepEnd}
                  placeholder="HH:MM"
                  placeholderTextColor="#999"
                />
              </View>
              
              <TouchableOpacity 
                onPress={handleSleepSchedule} 
                style={[styles.saveButton, { alignSelf: 'flex-end', marginTop: 8 }]}
              >
                <Text style={styles.saveButtonText}>Save Schedule</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity style={styles.dangerButton} onPress={onClose}>
            <Text style={styles.dangerButtonText}>Exit Parental Controls</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1D2B53',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  deviceInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(29, 43, 83, 0.5)',
  },
  deviceInfoText: {
    color: '#ccc',
    fontSize: 12,
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1D2B53',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3FFFA8',
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
  },
  activeTabText: {
    color: '#3FFFA8',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 48,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#3FFFA8',
    borderRadius: 8,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  activityItem: {
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  activityTimestamp: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  activityText: {
    color: '#fff',
    fontSize: 14,
  },
  websiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  websiteText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  removeButton: {
    padding: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingDescription: {
    color: '#999',
    fontSize: 14,
  },
  timeInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeInput: {
    flex: 1,
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#3FFFA8',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#0B132B',
    fontWeight: 'bold',
  },
  sleepScheduleContainer: {
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    color: '#fff',
    width: 80,
  },
  sleepTimeInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  dangerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  usageSections: {
    marginBottom: 24,
  },
  usageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7F00FF',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  usageActionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  appUsageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  appInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appName: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  usageTime: {
    color: '#3FFFA8',
    fontWeight: 'bold',
  },
  limitText: {
    color: '#3FFFA8',
    marginRight: 8,
  },
});

export default ParentalControl; 