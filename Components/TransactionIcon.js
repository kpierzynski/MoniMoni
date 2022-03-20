import { useTheme } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import useModal from './../Hooks/useModal';
import _store, { Actions } from './../store';
import TransactionModal from './Modals/TransactionModal';

const TransactionIcon = ({ transaction, onLongPress }) => {
	const { colors } = useTheme();
	const [store, dispatch] = useContext(_store);

	const alert = useModal();

	const { category, note, date, amount, id, income } = transaction;
	const { name, icon, color } = category;

	function handleEditTransaction() {
		alert(
			TransactionModal,
			data => {
				dispatch({
					type: Actions.EditTransaction,
					category,
					transaction: data,
					isIncome: income,
				});
			},
			{ fillInputs: transaction },
		);
	}

	return (
		<TouchableOpacity
			style={[styles.container, { borderColor: colors.secondaryBackground }]}
			onPress={handleEditTransaction}
			onLongPress={onLongPress}>
			<Icon style={styles.icon} name={icon} color={color} size={34} />

			<View style={styles.content}>
				<View>
					<Text style={[styles.info.name, { color: colors.textOnBackground }]}>{name}</Text>
					<Text
						style={[
							styles.info.note,
							note ? { color: colors.textOnBackground } : { color: colors.subTextOnBackground, fontStyle: 'italic' },
						]}>
						{note ? note : 'Empty note'}
					</Text>
				</View>
				<Text style={[styles.amount, { color: income ? colors.success : colors.fail }]}>
					{!income && '-'}
					{amount.toFixed(2)} {store.settings.currencySymbol}
				</Text>
			</View>
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
	content: {
		padding: 5,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	info: {
		name: {
			fontSize: 16,
		},
		note: {
			fontSize: 12,
		},
	},
	icon: {
		marginRight: 8,
	},
	amount: {
		fontSize: 22,
	},
});

export default TransactionIcon;
