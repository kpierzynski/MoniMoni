import React from 'react';
import { Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';

const Modal = ({ children, visible, onDismiss }) => {
	function handleClose() {
		if (onDismiss) onDismiss();
	}

	return (
		<RNModal animationType="fade" onRequestClose={handleClose} transparent visible={visible}>
			<View style={styles.container}>
				<Pressable style={styles.shadow} onPress={handleClose} />
				<View style={styles.content}>{children}</View>
			</View>
		</RNModal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	shadow: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 3,
	},
	content: {
		flex: 7,
	},
});

export default Modal;
