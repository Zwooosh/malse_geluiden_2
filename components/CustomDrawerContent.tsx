import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomDrawerContent(props: any) {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <View style={{ flex: 1, backgroundColor: '#fff', marginBottom: insets.bottom }}>
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
                        icon={({ color, size }) => <MaterialIcons name="star" size={size} color="#757575" />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />
                    <View style={styles.selectedItem}>
                        <DrawerItem
                            label="Alle Geluiden"
                            icon={({ color, size }) => <MaterialIcons name="library-music" size={size} color="#E91E63" />}
                            onPress={() => { }}
                            labelStyle={[styles.label, { color: '#E91E63' }]}
                        />
                    </View>
                    <DrawerItem
                        label="Kud"
                        icon={({ color, size }) => <MaterialIcons name="library-music" size={size} color="#757575" />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />
                    <DrawerItem
                        label="Lekker Spelen"
                        icon={({ color, size }) => <MaterialIcons name="library-music" size={size} color="#757575" />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />

                    <View style={styles.divider} />

                    <DrawerItem
                        label="Geluid aanvragen"
                        icon={({ color, size }) => <MaterialIcons name="record-voice-over" size={size} color="#757575" />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />
                    <DrawerItem
                        label="Changelog"
                        icon={({ color, size }) => <FontAwesome5 name="clipboard-list" size={size} color="#757575" />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />
                    <DrawerItem
                        label="Veelgestelde vragen"
                        icon={({ color, size }) => <FontAwesome5 name="question-circle" size={size} color="#757575" />}
                        onPress={() => { }}
                        labelStyle={styles.label}
                    />
                    <DrawerItem
                        label="Info"
                        icon={({ color, size }) => <MaterialIcons name="info" size={size} color="#757575" />}
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
        backgroundColor: '#B71C1C', // Dark red
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    logoContainer: {
        marginBottom: 15,
    },
    logoBox: {
        borderWidth: 2,
        borderColor: '#fff',
        padding: 5,
        alignSelf: 'flex-start',
        borderRadius: 4,
    },
    logoText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginTop: 5,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginLeft: -10,
    },
    selectedItem: {
        backgroundColor: '#FCE4EC', // Light pink selection background
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
    },
});
