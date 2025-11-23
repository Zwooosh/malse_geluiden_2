import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, SectionList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// @ts-ignore
import { soundAssets } from '../assets';
import { Palette } from '../constants/theme';

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
          style={part.toLowerCase() === query.toLowerCase() ? { backgroundColor: Palette.colorAccent, color: Palette.white } : {}}
        >
          {part}
        </Text>
      ))}
    </Text>
  );
};

const AnimatedChevron = ({ collapsed }: { collapsed: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(collapsed ? '0deg' : '180deg') }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <MaterialIcons name="keyboard-arrow-down" size={24} color={Palette.white} />
    </Animated.View>
  );
};

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

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

    // 3. Handle Collapsed Sections
    assets = assets.map((section: any) => {
      if (collapsedSections[section.title]) {
        return { ...section, data: [] };
      }
      return section;
    });

    return assets;
  }, [category, searchQuery, collapsedSections]);

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
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <TouchableOpacity style={styles.item} onPress={() => playSound(item.source)}>
          <View style={styles.playIconContainer}>
            <Ionicons name="play-circle" size={48} color={Palette.colorAccent} />
          </View>
          <View style={styles.itemTextContainer}>
            <HighlightedText text={formatName(item.name)} query={searchQuery} style={styles.itemTitle} />
          </View>
          <TouchableOpacity style={styles.moreIcon}>
            <MaterialIcons name="more-vert" size={24} color={Palette.colorAccent} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSectionHeader = ({ section }: { section: any }) => {
    const isCollapsed = collapsedSections[section.title];
    const count = section.data.length; // Note: This will be 0 when collapsed if we use filteredAssets logic.
    // We need the REAL count.
    // To fix this, we should look up the original count or pass it differently.
    // Or, we can just not show the count, or accept it shows 0 (which is technically true for visible items).
    // Let's try to find the original count.
    const originalSection = soundAssets.find((s: any) => s.title === section.title);
    const realCount = originalSection ? originalSection.data.length : 0;

    return (
      <TouchableOpacity style={styles.header} onPress={() => toggleSection(section.title)} activeOpacity={0.7}>
        <View style={styles.headerTextContainer}>
          <HighlightedText text={formatName(section.title)} query={searchQuery} style={styles.headerTitle} />
          <Text style={styles.headerSubtitle}>{realCount} geluiden</Text>
        </View>
        <AnimatedChevron collapsed={!!isCollapsed} />
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
                <MaterialIcons name="arrow-back" size={28} color={Palette.icons} />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Zoek geluid..."
                placeholderTextColor={Palette.textPrimaryLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                cursorColor={Palette.white}
                selectionColor={Palette.white}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="close" size={24} color={Palette.icons} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <MaterialIcons name="menu" size={28} color={Palette.icons} />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.appTitle}>Malse Geluiden</Text>
                <Text style={styles.appSubtitle}>{getSubtitle()}</Text>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => setIsSearchVisible(true)}>
                  <MaterialIcons name="search" size={28} color={Palette.icons} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialIcons name="more-vert" size={28} color={Palette.icons} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <AnimatedSectionList
          sections={filteredAssets}
          keyExtractor={(item: any, index: number) => item.name + index}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          extraData={{ collapsedSections, searchQuery }}
          contentContainerStyle={styles.listContent}
          // @ts-ignore
          itemLayoutAnimation={LinearTransition.springify()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.black, // Using extra dark for the system bar area background if visible
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Palette.listChoiceNormalBgLight, // White background for the app content
  },
  mainHeader: {
    backgroundColor: Palette.colorPrimary, // Pinkish red from screenshot
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
    color: Palette.white,
  },
  appSubtitle: {
    fontSize: 14,
    color: Palette.textPrimaryLight,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: Palette.colorPrimaryDark, // Darker red for section headers
    paddingVertical: 12, // Increased padding for better touch target
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Palette.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Palette.textPrimaryLight,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Palette.listChoiceNormalBgLight,
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
    color: Palette.textPrimary,
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
    color: Palette.white,
    fontSize: 18,
    marginLeft: 15,
    marginRight: 15,
  },
});

