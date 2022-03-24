import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FAB from './../FAB';
import Modal from './Modal';

const Card = () => (
	<View
		style={{
			flexDirection: 'row',
			margin: 4,
			borderWidth: 1,
			borderColor: '#fff',
			elevation: 2,
			backgroundColor: '#222',
			justifyContent: 'space-around',
			alignItems: 'center',
			padding: 4,
			width: 200,
		}}>
		<Text style={{ color: 'red' }}>(XD)</Text>
		<FAB />
	</View>
);

const AccountModal = ({ visible, onDismiss, onSuccess, fillInputs }) => {
	const { colors } = useTheme();

	return (
		<Modal visible={visible} onDismiss={onDismiss}>
			<View style={styles.container}>
				<View style={[styles.right, { backgroundColor: colors.background }]} />
				<View style={[styles.left, { backgroundColor: colors.lightBackground }]} />
				<View style={styles.content}>
					<ScrollView>
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	left: {
		width: '50%',
	},
	right: {
		width: '50%',
	},
	content: {
		position: 'absolute',
		height: '90%',
	},
});

export default AccountModal;
