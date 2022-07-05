import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Theme from './src/core/theme';

//Screens
import LoginScreen from './src/screens/login';
import HomeScreen from './src/screens/home';
import CameraScreen from './src/screens/camera';
import ProductScreen from './src/screens/product';
import SettingScreen from './src/screens/setting';

const Stack = createStackNavigator();
function App() {
  return (
    <PaperProvider theme={Theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerStyle: { backgroundColor: Theme.colors.primary }, headerTintColor: '#fff' }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerLeft: null, headerTitleAlign: 'center', headerTitle: 'Barkod Okuyucu' }} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerTitleAlign: 'center', headerTitle: 'Barkod Oku' }} />
          <Stack.Screen name="ProductScreen" component={ProductScreen}  options={{ headerTitleAlign: 'center', headerTitle: 'Ürün Ara' }}  />
          <Stack.Screen name="SettingScreen" component={SettingScreen}  options={{ headerTitleAlign: 'center', headerTitle: 'Ayarlar' }}  />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

export default App;