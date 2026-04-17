/**
 * Resources Screen - VCSA Mobile
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

export default function ResourcesScreen() {
  const [resources] = React.useState([
    {
      id: 1,
      title: 'Objection Handling Playbook',
      type: 'PDF',
      size: '4.2 MB',
      downloads: 1234,
    },
    {
      id: 2,
      title: 'Tour Presentation Template',
      type: 'Template',
      size: '2.8 MB',
      downloads: 892,
    },
    {
      id: 3,
      title: 'Daily Prospecting Checklist',
      type: 'Checklist',
      size: '156 KB',
      downloads: 2341,
    },
    {
      id: 4,
      title: 'Closing Techniques E-book',
      type: 'E-book',
      size: '8.5 MB',
      downloads: 3421,
    },
  ]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
        <Text style={styles.headerSubtitle}>Download tools to accelerate your success</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Resources</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>7,889</Text>
          <Text style={styles.statLabel}>Downloads</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
          <Text style={styles.filterTabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>PDFs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Templates</Text>
        </TouchableOpacity>
      </View>

      {/* Resources List */}
      <View style={styles.section}>
        {resources.map((resource) => (
          <TouchableOpacity key={resource.id} style={styles.resourceCard}>
            <View style={styles.resourceHeader}>
              <View style={styles.resourceTypeIcon}>
                <Text style={styles.resourceTypeIconText}>
                  {resource.type === 'PDF' ? '📄' :
                   resource.type === 'Template' ? '📝' :
                   resource.type === 'Checklist' ? '✅' : '📚'}
                </Text>
              </View>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceMeta}>{resource.size} • {resource.downloads.toLocaleString()} downloads</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>⬇ Download</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pro Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>1</Text>
          <Text style={styles.tipText}>Download resources before your tour for quick reference</Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipNumber}>2</Text>
          <Text style={styles.tipText}>Use templates to customize presentations for each prospect</Text>
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
  statsRow: {
    flexDirection: 'row',
    padding: 20,
    gap: 30,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f2ca50',
  },
  statLabel: {
    fontSize: 12,
    color: '#d0c5af',
    textTransform: 'uppercase',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1b1b20',
    borderWidth: 1,
    borderColor: '#4d4635',
  },
  filterTabActive: {
    backgroundColor: '#f2ca50',
    borderColor: '#f2ca50',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d0c5af',
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
  resourceCard: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2ca50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resourceTypeIconText: {
    fontSize: 24,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e1e8',
    marginBottom: 5,
  },
  resourceMeta: {
    fontSize: 12,
    color: '#d0c5af',
  },
  downloadButton: {
    backgroundColor: '#264191',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  downloadButtonText: {
    color: '#9db2ff',
    fontSize: 14,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#1b1b20',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f2ca50',
    marginRight: 15,
  },
  tipText: {
    fontSize: 14,
    color: '#e5e1e8',
    flex: 1,
  },
});
