/**
 * @format
 */

import React from "react";
import {
  Image,
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
  const savedScale = useSharedValue(1);
  const scale = useSharedValue(1);
  
  const start = useSharedValue(THRESHOLD_X);
  const top = useSharedValue(THRESHOLD_Y);
  
  const imageStyle = useAnimatedStyle(() => ({
    position: "absolute",
    start: start.value,
    top: top.value,
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
        
        start.value = THRESHOLD_X;
        top.value = THRESHOLD_Y;
      }),
    Gesture.Simultaneous(
      Gesture.Pan()
        .maxPointers(1)
        .onChange(e => {
          "worklet"
          const newStart = start.value + e.changeX;
          const newTop = top.value + e.changeY;
          
          // = The coordinates of the top-left corner are dependent on the scale = //
          const thresholdX = THRESHOLD_X + (kittenAssetSource.width * (scale.value - 1) / 2);
          const thresholdY = THRESHOLD_Y + (kittenAssetSource.height * (scale.value - 1) / 2);
          
          if (newStart >= thresholdX) {
            start.value = newStart;
          }
          
          if (newTop >= thresholdY) {
            top.value = newTop;
          }
        }),
      Gesture.Pinch()
        .onEnd(() => {
          savedScale.value = scale.value;
        })
        .onUpdate(e => {
          scale.value = savedScale.value * e.scale;
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

const kittenAssetSource = Image.resolveAssetSource(kitten);

const THRESHOLD_X = 5;
const THRESHOLD_Y = 10;
