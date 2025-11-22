import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, SectionList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// @ts-ignore
import { soundAssets } from '../assets';

import { DrawerActions } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

const HighlightedText = ({ text, query, style }: { text: string, query: string, style?: any }) => {
  if (!query.trim()) {
    return <Text style={style}>{text}</Text>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <Text style={style}>
      {parts.map((part, index) => (
        <Text
          key={index}
          style={part.toLowerCase() === query.toLowerCase() ? { backgroundColor: '#FFEB3B', color: '#000' } : {}}
        >
          {part}
        </Text>
      ))}
    </Text>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { category } = useLocalSearchParams<{ category: string }>();
  const playerRef = useRef<AudioPlayer | null>(null);
  const insets = useSafeAreaInsets();

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Handle Android Back Button
  useEffect(() => {
    const backAction = () => {
      if (isSearchVisible) {
        setIsSearchVisible(false);
        setSearchQuery('');
        return true; // Prevent default behavior (exit app)
      }
      return false; // Allow default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isSearchVisible]);

  const formatName = (name: string) => {
    const cleanName = name.replace(/_/g, ' ').replace(/\.(mp3|wav|m4a)$/, '');
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

  const filteredAssets = React.useMemo(() => {
    let assets = soundAssets;

    // 1. Filter by Category
    if (category && category !== 'all') {
      assets = assets.filter((section: any) => section.category === category);
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      assets = assets.map((section: any) => {
        const titleMatches = section.title.replace(/_/g, ' ').toLowerCase().includes(query);

        // If title matches, return all items (or maybe still filter items? Let's show all for now if title matches)
        // Actually, usually better to filter items even if title matches, unless user wants to see the whole album.
        // Let's stick to: Show item if Item Name matches OR Section Title matches.

        const filteredData = section.data.filter((item: any) => {
          const nameMatches = item.name.replace(/_/g, ' ').toLowerCase().includes(query);
          return nameMatches || titleMatches;
        });

        return {
          ...section,
          data: filteredData
        };
      }).filter((section: any) => section.data.length > 0);
    }

    return assets;
  }, [category, searchQuery]);

  const getSubtitle = () => {
    if (category === 'kud') return 'Kud';
    if (category === 'lekker_spelen') return 'Lekker Spelen';
    return 'Alle Geluiden';
  };

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
          <HighlightedText text={formatName(item.name)} query={searchQuery} style={styles.itemTitle} />
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
        <HighlightedText text={formatName(section.title)} query={searchQuery} style={styles.headerTitle} />
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
          {isSearchVisible ? (
            <View style={styles.searchContainer}>
              <TouchableOpacity onPress={() => { setIsSearchVisible(false); setSearchQuery(''); }}>
                <MaterialIcons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Zoek geluid..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <MaterialIcons name="menu" size={28} color="#fff" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.appTitle}>Malse Geluiden</Text>
                <Text style={styles.appSubtitle}>{getSubtitle()}</Text>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => setIsSearchVisible(true)}>
                  <MaterialIcons name="search" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialIcons name="more-vert" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <SectionList
          sections={filteredAssets}
          keyExtractor={(item, index) => item.name + index}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          extraData={{ collapsedSections, searchQuery }}
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
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    marginLeft: 15,
    marginRight: 15,
  },
});


