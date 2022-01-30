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
  
  const savedScale = useSharedValue(1);
  const scale = useSharedValue(1);
  
  const imageStyle = useAnimatedStyle(() => ({
    position: "absolute",
    start: translationX.value,
    top: translationY.value,
    transform: [
      {
        scale: scale.value
      }
    ]
  }), []);
  
  const gesture = Gesture.Race(
    Gesture.Tap()
      .onStart(() => {
        savedScale.value = 1;
        scale.value = 1;
        
        initialTranslationX.value = 0;
        initialTranslationY.value = 0;
        translationX.value = 0;
        translationY.value = 0;
      }),
    Gesture.Simultaneous(
      Gesture.Pan()
        .maxPointers(1)
        .onEnd(() => {
          initialTranslationX.value = translationX.value;
          initialTranslationY.value = translationY.value;
        })
        .onUpdate(e => {
          translationX.value = (initialTranslationX.value + e.translationX);
          translationY.value = (initialTranslationY.value + e.translationY);
        }),
      Gesture.Pinch()
        .onEnd(() => {
          savedScale.value = scale.value;
        })
        .onUpdate(e => {
          scale.value = savedScale.value * e.scale;
          
          console.log(scale.value);
        })
    )
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
    backgroundColor: "cyan",
    flex: 1
  },
  gestureHandlerRootView: {
    flex: 1
  }
});

export default App;
