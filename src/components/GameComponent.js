import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Container, Text } from 'native-base';
import { DeviceMotion } from 'expo-sensors';
import * as ScreenOrientation from 'expo-screen-orientation';
import useCountDown from 'react-countdown-hook';

const initialTime = 60 * 1000;
const interval = 1000;
const flags = {
  NOT_ARRIVED: 0,
  ARRIVED: 1,
  PASS: 2,
  SUCCESS: 3
}

let result = [];
export default GameComponent = (props) => {

  [motion, setMotion] = useState(true);
  [state, setState] = useState({
    current: -1,
    data: [],
    status: [],
    attempted: 0
  });
  [dm, setDm] = useState([]);

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
  });

  /*
  * Perform task of Adding or Removing DeviceMotion Listener
  */
  useEffect(() => {
    if (motion) {
      DeviceMotion.addListener(dm => {
        setDm(dm);
      });
      DeviceMotion.setUpdateInterval(300);
    } else {
      DeviceMotion.removeAllListeners();
    }
  }, [motion]);

  /*
  * Perform task of componentWillMount
  */
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    var temp = {
      current: -1,
      data: props.data,
      status: Array(props.data.length).fill(flags.NOT_ARRIVED),
      attempted: 0
    };

    start();
    setTimeout(() => {
      setMotion(true);

      let nextWordFlag = false;
      while (!nextWordFlag) {
        let random_index = Math.floor(Math.random() * state.data.length);
        if (temp.status[random_index] == flags.NOT_ARRIVED) {
          var x = temp.status.slice();
          x[random_index] = flags.ARRIVED;
          temp = {
            data: temp.data,
            current: random_index,
            status: x,
            attempted: 0
          };
          nextWordFlag = true;
        }
      }
      setState(temp);
    }, 500);

    return () => {
      componentWillUnMount();
    }

  }, []);

  /*
  * Handles Device Motion Change
  */
  useEffect(() => {
    if (dm && dm.rotation) {
      let angle = (dm.rotation.gamma * (57.2958)) + 90;

      if (Math.abs(angle) > 30) {
        setMotion(false);
        pause();

        let temp = {
          ...state
        };
        if (angle < -30) {
          temp.status[temp.current] = flags.SUCCESS;
        } else if (angle > 30) {
          temp.status[temp.current] = flags.PASS;
        }
        temp.attempted = ++temp.attempted;
        setState(temp);
        result.push({
          text: temp.data[state.current],
          status: state.status[state.current],
        });

        setTimeout(() => {
          getNextWord();
          resume();
          setMotion(true);
        }, 1000);
      }
    }
  }, [dm]);

  /*
  * Perform task of componentWillUnMount
  */
  const componentWillUnMount = () => {
    DeviceMotion.removeAllListeners();
    reset();
    setState({
      current: -1,
      data: [],
      status: [],
      attempted: 0
    });
    setDm([]);
  }

  /*
  * Perform task of getting NextWord and updating the State
  */
  const getNextWord = () => {
    let nextWordFlag = false;
    let temp = {
      ...state
    };
    if (temp.data.length <= temp.attempted) {
      return;
    }
    while (!nextWordFlag) {
      let random_index = Math.floor(Math.random() * temp.data.length);
      if (temp.status[random_index] === flags.NOT_ARRIVED) {
        temp.status[random_index] = flags.ARRIVED;
        temp.current = random_index;
        nextWordFlag = true;
      }
    }
    setState(temp);
    setMotion(true);
  }

  /*
  * return => Message to be shown on FrontEnd
  */
  const getText = () => {
    if (motion) {
      return state.data.length != 0 ? state.data[state.current] : 'Loading..';
    } else {
      return state.status[state.current] == 2 ? 'Pass !!' : 'Success !!'
    }
  }


  /*
  * return => Image url for background
  */
  const getSrc = () => {
    if (motion) {
      return require('../../assets/images/blue.png');
    } else {
      return state.status[state.current] == 2 ? require('../../assets/images/red.png') : require('../../assets/images/green.png');
    }
  }

  if (state.data.length != 0 && (timeLeft == 0 || state.data.length <= state.attempted)) {
    DeviceMotion.removeAllListeners();
    props.navigate('Result', {
      data: result,
      flags: flags
    });
    return (
      <></>
    );
  } else {
    return (
      <Container>
        <ImageBackground
          resizeMode="cover"
          source={getSrc()}
          style={styles.bgImage}
        >
          <View style={styles.view}>
            <ScrollView>
              <Text style={styles.text}>{
                getText()
              }</Text>
            </ScrollView>
            <Text style={styles.timerText}>{timeLeft / 1000}</Text>
          </View>
        </ ImageBackground>
      </Container >
    );
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
  bgRed: {
    backgroundColor: "rgba(254, 32, 32, 0.9)",
  },
  bgBlue: {
    backgroundColor: "rgba(23,137,252,0.9)",
  },
  bgGreen: {
    backgroundColor: "rgba(12, 178, 12, 0.9)",
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
  timerText: {
    fontSize: Math.min(Dimensions.get('window').height, Dimensions.get('window').width) / 7,
    color: '#fff',
  }
});


