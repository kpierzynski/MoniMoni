import { useContext } from 'react';
import { alertContext } from './../Components/Modals/AlertProvider';

function useModal() {
	const alert = useContext(alertContext);
	return alert;
}

export default useModal;
