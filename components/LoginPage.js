import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAllMemories } from '../redux/memoriesSlice';
import { useDispatch } from 'react-redux';


const LoginPage = ({ setCurrentPage, isDesktop, setMyUID }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [valid, setValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();

    let containerStyle

    if (isDesktop) {
        containerStyle = {
            ...styles.container,
            ...desktopOnly.container
        }
    } else {
        containerStyle = styles.container
    }

    return (
        <View style={ containerStyle }>
            <Text style={styles.title}>Welcome</Text>
            <TextInput
                style={styles.titleInput}
                placeholder="name@email.com"
                placeholderTextColor={'#818282'}
                color={'white'}
                keyboardAppearance={'dark'}
                onChangeText={newText => setEmail(newText)}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={'#818282'}
                color={'white'}
                keyboardAppearance={'dark'}
                onChangeText={newText => setPassword(newText)}
            />
            <Text style={styles.error}>{errorMessage}</Text>
            <View style={styles.buttonFrame}>
                <Pressable style={[styles.completeButton, valid ? null : styles.invalid ]} onPress={() => {

                    signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
                        .then((userCredential) => {
                            const user = userCredential.user;
                            setMyUID(user.uid)
                            dispatch(getAllMemories({ myUID: user.uid }))
                            setCurrentPage('Home')
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.warn(errorCode,errorMessage);
                            setValid(false);
                            setErrorMessage(errorCode);
                        })
                }}>
                    <Text style={styles.completeText}>Login</Text>
                </Pressable>
            </View>
            <Pressable style={styles.createAccount} onPress={() => {
                setCurrentPage('Signup')
            }}>
                <Text style={styles.completeText}>Create Account</Text>
            </Pressable>
        </View>

    );
};

const desktopOnly = StyleSheet.create({
    container: {
        width: '40%',
        marginLeft: '30%',
        marginRight: '30%',
    }
});

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        backgroundColor: '#05202a',
        flex: 1,
        ...Platform.select({
            web: {
                shadowColor: 'black',
                shadowRadius: 20,
            }
        })
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    buttonFrame: {
        alignItems: 'center',
        padding: 60,
    },
    completeButton: {
        height: 60,
        width: 180,
        backgroundColor: '#4dcbf7',
        borderRadius: '30px',
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowRadius: 10,
    },
    invalid: {
        backgroundColor: '#FC100D'
    },
    completeText: {
        textAlign: 'center',
        color: 'white',
        height: '100%',
        lineHeight: 60,
        fontSize: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowRadius: 10,
        textShadowOffset: {
            width: 1,
            height: 2,
        }
    },
    titleInput: {
        backgroundColor: '#1e2b36',
        margin: 20,
        height: 40,
        padding: 10,
        marginLeft: 50,
        marginRight: 50,
        color: 'white',
    },
    textInput: {
        backgroundColor: '#1e2b36',
        margin: 20,
        padding: 10,
        marginLeft: 50,
        marginRight: 50,
        color: 'white',
    },
    answerInput: {
        backgroundColor: '#1e2b36',
        margin: 20,
        padding: 10,
    },
});

export default LoginPage;