import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import uuid from 'react-native-uuid';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGyE4KFEArCZwFSDvfcRYJcwU9wvvVXXI",
  authDomain: "codeworriors-2.firebaseapp.com",
  projectId: "codeworriors-2",
  storageBucket: "codeworriors-2.firebasestorage.app",
  messagingSenderId: "61650179881",
  appId: "1:61650179881:web:40d9a65ab8a4e4772e8938",
  measurementId: "G-E7EZ3DRJEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generate a unique access code for kid registration
export const generateAccessCode = () => {
  // Generate a random 6-character code
  return uuid.v4().substring(0, 6).toUpperCase();
};

// Register a new child account and return the access code
export const registerChildAccount = async (childData) => {
  try {
    const accessCode = generateAccessCode();
    
    // Create a document for the child
    const childRef = doc(collection(db, "children"));
    
    await setDoc(childRef, {
      id: childRef.id,
      name: childData.name,
      dateOfBirth: childData.dateOfBirth,
      accessCode: accessCode,
      approved: false,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      parentId: null,
    });
    
    return { 
      success: true, 
      accessCode, 
      childId: childRef.id 
    };
  } catch (error) {
    console.error("Error registering child account:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Verify access code and connect parent to child
export const verifyAccessCode = async (accessCode) => {
  try {
    // Find child document with matching access code
    const childrenRef = collection(db, "children");
    const q = query(childrenRef, where("accessCode", "==", accessCode));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: "Invalid access code" };
    }
    
    const childDoc = snapshot.docs[0];
    const childData = childDoc.data();
    
    return { 
      success: true, 
      childId: childDoc.id, 
      childData 
    };
  } catch (error) {
    console.error("Error verifying access code:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Register parent account and link to child
export const registerParentAccount = async (parentData, childId) => {
  try {
    // Create parent document
    const parentRef = doc(collection(db, "parents"));
    
    await setDoc(parentRef, {
      id: parentRef.id,
      name: parentData.name,
      email: parentData.email,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      childrenIds: [childId],
    });
    
    // Update child document with parent ID
    const childRef = doc(db, "children", childId);
    await updateDoc(childRef, {
      parentId: parentRef.id,
      approved: true,
    });
    
    return { 
      success: true, 
      parentId: parentRef.id 
    };
  } catch (error) {
    console.error("Error registering parent account:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Log child activity
export const logChildActivity = async (childId, activity) => {
  try {
    const activityRef = doc(collection(db, "activities"));
    
    await setDoc(activityRef, {
      id: activityRef.id,
      childId,
      activity,
      timestamp: new Date().toISOString(),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error logging activity:", error);
    return { success: false, error: error.message };
  }
};

// Update parental control settings
export const updateParentalControls = async (childId, settings) => {
  try {
    const controlsRef = doc(db, "parentalControls", childId);
    
    // Check if document exists
    const controlsDoc = await getDoc(controlsRef);
    
    if (controlsDoc.exists()) {
      // Update existing document
      await updateDoc(controlsRef, {
        ...settings,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new document
      await setDoc(controlsRef, {
        childId,
        ...settings,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating parental controls:", error);
    return { success: false, error: error.message };
  }
};

// Subscribe to parental controls changes
export const subscribeToParentalControls = (childId, callback) => {
  const controlsRef = doc(db, "parentalControls", childId);
  
  return onSnapshot(controlsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback(null);
    }
  });
};

// Subscribe to child activity
export const subscribeToChildActivity = (childId, callback) => {
  const activitiesRef = collection(db, "activities");
  const q = query(activitiesRef, where("childId", "==", childId));
  
  return onSnapshot(q, (snapshot) => {
    const activities = [];
    snapshot.forEach((doc) => {
      activities.push(doc.data());
    });
    
    // Sort by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    callback(activities);
  });
};

export default db; 