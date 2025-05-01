import { ImageBackground, StyleSheet, Text, View, Image, SafeAreaView, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './composant/button/button';
import { useState,useEffect } from'react';
import { useNavigation } from '@react-navigation/native';

export default function Connexion() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [data,setData] = useState();
const [token,setToken] = useState();
const nav = useNavigation();

    useEffect(() => {
        getToken();
    });

    const storeToken = async (value) => {
        await AsyncStorage.setItem('token',value)
        setToken(value)
    }

  const getToken = async () => {
        const a = await AsyncStorage.getItem('token');
        if(a !== null){
            setToken(a);
            nav.navigate('Accueil');
        }
    }

    const eraseToken = async() => {
        await AsyncStorage.removeItem('token');
    }



    const login = async () => {
      try {
          const res = await fetch('https://lgxmotivation.lgx-creation.fr/login', {
              method: 'POST',
              headers: {
                  'Authorization': `token`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          setData(data);
          if (data.erreur !== undefined) {
              console.log(data.erreur);
          } else {
              eraseToken();
              // Dans la réponse, on a valid et token, on veut la valeur de token
              storeToken(data.token);
  
          }
      } catch (error) {
          console.error('Erreur :', error);
      }
  };
  
  const logout = () => {
  // Supprimer ou invalider le token d'authentification
      eraseToken(); // Supprimer le token de l'endroit où il est stocké (par exemple, AsyncStorage)

      // Redirection vers l'écran de connexion ou une autre page appropriée
      // Dans cet exemple, on peut simplement afficher un message dans la console
     
  };
  

  return (
 
    <ImageBackground
    style={{flex:1}} 
    resizeMode='cover'
    source={require('./assets/backGround.png')}>
      <SafeAreaView>
      <View style={styles.container}>
      <Text style={styles.text}>Connexion</Text>
    </View>
    <TextInput placeholder='email' 
    autoCapitalize='none' 
    onChangeText={setEmail} 
    value={email} 
    style={styles.input}/>

    <TextInput placeholder='password' 
    autoCapitalize='none' 
    secureTextEntry={true}
    onChangeText={setPassword} 
    value={password} 
    style={styles.input}/>
      <View style={styles.viewbtn}>
     <Button onClick={login} />
     </View>
     </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  logoLgx:{
    resizeMode: 'stretch',
    width: 150,
    height: 150,
  },
  viewbtn:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 50,
  },
  input:{
    backgroundColor: '#fff',
    height: 40,
    borderRadius: 10,
    paddingLeft: 10,
   margin: 20,
  }
});
