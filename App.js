import * as React from 'react';
import { Button, View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView, ToastAndroid, PermissionsAndroid } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon, List, ListItem } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Audio } from "expo-av";

const soundObject = new Audio.Sound();

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
  videoContainer: {
  	backgroundColor: "white",
  	marginBottom: 20,
  	height: Platform.OS !== "web" ? 260 : 270
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
  },
  audioHeader: {
  	flex: 1,
  	flexDirection: "row",
  	paddingBottom: 20,
  	paddingTop: 30,
  	paddingLeft: 20,
  	paddingRight: 20,
  	backgroundColor: "#cfd8dc",
  	zIndex: 4,
  	elevation: 4,
  	maxHeight: 150,
  	//height: 150,
  },
  audioHeaderImage: {
  	width: 100,
  	height: 100,
  	borderRadius: 5,
  	marginRight: 20,
  },
  artistName: {
  	color: "#fff",
  	fontSize: 14,
  	marginTop: 4,
  	marginBottom: 8,
  	fontWeight: "bold",
  	width: "100%"
  },
  artistAlbum: {
  	color: "#f0f3f4",
  	marginBottom: 8,
  	fontSize: 12,
  },
  trackItem: {
  	paddingLeft: 10,
  	paddingRight: 25,
  	paddingTop: 15,
  	paddingBottom: 15,
  	//backgroundColor: "#fff",
  	flex: 1,
  	flexDirection: "row",
  	//borderBottomWidth: 1,
  	//borderBottomColor: "gray"
  },
});

