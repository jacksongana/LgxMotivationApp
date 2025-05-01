import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { useFonts } from 'expo-font';
import Navbar from './composant/navbar/navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Inspirations() {
  const [token, setToken] = useState('');
  const [inspirations, setInspirations] = useState([]);
  const [loading, setLoading] = useState(true); // État pour le chargement

  useEffect(() => {
    retrieveToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchInspirations();
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

  const fetchInspirations = async () => {
    try {
      const response = await fetch('https://lgxmotivation.lgx-creation.fr/getInspiration', {
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
      setInspirations(data);
    } catch (error) {
      console.error('Failed to fetch inspirations:', error);
    } finally {
      setLoading(false);
    }
  };

  const [loaded] = useFonts({
    'Jacquard': require('./assets/fonts/Jacquard24-Regular.ttf'),
  });

  if (!loaded || loading) {
    return <Text>Loading...</Text>;
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: 'https://lgxmotivation.lgx-creation.fr' + item.image }} style={styles.image} />
      <Text style={styles.tag}>{item.etiquette}</Text>
    </View>
  );

  return (
    <ImageBackground
      style={{ flex: 1 }}
      resizeMode='cover'
      source={require('./assets/backGround.png')}>
      <View style={styles.container}>
        <Text style={styles.title}>Inspirations</Text>
        <FlatList
          data={inspirations}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
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
  title: {
    fontFamily: 'Jacquard',
    color: '#fff',
    fontSize: 50,
    marginBottom: 20,
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  tag: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
});
