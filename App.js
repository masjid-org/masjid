import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import PrayTimes from './PrayTimes';

export default function App() {
  const [sound, setSound] = React.useState();
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
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  var times = []
  var pt = prayTimes.getTimes(new Date(), [23, 90], 0+6);

  for(var i = 0; i < timeNames.length; i++){
    times.push(<Text>{timeNames[i]}: </Text>)
    times.push(<Text>{pt[timeNames[i].toLowerCase()]}</Text>)
  }


  return (
    <View style={styles.container}>
      <Text>Player times in Bangladesh</Text>
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
