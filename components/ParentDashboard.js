import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { updateParentalControls } from '../utils/firebase';

const ParentDashboard = ({ navigation }) => {
  const { 
    userAccount, 
    parentalControls, 
    childActivities,
    connectedChildId,
    logActivity
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('activity');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newWebsite, setNewWebsite] = useState('');
  const [screenTimeLimit, setScreenTimeLimit] = useState(
    parentalControls.screenTimeLimit ? parentalControls.screenTimeLimit.toString() : '0'
  );
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(
    parentalControls.screenTimeLimit > 0
  );
  const [sleepModeEnabled, setSleepModeEnabled] = useState(parentalControls.sleepModeEnabled);
  const [sleepStartTime, setSleepStartTime] = useState(parentalControls.sleepModeStartTime);
  const [sleepEndTime, setSleepEndTime] = useState(parentalControls.sleepModeEndTime);
  const [isDeviceLocked, setIsDeviceLocked] = useState(parentalControls.deviceLocked || false);
  
  // Refresh data when dashboard is opened
  useEffect(() => {
    refreshData();
  }, []);
  
  // Update local state when parental controls change
  useEffect(() => {
    setScreenTimeLimit(parentalControls.screenTimeLimit ? parentalControls.screenTimeLimit.toString() : '0');
    setTimeLimitEnabled(parentalControls.screenTimeLimit > 0);
    setSleepModeEnabled(parentalControls.sleepModeEnabled);
    setSleepStartTime(parentalControls.sleepModeStartTime);
    setSleepEndTime(parentalControls.sleepModeEndTime);
    setIsDeviceLocked(parentalControls.deviceLocked || false);
  }, [parentalControls]);
  
  // Function to refresh data
  const refreshData = async () => {
    setRefreshing(true);
    // The data will refresh automatically through Firebase listeners
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  // Function to create a timeout for Firebase operations
  const withTimeout = (promise, timeoutMs = 10000) => {
    let timeoutId;
    
    // Create a promise that rejects after timeoutMs milliseconds
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Operation timed out"));
      }, timeoutMs);
    });
    
    // Return a promise that resolves/rejects with the first promise to resolve/reject
    return Promise.race([
      promise,
      timeoutPromise
    ]).finally(() => {
      clearTimeout(timeoutId);
    });
  };
  
  // Function to safely update Firebase with timeout
  const safeUpdateParentalControls = async (childId, settings) => {
    try {
      return await withTimeout(updateParentalControls(childId, settings));
    } catch (error) {
      if (error.message === "Operation timed out") {
        throw new Error("Connection to the server timed out. Please check your internet connection and try again.");
      }
      throw error;
    }
  };
  
  // Function to add a blocked website
  const handleAddWebsite = async () => {
    if (!newWebsite.trim()) {
      Alert.alert('Error', 'Please enter a website to block');
      return;
    }
    
    // Enhanced website validation
    const websiteRegex = /^(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    const websiteToAdd = newWebsite.toLowerCase().trim();
    
    if (!websiteRegex.test(websiteToAdd)) {
      Alert.alert('Error', 'Please enter a valid website domain (e.g., example.com)');
      return;
    }
    
    // Check if child is connected
    if (!connectedChildId) {
      Alert.alert('Error', 'No child account connected. Please connect to a child account first.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Format the website - ensure it doesn't have http/https prefix
      const formattedWebsite = websiteToAdd.replace(/^(https?:\/\/)?(www\.)?/, '');
      
      // Check if website is already blocked
      if (parentalControls.blockedWebsites.includes(formattedWebsite)) {
        Alert.alert('Info', 'This website is already blocked');
        setLoading(false);
        return;
      }
      
      // Add to blocked websites
      const updatedSettings = {
        ...parentalControls,
        blockedWebsites: [...parentalControls.blockedWebsites, formattedWebsite]
      };
      
      // Update Firebase
      await safeUpdateParentalControls(connectedChildId, updatedSettings);
      
      // Log activity
      logActivity(`Blocked website: ${formattedWebsite}`);
      
      // Show success message
      Alert.alert('Success', `${formattedWebsite} has been blocked`);
      
      // Clear input
      setNewWebsite('');
    } catch (error) {
      console.error('Error adding blocked website:', error);
      Alert.alert('Error', 'Failed to add website to blocked list');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to remove a blocked website
  const handleRemoveWebsite = async (website) => {
    Alert.alert(
      'Confirm Removal',
      `Are you sure you want to unblock ${website}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unblock', 
          onPress: async () => {
            setLoading(true);
            
            try {
              // Remove from blocked websites
              const updatedSettings = {
                ...parentalControls,
                blockedWebsites: parentalControls.blockedWebsites.filter(site => site !== website)
              };
              
              // Update Firebase
              await safeUpdateParentalControls(connectedChildId, updatedSettings);
              
              // Log activity
              logActivity(`Unblocked website: ${website}`);
            } catch (error) {
              console.error('Error removing blocked website:', error);
              Alert.alert('Error', 'Failed to remove website from blocked list');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Function to update screen time limit
  const handleUpdateScreenTimeLimit = async () => {
    if (timeLimitEnabled) {
      const minutes = parseInt(screenTimeLimit, 10);
      if (isNaN(minutes) || minutes <= 0) {
        Alert.alert('Error', 'Please enter a valid time limit');
        return;
      }
      
      setLoading(true);
      
      try {
        // Update screen time limit
        const updatedSettings = {
          ...parentalControls,
          screenTimeLimit: minutes
        };
        
        // Update Firebase
        await safeUpdateParentalControls(connectedChildId, updatedSettings);
        
        // Log activity
        logActivity(`Set screen time limit to ${minutes} minutes`);
      } catch (error) {
        console.error('Error updating screen time limit:', error);
        Alert.alert('Error', 'Failed to update screen time limit');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      
      try {
        // Disable screen time limit
        const updatedSettings = {
          ...parentalControls,
          screenTimeLimit: 0
        };
        
        // Update Firebase
        await safeUpdateParentalControls(connectedChildId, updatedSettings);
        
        // Log activity
        logActivity('Disabled screen time limit');
      } catch (error) {
        console.error('Error disabling screen time limit:', error);
        Alert.alert('Error', 'Failed to disable screen time limit');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Function to toggle sleep mode
  const handleToggleSleepMode = async (value) => {
    setSleepModeEnabled(value);
    
    setLoading(true);
    
    try {
      // Update sleep mode settings
      const updatedSettings = {
        ...parentalControls,
        sleepModeEnabled: value
      };
      
      // Update Firebase
      await safeUpdateParentalControls(connectedChildId, updatedSettings);
      
      // Log activity
      logActivity(value ? 'Enabled sleep mode' : 'Disabled sleep mode');
    } catch (error) {
      console.error('Error toggling sleep mode:', error);
      Alert.alert('Error', 'Failed to update sleep mode settings');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update sleep mode schedule
  const handleUpdateSleepSchedule = async () => {
    // Validate time format (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    
    if (!timeRegex.test(sleepStartTime) || !timeRegex.test(sleepEndTime)) {
      Alert.alert('Error', 'Please enter valid times in HH:MM format');
      return;
    }
    
    setLoading(true);
    
    try {
      // Update sleep mode schedule
      const updatedSettings = {
        ...parentalControls,
        sleepModeStartTime: sleepStartTime,
        sleepModeEndTime: sleepEndTime
      };
      
      // Update Firebase
      await safeUpdateParentalControls(connectedChildId, updatedSettings);
      
      // Log activity
      logActivity(`Updated sleep mode schedule: ${sleepStartTime} - ${sleepEndTime}`);
      
      Alert.alert('Success', 'Sleep mode schedule updated');
    } catch (error) {
      console.error('Error updating sleep mode schedule:', error);
      Alert.alert('Error', 'Failed to update sleep mode schedule');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to toggle device lock
  const handleToggleDeviceLock = async (locked) => {
    if (!connectedChildId) {
      Alert.alert('Error', 'No child account connected');
      return;
    }
    
    setLoading(true);
    
    try {
      setIsDeviceLocked(locked);
      
      // Update remote lock status
      const updatedSettings = {
        ...parentalControls,
        deviceLocked: locked,
        deviceLockedTimestamp: new Date().toISOString()
      };
      
      // Update Firebase
      await safeUpdateParentalControls(connectedChildId, updatedSettings);
      
      // Log activity
      logActivity(locked ? 'Device remotely locked' : 'Device remotely unlocked');
      
      // Show confirmation
      Alert.alert(
        'Success', 
        locked 
          ? 'The device has been locked remotely. The child will be unable to use the app until unlocked.' 
          : 'The device has been unlocked. The child can now use the app again.'
      );
    } catch (error) {
      console.error('Error toggling device lock:', error);
      Alert.alert('Error', 'Failed to update device lock status');
      // Revert UI state on error
      setIsDeviceLocked(!locked);
    } finally {
      setLoading(false);
    }
  };
  
  // Format a timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      const date = new Date(timestamp);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };
  
  // Render activity log item
  const renderActivityItem = ({ item }) => {
    if (!item) return null;
    
    return (
      <View style={styles.activityItem}>
        <Text style={styles.activityTimestamp}>
          {formatTimestamp(item.timestamp)}
        </Text>
        <Text style={styles.activityText}>
          {item.activity || 'Unknown activity'}
        </Text>
      </View>
    );
  };
  
  // Render blocked website item
  const renderWebsiteItem = ({ item }) => (
    <View style={styles.websiteItem}>
      <Text style={styles.websiteText}>{item}</Text>
      <TouchableOpacity 
        onPress={() => handleRemoveWebsite(item)}
        style={styles.removeButton}
      >
        <MaterialIcons name="delete" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
  
  // Render app usage item
  const renderAppUsageItem = ({ item }) => {
    const hasTimeLimit = parentalControls.appTimeRestrictions && 
                         parentalControls.appTimeRestrictions[item.app];
    const timeLimit = hasTimeLimit ? parentalControls.appTimeRestrictions[item.app] : null;
    
    return (
      <View style={styles.usageItem}>
        <View style={styles.usageNameContainer}>
          <MaterialIcons name="apps" size={20} color="#3FFFA8" />
          <View style={styles.usageDetails}>
            <Text style={styles.usageName}>{item.app}</Text>
            {hasTimeLimit && (
              <Text style={styles.usageLimit}>Limit: {timeLimit} min/day</Text>
            )}
          </View>
        </View>
        
        <View style={styles.usageActions}>
          <Text style={styles.usageTime}>{item.time} min</Text>
          
          <TouchableOpacity 
            style={styles.usageLimitButton}
            onPress={() => hasTimeLimit 
              ? handleRemoveAppTimeLimit(item.app)
              : handleSetAppTimeLimit(item.app)
            }
          >
            <MaterialIcons 
              name={hasTimeLimit ? "timer-off" : "timer"} 
              size={18} 
              color={hasTimeLimit ? "#FF3B30" : "#3FFFA8"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Function to set time limit for specific app
  const handleSetAppTimeLimit = (appName) => {
    if (!connectedChildId) {
      Alert.alert('Error', 'No child account connected');
      return;
    }
    
    Alert.prompt(
      'Set Time Limit',
      `Set daily time limit for "${appName}" (in minutes)`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Set Limit',
          onPress: async (minutes) => {
            if (!minutes || isNaN(parseInt(minutes, 10)) || parseInt(minutes, 10) <= 0) {
              Alert.alert('Error', 'Please enter a valid number of minutes');
              return;
            }
            
            setLoading(true);
            
            try {
              const limitMinutes = parseInt(minutes, 10);
              
              // Update app time restrictions
              const updatedRestrictions = {
                ...parentalControls.appTimeRestrictions,
                [appName]: limitMinutes
              };
              
              const updatedSettings = {
                ...parentalControls,
                appTimeRestrictions: updatedRestrictions
              };
              
              // Update Firebase
              await safeUpdateParentalControls(connectedChildId, updatedSettings);
              
              // Log activity
              logActivity(`Set ${limitMinutes} minute daily limit for "${appName}"`);
              
              // Show confirmation
              Alert.alert('Success', `Daily time limit for "${appName}" set to ${limitMinutes} minutes`);
            } catch (error) {
              console.error('Error setting app time limit:', error);
              Alert.alert('Error', 'Failed to set app time limit');
            } finally {
              setLoading(false);
            }
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };
  
  // Function to remove time limit for specific app
  const handleRemoveAppTimeLimit = (appName) => {
    if (!connectedChildId) {
      Alert.alert('Error', 'No child account connected');
      return;
    }
    
    Alert.alert(
      'Remove Time Limit',
      `Remove daily time limit for "${appName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: async () => {
            setLoading(true);
            
            try {
              // Update app time restrictions
              const updatedRestrictions = { ...parentalControls.appTimeRestrictions };
              delete updatedRestrictions[appName];
              
              const updatedSettings = {
                ...parentalControls,
                appTimeRestrictions: updatedRestrictions
              };
              
              // Update Firebase
              await safeUpdateParentalControls(connectedChildId, updatedSettings);
              
              // Log activity
              logActivity(`Removed daily time limit for "${appName}"`);
              
              // Show confirmation
              Alert.alert('Success', `Daily time limit for "${appName}" removed`);
            } catch (error) {
              console.error('Error removing app time limit:', error);
              Alert.alert('Error', 'Failed to remove app time limit');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Parent Dashboard</Text>
          {userAccount && (
            <Text style={styles.subtitle}>Welcome, {userAccount.name}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshData}>
          <MaterialIcons name="refresh" size={24} color="#3FFFA8" />
        </TouchableOpacity>
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
          style={[styles.tab, activeTab === 'controls' && styles.activeTab]}
          onPress={() => setActiveTab('controls')}
        >
          <MaterialIcons 
            name="settings" 
            size={24} 
            color={activeTab === 'controls' ? '#3FFFA8' : '#fff'} 
          />
          <Text style={[styles.tabText, activeTab === 'controls' && styles.activeTabText]}>
            Controls
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
      </View>
      
      {activeTab === 'activity' && (
        <FlatList
          data={childActivities}
          renderItem={renderActivityItem}
          keyExtractor={(item, index) => `activity-${index}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} colors={["#3FFFA8"]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="history" size={48} color="#3FFFA8" opacity={0.5} />
              <Text style={styles.emptyText}>No activity recorded yet</Text>
            </View>
          }
        />
      )}
      
      {activeTab === 'controls' && (
        <ScrollView 
          style={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} colors={["#3FFFA8"]} />
          }
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Website Blocking</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter website (e.g., example.com)"
                placeholderTextColor="#999"
                value={newWebsite}
                onChangeText={setNewWebsite}
              />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddWebsite}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <MaterialIcons name="add" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.websiteList}>
              {parentalControls.blockedWebsites && parentalControls.blockedWebsites.length > 0 ? (
                parentalControls.blockedWebsites.map((item, index) => (
                  <View key={`website-${index}`} style={styles.websiteItem}>
                    <Text style={styles.websiteText}>{item}</Text>
                    <TouchableOpacity 
                      onPress={() => handleRemoveWebsite(item)}
                      style={styles.removeButton}
                    >
                      <MaterialIcons name="delete" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyListText}>No websites blocked yet</Text>
              )}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Screen Time Limit</Text>
            
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
                    handleUpdateScreenTimeLimit();
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
                  value={screenTimeLimit}
                  onChangeText={setScreenTimeLimit}
                  placeholder="Minutes"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                />
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleUpdateScreenTimeLimit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#0B132B" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sleep Mode</Text>
            
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Enable Sleep Mode Schedule</Text>
                <Text style={styles.settingDescription}>
                  Block device usage during sleep hours
                </Text>
              </View>
              <Switch
                value={sleepModeEnabled}
                onValueChange={handleToggleSleepMode}
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
                    value={sleepStartTime}
                    onChangeText={setSleepStartTime}
                    placeholder="HH:MM"
                    placeholderTextColor="#999"
                  />
                </View>
                
                <View style={styles.timeInputRow}>
                  <Text style={styles.timeLabel}>End Time:</Text>
                  <TextInput
                    style={styles.sleepTimeInput}
                    value={sleepEndTime}
                    onChangeText={setSleepEndTime}
                    placeholder="HH:MM"
                    placeholderTextColor="#999"
                  />
                </View>
                
                <TouchableOpacity 
                  style={[styles.saveButton, { alignSelf: 'flex-end', marginTop: 8 }]}
                  onPress={handleUpdateSleepSchedule}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#0B132B" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Schedule</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remote Lock</Text>
            
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Device Lock</Text>
                <Text style={styles.settingDescription}>
                  Immediately lock the device and prevent app access
                </Text>
              </View>
              <Switch
                value={isDeviceLocked}
                onValueChange={handleToggleDeviceLock}
                trackColor={{ false: '#767577', true: '#FF3B3080' }}
                thumbColor={isDeviceLocked ? '#FF3B30' : '#f4f3f4'}
              />
            </View>
            
            {isDeviceLocked && (
              <View style={styles.lockInfoContainer}>
                <MaterialIcons name="lock" size={20} color="#FF3B30" />
                <Text style={styles.lockInfoText}>
                  Device is currently locked. The child cannot access the app.
                </Text>
              </View>
            )}
            
            <Text style={styles.quickAccessTitle}>Quick Access</Text>
            
            <TouchableOpacity 
              style={[
                styles.emergencyLockButton, 
                isDeviceLocked && styles.emergencyUnlockButton
              ]}
              onPress={() => handleToggleDeviceLock(!isDeviceLocked)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons 
                    name={isDeviceLocked ? "lock-open" : "lock"} 
                    size={20} 
                    color="#fff" 
                  />
                  <Text style={styles.emergencyLockText}>
                    {isDeviceLocked ? "Emergency Unlock" : "Emergency Lock"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      
      {activeTab === 'usage' && (
        <ScrollView 
          style={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} colors={["#3FFFA8"]} />
          }
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Usage Statistics</Text>
            
            <Text style={styles.sectionDescription}>
              View your child's app usage and set daily time limits. 
              Tap the timer icon to set a limit for each app.
            </Text>
            
            {Object.keys(parentalControls.appUsageStats).length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="phone-android" size={48} color="#3FFFA8" opacity={0.5} />
                <Text style={styles.emptyText}>No app usage data available yet</Text>
              </View>
            ) : (
              <View style={styles.appUsageList}>
                {Object.entries(parentalControls.appUsageStats).map(([app, time], index) => {
                  const hasTimeLimit = parentalControls.appTimeRestrictions && 
                                      parentalControls.appTimeRestrictions[app];
                  const timeLimit = hasTimeLimit ? parentalControls.appTimeRestrictions[app] : null;
                  
                  return (
                    <View key={`app-${app}`} style={styles.usageItem}>
                      <View style={styles.usageNameContainer}>
                        <MaterialIcons name="apps" size={20} color="#3FFFA8" />
                        <View style={styles.usageDetails}>
                          <Text style={styles.usageName}>{app}</Text>
                          {hasTimeLimit && (
                            <Text style={styles.usageLimit}>Limit: {timeLimit} min/day</Text>
                          )}
                        </View>
                      </View>
                      
                      <View style={styles.usageActions}>
                        <Text style={styles.usageTime}>{time} min</Text>
                        
                        <TouchableOpacity 
                          style={styles.usageLimitButton}
                          onPress={() => hasTimeLimit 
                            ? handleRemoveAppTimeLimit(app)
                            : handleSetAppTimeLimit(app)
                          }
                        >
                          <MaterialIcons 
                            name={hasTimeLimit ? "timer-off" : "timer"} 
                            size={18} 
                            color={hasTimeLimit ? "#FF3B30" : "#3FFFA8"} 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Progress</Text>
            
            <View style={styles.progressContainer}>
              <MaterialIcons name="school" size={48} color="#3FFFA8" />
              <Text style={styles.progressMessage}>
                Learning progress tracking coming soon!
              </Text>
            </View>
          </View>
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
    backgroundColor: '#1D2B53',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1D2B53',
    borderBottomWidth: 1,
    borderBottomColor: '#0B132B',
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
    fontSize: 14,
  },
  activeTabText: {
    color: '#3FFFA8',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyListText: {
    color: '#999',
    fontSize: 14,
    padding: 16,
    textAlign: 'center',
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
  addButton: {
    backgroundColor: '#3FFFA8',
    borderRadius: 8,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nestedList: {
    maxHeight: 200,
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
    maxWidth: '80%',
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
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  usageNameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  usageDetails: {
    flexDirection: 'column',
    marginLeft: 8,
    flex: 1,
  },
  usageName: {
    color: '#fff',
    fontSize: 14,
  },
  usageLimit: {
    color: '#FF9500',
    fontSize: 12,
    marginTop: 2,
  },
  usageActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usageTime: {
    color: '#3FFFA8',
    fontWeight: 'bold',
    marginRight: 8,
  },
  usageLimitButton: {
    padding: 8,
  },
  progressContainer: {
    backgroundColor: '#1D2B53',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  progressMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  lockInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  lockInfoText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  emergencyLockButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyUnlockButton: {
    backgroundColor: '#3FFFA8',
  },
  emergencyLockText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  quickAccessTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
  },
  websiteList: {
    marginBottom: 16,
  },
  appUsageList: {
    marginBottom: 16,
  },
});

export default ParentDashboard; 