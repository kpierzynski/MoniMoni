import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import MatIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FAB from './../FAB';
import Modal from './Modal';

const builtInColors = [
	//'#f9ffff',
	'#9c9d97',
	//'#474f52',
	//'#1d1c21',
	'#ffd83d',
	'#f9801d',
	'#b02e26',
	'#825432',
	'#80c71f',
	'#5d7c15',
	'#3ab3da',
	'#169c9d',
	'#3c44a9',
	'#f38caa',
	'#c64fbd',
	'#8932b7',
];

const builtInIcons = [
	'food-fork-drink',
	'food',
	'shoe-ballet',
	'shoe-heel',
	'ring',
	'gift',
	'movie',
	'baby-carriage',
	'car',
	'face-woman',
	'face-man',
	'home',
	'flower',
	'bathtub',
	'hanger',
	'lipstick',
	'format-paint',
	'book-open',
	'human-female-female',
	'credit-card',
	'handshake-outline',
	'pill',
	'heart',
	'weight-lifter',
	'piggy-bank',
	'airplane',
	'gamepad-variant',
	'bitcoin',
	'cash-100',
	'wallet',
	'dots-horizontal',
];

const CategoryModal = ({ visible, onDismiss, onSuccess, fillInputs }) => {
	const { colors } = useTheme();

	const [currentIcon, setCurrentIcon] = useState(builtInIcons[0]);
	const [currentColor, setCurrentColor] = useState(builtInColors[0]);
	const [text, setText] = useState('');

	const [error, setError] = useState(false);

	useEffect(() => {
		if (!fillInputs) return;
		const { icon, color, name } = fillInputs;

		setCurrentColor(color);
		setCurrentIcon(icon);
		setText(name);
	}, [fillInputs]);

	function handleTextChange(text) {
		setText(text);
		setError(false);
	}

	function handleSuccess() {
		if (!text || text.length === 0) {
			setError(true);
			ToastAndroid.show('Enter category name!', ToastAndroid.SHORT);
			return;
		}
		if (!onSuccess) return;

		clearInputs();
		onSuccess({
			color: currentColor,
			icon: currentIcon,
			name: text.trim(),
			transactions: [],
			...(fillInputs && { id: fillInputs.id }),
		});
		onDismiss();
	}

	function handleDismiss() {
		if (!onDismiss) return;
		clearInputs();
		onDismiss();
	}

	function clearInputs() {
		setCurrentIcon(builtInIcons[0]);
		setCurrentColor(builtInColors[0]);
		setText('');
		setError(false);
	}

	const Color = ({ color }) => (
		<TouchableOpacity
			activeOpacity={0.5}
			onPress={() => setCurrentColor(color)}
			style={{
				borderRadius: 64,
				backgroundColor: color,
				height: 40,
				aspectRatio: 1,
				marginVertical: 16,
			}}
		/>
	);

	const Icon = ({ icon }) => (
		<MatIcon
			onPress={() => setCurrentIcon(icon)}
			style={{ marginVertical: 16 }}
			name={icon}
			size={40}
			color={colors.textOnLightBackground}
		/>
	);

	return (
		<Modal visible={visible} onDismiss={handleDismiss}>
			<View style={styles.container}>
				<View style={[styles.left, { backgroundColor: colors.background }]}>
					<MatIcon
						style={{ backgroundColor: currentColor, borderRadius: 64, padding: 28 }}
						name={currentIcon}
						color={colors.textOnPrimary}
						size={64}
					/>
					<TextInput
						placeholder="Category name"
						value={text}
						style={[styles.input, { color: colors.textOnBackground }, error ? { borderColor: 'red' } : { borderColor: colors.primary }]}
						onChangeText={handleTextChange}
						placeholderTextColor={colors.subTextOnBackground}
					/>
					<FAB size={32} icon="check" onPress={handleSuccess} />
				</View>
				<View style={[styles.right, { backgroundColor: colors.lightBackground }]}>
					<View style={styles.colors}>
						<ScrollView showsVerticalScrollIndicator={false}>
							{builtInColors.map((color, i) => (
								<Color key={color + i} color={color} />
							))}
						</ScrollView>
					</View>
					<View style={styles.icons}>
						<ScrollView showsVerticalScrollIndicator={false}>
							{builtInIcons.map((icon, i) => (
								<Icon key={(icon, i)} icon={icon} />
							))}
						</ScrollView>
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
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	right: {
		width: '50%',
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	colors: {
		width: '50%',
		alignItems: 'center',
	},
	icons: {
		width: '50%',
		alignItems: 'center',
	},
	input: {
		borderBottomWidth: 1,
		width: '75%',
	},
});

export default CategoryModal;
