import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const ProfileSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#f97316" />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.itemRight}>
        {rightComponent || <Ionicons name="chevron-forward" size={20} color="#9ca3af" />}
      </View>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Handle logout logic here
            console.log("User logged out");
          }
        }
      ]
    );
  };

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'English' ? 'हिंदी' : 'English');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>
        <Text style={styles.userName}>Guest User</Text>
        <Text style={styles.userEmail}>guest@filmwalla.com</Text>
      </View>

      {/* Account Section */}
      <ProfileSection title="Account">
        <ProfileItem
          icon="person-outline"
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={() => {
            Alert.alert("Feature Coming Soon", "Profile editing will be available in the next update.");
          }}
        />
        <ProfileItem
          icon="heart-outline"
          title="My Reviews"
          subtitle="View your movie reviews and ratings"
          onPress={() => {
            Alert.alert("Feature Coming Soon", "My Reviews feature will be available soon.");
          }}
        />
        <ProfileItem
          icon="bookmark-outline"
          title="Watchlist"
          subtitle="Movies you want to watch"
          onPress={() => {
            Alert.alert("Feature Coming Soon", "Watchlist feature will be available soon.");
          }}
        />
      </ProfileSection>

      {/* Preferences Section */}
      <ProfileSection title="Preferences">
        <ProfileItem
          icon="notifications-outline"
          title="Push Notifications"
          subtitle="Get notified about new reviews and news"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#e5e7eb", true: "#fed7aa" }}
              thumbColor={notifications ? "#f97316" : "#9ca3af"}
            />
          }
        />
        <ProfileItem
          icon="language-outline"
          title="Language"
          subtitle={`Currently: ${language}`}
          onPress={handleLanguageToggle}
          rightComponent={
            <Text style={styles.languageText}>{language}</Text>
          }
        />
        <ProfileItem
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Switch to dark theme"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#e5e7eb", true: "#fed7aa" }}
              thumbColor={darkMode ? "#f97316" : "#9ca3af"}
            />
          }
        />
      </ProfileSection>

      {/* Support Section */}
      <ProfileSection title="Support">
        <ProfileItem
          icon="help-circle-outline"
          title="Help Center"
          subtitle="Get answers to common questions"
          onPress={() => {
            Alert.alert("Help Center", "Visit our website for FAQs and support documentation.");
          }}
        />
        <ProfileItem
          icon="chatbubble-outline"
          title="Contact Us"
          subtitle="Send us your feedback"
          onPress={() => {
            Alert.alert("Contact Us", "Email: support@filmwalla.com");
          }}
        />
        <ProfileItem
          icon="star-outline"
          title="Rate App"
          subtitle="Rate Filmwalla on app store"
          onPress={() => {
            Alert.alert("Rate App", "Thank you for considering rating our app!");
          }}
        />
      </ProfileSection>

      {/* About Section */}
      <ProfileSection title="About">
        <ProfileItem
          icon="information-circle-outline"
          title="About Filmwalla"
          subtitle="Version 1.0.0"
          onPress={() => {
            Alert.alert("About Filmwalla", "Filmwalla.com - Your Gateway to Entertainment\n\nVersion 1.0.0\nBuilt with ❤️ for movie lovers");
          }}
        />
        <ProfileItem
          icon="document-text-outline"
          title="Privacy Policy"
          onPress={() => {
            Alert.alert("Privacy Policy", "Our privacy policy is available on our website.");
          }}
        />
        <ProfileItem
          icon="shield-checkmark-outline"
          title="Terms of Service"
          onPress={() => {
            Alert.alert("Terms of Service", "Our terms of service are available on our website.");
          }}
        />
      </ProfileSection>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by Filmwalla Team</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default ProfileScreen;