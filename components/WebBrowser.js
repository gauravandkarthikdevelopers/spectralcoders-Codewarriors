import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const DEFAULT_URL = 'https://google.com';

const WebBrowser = () => {
  const { parentalControls, logActivity } = useAppContext();
  const [url, setUrl] = useState(DEFAULT_URL);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [loading, setLoading] = useState(false);
  const [errorPage, setErrorPage] = useState(false);
  const [blockedSite, setBlockedSite] = useState('');
  const webViewRef = useRef(null);

  // Function to check if a URL is blocked
  const isUrlBlocked = (urlToCheck) => {
    if (!parentalControls || !parentalControls.blockedWebsites) return false;
    
    try {
      // Extract domain from URL
      const domain = urlToCheck.toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/i, '')
        .split('/')[0];
      
      // Check if domain or any parent domain is blocked
      return parentalControls.blockedWebsites.some(blockedSite => {
        return domain === blockedSite || domain.endsWith(`.${blockedSite}`);
      });
    } catch (error) {
      console.error('Error checking blocked URL:', error);
      return false;
    }
  };

  // Handle URL submission
  const handleSubmitUrl = () => {
    let processedUrl = url;
    // Add https:// if not present
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    // Check if the URL is blocked
    if (isUrlBlocked(processedUrl)) {
      setBlockedSite(processedUrl);
      setErrorPage(true);
      // Log blocked attempt
      logActivity(`Attempted to access blocked site: ${processedUrl}`);
      return;
    }
    
    // Navigate to URL
    webViewRef.current?.injectJavaScript(`window.location.href = "${processedUrl}";`);
    setUrl(processedUrl);
  };

  // Handle URL change from WebView
  const handleNavigationChange = (navState) => {
    const newUrl = navState.url;
    setCurrentUrl(newUrl);
    
    // Check if navigating to a blocked site
    if (isUrlBlocked(newUrl)) {
      setBlockedSite(newUrl);
      setErrorPage(true);
      // Log blocked attempt
      logActivity(`Blocked navigation to restricted site: ${newUrl}`);
      return;
    }
    
    setErrorPage(false);
    
    // Log successful navigation
    if (newUrl !== currentUrl) {
      logActivity(`Visited website: ${newUrl}`);
    }
  };

  // Handle back button press
  const goBack = () => {
    webViewRef.current?.goBack();
  };

  // Handle refresh button press
  const refresh = () => {
    webViewRef.current?.reload();
  };

  // Render error page for blocked sites
  const renderBlockedPage = () => (
    <View style={styles.blockedContainer}>
      <MaterialIcons name="block" size={80} color="#FF3B30" />
      <Text style={styles.blockedTitle}>Site Blocked</Text>
      <Text style={styles.blockedMessage}>
        This website has been blocked by parental controls.
      </Text>
      <Text style={styles.blockedSite}>{blockedSite}</Text>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => {
          setErrorPage(false);
          setUrl(DEFAULT_URL);
          webViewRef.current?.injectJavaScript(`window.location.href = "${DEFAULT_URL}";`);
        }}
      >
        <Text style={styles.backButtonText}>Go to Safe Page</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.urlBar}>
          <TextInput 
            style={styles.urlInput}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder="Enter website URL"
            placeholderTextColor="#999"
            onSubmitEditing={handleSubmitUrl}
          />
          <TouchableOpacity onPress={handleSubmitUrl} style={styles.goButton}>
            <MaterialIcons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={goBack}>
            <MaterialIcons name="arrow-back" size={24} color="#3FFFA8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={refresh}>
            <MaterialIcons name="refresh" size={24} color="#3FFFA8" />
          </TouchableOpacity>
        </View>
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3FFFA8" />
        </View>
      )}
      
      {errorPage ? renderBlockedPage() : (
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webView}
          onNavigationStateChange={handleNavigationChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
            setLoading(false);
          }}
        />
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
    padding: 16,
    backgroundColor: '#1D2B53',
  },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#121212',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  goButton: {
    backgroundColor: '#3FFFA8',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    padding: 8,
  },
  webView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 19, 43, 0.7)',
    zIndex: 1,
  },
  blockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  blockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 8,
  },
  blockedMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  blockedSite: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3FFFA8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#0B132B',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WebBrowser; 