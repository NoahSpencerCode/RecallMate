import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TextInput, Pressable, StyleSheet} from 'react-native';

const MemoryCreator = ({ setCurrentPage }) => {
  const [isComplete, setIsComplete] = useState(false);
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>New Memory</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor={'#818282'}
          color={'white'}
          keyboardAppearance={'dark'}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Text"
          placeholderTextColor={'#818282'}
          color={'white'}
          keyboardAppearance={'dark'}
          multiline={true}
        />
        <TextInput
          style={styles.answerInput}
          placeholder="Answer Input (Optional)"
          placeholderTextColor={'#818282'}
          color={'white'}
          keyboardAppearance={'dark'}
        />
        
      </ScrollView>
      <View style={styles.buttonFrame}>
        <Pressable style={styles.completeButton} onPress={() => {
            setIsComplete(true);
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
  titleInput: {
    backgroundColor: '#1e2b36',
    margin: 20,
    height: 40,
    padding: 10,
  },
  textInput: {
    backgroundColor: '#1e2b36',
    margin: 20,
    padding: 10,
    height: 100,
  },
  answerInput: {
    backgroundColor: '#1e2b36',
    margin: 20,
    padding: 10,
  },
});

export default MemoryCreator;