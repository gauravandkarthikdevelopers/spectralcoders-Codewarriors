import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const SLEEP_MODE_CHECK_TASK = 'checkSleepMode';

// Register the background task for sleep mode
TaskManager.defineTask(SLEEP_MODE_CHECK_TASK, async () => {
  try {
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
    
    // Get parental controls data
    const parentalControlsData = await AsyncStorage.getItem('parentalControls');
    if (!parentalControlsData) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
    
    const parentalControls = JSON.parse(parentalControlsData);
    
    // Check if we need to activate sleep mode
    if (parentalControls.sleepModeEnabled) {
      const startTime = parentalControls.sleepModeStartTime;
      const endTime = parentalControls.sleepModeEndTime;
      
      // Simple time check - this doesn't handle midnight crossover perfectly
      // but works for most scenarios
      const isInSleepPeriod = isTimeBetween(currentTime, startTime, endTime);
      
      if (isInSleepPeriod && !parentalControls.sleepModeActive) {
        // Activate sleep mode
        await activateSleepMode(parentalControls);
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } else if (!isInSleepPeriod && parentalControls.sleepModeActive) {
        // Deactivate sleep mode
        await deactivateSleepMode(parentalControls);
        return BackgroundFetch.BackgroundFetchResult.NewData;
      }
    }
    
    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Check if current time is between start and end times
function isTimeBetween(current, start, end) {
  // Convert times to minutes for easier comparison
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const currentMinutes = timeToMinutes(current);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  
  // Handle cases where end time is on the next day
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  } else {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
}

// Activate sleep mode
async function activateSleepMode(parentalControls) {
  // Update parental controls state
  const updatedControls = {
    ...parentalControls,
    sleepModeActive: true
  };
  
  // Save updated state
  await AsyncStorage.setItem('parentalControls', JSON.stringify(updatedControls));
  
  // Send a notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Sleep Mode Activated',
      body: 'The device is now in sleep mode according to the scheduled time.',
      data: { type: 'sleepMode' },
    },
    trigger: null, // Send immediately
  });
  
  // Log the activation in activity log
  const activityLog = [...updatedControls.activityLog, {
    timestamp: new Date().toISOString(),
    action: 'Sleep mode activated automatically'
  }];
  
  await AsyncStorage.setItem('parentalControls', JSON.stringify({
    ...updatedControls,
    activityLog
  }));
}

// Deactivate sleep mode
async function deactivateSleepMode(parentalControls) {
  // Update parental controls state
  const updatedControls = {
    ...parentalControls,
    sleepModeActive: false
  };
  
  // Save updated state
  await AsyncStorage.setItem('parentalControls', JSON.stringify(updatedControls));
  
  // Send a notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Sleep Mode Deactivated',
      body: 'Sleep mode has ended. The device is now available for use.',
      data: { type: 'sleepMode' },
    },
    trigger: null, // Send immediately
  });
  
  // Log the deactivation in activity log
  const activityLog = [...updatedControls.activityLog, {
    timestamp: new Date().toISOString(),
    action: 'Sleep mode deactivated automatically'
  }];
  
  await AsyncStorage.setItem('parentalControls', JSON.stringify({
    ...updatedControls,
    activityLog
  }));
}

// Register background tasks
export async function registerBackgroundTasks() {
  try {
    await BackgroundFetch.registerTaskAsync(SLEEP_MODE_CHECK_TASK, {
      minimumInterval: 60, // 1 minute in seconds
      stopOnTerminate: false,
      startOnBoot: true,
    });
    return true;
  } catch (err) {
    console.log('Sleep mode background task registration failed:', err);
    return false;
  }
}

// Unregister background tasks
export async function unregisterBackgroundTasks() {
  try {
    await BackgroundFetch.unregisterTaskAsync(SLEEP_MODE_CHECK_TASK);
    console.log('Sleep mode background task unregistered');
    return true;
  } catch (err) {
    console.log('Sleep mode background task unregistration failed:', err);
    return false;
  }
} 