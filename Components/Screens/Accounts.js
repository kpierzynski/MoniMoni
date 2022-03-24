import { useTheme } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import AccountIcon from '../AccountIcon';
import _store, { Actions } from './../../store';

const Accounts = ({ navigation }) => {
	const { colors } = useTheme();
	const [store, dispatch] = useContext(_store);

	function handleChangeAccount(name) {
		dispatch({ type: Actions.ChangeAccount, name });
		navigation.navigate('Home');
	}

	return (
		<View style={stylesA.container}>
			{store.accounts.map((account, i) => {
				const count =
					account.categories.map(cat => cat.transactions.length).reduce((a, b) => a + b, 0) +
					account.incomeCategories.map(cat => cat.transactions.length).reduce((a, b) => a + b, 0);
				return <AccountIcon onPress={() => handleChangeAccount(account.name)} key={'AccountIcon' + i} account={{ ...account, count }} />;
			})}
		</View>
	);
};

const stylesA = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
	},
});

export default Accounts;
