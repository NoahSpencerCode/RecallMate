import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';

const EmptyPage = ({ setCurrentPage, currentMemory }) => {


    return (
        <View style={styles.container}>
            <Text style={styles.title}>No Memory Selected</Text>
            <View style={styles.text}>
                <Pressable style={styles.new} onPress={() => {
                    setCurrentPage('MemoryCreator')
                }}>
                    <Text style={styles.newText}>Create +</Text>
                </Pressable>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        margin: 0,
        paddingTop: 80,
        backgroundColor: '#05202a',
        flex: 1,
        shadowColor: 'black',
        shadowRadius: 20,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
    },
    buttonFrame: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 40,
        alignItems: 'center'
    },
    completeButton: {
        height: 60,
        width: 180,
        backgroundColor: '#4dcbf7',
        borderRadius: '100%',
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
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: {
            width: 1,
            height: 2,
        }
    },
    text: {
        backgroundColor: '#1e2b36',
        margin: 50,
        height: '70%',
        padding: 10,
        color: 'white',
    },
    answerInput: {
        backgroundColor: '#1e2b36',
        margin: 20,
        padding: 10,
    },
    new: {
        margin: 'auto',
        width: 180,
        height: 80,
        backgroundColor: '#4dcbf7',
        borderRadius: '10px',
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowRadius: 10,
    },
    newText: {
        margin: 'auto',
        textAlign: 'center',
        color: 'white',
        fontSize: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowRadius: 10,
        textShadowOffset: {
            width: 1,
            height: 2,
        }
    }
});

export default EmptyPage;