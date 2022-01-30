/**
 * @format
 */

import React from "react";
import {
  StyleSheet,
  View
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
// @ts-ignore
import kitten from "../assets/kitten.jpg";

const App: React.VFC = () => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const initialTranslationX = useSharedValue(0);
  const initialTranslationY = useSharedValue(0);
  
  const scale = useSharedValue(1);
  
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value
      },
      {
        translateX: translationX.value
      },
      {
        translateY: translationY.value
      }
    ]
  }), []);
  
  const gesture = Gesture.Race(
    Gesture.Pan()
      .maxPointers(1)
      .onEnd(() => {
        initialTranslationX.value = translationX.value;
        initialTranslationY.value = translationY.value;
      })
      .onUpdate(e => {
        translationX.value = initialTranslationX.value + e.translationX;
        translationY.value = initialTranslationY.value + e.translationY;
      }),
    Gesture.Tap()
      .onStart(() => {
        initialTranslationX.value = 0;
        initialTranslationY.value = 0;
        translationX.value = 0;
        translationY.value = 0;
      })
  );
  
  return (
    <GestureHandlerRootView
      style={styles.gestureHandlerRootView}
    >
      <GestureDetector
        gesture={gesture}
      >
        <View
          style={styles.container}
        >
          <Animated.Image
            source={kitten}
            style={imageStyle}
          />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "cyan",
    flex: 1,
    justifyContent: "center"
  },
  gestureHandlerRootView: {
    flex: 1
  }
});

export default App;
