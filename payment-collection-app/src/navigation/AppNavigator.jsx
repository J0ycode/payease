import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import LoanDetailScreen from '../screens/LoanDetailScreen';
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';
import SuccessScreen from '../screens/SuccessScreen';
import LoanCalculatorScreen from '../screens/LoanCalculatorScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        {/* Home — account number search */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Loan Calculator */}
        <Stack.Screen name="LoanCalculator" component={LoanCalculatorScreen} />

        {/* Loan detail + payment form */}
        <Stack.Screen name="LoanDetail" component={LoanDetailScreen} />

        {/* Payment history */}
        <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />

        {/* Success confirmation */}
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
