import { useState } from 'react';
import { Animated } from 'react-native';

function useAnimation(duration, easing) {
	const animation = useState(new Animated.Value(0))[0];

	const callAnimation = () => {
		animation.setValue(0);
		Animated.timing(animation, {
			toValue: 1,
			duration: duration,
			useNativeDriver: true,
			easing: easing,
		}).start();
	};

	return [animation, callAnimation];
}

export { useAnimation };
