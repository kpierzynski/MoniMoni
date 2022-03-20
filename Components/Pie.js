import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import PieChart from 'react-native-pie';

const defaultSection = [{ percentage: 100, color: '#444' }];

const Pie = ({ title, main, sub, sections, onPress }) => {
	const { width } = useWindowDimensions();
	const { colors } = useTheme();

	return (
		<Pressable style={styles.container} onPress={onPress}>
			<PieChart
				radius={width / 3.5}
				innerRadius={width / 4}
				dividerSize={4}
				backgroundColor="rgba(0,0,0,0)"
				sections={sections && sections.length > 0 ? sections : defaultSection}
			/>
			<View style={styles.content.container}>
				{title && <Text style={styles.content.text.title}>{title}</Text>}
				{main && <Text style={[styles.content.text.main, { color: colors.textOnBackground }]}>{main}</Text>}
				{sub && <Text style={[styles.content.text.sub, { color: colors.textOnBackground }]}>{sub}</Text>}
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
	},
	content: {
		container: {
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			top: 0,
			justifyContent: 'center',
			alignItems: 'center',
		},
		text: {
			main: {
				fontSize: 32,
			},
			sub: {
				fontSize: 22,
			},
			title: {
				fontSize: 16,
			},
		},
	},
});

export default Pie;
