import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, useWindowDimensions, Vibration, View } from 'react-native';
import DialogAndroid from 'react-native-dialogs';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import _store from './../../store';
import FAB from './../FAB';
import Modal from './Modal';

function evalString(str) {
	try {
		const evaluation = eval(str);
		if (!Number.isFinite(evaluation)) throw 'Result is infinite!';
		return evaluation.toFixed(2).toString();
	} catch (err) {
		throw 'Result is invalid';
	}
}

const TransactionModal = ({ visible, onDismiss, onSuccess, fillInputs }) => {
	const { colors } = useTheme();
	const [store, dispatch] = useContext(_store);

	const { width } = useWindowDimensions();

	useEffect(() => {
		if (!fillInputs) return;
		const { amount, note, date } = fillInputs;

		setAmount(amount.toString());
		setDate(date);
		setNote(note);
	}, [fillInputs]);

	const digits = [
		'plus',
		'minus',
		'multiplication',
		'division',
		7,
		8,
		9,
		4,
		5,
		6,
		1,
		2,
		3,
		0,
		'decimal-comma',
		'keyboard-backspace',
		'equal',
	];

	const [amount, setAmount] = useState('0');
	const [date, setDate] = useState(new Date().getTime());
	const [note, setNote] = useState('');

	function handleDigitPress(item) {
		Vibration.vibrate(25);

		if (item === 'equal') {
			try {
				setAmount(evalString(amount));
			} catch (err) {
				ToastAndroid.show('Invalid equation to evaluate!', ToastAndroid.SHORT);
			}

			return;
		}

		if (['plus', 'minus', 'multiplication', 'division'].indexOf(item) >= 0) {
			const conv = { plus: '+', minus: '-', multiplication: '*', division: '/' };
			if (['+', '-', '*', '/'].includes(amount[amount.length - 1])) {
				setAmount(amount.slice(0, -1) + conv[item]);
				return;
			}
			setAmount(amount + conv[item]);
			return;
		}

		if (Number.isInteger(item)) {
			if (amount === '0') setAmount(item.toString());
			else {
				if (amount.indexOf('.') >= 1 && amount.split('.').pop().length == 2) return;
				else setAmount(amount + item.toString());
			}
		}

		if (item === 'keyboard-backspace' && amount.length > 1) setAmount(amount.slice(0, -1));

		if (item === 'keyboard-backspace' && amount.length === 1 && amount !== '0') setAmount('0');

		if (item === 'decimal-comma') setAmount(amount + '.');
	}

	async function handleAction(button) {
		switch (button) {
			case 'calendar':
				DateTimePickerAndroid.open({
					value: new Date(date),
					onChange: (_, selectedDate) => {
						setDate(selectedDate.getTime());
					},
				});
				break;

			case 'notebook':
				const { action, text } = await DialogAndroid.prompt('Note', 'Type note for new transaction', { defaultValue: note });
				if (action === DialogAndroid.actionPositive) {
					setNote(text);
				}
				break;

			case 'check':
				if (!onSuccess || !onDismiss) break;

				try {
					const ev = evalString(amount);
					setAmount(ev);
					onSuccess({ date, note, amount: +ev, ...(fillInputs && { id: fillInputs.id, income: fillInputs.income }) });
					clearInputs();
					onDismiss();
				} catch (err) {
					ToastAndroid.show('Invalid equation to evaluate!', ToastAndroid.SHORT);
				}

				break;
		}
	}

	function handleDismiss() {
		if (!onDismiss) return;
		clearInputs();
		onDismiss();
	}

	function clearInputs() {
		setAmount('0');
		setDate(new Date().getTime());
		setNote('');
	}

	const Digit = ({ item, size }) => (
		<TouchableOpacity onPress={() => handleDigitPress(item)}>
			<Icon
				style={{ padding: 0 }}
				name={Number.isInteger(item) ? `numeric-${item}` : item}
				color={colors.textOnLightBackground}
				size={size}
			/>
		</TouchableOpacity>
	);

	return (
		<Modal visible={visible} onDismiss={handleDismiss}>
			<View style={styles.container}>
				<View style={[styles.left, { backgroundColor: colors.background }]}>
					<View style={styles.info}>
						<Text style={[styles.info.title, { color: colors.textOnBackground }]}>Quantity:</Text>
						<Text style={[styles.info.amount, { color: colors.textOnBackground }]}>
							{amount} {store.settings.currencySymbol}
						</Text>
						<Text style={{ color: colors.textOnBackground }}>{new Date(date).toDateString()}</Text>
						<Text style={{ color: colors.subTextOnBackground }}>{note}</Text>
					</View>

					<View style={styles.buttons}>
						{['calendar', 'notebook', 'check'].map((button, i) => (
							<FAB key={button + i} size={32} icon={button} onPress={() => handleAction(button)} />
						))}
					</View>
				</View>
				<View style={[styles.right, { backgroundColor: colors.lightBackground }]}>
					<View>
						<FlatList
							contentContainerStyle={styles.list}
							data={digits.slice(0, 4)}
							renderItem={props => <Digit {...props} size={width / 2 / 4} />}
							numColumns={4}
							keyExtractor={item => item}
						/>
						<FlatList
							contentContainerStyle={styles.list}
							data={digits.slice(4)}
							renderItem={props => <Digit {...props} size={width / 2 / 3} />}
							numColumns={3}
							keyExtractor={item => item}
						/>
					</View>
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
		alignItems: 'center',
	},
	right: {
		width: '50%',
		justifyContent: 'center',
	},
	list: {
		alignItems: 'center',
	},
	buttons: {
		justifyContent: 'space-evenly',
		flex: 1,
		marginBottom: 8,
	},
	info: {
		borderBottomWidth: 3,
		borderColor: '#fff',

		width: '100%',

		padding: 16,
		title: {
			fontSize: 24,
			alignSelf: 'center',
		},
		amount: {
			fontSize: 20,
			alignSelf: 'center',
			marginBottom: 16,
		},
	},
});

export default TransactionModal;
