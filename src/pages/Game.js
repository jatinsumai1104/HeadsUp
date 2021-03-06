import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Container, Text } from 'native-base';
import { DeviceMotion } from 'expo-sensors';
import * as ScreenOrientation from 'expo-screen-orientation';

import GameComponent from '../components/GameComponent';

import useCountDown from 'react-countdown-hook';

export default Game = ({ route, navigation }) => {

  [isMounted, setMounted] = useState(false);
  [onForehead, setOnForehead] = useState(false);
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(3000, 1000);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    DeviceMotion.addListener(dm => {
      onMotionChange(dm);
    });
    setMounted(true);

    return () => {
      componentWillUnMount();
    }
  }, []);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
  });
  const onMotionChange = (dm) => {
    if (dm && dm.rotation) {
      let angle = (dm.rotation.gamma * (57.2958)) + 90;
      if (Math.abs(angle) < 30) {
        //On Forehead
        setOnForehead(true);
        start();
      }
    }
  }

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
  });

  const componentWillUnMount = () => {
    DeviceMotion.removeAllListeners();
    reset();
    setMounted(false);
  }

  if (isMounted) {
    if (!onForehead) {
      return (
        <Container>
          <ImageBackground
            resizeMode="cover"
            source={require("../../assets/images/bg-white.png")}
            style={[styles.bgImage, styles.bgBlack]}
          >
            <View style={styles.view}>
              <ScrollView>
                <Text style={styles.text}>Please Place you Phone on Forehead to start the Game</Text>
              </ScrollView>
            </View>
          </ ImageBackground>
        </Container >
      );
    } else if (timeLeft != 0) {
      return (
        <Container>
          <ImageBackground
            resizeMode="cover"
            source={require("../../assets/images/bg-white.png")}
            style={[styles.bgImage, styles.bgBlack]}
          >
            <View style={styles.view}>
              <Text style={styles.text}>Get Ready!!</Text>
              <Text style={styles.text} animation="zoomIn">{timeLeft / 1000}</Text>
            </View>
          </ ImageBackground>
        </Container >
      );
    } else {
      pause();
      return (
        <GameComponent data={route.params.data} navigate={navigation.navigate} />
      )
    }
  } else {
    return (<></>);
  }
}
const styles = StyleSheet.create({
  bgImage: {
    height: '100%',
    width: '100%',
  },
  bgBlack: {
    backgroundColor: "#000",
  },
  view: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: Math.min(Dimensions.get('window').height, Dimensions.get('window').width) / 5
  },
  text: {
    textAlignVertical: 'center',
    fontSize: Math.min(Dimensions.get('window').height, Dimensions.get('window').width) / 6,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20
  },
});



