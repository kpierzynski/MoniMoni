import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListItem from './ListItem';

const AccountIcon = ({ account }) => {
	const { colors } = useTheme();

	const { total: amount = 0, name, count = 0 } = account;
	const positive = amount >= 0;

	const note = `${count} transactions`;

	return (
		<ListItem>
			<View style={styles.content}>
				<View>
					<Text style={[styles.info.name, { color: colors.textOnBackground }]}>{name}</Text>
					<Text
						style={[
							styles.info.note,
							note ? { color: colors.textOnBackground } : { color: colors.subTextOnBackground, fontStyle: 'italic' },
						]}>
						{note}
					</Text>
				</View>

				<Text style={[styles.amount, { color: positive ? colors.success : colors.fail }]}>
					{!positive && '-'}
					{amount.toFixed(2)} {'$'}
				</Text>
			</View>
		</ListItem>
	);
};

const styles = StyleSheet.create({
	content: {
		padding: 5,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	amount: {
		fontSize: 22,
	},
	info: {
		name: {
			fontSize: 16,
		},
		note: {
			fontSize: 12,
		},
	},
});

export default AccountIcon;
