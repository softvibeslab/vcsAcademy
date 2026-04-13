/**
 * Profile Screen - VCSA Mobile
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userRole}>Sales Representative</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 15 Day Streak</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Modules</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>48.5h</Text>
          <Text style={styles.statLabel}>Training</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>72%</Text>
          <Text style={styles.statLabel}>Readiness</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🎯</Text>
          <Text style={styles.menuText}>My Goals</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuText}>Performance</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Notifications</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🌙</Text>
          <Text style={styles.menuText}>Dark Mode</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help & Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.version}>VCSA Mobile v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131317',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#1b1b20',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f2ca50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#d4af37',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3c2f00',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e5e1e8',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: '#d0c5af',
    marginBottom: 15,
  },
  streakBadge: {
    backgroundColor: 'rgba(242, 202, 80, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f2ca50',
  },
  streakText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f2ca50',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f2ca50',
  },
  statLabel: {
    fontSize: 12,
    color: '#d0c5af',
    textTransform: 'uppercase',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d0c5af',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1b20',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 1,
    borderRadius: 12,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#e5e1e8',
  },
  menuArrow: {
    fontSize: 24,
    color: '#d0c5af',
  },
  logoutButton: {
    backgroundColor: '#ffb4ab',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#690005',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#d0c5af',
    paddingVertical: 20,
  },
});
