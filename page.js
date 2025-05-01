import { ImageBackground, StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Btn from './composant/button/btn';

export default function Page() {

  const nav = useNavigation();

  return (
 
    <ImageBackground
    style={{flex:1}} 
    resizeMode='cover'
    source={require('./assets/backGround.png')}>
      <SafeAreaView>
      <View style={styles.container}>
     <Image style={styles.logoLgx} source={require('./assets/lgx.png')}/>
     <Text style={styles.text}>INSPI</Text>
     <Text style={styles.title}>LGX</Text>
     <Btn onClick={() => nav.navigate('Connexion')} />
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
  text:{
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  title:{
    color: '#fff',
    fontSize: 80,
    fontWeight: 'bold',
  },
 
});
