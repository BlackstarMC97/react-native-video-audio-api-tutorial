import * as React from 'react';
import { Button, View, Text, Image, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView, ToastAndroid, PermissionsAndroid } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

const showToast = (message) => {
	ToastAndroid.show(message, ToastAndroid.SHORT);
};

const styles = StyleSheet.create({
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
  	height: Platform.OS !== "web" ? 260 : 270
  },
  videoImage: {
  	width: "100%",
  	height: 180,
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

const downloadDocument = async (url) => {
	if(Platform.OS !== 'web') {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL).catch(err => {console.log(err)});
		if (status === "granted") {
			var fileURI = FileSystem.documentDirectory + 'image.png';
			const resp = await FileSystem.downloadAsync(url, fileURI);
			
			//save photo
			try {
				const asset = await MediaLibrary.createAssetAsync(fileURI);
        		await MediaLibrary.createAlbumAsync("Download", asset, false);
        		showToast("Téléchargement effectué!");
			}
			catch(err) {
				showToast("La vidéo n'a pas pu être enregistrée!");
				console.log(err);
			}
		}
		else {
			showToast("Téléchargement non autorisé!");
		}
	}
	else {
		// Here i can't use my api url because CORS is not enabled on the api servers
		try {
			var myUrl = "https://i.picsum.photos/id/884/536/354.jpg?hmac=CqsELRDUWEC8Iah_3JKD1oWJdgxnpBffbkDAckj95B4";
			//var myUrl = "https://img.youtube.com/vi/lrA_9Lx-0nU/hqdefault.jpg";
			fetch(myUrl).then(function(t) {
			    return t.blob().then((b)=>{
			        var a = document.createElement("a");
			        a.href = URL.createObjectURL(b);
			        a.setAttribute("download", "Nouveaufichier.jpg");
			        a.click();
			    }
			    );
			});
			//alert('Téléchargement effectué!');
		} catch (e) {
			console.error(e);
			alert("Le téléchargement n'a pas pu être effectué!");
		}
	}
}

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
        title="Démarrer le test"
        onPress={() => navigation.navigate('Shalom Test App')}
      />
    </View>
  );
}

function BlankScreen() {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>Page vide</Text>
    </View>
  );
}

function MyWeb() {
	return (
		<View>
			<WebView
				source={{ uri: 'https://github.com/expo/expo' }}
				style={{ marginTop: 24 }}
			/>
		</View>
	);
}

function AudiosScreen() {
  return (
    <View style={Platform.OS !== "web" ? {flex: 1, justifyContent: 'center', alignItems: 'center'} : {flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'auto'}}>
      <Text>Gestion des audios</Text>
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
		<ScrollView style={Platform.OS !== "web" ? {flex: 1} : {flex: 1, overflow: 'auto'}}>
			{
				photos.length !== 0 ? 
					photos.map((photo, i) => (
						<View key={i} style={styles.videoContainer}>
							{
								Platform.OS !== "web" ? 
								<View style={{height: 180}}>
									<WebView
										source={{ uri: photo.embed.match(/src='([^']+)/)[1] }}
										style={{marginTop: -47}}
										javaScriptEnabled={true}
									    domStorageEnabled={true}
									    startInLoadingState={true}
									/>
								</View> : 
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
										onPress={() => downloadDocument(photo.thumbnail)} 
									/>
								</View>
							</View>
					    </View>
					))
				: 
				<View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 30}}>
					<Text style={styles.loadingText}>Chargement des vidéos en cours...</Text>
				</View>
			}
		</ScrollView>
	);
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerTintColor: 'white', headerStyle: styles.header }}>
      <HomeStack.Screen name="Accueil" component={HomeScreen} />
      <HomeStack.Screen name="Shalom Test App" component={Root} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerTintColor: 'white', headerStyle: styles.header }}>
      <SettingsStack.Screen name="Page vide" component={BlankScreen} />
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
            return <Ionicons style={{marginBottom: -5}} name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          style: {height: 50, paddingBottom: 5},
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