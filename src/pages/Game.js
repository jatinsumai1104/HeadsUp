import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Container, Text } from 'native-base';
import { DeviceMotion } from 'expo-sensors';
import * as ScreenOrientation from 'expo-screen-orientation';

import GameComponent from '../components/GameComponent';

export default Game = ({ route, navigation }) => {

  [onForehead, setOnForehead] = useState(false);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    DeviceMotion.addListener(dm => {
      onMotionChange(dm);
    });
  }, []);

  const onMotionChange = (dm) => {
    if (dm && dm.rotation) {
      let angle = (dm.rotation.gamma * (57.2958)) + 90;
      if (Math.abs(angle) < 30) {
        //On Forehead
        setOnForehead(true);
      }
    }
  }

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
  } else {
    return (
      <GameComponent data={route.params.data} navigate={navigation.navigate} />
    )
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
    justifyContent: 'space-evenly',
    paddingTop: Math.min(Dimensions.get('window').height, Dimensions.get('window').width) / 4,
    paddingHorizontal: 10
  },
  text: {
    fontSize: Math.min(Dimensions.get('window').height, Dimensions.get('window').width) / 6,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20
  },
});



