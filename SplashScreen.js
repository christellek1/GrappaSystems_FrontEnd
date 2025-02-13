import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000); // 3 seconds delay before navigating
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('./BookNook.jpg')} style={styles.logo} />
      <Text style={styles.text}>Book Browser</Text>
      <Text style={styles.poweredBy}>Powered by Grappa Systems</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  poweredBy: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    color: '#888',
  },
});

export default SplashScreen;
