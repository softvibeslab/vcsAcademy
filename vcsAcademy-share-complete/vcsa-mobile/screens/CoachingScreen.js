/**
 * Coaching Screen - VCSA Mobile
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

export default function CoachingScreen() {
  const [events] = React.useState([
    {
      id: 1,
      title: 'Advanced Closing Workshop',
      type: 'Group Coaching',
      date: 'Today, 3:00 PM',
      duration: '90 min',
      registered: false,
    },
    {
      id: 2,
      title: 'Handling Price Objections',
      type: 'Role Play',
      date: 'Tomorrow, 10:00 AM',
      duration: '60 min',
      registered: true,
    },
    {
      id: 3,
      title: 'Q&A: Call Reluctance',
      type: 'Q&A Session',
      date: 'Friday, 2:00 PM',
      duration: '45 min',
      registered: false,
    },
  ]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coaching Hub</Text>
        <Text style={styles.headerSubtitle}>Elevate your skills with expert guidance</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Registered</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Recordings</Text>
        </View>
      </View>

      {/* Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={[styles.eventType, event.registered && styles.eventTypeRegistered]}>
                {event.type}
              </Text>
            </View>

            <View style={styles.eventDetails}>
              <Text style={styles.eventDetail}>📅 {event.date}</Text>
              <Text style={styles.eventDetail}>⏱️ {event.duration}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.registerButton,
                event.registered && styles.registerButtonRegistered
              ]}
            >
              <Text style={styles.registerButtonText}>
                {event.registered ? '✓ Registered' : 'Register Now'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={styles.tipTitle}>Come Prepared</Text>
          <Text style={styles.tipDesc}>
            Review your toughest objections before coaching sessions
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>🎯</Text>
          <Text style={styles.tipTitle}>Practice Active</Text>
          <Text style={styles.tipDesc}>
            Roleplay scenarios help you build confidence
          </Text>
        </View>
      </View>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e5e1e8',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#d0c5af',
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
    fontSize: 28,
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e5e1e8',
    marginBottom: 15,
  },
  eventCard: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e1e8',
    flex: 1,
    marginRight: 10,
  },
  eventType: {
    backgroundColor: '#264191',
    color: '#9db2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  eventTypeRegistered: {
    backgroundColor: '#f2ca50',
    color: '#3c2f00',
  },
  eventDetails: {
    marginBottom: 15,
  },
  eventDetail: {
    fontSize: 14,
    color: '#d0c5af',
    marginBottom: 5,
  },
  registerButton: {
    backgroundColor: '#f2ca50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  registerButtonRegistered: {
    backgroundColor: '#264191',
  },
  registerButtonText: {
    color: '#3c2f00',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipCard: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e1e8',
    marginBottom: 5,
  },
  tipDesc: {
    fontSize: 14,
    color: '#d0c5af',
    flex: 1,
  },
});
