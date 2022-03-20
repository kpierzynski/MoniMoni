import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const VerticalList = ({ style = {}, children }) => {
	return (
		<ScrollView style={[styles.container, style]} horizontal={false}>
			{children}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {},
});

export default VerticalList;
