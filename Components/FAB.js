import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { useAnimation } from './../Hooks/useAnimation';

const FAB = ({ icon = 'plus', size = 24, style = {}, onPress }) => {
	const { colors } = useTheme();
	const [animation, callAnimation] = useAnimation(500, Easing.quad);

	function handlePress() {
		if (onPress) onPress();
	}

	const sca = animation.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [1, 1.5, 2],
	});

	const opa = animation.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0.5, 0.25, 0],
	});

	return (
		<View
			style={[
				{
					height: size * 1.75,
					aspectRatio: 1,
				},
				style,
			]}>
			<Animated.View
				style={[
					styles.common,
					{
						height: size * 1.8,
						backgroundColor: colors.primary,
						opacity: opa,
						transform: [{ scale: sca }],
					},
				]}></Animated.View>
			<Icon
				style={[styles.common, styles.fab, { height: size * 1.75, backgroundColor: colors.primary }]}
				onPress={handlePress}
				onPressIn={() => callAnimation()}
				name={icon}
				color={colors.textOnPrimary}
				size={size}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	common: {
		position: 'absolute',
		alignSelf: 'center',
		borderRadius: 56,
		aspectRatio: 1,
	},
	fab: {
		elevation: 8,
		textAlign: 'center',
		textAlignVertical: 'center',
	},
});
export default FAB;
