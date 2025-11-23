import { MaterialIcons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import React, { memo } from 'react';
import { Alert, Animated as RNAnimated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Palette } from '../constants/theme';
import FlipPlayButton from './FlipPlayButton';

// Helper for highlighting text
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

const formatName = (name: string) => {
    const cleanName = name.replace(/_/g, ' ').replace(/\.(mp3|wav|m4a)$/, '');
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
};

interface SoundListItemProps {
    item: any;
    isPlaying: boolean;
    isFavorite: boolean;
    isFavoritesView: boolean;
    searchQuery: string;
    onPlay: (item: any) => void;
    onToggleFavorite: (name: string) => void;
}

const SoundListItem = memo(({ item, isPlaying, isFavorite, isFavoritesView, searchQuery, onPlay, onToggleFavorite }: SoundListItemProps) => {
    let swipeableRef: Swipeable | null = null;

    const renderLeftActions = (progress: any, dragX: any) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <View style={[styles.leftAction, isFavoritesView && { backgroundColor: Palette.deleteColor }]}>
                <RNAnimated.View style={{ transform: [{ scale }] }}>
                    <MaterialIcons name={isFavoritesView ? "delete" : "star"} size={30} color={Palette.white} />
                </RNAnimated.View>
            </View>
        );
    };

    const renderRightActions = (progress: any, dragX: any) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.rightAction}>
                <RNAnimated.View style={{ transform: [{ scale }] }}>
                    <MaterialIcons name="share" size={30} color={Palette.white} />
                </RNAnimated.View>
            </View>
        );
    };

    const handleSwipeOpen = async (direction: 'left' | 'right') => {
        swipeableRef?.close();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (direction === 'right') {
            try {
                if (!(await Sharing.isAvailableAsync())) {
                    alert("Sharing is not available on this device");
                    return;
                }
                const asset = Asset.fromModule(item.source);
                await asset.downloadAsync();

                await Sharing.shareAsync(asset.localUri || asset.uri || '', {
                    mimeType: 'audio/mpeg',
                    dialogTitle: `Share ${formatName(item.name)}`,
                });
            } catch (error) {
                console.error("Error sharing sound:", error);
                alert("Failed to share sound.");
            }
        } else {
            if (isFavoritesView) {
                Alert.alert(
                    "Verwijderen",
                    `Weet je zeker dat je "${formatName(item.name)}" uit je favorieten wilt verwijderen?`,
                    [
                        { text: "Annuleren", style: "cancel" },
                        { text: "Verwijderen", style: "destructive", onPress: () => onToggleFavorite(item.name) }
                    ]
                );
            } else {
                onToggleFavorite(item.name);
            }
        }
    };

    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Swipeable
                ref={(ref) => { swipeableRef = ref; }}
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                onSwipeableOpen={(direction) => {
                    handleSwipeOpen(direction === 'right' ? 'right' : 'left');
                }}
                overshootRight={false}
                overshootLeft={false}
            >
                <View style={styles.item}>
                    {isFavorite && !isFavoritesView && (
                        <View style={styles.favoriteMarker}>
                            <MaterialIcons name="star" size={10} color={Palette.white} style={styles.favoriteIcon} />
                        </View>
                    )}

                    <View style={styles.playIconContainer}>
                        <FlipPlayButton isPlaying={isPlaying} onPress={() => onPlay(item)} />
                    </View>
                    <View style={styles.itemTextContainer}>
                        <HighlightedText text={formatName(item.name)} query={searchQuery} style={styles.itemTitle} />
                        {isFavoritesView && item.episodeTitle && (
                            <Text style={styles.itemSubtitle}>{formatName(item.episodeTitle)}</Text>
                        )}
                    </View>
                    <TouchableOpacity style={styles.moreIcon}>
                        <MaterialIcons name="more-vert" size={24} color={Palette.colorAccent} />
                    </TouchableOpacity>
                </View>
            </Swipeable>
        </Animated.View>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.isPlaying === nextProps.isPlaying &&
        prevProps.isFavorite === nextProps.isFavorite &&
        prevProps.searchQuery === nextProps.searchQuery &&
        prevProps.item.name === nextProps.item.name &&
        prevProps.isFavoritesView === nextProps.isFavoritesView
        // onPlay and onToggleFavorite are assumed stable or ignored if they change but other props don't
        // But strictly, if onPlay changes, we should re-render. We will ensure onPlay is stable.
    );
});

export default SoundListItem;

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: Palette.listChoiceNormalBgLight,
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
    itemSubtitle: {
        fontSize: 12,
        color: Palette.textSecondary,
        marginTop: 2,
    },
    moreIcon: {
        padding: 5,
    },
    rightAction: {
        backgroundColor: Palette.shareColor,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        flex: 1,
    },
    leftAction: {
        backgroundColor: Palette.favoriteColor,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        flex: 1,
    },
    favoriteMarker: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 24,
        borderTopWidth: 24,
        borderRightColor: 'transparent',
        borderTopColor: Palette.favoriteColor,
        zIndex: 10,
    },
    favoriteIcon: {
        position: 'absolute',
        top: -22,
        left: 2,
    }
});
