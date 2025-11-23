import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGlobalSearchParams } from 'expo-router';
import { Palette } from '../constants/theme';

export default function CustomDrawerContent(props: any) {
    const insets = useSafeAreaInsets();
    const { category } = useGlobalSearchParams<{ category: string }>();

    // Default to 'all' if no category is present
    const currentCategory = category || 'all';

    return (
        <View style={{ flex: 1, backgroundColor: Palette.black }}>
            <View style={{ flex: 1, backgroundColor: Palette.white, marginBottom: insets.bottom }}>
                {/* Custom Header */}
                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    <View style={styles.logoContainer}>
                        {/* Placeholder for logo if needed, or just text */}
                        <View style={styles.logoBox}>
                            <Text style={styles.logoText}>MALSE</Text>
                            <Text style={styles.logoText}>GELUIDEN</Text>
                        </View>
                    </View>
                    <Text style={styles.headerTitle}>Malse Geluiden</Text>
                    <Text style={styles.headerSubtitle}>Fijne geluiden voor je oorschelp</Text>
                </View>

                <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                    <DrawerItem
                        label="Favorieten"
                        icon={({ color, size }) => <MaterialIcons name="star" size={size} color={Palette.textSecondary} />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />

                    <View style={currentCategory === 'all' ? styles.selectedItem : null}>
                        <DrawerItem
                            label="Alle Geluiden"
                            icon={({ color, size }) => <MaterialIcons name="library-music" size={size} color={currentCategory === 'all' ? Palette.colorPrimary : Palette.textSecondary} />}
                            onPress={() => props.navigation.navigate('index', { category: 'all' })}
                            labelStyle={[styles.label, currentCategory === 'all' && { color: Palette.colorPrimary }]}
                        />
                    </View>

                    <View style={currentCategory === 'kud' ? styles.selectedItem : null}>
                        <DrawerItem
                            label="Kud"
                            icon={({ color, size }) => <MaterialIcons name="library-music" size={size} color={currentCategory === 'kud' ? Palette.colorPrimary : Palette.textSecondary} />}
                            onPress={() => props.navigation.navigate('index', { category: 'kud' })}
                            labelStyle={[styles.label, currentCategory === 'kud' && { color: Palette.colorPrimary }]}
                        />
                    </View>

                    <View style={currentCategory === 'lekker_spelen' ? styles.selectedItem : null}>
                        <DrawerItem
                            label="Lekker Spelen"
                            icon={({ color, size }) => <MaterialIcons name="library-music" size={size} color={currentCategory === 'lekker_spelen' ? Palette.colorPrimary : Palette.textSecondary} />}
                            onPress={() => props.navigation.navigate('index', { category: 'lekker_spelen' })}
                            labelStyle={[styles.label, currentCategory === 'lekker_spelen' && { color: Palette.colorPrimary }]}
                        />
                    </View>

                    <View style={styles.divider} />

                    <DrawerItem
                        label="Geluid aanvragen"
                        icon={({ color, size }) => <MaterialIcons name="record-voice-over" size={size} color={Palette.textSecondary} />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />
                    <DrawerItem
                        label="Changelog"
                        icon={({ color, size }) => <FontAwesome5 name="clipboard-list" size={size} color={Palette.textSecondary} />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />
                    <DrawerItem
                        label="Veelgestelde vragen"
                        icon={({ color, size }) => <FontAwesome5 name="question-circle" size={size} color={Palette.textSecondary} />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />
                    <DrawerItem
                        label="Info"
                        icon={({ color, size }) => <MaterialIcons name="info" size={size} color={Palette.textSecondary} />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />
                </DrawerContentScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Palette.colorPrimaryDark, // Dark red
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    logoContainer: {
        marginBottom: 15,
    },
    logoBox: {
        borderWidth: 2,
        borderColor: Palette.white,
        padding: 5,
        alignSelf: 'flex-start',
        borderRadius: 4,
    },
    logoText: {
        color: Palette.white,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 10,
    },
    headerTitle: {
        color: Palette.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: Palette.textPrimaryLight,
        fontSize: 14,
        marginTop: 5,
    },
    label: {
        fontSize: 16,
        color: Palette.textPrimary,
        marginLeft: -10,
    },
    selectedItem: {
        backgroundColor: Palette.listChoicePressedBgLight, // Light pink selection background
    },
    divider: {
        height: 1,
        backgroundColor: Palette.divider,
        marginVertical: 10,
    },
});
