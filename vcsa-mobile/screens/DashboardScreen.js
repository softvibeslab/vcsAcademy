/**
 * Dashboard Screen - VCSA Mobile
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API = 'http://10.0.2.2:8000/api';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [readinessScore, setReadinessScore] = useState(72);
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, title: 'Tours', current: 2, target: 3, color: '#f2ca50' },
    { id: 2, title: 'Sales', current: 1, target: 2, color: '#9db2ff' },
    { id: 3, title: 'Volume', current: 8500, target: 15000, color: '#c3cee6', prefix: '$' },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/performance`, {
        timeout: 5000
      });
      // Demo data for preview
    } catch (error) {
      console.log('Using demo data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f2ca50" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#f2ca50', '#d4af37']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Good Morning!</Text>
        <Text style={styles.headerSubtitle}>Welcome to The Vault</Text>
      </LinearGradient>

      {/* Readiness Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Readiness Score</Text>
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{readinessScore}</Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreTrend}>↑ 5% this week</Text>
            <Text style={styles.scoreDesc}>You're doing great!</Text>
          </View>
        </View>
      </View>

      {/* Daily Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Goals</Text>
        {dailyGoals.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalValue}>
                {goal.prefix || ''}{goal.current}/{goal.target}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(goal.current / goal.target) * 100}%`, backgroundColor: goal.color }
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionTitle}>Log Tour</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🎓</Text>
            <Text style={styles.actionTitle}>Training</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>Coaching</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#131317',
  },
  loadingText: {
    color: '#d0c5af',
    marginTop: 10,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3c2f00',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#554300',
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
  scoreCard: {
    backgroundColor: '#1b1b20',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f2ca50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3c2f00',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#554300',
    textTransform: 'uppercase',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTrend: {
    fontSize: 16,
    color: '#9db2ff',
    fontWeight: '600',
    marginBottom: 5,
  },
  scoreDesc: {
    fontSize: 14,
    color: '#d0c5af',
  },
  goalCard: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e1e8',
  },
  goalValue: {
    fontSize: 14,
    color: '#f2ca50',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#353439',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    width: (width - 60) / 2,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e1e8',
    textAlign: 'center',
  },
});
