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
  GestureHandlerRootView,
  GestureTouchEvent
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
// @ts-expect-error
import kitten from "../assets/kitten.jpg";

const App: React.VFC = () => {
  const pointers = usePointers();
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
  
  const getDistance = (...points: Point[]): number => {
    'worklet'
    return (
      Math.sqrt(
        Math.pow(points[0].x - (points[1]?.x ?? 0), 2)
        + Math.pow(points[0].y - (points[1]?.y ?? 0), 2)
      )
    )
  }
  
  const pan = (event: GestureTouchEvent) => {
    'worklet'
    
    const touch = event.changedTouches[0]
    const {x, y} = pointers[touch.id].value
    
    const xOffset = touch.x - x
    const yOffset = touch.y - y
    
    // console.log(`xOffset: ${xOffset}, yOffset: ${yOffset}`)
    
    start.value += xOffset
    top.value += yOffset
  }
  
  const gesture = Gesture.Exclusive(
    Gesture.Manual()
      .onBegin(() => {
        console.log('onBegin')
      })
      .onEnd((_event, success) => {
        console.log('onEnd', success)
      })
      .onFinalize((_event, success) => {
        console.log('onFinalize', success)
      })
      .onStart(() => {
        console.log('onStart')
      })
      .onTouchesDown((event, manager) => {
        if (
          (event.numberOfTouches === 1 && event.changedTouches[0].id)
          || event.changedTouches.find(touch => touch.id >= pointers.length)
        ) {
          manager.fail()
          return
        }
        
        for (const touch of event.changedTouches) {
          pointers[touch.id].value = {
            x: touch.x,
            y: touch.y
          }
        }
      })
      .onTouchesMove((event, manager) => {
        manager.activate()
        
        if (event.numberOfTouches === 1) {
          pan(event)
        } else {
          // const pointerOffsets = event.changedTouches.map(touch => {
          //   return getDistance(touch) - getDistance(pointers[touch.id].value)
          // })
          
          // if ((pointerOffsets[0] - pointerOffsets[1]) < 1) {
          //   pan(event)
          // } else {
            const oldDistance = getDistance(pointers[0].value, pointers[1].value)
            const newDistance = getDistance(...event.allTouches)
            
            scale.value *= newDistance / oldDistance
          // }
        }
        
        for (const touch of event.changedTouches) {
          pointers[touch.id].value = {
            x: touch.x,
            y: touch.y
          }
        }
      })
      .onTouchesUp((event, manager) => {
        if (!event.numberOfTouches) {
          manager.end()
        }
      }),
    Gesture.Tap()
      .onStart(() => {
        scale.value = 1
        start.value = THRESHOLD_X
        top.value = THRESHOLD_Y
      })
  )
  
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

interface Point {
  readonly x: number
  readonly y: number
}

interface Pointer extends Point {}

const THRESHOLD_X = 5
const THRESHOLD_Y = 10

const kittenAssetSource = Image.resolveAssetSource(kitten)

const styles = StyleSheet.create({
  container: {
    backgroundColor: "cyan",
    flex: 1
  },
  gestureHandlerRootView: {
    flex: 1
  }
})

const usePointers = (): ReadonlyArray <Animated.SharedValue <Pointer>> => {
  const pointers: Animated.SharedValue <Pointer> [] = []
  
  for (let i = 0; i < 2; ++i) {
    pointers[i] = useSharedValue({
      x: 0,
      y: 0
    })
  }
  
  return pointers
}

export default App
