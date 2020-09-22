import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Container, Content } from 'native-base';

import Categories from '../components/Categories';

import logo from '../../assets/images/logo3.png';

import * as ScreenOrientation from 'expo-screen-orientation';

const Home = ({ navigation }) => {

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_DOWN);
  }, []);

  return (
    <Container style={{ backgroundColor: "#000" }}>
      <Content>
        <View >
          <Image source={logo} style={[styles.headerImage]} />
        </View>
        < Categories navigate={navigation.navigate} destinationPage="Game" />
      </Content>
    </Container>
  );
}
const styles = StyleSheet.create({
  headerImage: {
    marginTop: 30,
    marginBottom: 10,
    height: 80,
    width: '70%',
    alignSelf: 'center'
  },
});

export default Home;

