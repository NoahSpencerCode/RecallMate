import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TextInput, Pressable, StyleSheet, Platform} from 'react-native';
import { useDispatch } from 'react-redux';
import { newMemory } from '../redux/memoriesSlice';
import Back from './Back';

const MemoryCreator = ({ setCurrentPage, myUID }) => {

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');

  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Back onPress={() => {
        setCurrentPage('Home')
      }}
      />
      <ScrollView>
        <Text style={styles.title}>New Memory</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor={'#818282'}
          color={'white'}
          keyboardAppearance={'dark'}
          onChangeText={newText => setTitle(newText)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Text"
          placeholderTextColor={'#818282'}
          color={'white'}
          keyboardAppearance={'dark'}
          multiline={true}
          onChangeText={newText => setText(newText)}
        />
        <TextInput
          style={styles.answerInput}
          placeholder="Answer Input (Optional)"
          placeholderTextColor={'#818282'}
          color={'white'}
          keyboardAppearance={'dark'}
          onChangeText={newText => setAnswer(newText)}
        />
        
      </ScrollView>
      <View style={styles.buttonFrame}>
        <Pressable style={styles.completeButton} onPress={() => {
            dispatch(newMemory({ title, text, answer, myUID }))
            setCurrentPage('Home')
          }}>
          <Text style={styles.completeText}>Complete</Text>
        </Pressable>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:80,
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
    color: 'white',
  },
  textInput: {
    backgroundColor: '#1e2b36',
    margin: 20,
    padding: 10,
    height: 100,
    color: 'white',
  },
  answerInput: {
    backgroundColor: '#1e2b36',
    margin: 20,
    padding: 10,
    color: 'white',
  },
});

export default MemoryCreator;