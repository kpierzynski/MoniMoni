import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Header from './Components/Header';
import AlertProvider from './Components/Modals/AlertProvider';
import Home from './Components/Screens/Home';
import Settings from './Components/Screens/Settings';
import Transactions from './Components/Screens/Transactions';
import { StoreProvider } from './store';

const Tab = createBottomTabNavigator();

const screens = [
	{
		name: 'Home',
		component: Home,
		icon: 'home-variant',
	},
	{
		name: 'Transactions',
		component: Transactions,
		icon: 'view-list',
	},
	{
		name: 'Settings',
		component: Settings,
		icon: 'settings-helper',
	},
];

const appDarkTheme = {
	dark: true,
	colors: {
		primary: '#f9801d',
		textOnPrimary: '#fff',

		background: '#222',
		textOnBackground: '#fff',
		secondaryBackground: '#444',
		lightBackground: '#fff',
		textOnLightBackground: '#000',
		subTextOnBackground: '#bbb',

		success: 'green',
		fail: 'red',
	},
};

const appLightTheme = {
	dark: true,
	colors: {
		primary: '#f9801d',
		textOnPrimary: '#fff',

		background: '#eee',
		textOnBackground: '#000',
		secondaryBackground: '#ddd',
		lightBackground: '#fff',
		textOnLightBackground: '#000',
		subTextOnBackground: '#999',

		success: 'green',
		fail: 'red',
	},
};

const App = () => {
	const schemeType = useColorScheme();
	const theme = schemeType === 'dark' ? appDarkTheme : appLightTheme;

	return (
		<StoreProvider>
			<NavigationContainer theme={theme}>
				<AlertProvider>
					<Tab.Navigator
						screenOptions={{
							header: props => <Header {...props} />,
							tabBarActiveTintColor: theme.colors.primary,
							tabBarInactiveTintColor: theme.colors.textOnBackground,

							tabBarStyle: {
								paddingBottom: 4,
								backgroundColor: theme.colors.secondaryBackground,
							},
						}}>
						{screens.map(({ name, component, icon }, i) => (
							<Tab.Screen
								key={'Screens' + i}
								name={name}
								component={component}
								options={{
									tabBarIcon: ({ color, size }) => <Icon name={icon} color={color} size={size} />,
								}}
							/>
						))}
					</Tab.Navigator>
				</AlertProvider>
			</NavigationContainer>
		</StoreProvider>
	);
};

const styles = StyleSheet.create({});

export default App;
