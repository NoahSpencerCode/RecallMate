import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';

export default NextMemory = ({ title }) => {

    return (
        <Pressable style={nextStyles.frame}>
            <Text style={nextStyles.text}>{title}</Text>
        </Pressable>
    );
}

const nextStyles = StyleSheet.create({
    frame: {
        backgroundColor: '#39444f',
        borderRadius: 30,
        height: 60,
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowRadius: 10,
    },
    text: {
        textAlign: 'center',
        color: 'grey',
        height: '100%',
        lineHeight: 60,
        fontSize: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowRadius: 10,
        textShadowOffset: {
            width: 1,
            height: 2,
        }
    }
});