import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MatIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Button from './../Primitives/Button';
import Modal from './Modal';

const RangeModal = ({ visible, onDismiss, onSuccess, fillInputs }) => {
	const { colors } = useTheme();
	const { from, to } = fillInputs;

	function handlePick(range) {
		if (!onSuccess) return;

		onSuccess(range);
		onDismiss();
	}

	return (
		<Modal visible={visible} onDismiss={onDismiss}>
			<View style={styles.container}>
				<View style={[styles.left, { backgroundColor: colors.secondaryBackground }]}>
					<Text style={{ fontSize: 16, color: colors.textOnBackground }}>{from}</Text>
					<MatIcon style={{ margin: 8 }} name={'arrow-up-down-bold-outline'} size={24} color={colors.textOnBackground} />
					<Text style={{ fontSize: 16, color: colors.textOnBackground }}>{to}</Text>
				</View>
				<View style={[styles.right, { backgroundColor: colors.lightBackground }]}>
					{['day', 'week', 'month', 'year'].map((range, i) => (
						<View key={'button' + range + i} style={styles.button}>
							<Button style={{ color: 'red' }} text={range} onPress={() => handlePick(range)} color={colors.primary} />
						</View>
					))}
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
	},
	left: {
		width: '50%',
		flex: 1,
		alignItems: 'center',
		paddingTop: 16,
	},
	right: {
		width: '50%',
		flex: 1,
	},
	button: {
		margin: 16,
	},
});

export default RangeModal;
