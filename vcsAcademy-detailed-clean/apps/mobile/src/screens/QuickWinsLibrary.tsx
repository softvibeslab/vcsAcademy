import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchQuickWins, setSearchQuery, setSelectedCategory } from '../store/slices/contentSlice';

const CATEGORIES = ['All', 'before_tour', 'closing_help', 'objections', 'relationship'];

export default function QuickWinsLibraryScreen() {
  const dispatch = useAppDispatch();
  const { quickWins, isLoading, searchQuery, selectedCategory } = useAppSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchQuickWins());
  }, [dispatch]);

  const filteredWins = quickWins.filter(win => {
    const matchesSearch = win.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         win.one_liner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || win.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Quick Wins Library</Text>
        <Text style={styles.subtitle}>50+ battle-tested tactics</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search quick wins..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryPill,
              selectedCategory === category && styles.categoryPillActive
            ]}
            onPress={() => dispatch(setSelectedCategory(category))}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Wins List */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredWins.map((win) => (
          <View key={win.id} style={styles.winCard}>
            <View style={styles.winHeader}>
              <View style={styles.winCategoryBadge}>
                <Text style={styles.winCategoryText}>{win.category}</Text>
              </View>
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons
                  name={win.is_favorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={win.is_favorite ? '#EF4444' : '#94A3B8'}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.winTitle}>{win.title}</Text>
            <Text style={styles.winOneLiner}>{win.one_liner}</Text>

            <View style={styles.winFooter}>
              <View style={styles.timingSection}>
                <Ionicons name="time" size={14} color="#94A3B8" />
                <Text style={styles.timingText}>{win.timing}</Text>
              </View>

              <View style={styles.impactSection}>
                <Text style={styles.impactLabel}>Impact:</Text>
                {[...Array(10)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={12}
                    color={i < win.estimated_impact ? '#D4AF37' : '#334155'}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020204',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F1F5F9',
    fontFamily: 'Playfair Display',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F1F5F9',
    fontSize: 16,
    paddingVertical: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#D4AF37',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  categoryTextActive: {
    color: '#020204',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  winCard: {
    backgroundColor: '#1E293B',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  winHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  winCategoryBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  winCategoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F1F5F9',
  },
  favoriteButton: {
    padding: 4,
  },
  winTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  winOneLiner: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  winFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timingText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  impactSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  impactLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 4,
  },
  applyButton: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#020204',
  },
});
