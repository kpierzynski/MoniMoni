import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import useModal from './../Hooks/useModal';
import CategoryIcon from './CategoryIcon';
import TransactionModal from './Modals/TransactionModal';
import VerticalList from './VerticalList';

const CategoryList = ({ categories, onNewTransaction, onRemoveCategory, animated, style = {} }) => {
	const alert = useModal();

	function handleNewTransaction(category) {
		if (!onNewTransaction) return;

		alert(TransactionModal, data => {
			onNewTransaction(category, data);
		});
	}

	function handleRemoveCategory(category) {
		if (!onRemoveCategory) return;

		onRemoveCategory(category);
	}

	categories.forEach(
		category => (category.total = category.transactions.map(transaction => transaction.amount).reduce((p, c, i, a) => p + c, 0)),
	);

	const Wrapper = animated ? Animated.View : View;

	return (
		<Wrapper style={[styles.container, style]}>
			<VerticalList>
				{categories.map((category, i) => (
					<CategoryIcon
						key={'CategoryIcon' + i}
						category={category}
						onPress={() => handleNewTransaction(category)}
						onLongPress={() => handleRemoveCategory(category)}
					/>
				))}
			</VerticalList>
		</Wrapper>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		right: 0,
		top: 0,
		bottom: 0,
	},
});

export default CategoryList;
