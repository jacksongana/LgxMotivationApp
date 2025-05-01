import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Navbar from './composant/navbar/navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Exercices() {
  const [token, setToken] = useState('');
  const [exercices, setExercices] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to show or hide the popup
  const [timer, setTimer] = useState(0); // State for the timer
  const [isTimerRunning, setIsTimerRunning] = useState(false); // State to know if the timer is running
  const [loading, setLoading] = useState(true); // State for loading

  const nav = useNavigation();

  useEffect(() => {
    retrieveToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchExercices();
    }
  }, [token]);

  const retrieveToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to retrieve the token:', error);
    }
  };

  const fetchExercices = async () => {
    try {
      const response = await fetch('https://lgxmotivation.lgx-creation.fr/getExercices', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });
      const responseText = await response.text();
      console.log('Response Text:', responseText); // Log the response text for debugging
      const data = responseText ? JSON.parse(responseText) : [];
      console.log(data); // Check the API response here
      setExercices(data);
    } catch (error) {
      console.error('Failed to fetch exercices:', error);
    } finally {
      setLoading(false);
    }
  };

  const [loaded] = useFonts({
    'Jacquard': require('./assets/fonts/Jacquard24-Regular.ttf'),
  });

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!loaded || loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackground
      style={{ flex: 1 }}
      resizeMode='cover'
      source={require('./assets/backGround.png')}>
      <View style={styles.container}>
        <Text style={styles.title}>Exercices</Text>
        {/* Display all exercises */}
        {exercices.map((exercice, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => setShowPopup(true)}>
            <Image source={{ uri: 'https://lgxmotivation.lgx-creation.fr' + exercice.image }} style={styles.image} />
            <Text style={styles.exercicesText}>{exercice.description}</Text>
            <Text style={styles.exercicesText}>Time: {exercice.time}</Text>
          </TouchableOpacity>
        ))}
        {/* Popup */}
        <Modal visible={showPopup} animationType="slide">
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Timer</Text>
            <Text style={styles.popupTimer}>{timer}</Text>
            <View style={styles.popupButtonsContainer}>
              <Button title="Play" onPress={startTimer} disabled={isTimerRunning} />
              <Button title="Pause" onPress={pauseTimer} disabled={!isTimerRunning} />
              <Button title="Reset" onPress={resetTimer} />
              <Button title="Close" onPress={() => setShowPopup(false)} />
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ justifyContent: 'flex-end', flex: 1 }}>
        <Navbar />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    marginTop: 20,
  },
  title: {
    fontFamily: 'Jacquard',
    color: '#fff',
    fontSize: 50,
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  inspirationText: {
    color: '#000',
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  // Styles for the popup
  popupContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  popupTimer: {
    fontSize: 50,
    marginBottom: 20,
  },
  popupButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
});
