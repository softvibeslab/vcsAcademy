/**
 * Dashboard Screen - VCSA Mobile (Enhanced with Real API)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import apiService from '../services/api';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [readinessScore, setReadinessScore] = useState(0);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [nextAssignment, setNextAssignment] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Obtener datos del progreso del usuario
      const progressResult = await apiService.getProgress();

      if (progressResult.success) {
        const progress = progressResult.data.progress;

        // Actualizar readiness score
        setReadinessScore(progress.readiness_score || 0);

        // Actualizar next assignment
        if (progressResult.data.next_assignment) {
          setNextAssignment(progressResult.data.next_assignment);
        }

        // Actualizar badges
        setBadges(progress.badges_earned || []);

        // Actualizar daily goals basado en el progreso real
        updateDailyGoals(progress);
      }

      // Obtener datos del usuario
      const user = apiService.getUser();
      if (user) {
        setUserData(user);
      }

    } catch (error) {
      console.log('Using demo data due to error:', error);
      // Usar datos demo si falla la API
      setReadinessScore(72);
      setDailyGoals([
        { id: 1, title: 'Tours', current: 2, target: 5, color: '#f2ca50' },
        { id: 2, title: 'Sales', current: 1, target: 2, color: '#9db2ff' },
        { id: 3, title: 'Volume', current: 8500, target: 15000, color: '#c3cee6', prefix: '$' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateDailyGoals = (progress) => {
    const goals = [];

    // Tours goal
    const completedContent = progress.content_completed || [];
    const toursCount = completedContent.filter(c => c.startsWith('mod_')).length;
    goals.push({
      id: 1,
      title: 'Training Modules',
      current: toursCount,
      target: 36,
      color: '#f2ca50'
    });

    // Quick wins
    const quickWinsCount = completedContent.filter(c => c.startsWith('qw_')).length;
    goals.push({
      id: 2,
      title: 'Quick Wins',
      current: quickWinsCount,
      target: 20,
      color: '#9db2ff'
    });

    // Deal breakdowns
    const breakdownsCount = completedContent.filter(c => c.startsWith('breakdown_')).length;
    goals.push({
      id: 3,
      title: 'Deal Breakdowns',
      current: breakdownsCount,
      target: 15,
      color: '#c3cee6'
    });

    setDailyGoals(goals);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleMarkComplete = async (contentId) => {
    try {
      const result = await apiService.markContentComplete(contentId);
      if (result.success) {
        // Refrescar datos
        fetchData();
      }
    } catch (error) {
      console.error('Error marking complete:', error);
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
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#f2ca50"
        />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#f2ca50', '#d4af37']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
        </Text>
        <Text style={styles.headerSubtitle}>
          {userData?.name || 'Welcome to The Vault'}
        </Text>
        {userData?.email && (
          <Text style={styles.headerEmail}>{userData.email}</Text>
        )}
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
            <Text style={styles.scoreTrend}>
              {readinessScore >= 70 ? '🔥 Top Performer' :
               readinessScore >= 40 ? '⭐ Developing' :
               '🌱 Getting Started'}
            </Text>
            <Text style={styles.scoreDesc}>
              {badges.length} badges earned
            </Text>
          </View>
        </View>
      </View>

      {/* Next Assignment */}
      {nextAssignment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Assignment</Text>
          <TouchableOpacity
            style={styles.assignmentCard}
            onPress={() => navigation.navigate('Training')}
          >
            <View style={styles.assignmentHeader}>
              <Text style={styles.assignmentType}>{nextAssignment.type}</Text>
              <Text style={styles.assignmentTrack}>{nextAssignment.track}</Text>
            </View>
            <Text style={styles.assignmentTitle}>{nextAssignment.content?.title || 'Continue Learning'}</Text>
            <Text style={styles.assignmentDesc}>Tap to continue →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Daily Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Progress</Text>
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
                  {
                    width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                    backgroundColor: goal.color
                  }
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Badges */}
      {badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {badges.slice(0, 5).map((badgeId, index) => (
              <View key={index} style={styles.badgeCard}>
                <Text style={styles.badgeIcon}>🏆</Text>
                <Text style={styles.badgeText}>{badgeId}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Training')}
          >
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionTitle}>Training</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Coaching')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>Coaching</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Resources')}
          >
            <Text style={styles.actionIcon}>📁</Text>
            <Text style={styles.actionTitle}>Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionTitle}>Profile</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3c2f00',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#554300',
    marginTop: 5,
  },
  headerEmail: {
    fontSize: 12,
    color: '#664300',
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
  assignmentCard: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f2ca50',
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  assignmentType: {
    fontSize: 12,
    color: '#f2ca50',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  assignmentTrack: {
    fontSize: 12,
    color: '#9ca3af',
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e1e8',
    marginBottom: 5,
  },
  assignmentDesc: {
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
  badgeCard: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 10,
    color: '#d0c5af',
    textAlign: 'center',
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