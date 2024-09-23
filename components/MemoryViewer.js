import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Platform, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { reviewMemory, removeMemory } from '../redux/memoriesSlice';
import Back from './Back';
import Delete from './Delete';
import Confirmation from './Confirmation';

const MemoryViewer = ({ setCurrentPage, currentMemory, myUID, isPreview }) => {
  const memory = useSelector((state) => state.memories.documents.find(obj => obj.id === currentMemory));
  console.log("answer", memory.answer);
  const dispatch = useDispatch();

  const onNoPress = () => {}

  const onYesPress = () => {
    dispatch(removeMemory({ memory, myUID }))
    setCurrentPage('Home')
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  // Animated value for shaking effect
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  console.log("ATTREWMPS", attempts)
  const ValidateAnswer = () => {
    setAttempts(attempts + 1);  // increment attempts
    if (answerInput === memory.answer) {
      setIsCorrect(true);
      return true;
    } else {
      triggerShake();  // trigger shake animation on validation fail
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <Back onPress={() => setCurrentPage('Home')} />
      <ScrollView>
        <Text style={styles.title}>{memory.title}</Text>
        <Text style={styles.text}>{memory.text}</Text>
        {memory.answer !== '' && memory.answer !== undefined && (
          <>
            <TextInput
              style={styles.answerInput}
              placeholder="Answer"
              placeholderTextColor={'#818282'}
              color={'white'}
              keyboardAppearance={'dark'}
              onChangeText={newText => setAnswerInput(newText)}
            />
            {!isCorrect && (attempts < 3) && (
              <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
                <Pressable style={styles.checkButton} onPress={ValidateAnswer}>
                  <Text style={styles.completeText}>Check</Text>
                </Pressable>
              </Animated.View>
            )}
            {attempts > 2 && (
              <Text style={styles.text}>{memory.answer}</Text>
            )}
          </>
        )}
      </ScrollView>
      <Delete onPress={() => setModalVisible(true)} />
      <Confirmation
        text="Delete Memory?"
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        onNoPress={onNoPress}
        onYesPress={onYesPress}
      />
      {!isPreview && isCorrect && (
        <View style={styles.buttonFrame}>
          <Pressable
            style={styles.completeButton}
            onPress={() => {
              dispatch(reviewMemory({ memory, myUID }));
              setCurrentPage('Home');
            }}
          >
            <Text style={styles.completeText}>Complete</Text>
          </Pressable>
        </View>
      )}
      {!isPreview && !isCorrect && (attempts > 2) && (
        <View style={styles.buttonFrame}>
          <Pressable
            style={styles.completeButtonFail}
            onPress={() => {
              dispatch(reviewMemory({ memory, myUID, isFailed: true }));
              setCurrentPage('Home');
            }}
          >
            <Text style={styles.completeText}>Complete</Text>
          </Pressable>
        </View>
      )}
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
      },
    }),
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
    alignItems: 'center',
  },
  completeButton: {
    height: 60,
    width: 180,
    backgroundColor: '#4dcbf7',
    borderRadius: '30px',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowRadius: 10,
  },
  completeButtonFail: {
    height: 60,
    width: 180,
    backgroundColor: '#FF0000',
    borderRadius: '30px',
    shadowColor: 'black',
    shadowOpacity: 0.5,
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
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowRadius: 10,
  },
  completeText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowRadius: 10,
    textShadowOffset: {
      width: 1,
      height: 2,
    },
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
    color: 'white',
  },
});

export default MemoryViewer;
