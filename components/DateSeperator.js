import React from 'react';
import { Text, View } from 'react-native';

export default DateSeperator = () => {
    const date = new Date()
    date.setDate(date.getDate() + 1);
    return (
        <View>
            <Text style={{ color: 'grey', textAlign: 'center' }}>Tomorrow</Text>
            <Text style={{ color: 'grey', textAlign: 'center' }}>
                {date.toLocaleString('default', { month: 'long' })} {date.getDate()}
            </Text>
            <Dash />
        </View>
    )
}