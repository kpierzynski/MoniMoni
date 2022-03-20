import { useTheme } from '@react-navigation/native';
import React, { Fragment, useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DialogAndroid from 'react-native-dialogs';
import _store, { Actions } from './../../store';
import { getDateString } from './../../Tools/utils';
import TransactionIcon from './../TransactionIcon';

const Transactions = ({ navigation }) => {
	const { colors } = useTheme();
	const [store, dispatch] = useContext(_store);

	async function handleTransactionRemove(transaction) {
		const { action } = await DialogAndroid.alert('Remove', `Remove transaction permanently?`, {
			negativeText: 'cancel',
		});
		if (action === DialogAndroid.actionPositive) {
			dispatch({ type: Actions.RemoveTransaction, transaction });
		}
	}

	const account = store.accounts.find(acc => acc.name === store.currentAccount);

	const res = ['categories', 'incomeCategories']
		.map(key => {
			return account[key].map(category => {
				return category.transactions.map(transaction => {
					const { transactions, ...categoryInfo } = category;
					return {
						...transaction,
						income: key === 'incomeCategories',
						category: categoryInfo,
					};
				});
			});
		})
		.reduce((a, b) => a.concat(b), [])
		.reduce((a, b) => a.concat(b), []);

	const groups = res
		.sort((a, b) => {
			if (a.date < b.date) return 1;
			if (a.date > b.date) return -1;
			return 0;
		})
		.reduce((result, current) => {
			const date = getDateString(current['date']);
			if (!result[date]) result[date] = [];

			result[date].push(current);
			return result;
		}, {});

	return (
		<View style={styles.container}>
			<ScrollView style={styles.content}>
				{Object.keys(groups).length > 0 ? (
					Object.entries(groups).map(([key, value], i) => (
						<Fragment key={key + i}>
							<Text style={[styles.groupTitle, { color: colors.subTextOnBackground }]}>{key}</Text>
							{value.map((transaction, i) => (
								<TransactionIcon
									onLongPress={() => handleTransactionRemove(transaction)}
									key={'transactionIcon' + i}
									transaction={transaction}
								/>
							))}
						</Fragment>
					))
				) : (
					<>
						<Text style={[styles.text, { margin: 16, fontSize: 22, color: colors.subTextOnBackground }]}>Empty</Text>
						<Text style={[styles.text, { alignSelf: 'center', margin: 8, color: colors.subTextOnBackground }]}>
							Go to{' '}
							<Text onPress={() => navigation.navigate('Home')} style={{ color: '#08f', textDecorationLine: 'underline' }}>
								Home
							</Text>{' '}
							and create new transactions!
						</Text>
					</>
				)}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 8,
	},
	groupTitle: {
		fontSize: 16,
		margin: 8,
	},
	text: {
		alignSelf: 'center',
	},
});

export default Transactions;
