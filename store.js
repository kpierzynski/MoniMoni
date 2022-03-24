import update from 'immutability-helper';
import React, { createContext, useEffect, useReducer } from 'react';
import MMKVStorage, { useMMKVStorage } from 'react-native-mmkv-storage';
import { decrementRange, getInitRange, getRange, incrementRange } from './Tools/utils';

const store = createContext(initStore);
const { Provider } = store;

const initStore = {
	currentAccount: 'Card',
	currentRange: getInitRange(),

	settings: {
		currencySymbol: '$',
	},

	accounts: [
		{
			name: 'Card',
			categories: [],
			incomeCategories: [],
		},
	],
};

Array.prototype.max = function () {
	return this.length ? Math.max.apply(null, this) : undefined;
};

const MMKV = new MMKVStorage.Loader().initialize();

const Actions = {
	AddCategory: 'AddCategory',
	AddTransaction: 'AddTransaction',

	RemoveCategory: 'RemoveCategory',
	RemoveTransaction: 'RemoveTransaction',
	RemoveAccount: 'RemoveAccount',

	EditTransaction: 'EditTransaction',
	EditCategory: 'EditCategory',

	ChangeRange: 'ChangeRange',
	IncrementRange: 'IncrementRange',

	Clear: 'Clear',
	Load: 'Load',
	LoadSettings: 'LoadSettings',

	ChangeAccount: 'ChangeAccount',
	NewAccount: 'NewAccount',

	ChangeCurrencySymbol: 'ChangeCurrencySymbol',
};

