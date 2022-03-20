import { useTheme } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import DialogAndroid from 'react-native-dialogs';
import { useAnimation } from './../../Hooks/useAnimation';
import useModal from './../../Hooks/useModal';
import _store, { Actions } from './../../store';
import CategoryList from './../CategoryList';
import FAB from './../FAB';
import CategoryModal from './../Modals/CategoryModal';
import Pie from './../Pie';

const Home = () => {
	const { colors } = useTheme();
	const alert = useModal();

	const [income, setIncome] = useState(false);

	const duration = 500;
	const [animation, callAnimation] = useAnimation(400, Easing.sin);

	const [store, dispatch] = useContext(_store);
	const { from, to } = store.currentRange;

	let categories = store.accounts.find(acc => acc.name === store.currentAccount)[income ? 'incomeCategories' : 'categories'];

	categories = categories.map(category => {
		return {
			...category,
			transactions: category.transactions.filter(transaction => {
				return transaction.date / 1000 >= from && transaction.date / 1000 <= to;
			}),
		};
	});

	categories = categories.map(category => {
		return {
			...category,
			total: category.transactions.map(transaction => transaction.amount).reduce((p, c, i, a) => p + c, 0),
		};
	});

	const sum = categories.map(category => category.total).reduce((p, c, i, a) => p + c, 0);

	const sections = categories
		.filter(category => category.total)
		.map(category => {
			return {
				percentage: (100 * category.total) / sum,
				color: category.color,
			};
		});

	function handleFAB() {
		alert(CategoryModal, data => {
			dispatch({
				type: Actions.AddCategory,
				category: data,
				isIncome: income,
			});
		});
	}

	async function handleRemoveCategory(category) {
		const { action } = await DialogAndroid.alert('Remove', `Remove category permanently? All transactions will be lost forever!`, {
			negativeText: 'cancel',
			neutralText: 'edit',
		});
		if (action === DialogAndroid.actionPositive) {
			dispatch({ type: Actions.RemoveCategory, category, isIncome: income });
		} else if (action === DialogAndroid.actionNeutral) {
			alert(
				CategoryModal,
				data => {
					dispatch({ type: Actions.EditCategory, category: data, isIncome: income });
				},
				{ fillInputs: category },
			);
		}
	}

	function handleTransaction(category, newTransaction) {
		dispatch({
			type: Actions.AddTransaction,
			category,
			transaction: newTransaction,
			isIncome: income,
		});
	}

	function handleCategorySwitch() {
		setTimeout(() => setIncome(!income), duration / 2);
		callAnimation();
	}

	const pieRoll = animation.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: ['0deg', '90deg', '0deg'],
	});

	const listSwipe = animation.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0, 100, 0],
	});

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.container, { transform: [{ rotateY: pieRoll }] }]}>
				<Pie
					sections={sections}
					main={`${(income ? sum : -sum).toFixed(2)} ${store.settings.currencySymbol}`}
					onPress={handleCategorySwitch}
					title={income ? <Text style={{ color: colors.success }}>Income</Text> : <Text style={{ color: colors.fail }}>Outcome</Text>}
				/>
			</Animated.View>

			<CategoryList
				animated
				style={{ transform: [{ translateX: listSwipe }] }}
				onNewTransaction={handleTransaction}
				onRemoveCategory={handleRemoveCategory}
				categories={categories}
			/>

			<FAB style={styles.fab} onPress={handleFAB} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	fab: {
		position: 'absolute',
		left: '50%',
		right: '50%',
		bottom: '15%',
	},
});

export default Home;
