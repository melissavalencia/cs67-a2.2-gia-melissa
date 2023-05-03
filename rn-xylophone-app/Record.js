import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Audio } from 'expo-av';
import { NoteOne, Red, Green } from './constants/Colors'

const Record = ({ navigation }) => {
	const [recordedURI, setRecordedURI] = useState("");  // the recording is stored at a URI, which we want access to
	const [recording, setRecording] = useState(false);  // whether we are recording or not

	startRecording = async () => {
		try {
		  	// clear old recording URI if there is one
		  	if (recordedURI) { 
				setRecordedURI("");
		  	}
			console.log('requesting recording permissions');
		  	await Audio.requestPermissionsAsync();
		  	await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
		  	}); 

		  	// start recording
		  	const { recording } = await Audio.Recording.createAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
		  	);
		  	setRecording(recording);
		} catch (error) {
		  	console.log(error);
		}
	}
	
	stopRecording = async () =>  {
		try {
			console.log('stopping the recording');
			setRecording(false);
			await recording.stopAndUnloadAsync();
			const uri = recording.getURI(); 
			setRecordedURI(uri); // save uri where recording is stored
			console.log('recording stored at', uri);
		} catch (error) {
			console.log(error)
		}
	}

	playRecording = async () => {
		// only play if we recorded something -- check if we recorded something by checking if recordedURI is not null
		if (recordedURI) {
			// create a new sound object, bc every time we play sound, we have to create a new object
			// this currently doesn't work because there is a problem loading the sound from the URI
			const soundObject = new Audio.Sound()
			try {
				let source = recordedURI;
				await soundObject.loadAsync(source) // problem playing back recorded sound occurs here
				console.log(soundObject);
				await soundObject
					.playAsync()
					.then(async playbackStatus => {
						setTimeout(() => {
							soundObject.unloadAsync()
						}, playbackStatus.playableDurationMillis)
					})
					.catch(error => {
						console.log(error)
					})
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: recording ? Red : Green }]}
                    onPress={() => recording ? this.stopRecording() : this.startRecording()}
                >
                    <Text style={styles.buttonText}>{recording ? 'Press to STOP Recording' : 'Press to START Recording'}</Text>
                </TouchableOpacity>
            </View>
			{ recordedURI ? 
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[styles.button, { backgroundColor: NoteOne }]}
						onPress={() => this.playRecording()}
					>
						<Text style={styles.buttonText}>Play Recording</Text>
					</TouchableOpacity>
				</View>
			: null }
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: NoteOne }]}
                    title="Go to Xylophone page"
                    onPress={() =>
                        navigation.navigate('Xylophone')
                    }
                >
                    <Text style={styles.buttonText}>Go To Xylophone Page</Text>
                </TouchableOpacity>
            </View>
        </View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 25,
		marginTop: 50
	},
	buttonContainer: {
		height: 40,
		margin: 5
	},
	button: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonText: {
		color: '#fff',
		fontSize: 18
	}
});

export default Record;
