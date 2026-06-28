import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  isStepCountingSupported,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from '@dongminyu/react-native-step-counter';

const DAILY_GOAL = 10000;

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
  
  const progress = Math.min(steps / DAILY_GOAL, 1);
  const percentage = Math.round(progress * 100);
  const remaining = Math.max(DAILY_GOAL - steps, 0);
  const goalReached = steps >= DAILY_GOAL;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StepSense</Text>
      
      {/* Step Count */}
      <Text style={styles.steps}>{steps.toLocaleString()}</Text>
      <Text style={styles.label}>steps today</Text>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, {width: `${percentage}%`}]} />
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      
      {/* Goal Info */}
      {goalReached ? (
        <Text style={styles.goalReached}>Daily goal reached</Text>
      ) : (
        <Text style={styles.remaining}>
          {remaining.toLocaleString()} steps to goal
        </Text>
      )}
      
      <Text style={styles.goal}>Goal: {DAILY_GOAL.toLocaleString()} steps</Text>
      
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
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginBottom: 40,
  },
  steps: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  label: {
    fontSize: 18,
    color: '#94a3b8',
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
  },
  progressBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
    borderRadius: 6,
  },
  percentage: {
    color: '#38bdf8',
    marginTop: 8,
    fontSize: 14,
  },
  remaining: {
    color: '#94a3b8',
    marginTop: 24,
    fontSize: 16,
  },
  goalReached: {
    color: '#4ade80',
    marginTop: 24,
    fontSize: 18,
    fontWeight: 'bold',
  },
  goal: {
    color: '#475569',
    marginTop: 8,
    fontSize: 14,
  },
  error: {
    color: '#f87171',
    marginTop: 20,
  },
});