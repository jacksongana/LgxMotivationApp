import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Page from './page';
import Connexion from './Connexion';
import Accueil from './Accueil';
import Exercices from './Exercices';
import Inspirations from './Inspiration';
import Imc from './Imc';

export default function App() {

  const Stack = createStackNavigator(); 
  return (
<>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Toto'> 
        <Stack.Screen name='Toto' component={Page}/>
        <Stack.Screen name='Connexion' component={Connexion}/>
        <Stack.Screen name='Accueil' component={Accueil}/>
        <Stack.Screen name='Exercices' component={Exercices}/>
        <Stack.Screen name='Inspirations' component={Inspirations}/>
        <Stack.Screen name='Imc' component={Imc}/>
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

