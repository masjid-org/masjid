import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';

import PrayTimes from './PrayTimes';

export default function App() {
  const [sound, setSound] = React.useState();
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  const prayTimes = new PrayTimes();
  const timeNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];

  async function playSound() {    
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./assets/azan2.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  React.useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(Math.round(location.coords.latitude) + "," + Math.round(location.coords.longitude));
  }


  var times = []
  var pt = prayTimes.getTimes(new Date(), [location.coords.latitude, location.coords.longitude], 0+6);

  for(var i = 0; i < timeNames.length; i++){
    times.push(<Text>{timeNames[i]}: </Text>)
    times.push(<Text>{pt[timeNames[i].toLowerCase()]}</Text>)
  }


  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <Text>Date: {new Date().toLocaleDateString()}</Text>
      {times}
      <Button title="Play Azan" onPress={playSound} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
