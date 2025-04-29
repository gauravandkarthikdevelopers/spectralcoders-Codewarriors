import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { getDoc, doc } from 'firebase/firestore';
import db from '../utils/firebase';

const PendingApproval = ({ onLogout }) => {
  const { userAccount, pendingAccessCode, updateChildAccount } = useAppContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Function to check if account has been approved
  const checkApprovalStatus = async () => {
    if (!userAccount || !userAccount.id) {
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      // Check the current status in Firestore
      const childRef = doc(db, "children", userAccount.id);
      const childDoc = await getDoc(childRef);
      
      if (childDoc.exists()) {
        const childData = childDoc.data();
        
        // If account is now approved
        if (childData.approved && childData.parentId) {
          // Update local account data
          const updatedAccount = {
            ...userAccount,
            approved: true,
            parentId: childData.parentId
          };
          
          // Update the account in context/storage
          updateChildAccount(updatedAccount);
        }
      }
    } catch (error) {
      console.error("Error checking approval status:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="hourglass-top" size={64} color="#FFD700" />
        </View>
        
        <Text style={styles.title}>Account Pending Approval</Text>
        
        <Text style={styles.description}>
          Your account has been created, but you need to wait for a parent or guardian to approve it.
        </Text>
        
        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>Your access code:</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.code}>{pendingAccessCode}</Text>
          </View>
          <Text style={styles.codeInstructions}>
            Please share this code with your parent or guardian. They will need it to approve your account.
          </Text>
        </View>
        
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Next Steps:</Text>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Ask your parent to download the app
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              They should select "I am a Parent" and enter this access code
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Once approved, click the refresh button below to start learning
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={checkApprovalStatus}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator color="#0B132B" size="small" />
          ) : (
            <>
              <MaterialIcons name="refresh" size={20} color="#0B132B" />
              <Text style={styles.refreshText}>Check Approval Status</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 32,
    textAlign: 'center',
  },
  codeSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  codeContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  code: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 4,
  },
  codeInstructions: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  stepsContainer: {
    width: '100%',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3FFFA8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B132B',
  },
  stepText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3FFFA8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B132B',
    marginLeft: 8,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
});

export default PendingApproval; 