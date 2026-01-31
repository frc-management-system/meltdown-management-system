import React from 'react';
import { Teleop } from './src/components/screens/Teleop';
import { Prematch } from './src/components/screens/Prematch';
import { EndgameOne } from './src/components/screens/EndgameOne';
import { EndgameTwo } from './src/components/screens/EndgameTwo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ERobotState, TRootStackParamList } from './types';
import { AssignmentProvider } from './src/contexts/AssignmentContext';
import { Startup } from './src/components/screens/Startup';
import { QRCapture } from './src/components/screens/QRCapture';
import { QRShow } from './src/components/screens/QRShow';
import { MatchLogs } from './src/components/screens/MatchLogs';
import { StatusBar } from 'expo-status-bar';
import { LogProvider } from './src/contexts/LogContext';
import { TimerProvider } from './src/contexts/TimerContext';
import { EditAssignment } from './src/components/screens/EditAssignment';

const NavStack = createNativeStackNavigator<TRootStackParamList>();

function App() {
  return (
    <>
      <TimerProvider>
        <StatusBar hidden={true} />
        <AssignmentProvider>
          <LogProvider>
            <NavigationContainer>
              <NavStack.Navigator initialRouteName="Startup" screenOptions={{ headerShown: false }}>
                <NavStack.Screen
                  name="Startup"
                  component={Startup}
                  options={{ headerShown: false }}
                />
                <NavStack.Screen
                  name="MatchLogs"
                  component={MatchLogs}
                  options={{ headerShown: false }}
                />
                <NavStack.Screen
                  name="QRCapture"
                  component={QRCapture}
                  options={{ headerShown: false }}
                />
                <NavStack.Screen
                  name="Prematch"
                  component={Prematch}
                  options={{ headerShown: false }}
                />
                <NavStack.Screen
                  name="Teleop"
                  component={Teleop}
                  options={{ headerShown: false }}
                />
                <NavStack.Screen
                  name="EndgameOne"
                  component={EndgameOne}
                  options={{ headerShown: false }}
                />
                <NavStack.Screen
                  name="EndgameTwo"
                  component={EndgameTwo}
                  options={{ headerShown: false }}
                />
                <NavStack.Screen
                  name="QRShow"
                  component={QRShow}
                  options={{ headerShown: false }}
                />
                <NavStack.Screen
                  name="EditAssignment"
                  component={EditAssignment}
                  options={{ headerShown: false }}
                />
              </NavStack.Navigator>
            </NavigationContainer>
          </LogProvider>
        </AssignmentProvider>
      </TimerProvider>
    </>
  );
}

export default App;
