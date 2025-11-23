import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Palette } from '../constants/theme';

interface FlipPlayButtonProps {
    isPlaying: boolean;
    onPress: () => void;
}

export default function FlipPlayButton({ isPlaying, onPress }: FlipPlayButtonProps) {
    const rotation = useSharedValue(isPlaying ? 180 : 0);

    useEffect(() => {
        // Always animate to the target state defined by props
        rotation.value = withTiming(isPlaying ? 180 : 0, { duration: 300 });
    }, [isPlaying]);

    const handlePress = () => {
        onPress();
    };

    const frontStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${rotation.value}deg` }],
            opacity: rotation.value < 90 ? 1 : 0,
        };
    });

    const backStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateY: `${rotation.value - 180}deg` }],
            opacity: rotation.value >= 90 ? 1 : 0,
        };
    });

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.container}>
            <View style={styles.innerContainer}>
                {/* Front Face (Play) */}
                <Animated.View style={[styles.face, frontStyle]}>
                    <Ionicons name="play-circle" size={48} color={Palette.colorAccent} />
                </Animated.View>

                {/* Back Face (Stop) */}
                <Animated.View style={[styles.face, backStyle]}>
                    <Ionicons name="stop-circle" size={48} color={Palette.colorAccent} />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    face: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
    },
});
