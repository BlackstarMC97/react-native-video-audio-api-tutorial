import * as React from 'react';
import { Button, View, Text, Image, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  header: {
  	backgroundColor: "#91285f",
  },
  loadingText: {
  	color: "#2196f3",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
  videoContainer: {
  	backgroundColor: "white",
  	marginBottom: 20,
  },
  videoImage: {
  	width: "100%",
  	height: 260,
  },
  videoTitle: {
  	paddingTop: 12,
  	paddingLeft: 12,
  	paddingRight: 12,
  	marginBottom: 2,
  	fontSize: 16,
  	fontWeight: "bold",
  },
  videoSubTitle: {
  	paddingTop: 2,
  	paddingLeft: 12,
  	paddingRight: 12,
  	marginBottom: 20,
  	fontSize: 13,
  }
});

function getDataUsingGet(callback) {
    fetch("https://api.napster.com/v2.1/tracks/top?apikey=NDBkNDRhYjAtZjRlOC00YTI2LTg0ODMtYTBmNWVmOTQ3YjQ1", {
		"method": "GET",
	})
	.then(response => response.json())
	.then(responseJson => {
		console.log(responseJson);
	})
	.catch(err => {
		console.log(err);
	});
}

function HomeScreen({ navigation }) {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Button
        title="Launch the test"
        onPress={() => navigation.navigate('Shalom Test App')}
      />
    </View>
  );
}

function BlankScreen() {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>Blank page</Text>
    </View>
  );
}

function AudiosScreen() {
  return (
    <View style={{overflow: "auto"}}>
      <Text>Audio page</Text>
    </View>
  );
}

function VideosScreen() {
	const screenHeight = Dimensions.get('window').height;
	const [photos, setPhotos] = React.useState([]);

	React.useEffect(function effectFunction() {
		fetch("https://free-football-soccer-videos.p.rapidapi.com/", {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "free-football-soccer-videos.p.rapidapi.com",
				"x-rapidapi-key": "VTFclTfEVAmshQmaJNoPsbhlnoAcp1i978ojsnVvUKgKp4QiG6"
			}
		})
		.then(response => response.json())
		.then(responseJson => {
			//console.log(responseJson[0].embed.match(/src='([^']+)/)[1]);
			setPhotos(responseJson.slice(0, 3));
		});
   	}, []);

	return (
		<View style={{flex: 1, overflow: "auto"}}>
			<View>
				{
					photos.length !== 0 ? 
						photos.map((photo, i) => (
							<View key={i} style={styles.videoContainer}>
								{
									!Platform.OS === "web" ? 
									<WebView 
										source={{
											html:"<iframe height='240' scrolling='no' src={photo.embed.match(/src='([^']+)/)[1]} />"
										}} 
										style={{width:"100%",height:200,backgroundColor:'blue',marginTop:20}}
									/> : 
									<div style={{display:"block",width:"inherit",overflow:"hidden",width:"100%",height:"200px"}}>
										<iframe style={{marginTop:"-47px", width:"-webkit-fill-available"}} height="247px" scrolling="no" src={photo.embed.match(/src='([^']+)/)[1]} />
									</div>
								}
								<View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
									<View>
										<Text style={styles.videoTitle}>{photo.title.replace(/./,m=>m.toUpperCase())}</Text>
						      			<Text style={styles.videoSubTitle}>Shalom Tabernacle</Text>
									</View>
									<View>
										<Icon
											raised
											reverse
											name='download'
											type='font-awesome'
											color='#91285f'
											reverseColor='white'
											size={16}
											onPress={() => getDataUsingGet()} 
										/>
									</View>
								</View>
						    </View>
						))
					: 
					<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
						<Text style={styles.loadingText}>Chargement des vidéos en cours...</Text>
					</View>
				}
			</View>						
		</View>
	);
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerTintColor: 'white', headerStyle: styles.header }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Shalom Test App" component={Root} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerTintColor: 'white', headerStyle: styles.header }}>
      <SettingsStack.Screen name="Blank page" component={BlankScreen} />
      <SettingsStack.Screen name="Shalom Test App" component={Root} />
    </SettingsStack.Navigator>
  );
}

const Tab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();

function Root() {
  return (
    <Tab.Navigator
        tabBarOptions={{
          labelStyle: { fontSize: 12, color: "#2196f3" },
          style: { backgroundColor: '#fff' },
        }}
      >
        <Tab.Screen name="Vidéos" component={VideosScreen} />
        <Tab.Screen name="Audios" component={AudiosScreen} />
      </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <BottomTab.Navigator
      	screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Annonces') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Alertes') {
              iconName = focused ? 'ios-notifications' : 'ios-notifications-outline';
            } else if (route.name === 'Replay') {
              iconName = 'ios-refresh';
            } else if (route.name === 'Profil') {
              iconName = 'ios-person';
            }

            // You can return any component that you like here!
            return <Ionicons style={{ marginBottom: "-7px" }} name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          style: {height: 50, marginBottom: 10},
          activeTintColor: '#2196f3',
          inactiveTintColor: 'gray',
        }}
      >
        <BottomTab.Screen name="Annonces" component={HomeStackScreen} />
        <BottomTab.Screen name="Alertes" component={SettingsStackScreen} />
        <BottomTab.Screen name="Replay" component={SettingsStackScreen} />
        <BottomTab.Screen name="Profil" component={SettingsStackScreen} />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}