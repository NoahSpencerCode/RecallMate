import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TextInput, Pressable, StyleSheet, Platform} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { reviewMemory, removeMemory } from '../redux/memoriesSlice';
import Back from './Back';
import Delete from './Delete';
import Confirmation from './Confirmation';

const MemoryViewer = ({ setCurrentPage, currentMemory, myUID, isPreview }) => {
  const memory = useSelector((state) => state.memories.documents.find(obj => obj.id === currentMemory));

  const dispatch = useDispatch();

  const onNoPress = () => {

  }

  const onYesPress = () => {
    dispatch(removeMemory({ memory, myUID }))
    setCurrentPage('Home')
  }

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Back onPress={() => {
        setCurrentPage('Home')
      }}
      />
      <ScrollView>
        <Text style={styles.title}>{memory.title}</Text>
        <Text style={styles.text}>{memory.text}</Text>
        {memory.answer != '' && memory.answer != null && 
          <>
            <TextInput
                style={styles.answerInput}
                placeholder="Answer"
                placeholderTextColor={'#818282'}
                color={'white'}
                keyboardAppearance={'dark'}
                onChangeText={newText => setAnswer(newText)}
            />
            <Pressable style={styles.checkButton} onPress={() => {
              
            }}>
              <Text style={styles.completeText}>Check</Text>
            </Pressable>
          </>
        }
        
        
      </ScrollView>
      <Delete onPress={() => {
        setModalVisible(true);
      }}
      />
      <Confirmation text="Delete Memory?" setModalVisible={setModalVisible} modalVisible={modalVisible} onNoPress={onNoPress} onYesPress={onYesPress} />
      { !isPreview ? 
      <View style={styles.buttonFrame}>
        <Pressable style={styles.completeButton} onPress={() => {
            dispatch(reviewMemory({ memory, myUID }))
            setCurrentPage('Home')
          }}>
          <Text style={styles.completeText}>Complete</Text>
        </Pressable>
      </View> 
      : null}
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
  checkButton: {
    margin: 'auto',
    height: 30,
    width: 90,
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
    height: 'fit-content',
    //lineHeight: 60,
    margin: 'auto',
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