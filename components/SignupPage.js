import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

const SignupPage = ({ setCurrentPage, setLoggedIn, setMyUID }) => {
    const [isComplete, setIsComplete] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>New Account</Text>
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
            <View style={styles.buttonFrame}>
                <Pressable style={styles.completeButton} onPress={() => {

                    createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
                        .then((userCredential) => {
                            const user = userCredential.user;
                            doc(FIREBASE_DB, collection(FIREBASE_DB, 'users').path, user.uid)
                            setMyUID(user.uid)
                            setIsComplete(true);
                            setCurrentPage('Home')
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.warn(errorCode,errorMessage);
                        })

                }}>
                    <Text style={styles.completeText}>Sign up</Text>
                </Pressable>
            </View>
            <Pressable style={styles.createAccount} onPress={() => {

                setIsComplete(true);
                setCurrentPage('Login')
            }}>
                <Text style={styles.completeText}>Login</Text>
            </Pressable> 
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        backgroundColor: '#05202a',
        flex: 1,
        ...Platform.select({
            web: {
                shadowColor: 'black',
                shadowRadius: 20,
                width: '40%',
                marginLeft: '30%',
                marginRight: '30%',
            }
        })
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
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

export default SignupPage;