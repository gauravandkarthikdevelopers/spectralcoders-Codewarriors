import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background with blur effect */}
      <BlurView intensity={20} style={styles.background}>
        <View style={styles.content}>
          {/* Logo/Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Code Warriors</Text>
            <Text style={styles.subtitle}>Master the Art of Programming</Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialIcons name="code" size={32} color="#fff" />
              <Text style={styles.featureText}>Learn to Code</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="school" size={32} color="#fff" />
              <Text style={styles.featureText}>Interactive Lessons</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="emoji_events" size={32} color="#fff" />
              <Text style={styles.featureText}>Earn Achievements</Text>
            </View>
          </View>

          {/* Next Button */}
          <Link href="/tabs" asChild>
            <Pressable style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Get Started</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </Pressable>
          </Link>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
}); 