function reducer(state, action) {
	switch (action.type) {
		case Actions.AddCategory: {
			const indexAcc = state.accounts.map(acc => acc.name).indexOf(state.currentAccount);

			const { isIncome } = action;
			const key = isIncome ? 'incomeCategories' : 'categories';

			const id = state.accounts[indexAcc][key].map(t => t.id).max() || 0;

			const newState = update(state, {
				accounts: {
					[indexAcc]: {
						[key]: { $push: [{ ...action.category, id: id + 1 }] },
					},
				},
			});
			return newState;
		}

		case Actions.AddTransaction: {
			const indexAcc = state.accounts.map(acc => acc.name).indexOf(state.currentAccount);

			const { isIncome } = action;
			const key = isIncome ? 'incomeCategories' : 'categories';

			const indexCat = state.accounts[indexAcc][key].map(cat => cat.id).indexOf(action.category.id);

			const id = state.accounts[indexAcc][key][indexCat].transactions.map(t => t.id).max() || 0;

			const newState = update(state, {
				accounts: {
					[indexAcc]: {
						[key]: {
							[indexCat]: {
								transactions: { $push: [{ ...action.transaction, id: id + 1 }] },
							},
						},
					},
				},
			});
			return newState;
		}

		case Actions.EditTransaction: {
			console.log(action.category);
			const indexAcc = state.accounts.map(acc => acc.name).indexOf(state.currentAccount);
			const { isIncome } = action;
			const key = isIncome ? 'incomeCategories' : 'categories';
			const indexCat = state.accounts[indexAcc][key].map(cat => cat.id).indexOf(action.category.id);

			const indexTran = state.accounts[indexAcc][key][indexCat].transactions.map(t => t.id).indexOf(action.transaction.id);
			console.log('indexTran', indexTran);
			console.log('action.transaction', action.transaction);

			const newState = update(state, {
				accounts: {
					[indexAcc]: {
						[key]: {
							[indexCat]: {
								transactions: {
									[indexTran]: {
										date: { $set: action.transaction.date },
										note: { $set: action.transaction.note },
										amount: { $set: action.transaction.amount },
									},
								},
							},
						},
					},
				},
			});

			return newState;
		}

		case Actions.EditCategory: {
			console.log('Im in store.js in EditCategory action.');

			const indexAcc = state.accounts.map(acc => acc.name).indexOf(state.currentAccount);
			const { isIncome } = action;
			const key = isIncome ? 'incomeCategories' : 'categories';
			const indexCat = state.accounts[indexAcc][key].map(cat => cat.id).indexOf(action.category.id);

			console.log(action.category);

			const newState = update(state, {
				accounts: {
					[indexAcc]: {
						[key]: {
							[indexCat]: {
								name: { $set: action.category.name },
								color: { $set: action.category.color },
								icon: { $set: action.category.icon },
							},
						},
					},
				},
			});

			return newState;
		}

		case Actions.RemoveTransaction: {
			const indexAcc = state.accounts.map(acc => acc.name).indexOf(state.currentAccount);

			const key = action.transaction.income ? 'incomeCategories' : 'categories';

			const indexCat = state.accounts[indexAcc][key].map(cat => cat.id).indexOf(action.transaction.category.id);

			const indexTran = state.accounts[indexAcc][key][indexCat].transactions.map(t => t.id).indexOf(action.transaction.id);

			const newState = update(state, {
				accounts: {
					[indexAcc]: {
						[key]: {
							[indexCat]: {
								transactions: { $splice: [[indexTran, 1]] },
							},
						},
					},
				},
			});
			return newState;
		}

		case Actions.RemoveCategory: {
			const indexAcc = state.accounts.map(acc => acc.name).indexOf(state.currentAccount);

			const { isIncome } = action;
			const key = isIncome ? 'incomeCategories' : 'categories';

			const indexCat = state.accounts[indexAcc][key].map(cat => cat.id).indexOf(action.category.id);

			const newState = update(state, {
				accounts: {
					[indexAcc]: {
						[key]: {
							$splice: [[indexCat, 1]],
						},
					},
				},
			});

			return newState;
		}

		case Actions.RemoveAccount: {
			if (state.accounts.length === 1) {
				throw 'Cannot remove last account.';
				return state;
			}

			const { name } = action;

			const indexAcc = state.accounts.map(acc => acc.name).indexOf(name);

			const newState = update(state, {
				accounts: {
					$splice: [[indexAcc, 1]],
				},
			});

			if (name === state.currentAccount) {
				return update(newState, {
					currentAccount: {
						$set: state.accounts[0].name,
					},
				});
			}
			return newState;
		}

		case Actions.ChangeRange: {
			const { rangeType } = action;
			const newState = update(state, {
				currentRange: { $set: getRange(rangeType) },
			});

			return newState;
		}

		case Actions.IncrementRange: {
			const newState = update(state, {
				currentRange: { $set: incrementRange(state.currentRange) },
			});

			return newState;
		}

		case Actions.DecrementRange: {
			const newState = update(state, {
				currentRange: { $set: decrementRange(state.currentRange) },
			});

			return newState;
		}

		case Actions.ChangeAccount: {
			const newState = update(state, { currentAccount: { $set: action.name } });
			return newState;
		}

		case Actions.NewAccount: {
			const newState = update(state, {
				currentAccount: { $set: action.name },
				accounts: {
					$push: [
						{
							name: action.name,
							categories: [],
							incomeCategories: [],
						},
					],
				},
			});

			return newState;
		}

		case Actions.ChangeCurrencySymbol: {
			const newState = update(state, {
				settings: {
					currencySymbol: { $set: action.symbol },
				},
			});
			return newState;
		}

		case Actions.Clear: {
			return initStore;
		}

		case Actions.Load: {
			return { ...state, accounts: action.db };
		}

		case Actions.LoadSettings: {
			return { ...state, settings: action.settings };
		}

		default:
			return state;
	}
}

const StoreProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initStore);
	const [db, setDb] = useMMKVStorage('db', MMKV, initStore.accounts);
	const [settings, setSettings] = useMMKVStorage('settings', MMKV, initStore.settings);

	useEffect(() => {
		dispatch({ type: Actions.Load, db: db });
		dispatch({ type: Actions.LoadSettings, settings: settings });
	}, []);

	useEffect(() => {
		setDb(state.accounts);
	}, [state.accounts]);

	useEffect(() => {
		setSettings(state.settings);
	}, [state.settings]);

	return <Provider value={[state, dispatch]}>{children}</Provider>;
};

export { Actions, StoreProvider };
export default store;
