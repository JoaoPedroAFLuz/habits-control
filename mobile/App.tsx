import './src/lib/dayjs';

import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

Notifications.getPermissionsAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  async function schedulePushNotification() {
    const schedule = await Notifications.getAllScheduledNotificationsAsync();

    if (schedule.length > 0) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    const trigger = new Date(Date.now());
    trigger.setSeconds(trigger.getSeconds() + 5);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Olá 😀',
        body: 'Você praticou seus hábitos hoje?',
      },
      trigger,
    });
  }

  useEffect(() => {
    schedulePushNotification();
  }, []);

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Routes />
    </>
  );
}
