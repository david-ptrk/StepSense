import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {
  isStepCountingSupported,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from '@dongminyu/react-native-step-counter';

export default function App() {
  const [steps, setSteps] = useState<number>(0);
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    requestPermissionAndStart();
    return () => {
      stopStepCounterUpdate();
    };
  }, []);

  const requestPermissionAndStart = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission denied');
        return;
      }
    }

    const ok = await isStepCountingSupported();
    setSupported(ok);

    if (ok) {
      startStepCounterUpdate(new Date(), (data: any) => {
        console.log('Step data:', JSON.stringify(data));
        if (data && typeof data.numberOfSteps === 'number') {
          setSteps(data.numberOfSteps);
        } else if (data && typeof data.steps === 'number') {
          setSteps(data.steps);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StepSense</Text>
      <Text style={styles.steps}>{steps}</Text>
      <Text style={styles.label}>steps today</Text>
      {supported === false && (
        <Text style={styles.error}>Step counter not supported on this device</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginBottom: 40,
  },
  steps: {
    fontSize: 96,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  label: {
    fontSize: 18,
    color: '#94a3b8',
    marginTop: 8,
  },
  error: {
    color: '#f87171',
    marginTop: 20,
  },
});