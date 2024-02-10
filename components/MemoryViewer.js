import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TextInput, Pressable, StyleSheet, Platform} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { reviewMemory } from '../redux/memoriesSlice';

const MemoryViewer = ({ setCurrentPage, currentMemory, myUID }) => {
  const [isComplete, setIsComplete] = useState(false);
  const memory = useSelector((state) => state.memories.documents.find(obj => obj.id === currentMemory));

  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{memory.title}</Text>
        <Text style={styles.text}>{memory.text}</Text>
        {memory.answer != '' && memory.answer != null ? 
            <TextInput
                style={styles.answerInput}
                placeholder="Answer"
                placeholderTextColor={'#818282'}
                color={'white'}
                keyboardAppearance={'dark'}
                onChangeText={newText => setAnswer(newText)}
            />
        : 
            null
        }
        
        
      </ScrollView>
      <View style={styles.buttonFrame}>
        <Pressable style={styles.completeButton} onPress={() => {
            dispatch(reviewMemory({ memory, myUID }))
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
  text: {
    backgroundColor: '#1e2b36',
    margin: 20,
    height: 40,
    padding: 10,
    color: 'white',
  },
  answerInput: {
    backgroundColor: '#1e2b36',
    margin: 20,
    padding: 10,
  },
});

export default MemoryViewer;