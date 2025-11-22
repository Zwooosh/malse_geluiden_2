import CustomDrawerContent from '@/components/CustomDrawerContent';
import * as NavigationBar from 'expo-navigation-bar';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#000000');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: { width: 300 },
        }}
      >
        <Drawer.Screen name="index" />
        <Drawer.Screen name="modal" options={{
          drawerItemStyle: { display: 'none' }
        }} />
      </Drawer>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
