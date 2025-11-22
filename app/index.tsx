import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// @ts-ignore
import { soundAssets } from '../assets';

import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();
  const playerRef = useRef<AudioPlayer | null>(null);
  const insets = useSafeAreaInsets();
  // Initialize all sections as expanded (false = expanded in this logic, or we can flip it)
  // Let's stick to: true = collapsed, false/undefined = expanded
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  function playSound(source: any) {
    if (playerRef.current) {
      playerRef.current.replace(source);
      playerRef.current.play();
    } else {
      const player = createAudioPlayer(source);
      player.play();
      playerRef.current = player;
    }
  }

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
      }
    };
  }, []);

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const formatSoundName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\.(mp3|wav|m4a)$/, '');
  };

  const renderItem = ({ item, section }: { item: any, section: any }) => {
    if (collapsedSections[section.title]) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.item} onPress={() => playSound(item.source)}>
        <View style={styles.playIconContainer}>
          <Ionicons name="play-circle" size={48} color="#FF9800" />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{formatSoundName(item.name)}</Text>
        </View>
        <TouchableOpacity style={styles.moreIcon}>
          <MaterialIcons name="more-vert" size={24} color="#FF9800" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: any }) => {
    const isCollapsed = collapsedSections[section.title];
    const count = section.data.length;
    const statusText = isCollapsed ? 'ingeklapt' : 'uitgeklapt';

    return (
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(section.title)}>
        <Text style={styles.headerTitle}>{section.title.toUpperCase()}</Text>
        <Text style={styles.headerSubtitle}>{count} geluiden ({statusText})</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.contentContainer}>
        {/* Main Header */}
        <View style={[styles.mainHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <MaterialIcons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.appTitle}>Malse Geluiden</Text>
            <Text style={styles.appSubtitle}>Alle Geluiden</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={{ marginRight: 15 }}>
              <MaterialIcons name="search" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <SectionList
          sections={soundAssets}
          keyExtractor={(item, index) => item.name + index}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          extraData={collapsedSections}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background for the bottom bar area
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff', // White background for the app content
  },
  mainHeader: {
    backgroundColor: '#E91E63', // Pinkish red from screenshot
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    // Height is now dynamic based on padding
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 20,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#B71C1C', // Darker red for section headers
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    // No border in screenshot, but maybe needed for separation? Screenshot looks clean.
  },
  playIconContainer: {
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
  },
  moreIcon: {
    padding: 5,
  },
});


