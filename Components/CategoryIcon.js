import { useTheme } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import _store from './../store';

const CategoryIcon = ({ category, onPress, onLongPress }) => {
	const { colors } = useTheme();
	const [store, _] = useContext(_store);

	const { name, icon, color, total } = category;

	return (
		<Pressable onPress={onPress} onLongPress={onLongPress} style={styles.container}>
			<Text style={{ color: colors.textOnBackground }}>{name}</Text>

			<TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
				<Icon style={[styles.icon, { backgroundColor: color, color: colors.textOnPrimary }]} name={icon} color={color} size={24} />
			</TouchableOpacity>
			<Text style={{ color: colors.textOnBackground }}>
				{total.toFixed(2)} {store.settings.currencySymbol}
			</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},
	icon: {
		marginVertical: 6,
		borderRadius: 32,
		padding: 14,
	},
});

export default CategoryIcon;
