import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.background}>
        <View style={styles.content}>
          {/* Logo/Title Section */}
          <View style={styles.titleContainer}>
            <MaterialIcons name="security" size={60} color="#3FFFA8" />
            <Text style={styles.title}>Cyber Warriors</Text>
            <Text style={styles.subtitle}>Master Cybersecurity. Have Fun.</Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialIcons name="security" size={32} color="#3FFFA8" />
              <Text style={styles.featureText}>Learn Cybersecurity Skills</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="videogame-asset" size={32} color="#3FFFA8" />
              <Text style={styles.featureText}>Fun Interactive Challenges</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="emoji-events" size={32} color="#3FFFA8" />
              <Text style={styles.featureText}>Earn XP & Badges</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="trending-up" size={32} color="#3FFFA8" />
              <Text style={styles.featureText}>Track Daily Progress</Text>
            </View>
          </View>

          {/* Next Button */}
          <Link href="/(tabs)" asChild>
            <Pressable style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Get Started</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#0B132B" />
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B132B',
  },
  content: {
    width: '90%',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#3FFFA8',
    marginVertical: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(127, 0, 255, 0.2)',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#7F00FF',
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3FFFA8',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#0B132B',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
}); 