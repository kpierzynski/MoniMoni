import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const Button = ({ text, onPress, disabled, danger = false, icon = null }) => {
	const { colors } = useTheme();

	return (
		<TouchableOpacity
			style={[styles.container, { backgroundColor: !disabled ? (danger ? colors.fail : colors.primary) : colors.secondaryBackground }]}
			onPress={onPress}>
			{icon && <Icon name={icon} color={colors.textOnPrimary} size={22} style={{ paddingHorizontal: 4 }} />}
			<Text style={{ color: !disabled ? colors.textOnPrimary : colors.subTextOnBackground, fontWeight: 'bold' }}>{text.toUpperCase()}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 2,
		padding: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default Button;
