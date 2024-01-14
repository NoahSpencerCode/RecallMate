import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TextInput, Button} from 'react-native';

const MemoryCreator = ({ setCurrentPage }) => {
  const [isComplete, setIsComplete] = useState(false);
  return (
    <View style={{padding:40}}>
      <View style={{height:60}}/>
      <ScrollView>
        <Text>New Memory</Text>
        <View>
          <Image
            source={require('../assets/ReScaleIcon.png')}
            style={{width: 200, height: 200}}
          />
          <Text>Choose a Title</Text>
          
        </View>
        <TextInput
          style={{ 
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
          }}
          placeholder="Memory Title"
        />
        <Text style={{paddingTop:30}}>
          Information
        </Text>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
          }}
          placeholder="Add facts, content, or questions"
        />
        <Text style={{paddingTop:30}}>
          Completion Input (Optional)
        </Text>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
          }}
          placeholder="The Answer to the required question"
        />
      </ScrollView>
      <Button
        onPress={() => {
          setIsComplete(true);
          setCurrentPage('Home')
        }}
        disabled={isComplete}
        title={isComplete ? 'Saving...' : 'Complete'}
      />
    </View>
    
  );
};

export default MemoryCreator;