import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Audio } from 'expo-av';
import {
	NoteOne,
	NoteTwo,
	NoteThree,
	NoteFour,
	NoteFive,
	NoteSix,
	NoteSeven,
	Black,
	Green,
	Red
} from './constants/Colors'

// seven different sound files, one for each "button"/xylophone bar
const xyloSounds = {
	one: require('./assets/note1.wav'),
	two: require('./assets/note2.wav'),
	three: require('./assets/note3.wav'),
	four: require('./assets/note4.wav'),
	five: require('./assets/note5.wav'),
	six: require('./assets/note6.wav'),
	seven: require('./assets/note7.wav')
}

const Xylophone = ({ navigation }) => {
	const [notesToPlayBack, setNotesToPlayback] = useState([]);
	const [recording, setRecording] = useState(false);
	const [playNotes, setPlayNotes] = useState(false);

	// function that will play the correct note based on which button was pressed
	handlePlaySound = async (note) => {
		if (recording) {
			setNotesToPlayback(notesToPlayBack.concat(note)) // appending the new note to the array + updating state
		}
		// create a new sound object, bc every time we play sound, we have to create a new object
		const soundObject = new Audio.Sound()
		try {
			let source = xyloSounds[note]
			await soundObject.loadAsync(source)
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

	record = () => {
		setPlayNotes(false);
		setNotesToPlayback([]); // reset the notes when the user clicks the record button
		setRecording(true);
		console.log("playnotes", playNotes);
		console.log("recording", recording);
	}

	stopRecord = () => {
		setRecording(false)
		console.log("recording", recording);
	}

    timeout = (time) => {
        return new Promise(res => setTimeout(res, time));
    }

	handlePlayNotes = async () => {
		// go through array playNotes and play each note for a set amount of time
		setPlayNotes(true);
		for (let i = 0; i < notesToPlayBack.length; i++) {
			console.log("note being played: ", notesToPlayBack[i]);
			const note = notesToPlayBack[i];
            await handlePlaySound(note);
            await timeout(500);
		}
	}

	return (
		<View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: NoteOne }]}
                    onPress={() => this.handlePlaySound('one')}
                >
                    <Text style={styles.buttonText}>Note 1</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: NoteTwo }]}
                    onPress={() => this.handlePlaySound('two')}
                >
                    <Text style={styles.buttonText}>Note 2</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: NoteThree }]}
                    onPress={() => this.handlePlaySound('three')}
                >
                    <Text style={styles.buttonText}>Note 3</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: NoteFour }]}
                    onPress={() => this.handlePlaySound('four')}
                >
                    <Text style={styles.buttonText}>Note 4</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: NoteFive }]}
                    onPress={() => this.handlePlaySound('five')}
                >
                    <Text style={styles.buttonText}>Note 5</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: NoteSix }]}
                    onPress={() => this.handlePlaySound('six')}
                >
                    <Text style={styles.buttonText}>Note 6</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: NoteSeven }]}
                    onPress={() => this.handlePlaySound('seven')}
                >
                    <Text style={styles.buttonText}>Note 7</Text>
                </TouchableOpacity>
            </View>

            {/*new buttons for recording!*/}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Green }]}
                    onPress={() => this.record()}
                >
                    <Text style={styles.buttonText}>Press to Start Recording</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Red }]}
                    onPress={() => this.stopRecord()}
                >
                    <Text style={styles.buttonText}>Press to Stop Recording</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Black }]}
                    onPress={() => this.handlePlayNotes()}
                >
                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Black }]}
                    title="Go to Record page"
                    onPress={() =>
                        navigation.navigate('Record')
                    }
                >
                    <Text style={styles.buttonText}>Go To Recording Page</Text>
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

export default Xylophone;