const downloadDocument = async (url, title) => {
	title = title.split(' ').join('-');
	//url = "https://cdns-preview-1.dzcdn.net/stream/c-13039fed16a173733f227b0bec631034-12.mp3";
	if(Platform.OS !== 'web') {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL).catch(err => {console.log(err)});
		if (status === "granted") {
			var fileURI = FileSystem.documentDirectory + title.replace(/[^a-zA-Z ]/g, "") + "." + url.split('.').pop();
			const resp = await FileSystem.downloadAsync(url, fileURI);
			
			//save photo
			try {
				const asset = await MediaLibrary.createAssetAsync(fileURI);
        		await MediaLibrary.createAlbumAsync("Shalom Downloads", asset, false);
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
			// fetch(myUrl).then(function(t) {
			//     return t.blob().then((b)=>{
			//         var a = document.createElement("a");
			//         a.href = URL.createObjectURL(b);
			//         a.setAttribute("download", "Nouveaufichier.jpg");
			//         a.click();
			//     }
			//     );
			// });
			alert('Téléchargement indisponible en mode web!');
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

const list = [
  {
  	id: '1',
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: '2:35'
  },
  {
  	id: '2',
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: '5:06'
  },
];

function formatDuration(duration) {
	return Math.floor(duration/60) + ":" + ('0' + duration%60).slice(-2);
}

function AudiosScreen() {
	const [audios, setAudios] = React.useState([]);
	React.useEffect(function effectFunction() {
		fetch("https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem", {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
				"x-rapidapi-key": "VTFclTfEVAmshQmaJNoPsbhlnoAcp1i978ojsnVvUKgKp4QiG6"
			}
		})
		.then(response => response.json())
		.then(responseJson => {
			setAudios(responseJson.data.slice(0, 7));
		});
   	}, []);

  	const [playing, setPlaying] = React.useState(false);
  	const [soundPlaying, setSoundPlaying] = React.useState(false);
  	const soundLocation = 'https://cdns-preview-1.dzcdn.net/stream/c-13039fed16a173733f227b0bec631034-12.mp3';

  	const playAudio = async (key, sound) => {
	    try {
			if (playing) {
				await soundObject.pauseAsync();
				setPlaying(false);
				showToast("Pause...");
			} 
			else {
				var title = "aezea";
				var url = "lkm.mp3";
				const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL).catch(err => {console.log(err)});
				if (status === "granted") {
					var fileURI = FileSystem.documentDirectory + title.replace(/[^a-zA-Z ]/g, "") + "." + url.split('.').pop();
					const resp = await FileSystem.downloadAsync(url, fileURI);
					
					//save photo
					try {
						setPlaying(true);
						await soundObject.loadAsync({uri: fileURI});
						await soundObject.playAsync();
						showToast("Lecture en cours...");
					}
					catch(err) {
						showToast("Fichier audio inaccessible!");
						console.log(err);
					}
				}
				else {
					showToast("Lecture non autorisée!");
				}
			}
		}
		catch (error) {
			console.log(error);
		}
	};

	const MyMenu = ({url, title}) => {
		const menu = React.useRef();
		const hideMenu = () => menu.current.hide();
		const showMenu = () => menu.current.show();

		return (
			<Menu 
				ref={menu} 
				button={
					<Icon
						reverse
						reverseColor="#bebebe"
						name='ellipsis-v'
						type='font-awesome'
						color='#fff'
						size={9}
						onPress={showMenu} 
						containerStyle={{paddingTop: 0, paddingRight: 20}}
					/>
				}
			>
		        <MenuItem onPress={playAudio}>Lire</MenuItem>
		        <MenuItem onPress={() => {downloadDocument(url, title); hideMenu();}}>Télécharger</MenuItem>
		    </Menu>
		);
	}

	const renderItem = ({ item, index }) => (
  		<View style={styles.trackItem}>
  			<View style={{width: 30, paddingTop: 10}}>
				<Text style={{color: "#bebebe"}}>{index+1}</Text>
			</View>
			<View style={{width: "85%"}}>
				<Text style={{fontWeight: "bold", fontSize: 13}}>{item.title_short}</Text>
				<Text style={{fontSize: 12, color: "#bebebe"}}>{formatDuration(item.duration)}</Text>
			</View>
			<View Style={{alignSelf: "flex-end"}}>
				<MyMenu url={item.preview} title={item.title_short} />
			</View>
  		</View>
	);

  	return (
	    <View style={Platform.OS !== "web" ? {flex: 1} : {flex: 1}}>
	      	<View style={styles.audioHeader}>
	      		<View style={{zIndex: 1, elevation: 1}}>
	      			<Image
						style={styles.audioHeaderImage}
						source={{
					  		uri: "https://generations.fr/media/news/thumb/870x489_5e19b61ec61c4-eminem-gay.jpg"
						}}
					/>
	      		</View>
	      		<View style={{flexDirection:'row', flex: 1, flexWrap: 'wrap', flexShrink: 1}}>
	      			<Text style={styles.artistName}>EMINEM</Text>
	      			<Text style={styles.artistAlbum}>Most Famous Hits</Text>
	      			<Text style={styles.artistAlbum}>10 morceaux - 1:44:56</Text>
	      		</View>

	      	</View>
      		<Icon
				raised
				reverse
				name='play'
				type='font-awesome'
				color='#2196f3'
				reverseColor='white'
				size={22}
				onPress={() => console.log("Gucci gang")} 
				containerStyle={{alignSelf: "flex-end", position: "relative", top: -30, zIndex: 6, elevation: 6}}
			/>
	      	<View style={{flex: 1, zIndex: 2, elevation: 2, marginTop: -50}}>
	      		<ScrollView>
		      		<FlatList
				        data={audios}
				        renderItem={renderItem}
				        keyExtractor={item => item.id}
				    />
			    </ScrollView>
	      	</View>
	    </View>
  	);
}

function VideosScreen() {
	const [videos, setVideos] = React.useState([]);

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
			setVideos(responseJson.slice(0, 3));
		});
   	}, []);

	return (
		<ScrollView style={Platform.OS !== "web" ? {flex: 1} : {flex: 1, overflow: 'auto'}}>
			{
				videos.length !== 0 ? 
					videos.map((photo, i) => (
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
								<div style={{display:"block",width:"inherit",overflow:"hidden",height:"200px"}}>
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
										onPress={() => downloadDocument(photo.thumbnail, photo.title)} 
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
      	<Tab.Screen name="Audios" component={AudiosScreen} />
        <Tab.Screen name="Vidéos" component={VideosScreen} />
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