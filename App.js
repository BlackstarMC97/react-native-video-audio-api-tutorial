import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  header: {
  	backgroundColor: "#91285f",
  },
  loadingText: {
  	flex: 1, 
  	alignItems: 'center', 
  	justifyContent: 'center',
  	color: "mediumblue",
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
    fetch("https://free-football-soccer-videos.p.rapidapi.com/", {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "free-football-soccer-videos.p.rapidapi.com",
			"x-rapidapi-key": "VTFclTfEVAmshQmaJNoPsbhlnoAcp1i978ojsnVvUKgKp4QiG6"
		}
	})
	.then(response => response.json())
	.then(responseJson => {
		console.log(responseJson);
	})
	.catch(err => {
		console.log(err);
	});
}

function HomeScreen() {
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
			setPhotos(responseJson.slice(0, 5));
		});
   	}, []);

	return (
		<View>
			<View style={{flex: 1, flexDirection:'column'}}>
				{
					photos.length !== 0 ? 
						photos.map((photo, i) => (
							<TouchableOpacity key={i} onPress={() => console.log('Touché')}>
								<View style={styles.videoContainer}>
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
							      	<Text style={styles.videoTitle}>{photo.title.replace(/./,m=>m.toUpperCase())}</Text>
							      	<Text style={styles.videoSubTitle}>Shalom Tabernacle</Text>
							    </View>
							</TouchableOpacity>
						))
					: <Text style={styles.loadingText}>Chargement des vidéos en cours...</Text>
				}
			</View>

						
		</View>
	);
}

function App() {
	return (
	    <NavigationContainer>
	      	<Stack.Navigator screenOptions={{ headerTintColor: 'white', headerStyle: styles.header }}>
		        <Stack.Screen
					name="Home"
					component={HomeScreen}
					options={{ title: 'Shalom Tabernacle - Partie Vidéo' }}
		        />
	      	</Stack.Navigator>
	    </NavigationContainer>
	);
}

export default App;