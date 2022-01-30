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

const kittenAssetSource = Image.resolveAssetSource(kitten);

const App: React.VFC = () => {
  const savedScale = useSharedValue(1);
  const scale = useSharedValue(1);
  
  const start = useSharedValue(0);
  const top = useSharedValue(0);
  
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
        
        start.value = 0;
        top.value = 0;
      }),
    Gesture.Simultaneous(
      Gesture.Pan()
        .maxPointers(1)
        .onChange(e => {
          "worklet"
          const newStart = start.value + e.changeX;
          const newTop = top.value + e.changeY;
          
          // = The coordinates of the top-left corner are dependent on the scale = //
          const thresholdX = 10 + (kittenAssetSource.width * (scale.value - 1) / 2);
          const thresholdY = 10 + (kittenAssetSource.height * (scale.value - 1) / 2);
          
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
