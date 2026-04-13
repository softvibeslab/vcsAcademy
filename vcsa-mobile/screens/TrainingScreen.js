/**
 * Training Screen - VCSA Mobile
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TrainingScreen() {
  const [tracks] = useState([
    {
      id: 1,
      title: 'Pro Mindset',
      modules: 6,
      completed: 4,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    },
    {
      id: 2,
      title: 'Discovery & Control',
      modules: 6,
      completed: 3,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    },
    {
      id: 3,
      title: 'Value Architecture',
      modules: 6,
      completed: 2,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    },
    {
      id: 4,
      title: 'Decision Management',
      modules: 6,
      completed: 1,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
    },
    {
      id: 5,
      title: 'Objection Mastery',
      modules: 6,
      completed: 1,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
    },
    {
      id: 6,
      title: 'Post-Sale Integrity',
      modules: 6,
      completed: 1,
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
    },
  ]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Top Producer Path</Text>
        <Text style={styles.headerSubtitle}>Your journey to elite performance</Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressValue}>64%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '64%' }]} />
          </View>
          <Text style={styles.progressLabel}>Path Completion</Text>
        </View>
      </View>

      {/* Active Session */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        <TouchableOpacity style={styles.activeSessionCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800' }}
            style={styles.activeSessionImage}
          />
          <View style={styles.activeSessionOverlay}>
            <Text style={styles.activeSessionTag}>In Progress</Text>
            <Text style={styles.activeSessionTitle}>Session 1: Mindset Mastery</Text>
            <Text style={styles.activeSessionDesc}>12m remaining</Text>
            <View style={styles.activeSessionProgress}>
              <View style={[styles.activeSessionProgressBar, { width: '82%' }]} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* All Tracks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Training Tracks</Text>
        {tracks.map((track) => (
          <TouchableOpacity key={track.id} style={styles.trackCard}>
            <Image
              source={{ uri: track.image }}
              style={styles.trackImage}
            />
            <View style={styles.trackOverlay}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackStats}>
                {track.completed}/{track.modules} modules
              </Text>
              <View style={styles.trackProgress}>
                <View
                  style={[
                    styles.trackProgressBar,
                    { width: `${(track.completed / track.modules) * 100}%` }
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#1b1b20',
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
  progressCard: {
    marginTop: 15,
    backgroundColor: '#201f24',
    borderRadius: 12,
    padding: 15,
  },
  progressValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f2ca50',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#353439',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f2ca50',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: '#d0c5af',
    marginTop: 5,
    textTransform: 'uppercase',
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
  activeSessionCard: {
    borderRadius: 15,
    overflow: 'hidden',
    height: 200,
    marginBottom: 10,
  },
  activeSessionImage: {
    width: '100%',
    height: '100%',
  },
  activeSessionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(19, 19, 23, 0.8)',
    padding: 15,
    justifyContent: 'flex-end',
  },
  activeSessionTag: {
    backgroundColor: 'rgba(38, 65, 145, 0.3)',
    color: '#9db2ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  activeSessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e5e1e8',
    marginBottom: 5,
  },
  activeSessionDesc: {
    fontSize: 14,
    color: '#d0c5af',
    marginBottom: 10,
  },
  activeSessionProgress: {
    height: 4,
    backgroundColor: '#353439',
    borderRadius: 2,
    overflow: 'hidden',
  },
  activeSessionProgressBar: {
    height: '100%',
    backgroundColor: '#f2ca50',
    borderRadius: 2,
  },
  trackCard: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 120,
    marginBottom: 10,
  },
  trackImage: {
    width: '100%',
    height: '100%',
  },
  trackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(19, 19, 23, 0.7)',
    padding: 15,
    justifyContent: 'flex-end',
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e1e8',
    marginBottom: 5,
  },
  trackStats: {
    fontSize: 12,
    color: '#d0c5af',
    marginBottom: 5,
  },
  trackProgress: {
    height: 3,
    backgroundColor: '#353439',
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackProgressBar: {
    height: '100%',
    backgroundColor: '#f2ca50',
    borderRadius: 2,
  },
});
