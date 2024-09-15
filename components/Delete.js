import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';


export default Delete = ({ text = "Delete", onPress }) => {

    return (
            <Pressable style={memoryStyles.center} onPress={onPress}>
                <Text style={memoryStyles.text}>{text}</Text>
            </Pressable>
    );
}

const memoryStyles = StyleSheet.create({
    frame: {
        width: 30,
        height: 30,
        padding: 10,
    },
    center: {

    },
    text: {
        width: 70,
        margin: 20,
        textAlign: 'center',
        color: '#c70000',
        fontSize: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowRadius: 10,
        textShadowOffset: {
            width: 1,
            height: 2,
        }
    }
});