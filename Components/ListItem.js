import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const ListItem = ({ children, onPress, onLongPress }) => {
	const { colors } = useTheme();
	return (
		<TouchableOpacity style={[styles.container, { borderColor: colors.secondaryBackground }]} onPress={onPress} onLongPress={onLongPress}>
			{children}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderRadius: 64,
	},
});

export default ListItem;
