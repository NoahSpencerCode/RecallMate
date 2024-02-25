import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';


export default Back = ({ text = "Back", onPress }) => {

    return (
        <Pressable style={memoryStyles.frame} onPress={onPress}>
            <Text style={memoryStyles.text}>{"< "}{text}</Text>
        </Pressable>
    );
}

const memoryStyles = StyleSheet.create({
    frame: {
        height: 60,
    },
    text: {
        paddingLeft: 20,
        color: '#4dcbf7',
        height: '100%',
        lineHeight: 0,
        fontSize: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowRadius: 10,
        textShadowOffset: {
            width: 1,
            height: 2,
        }
    }
});