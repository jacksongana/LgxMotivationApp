import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Navbar from './composant/navbar/navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Accueil() {
  const [nom, setNom] = useState('');
  const [token, setToken] = useState('');
  const [inspiration, setInspiration] = useState({});

  const nav = useNavigation();

  useEffect(() => {
    getToken();
    fetchNom();
    fetchInspiration();
  }, [token]);

  const fetchNom = async () => {
    try {
      const response = await fetch('https://lgxmotivation.lgx-creation.fr/profil', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setNom(data.nom);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchInspiration = async () => {
    try {
      const response = await fetch('https://lgxmotivation.lgx-creation.fr/getInspiration', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const todayIndex = new Date().getDate() % data.length;
      setInspiration(data[todayIndex]);
      console.log(inspiration.image);
    } catch (error) {
      console.error(error);
    }
  }

  const getToken = async () => {
    try {
      const a = await AsyncStorage.getItem('token');
      if (a !== null) {
        setToken(a);
        nav.navigate('Accueil');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const [loaded] = useFonts({
    'Jacquard': require('./assets/fonts/Jacquard24-Regular.ttf'),
  });

  if (!loaded) {
    return <Text>Chargement du font</Text>;
  }

  return (
    <ImageBackground
      style={{ flex: 1 }}
      resizeMode='cover'
      source={require('./assets/backGround.png')}>
      <View style={styles.container}>
        <Text style={styles.title}>Bonne Journée</Text>
        <Text style={styles.text}>{nom}</Text>
        <View style={styles.card}>
          <Image source={{ uri: 'https://lgxmotivation.lgx-creation.fr'+inspiration.image }} style={styles.image} />
          <Text style={styles.inspirationText}>{inspiration.etiquette}</Text>
        </View>
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
});
