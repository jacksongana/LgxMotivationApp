import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import { FontAwesome } from "@expo/vector-icons";
import Navbar from './composant/navbar/navbar';

export default function ImcPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('homme');
  const [imc, setImc] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#000');
  const [calories, setCalories] = useState('');
  const [caloriesToLoseWeight, setCaloriesToLoseWeight] = useState('');
  const [caloriesToGainWeight, setCaloriesToGainWeight] = useState('');

  const calculateImc = () => {
    if (!height || !weight || !age) {
      Alert.alert('Erreur', 'Veuillez entrer votre taille, poids et âge.');
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const imcValue = weightInKg / (heightInMeters * heightInMeters);
    setImc(imcValue.toFixed(2));
    determineImcMessage(imcValue);
    calculateCalories(imcValue, weightInKg, age, gender);
  };

  const determineImcMessage = (imcValue) => {
    let message = '';
    let color = '';

    if (imcValue < 16.5) {
      message = 'Dénutrition ou anorexie';
      color = 'red';
    } else if (imcValue < 18.5) {
      message = 'Maigreur';
      color = 'orange';
    } else if (imcValue < 25) {
      message = 'Normal';
      color = 'green';
    } else if (imcValue < 30) {
      message = 'Surpoids';
      color = 'orange';
    } else if (imcValue < 35) {
      message = 'Obésité modérée';
      color = 'red';
    } else if (imcValue < 40) {
      message = 'Obésité sévère';
      color = 'red';
    } else {
      message = 'Obésité morbide';
      color = 'red';
    }

    setMessage(message);
    setMessageColor(color);
  };

  const calculateCalories = (imcValue, weightInKg, age, gender) => {
    const activityFactor = 1.55; // exemple de facteur d'activité modéré
    let baseCalories = 0;

    // Calcul de la dépense énergétique de base (BMR) selon le genre et l'âge
    if (gender === 'homme') {
      if (age >= 18 && age < 30) {
        baseCalories = (15.057 * weightInKg) + 692.2;
      } else if (age >= 30 && age < 60) {
        baseCalories = (11.472 * weightInKg) + 873.1;
      } else if (age >= 60) {
        baseCalories = (11.711 * weightInKg) + 587.7;
      }
    } else if (gender === 'femme') {
      if (age >= 18 && age < 30) {
        baseCalories = (14.818 * weightInKg) + 486.6;
      } else if (age >= 30 && age < 60) {
        baseCalories = (8.126 * weightInKg) + 845.6;
      } else if (age >= 60) {
        baseCalories = (9.082 * weightInKg) + 658.5;
      }
    }

    // Calcul des calories totales
    const totalCalories = baseCalories * activityFactor;
    setCalories(totalCalories.toFixed(2));

    // Calcul des calories pour perdre du poids
    setCaloriesToLoseWeight((totalCalories - 500).toFixed(2));

    // Calcul des calories pour prendre du poids
    setCaloriesToGainWeight((totalCalories + 500).toFixed(2));
  };

  const resetFields = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setGender('homme');
    setImc(null);
    setMessage('');
    setCalories('');
    setCaloriesToLoseWeight('');
    setCaloriesToGainWeight('');
  };

  const [loaded] = useFonts({
    'Jacquard': require('./assets/fonts/Jacquard24-Regular.ttf'),
  });

  if (!loaded) {
    return <Text>Chargement du font...</Text>;
  }

  return (
    <ImageBackground
      style={{ flex: 1 }}
      resizeMode='cover'
      source={require('./assets/backGround.png')}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Calculateur d'IMC</Text>
        <Text style={styles.label}>Taille (cm)</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={height}
          onChangeText={setHeight}
        />
        <Text style={styles.label}>Poids (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={weight}
          onChangeText={setWeight}
        />
        <Text style={styles.label}>Âge</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={age}
          onChangeText={setAge}
        />
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}>
          <Picker.Item label="Homme" value="homme" />
          <Picker.Item label="Femme" value="femme" />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={calculateImc}>
          <Text style={styles.buttonText}>Calculer l'IMC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetFields}>
        <FontAwesome name="refresh" size={24} color="white" />
        </TouchableOpacity>
        {imc && (
          <View style={styles.resultContainer}>
            <Text style={styles.result}>Votre IMC est: <Text style={styles.resultImc}>{imc}</Text></Text>
            <Text style={[styles.resultMessage, { color: messageColor }]}>{message}</Text>
            <Text style={styles.calories}>Calories recommandées par jour: <Text style={styles.normalCalories}>{calories}</Text></Text>
            <Text style={styles.calories}>Calories pour perdre du poids: <Text style={styles.loseCalories}>{caloriesToLoseWeight}</Text></Text>
            <Text style={styles.calories}>Calories pour prendre du poids: <Text style={styles.gainCalories}>{caloriesToGainWeight}</Text></Text>
          </View>
        )}
        <View style={styles.tableContainer}>
          <View style={styles.definitionContainer}>
            <Text style={styles.definitionTitle}>Définition</Text>
            <Text style={styles.definitionText}>
              L'IMC (Indice de Masse Corporelle) est calculé en divisant le poids d'une personne par le carré de sa taille (en mètres).
              Il est interprétable pour un adulte de 18 à 65 ans. Voici les catégories de l'IMC :
            </Text>
          </View>
          <Text style={styles.tableHeader}>IMC Explication</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Moins de 16,5</Text>
            <Text style={styles.tableCell}>Dénutrition ou anorexie</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>16,5 - 18,5</Text>
            <Text style={styles.tableCell}>Maigreur</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>18,5 - 25</Text>
            <Text style={styles.tableCell}>Normal</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>25 - 30</Text>
            <Text style={styles.tableCell}>Surpoids</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>30 - 35</Text>
            <Text style={styles.tableCell}>Obésité modérée</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>35 - 40</Text>
            <Text style={styles.tableCell}>Obésité sévère</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Plus de 40</Text>
            <Text style={styles.tableCell}>Obésité morbide</Text>
          </View>
        </View>
      </ScrollView>
      <Navbar />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      },
      title: {
        fontFamily: 'Jacquard',
        fontSize: 32,
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
      },
      label: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10,
      },
      input: {
        height: 50,
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
      },
      picker: {
        marginTop: -50,
        width: '100%',
        marginBottom: -20,
      },
      resultContainer: {
        alignItems: 'center',
        marginTop: 20,
      },
      result: {
        color: 'black',
        fontSize: 30,
      },
      resultImc: {
        fontWeight: 'bold',
      },
      resultMessage: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 10,
      },
      calories: {
        fontSize: 16,
        marginVertical: 5,
      },
      normalCalories: {
        color: 'green',
      },
      loseCalories: {
        color: 'orange',
      },
      gainCalories: {
        color: 'blue',
      },
      calories: {
        color: 'black',
        fontSize: 20,
        marginTop: 10,
      },
      definitionContainer: {
        marginBottom: 10,
        paddingHorizontal: 20,
      },
      definitionTitle: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
      },
      definitionText: {
        color: '#6F4E37',
        fontSize: 16,
        textAlign: 'center',
      },
      calorieDefinitionContainer: {
        marginTop: 30,
        paddingHorizontal: 20,
      },
      calorieDefinitionTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
      },
      calorieDefinitionText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
      },
      tableContainer: {
        marginTop: 20,
        width: '90%',
        backgroundColor: '#ecf0f1',
        borderRadius: 10,
        padding: 10,
      },
      tableHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center',
      },
      tableRow: {
        flexDirection: 'row',
        
        justifyContent: 'space-between',
        paddingVertical: 5,
      },
      tableCell: {
        flex: 1,
        color: '#6F4E37',
        textAlign: 'center',
      },
      button: {
        backgroundColor: '#A91D3A',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 10,
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },
});
