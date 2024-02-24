import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';


export default Memory = ({ id, title, setCurrentPage, setCurrentMemory }) => {

    return (
        <Pressable style={memoryStyles.frame} onPress={() => {
            setCurrentMemory(id)
            setCurrentPage('MemoryViewer')
        }}>
            <Text style={memoryStyles.text}>{title}</Text>
        </Pressable>
    );
}

const memoryStyles = StyleSheet.create({
    frame: {
        backgroundColor: '#00a8f9',
        borderRadius: '30px',
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
    }
});