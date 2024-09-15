import React from 'react';
import { Text, Pressable, StyleSheet, Modal, View } from 'react-native';


export default Confirmation = ({ text = "Are you sure?", onNoPress, onYesPress, setModalVisible, modalVisible }) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{text}</Text>
                    <View style={styles.flexStyle}>
                        <Pressable
                            style={styles.margins}
                            onPress={() => {
                              setModalVisible(!modalVisible)
                              onNoPress()
                            }}
                        >
                            <Text style={styles.textStyle}>No</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose, styles.margins]}
                            onPress={() => {
                              setModalVisible(!modalVisible)
                              onYesPress()
                            }}
                        >
                            <Text style={styles.textStyle}>Yes</Text>
                        </Pressable>
                        
                    </View>
                    
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    margins: {
        margin: 20,
        padding: 30
    },
    flexStyle: {
        display: 'flex',
        flexDirection: 'row',
        rowGap: 40
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: '#05202a',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#c70000',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      color: 'white',
      marginBottom: 15,
      textAlign: 'center',
    },
  });