import React, { createContext, useState } from 'react';

const initState = {
	visible: false,
};

const alertContext = createContext();
const { Provider } = alertContext;

const AlertProvider = ({ children }) => {
	const [alertState, setAlertState] = useState(initState);

	const alert = (component, cb, params) => {
		setAlertState({ visible: true, onSuccess: cb, component, params });
	};

	const close = () => {
		setAlertState(initState);
	};

	return (
		<>
			<Provider value={alert}>{children}</Provider>
			{alertState.component && (
				<alertState.component {...alertState.params} visible={alertState.visible} onDismiss={close} onSuccess={alertState.onSuccess} />
			)}
		</>
	);
};

export default AlertProvider;
export { alertContext };
