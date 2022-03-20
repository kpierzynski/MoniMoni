import { useTheme } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DialogAndroid from 'react-native-dialogs';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import useModal from './../Hooks/useModal';
import _store, { Actions } from './../store';
import { formatDate, isSameDay } from './../Tools/utils';
import RangeModal from './Modals/RangeModal';

const Header = () => {
	const [store, dispatch] = useContext(_store);

	const { colors } = useTheme();
	const { from, to } = store.currentRange;

	const alert = useModal();

	function handleRangePick() {
		alert(
			RangeModal,
			data => {
				dispatch({ type: Actions.ChangeRange, rangeType: data });
			},
			{ fillInputs: { from: formatDate(from * 1000), to: formatDate(to * 1000) } },
		);
	}

	function handleRangeDir(dir) {
		return () => {
			if (dir === 'right') dispatch({ type: Actions.IncrementRange });
			else dispatch({ type: Actions.DecrementRange });
		};
	}

	async function handleAccountChange() {
		const { action, selectedItem } = await DialogAndroid.showPicker('Select account', '', {
			neutralText: 'create',

			items: store.accounts.map(acc => {
				return { label: acc.name };
			}),
		});

		if (selectedItem) {
			dispatch({ type: Actions.ChangeAccount, name: selectedItem.label });
			return;
		}

		if (action === DialogAndroid.actionNeutral) {
			const { action, text } = await DialogAndroid.prompt('Create new account', 'Type new account name');
			if (action === DialogAndroid.actionPositive) {
				dispatch({ type: Actions.NewAccount, name: text.trim() });
			}
		}
	}

	const acc = store.accounts.find(acc => acc.name === store.currentAccount);

	const title =
		acc.categories.map(cat => cat.transactions.map(t => -t.amount).reduce((p, c) => p + c, 0)).reduce((p, c) => p + c, 0) +
		acc.incomeCategories.map(cat => cat.transactions.map(t => t.amount).reduce((p, c) => p + c, 0)).reduce((p, c) => p + c, 0);

	const [Left, Right] = ['left', 'right'].map(dir => () => (
		<Icon style={styles.nav.arrow} color={colors.textOnPrimary} size={32} name={`chevron-${dir}`} onPress={handleRangeDir(dir)} />
	));

	return (
		<View style={[styles.container, { backgroundColor: colors.primary }]}>
			<View style={styles.title.container}>
				<Text style={[styles.title.text, { color: colors.textOnPrimary }]}>{store.currentAccount}</Text>
				<Icon style={styles.title.down} name="chevron-down" size={24} color={colors.textOnPrimary} onPress={handleAccountChange} />
			</View>
			<Text style={{ color: colors.textOnPrimary }}>
				{title.toFixed(2)} {store.settings.currencySymbol}
			</Text>
			<View style={styles.nav.container}>
				<Left />
				<View style={styles.range.container}>
					<Icon style={styles.range.margin} name="calendar" size={24} color={colors.textOnPrimary} />
					<Text style={[styles.range.margin, { color: colors.textOnPrimary }]}>
						{isSameDay(from * 1000, to * 1000) ? formatDate(from * 1000) : `${formatDate(from * 1000)} - ${formatDate(to * 1000)}`}
					</Text>
					<Icon style={styles.range.margin} name="chevron-down" size={24} color={colors.textOnPrimary} onPress={handleRangePick} />
				</View>
				<Right />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
	},
	nav: {
		container: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			width: '100%',
			alignItems: 'center',
		},
		arrow: {
			margin: 10,
		},
	},
	title: {
		container: {
			marginTop: 12,
			flexDirection: 'row',
			alignItems: 'center',
		},
		text: {
			fontSize: 28,
		},
		down: {},
	},
	range: {
		container: {
			flexDirection: 'row',
		},
		margin: {
			margin: 5,
		},
	},
});

export default Header;
