import { useTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Share, StyleSheet, Text, TextInput, View } from 'react-native';
import DialogAndroid from 'react-native-dialogs';
import _store, { Actions } from './../../store';
import MMButton from './../Primitives/Button';
import VerticalList from './../VerticalList';

const Settings = () => {
	const { colors } = useTheme();
	const [text, setText] = useState('');
	const [store, dispatch] = useContext(_store);

	useEffect(() => {
		setText(store.settings.currencySymbol);
	}, [store.settings.currencySymbol]);

	async function handleExport() {
		await Share.share({ message: JSON.stringify(store.accounts) });
	}

	async function handleCurrencyChange(text) {
		setText(text);
		dispatch({ type: Actions.ChangeCurrencySymbol, symbol: text });
	}

	async function handleRemove() {
		const { action, text } = await DialogAndroid.alert('Remove data', 'Are you sure you want to permanently remove all data?', {
			negativeText: 'Cancel',
		});

		if (action === DialogAndroid.actionPositive) dispatch({ type: Actions.Clear });
	}

	async function handleImport() {
		const { action, text } = await DialogAndroid.prompt('Import data', 'Paste here result of export');
		if (action === DialogAndroid.actionPositive) {
			try {
				const db = JSON.parse(text);
				if (!Array.isArray(db)) throw 'Imported object is not an array!';
				dispatch({ type: Actions.Load, db: db });
				DialogAndroid.alert('Import data', 'Importing done.');
			} catch (err) {
				DialogAndroid.alert('Import data', 'Importing error!');
			}
		}
	}

	const buttons = [
		{ title: 'Export data', cb: handleExport },
		{ title: 'Import data', cb: handleImport },
		{ title: 'Remove data', cb: handleRemove, danger: true },
		{
			title: 'Currency shortcut',
			custom: (
				<TextInput
					maxLength={3}
					value={text}
					style={[styles.input, { color: colors.textOnBackground, borderColor: colors.secondaryBackground }]}
					onChangeText={handleCurrencyChange}
				/>
			),
		},
	];

	return (
		<View style={styles.container}>
			<VerticalList style={styles.list}>
				{buttons.map((button, i) => (
					<View style={[styles.button, { borderColor: colors.secondaryBackground }]} key={button.title + i}>
						<Text style={{ color: colors.textOnBackground, width: '50%' }}>{button.title}</Text>
						<View style={{ width: '50%' }}>
							{button.custom ? (
								button.custom
							) : (
								<MMButton text={button.title} danger={button.danger} onPress={button.cb} disabled={!Boolean(button.cb)} />
							)}
						</View>
					</View>
				))}
			</VerticalList>

			{__DEV__ && <Text style={{ fontSize: 8 }}>{JSON.stringify(store.accounts)}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	list: {
		padding: 16,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		paddingVertical: 12,
		borderRadius: 32,
	},
	input: {
		paddingVertical: 0,
		paddingHorizontal: 16,
		margin: 0,
		alignSelf: 'flex-end',
	},
});

export default Settings;
