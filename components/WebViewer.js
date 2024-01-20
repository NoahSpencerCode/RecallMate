import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, Button, Platform } from 'react-native';
import MemoryCreator from './MemoryCreator.js';
import MemoryViewer from './MemoryViewer.js';
import Home from './Home.js';
import EmptyPage from './EmptyPage.js';

const WebViewer = ({ currentPage, setCurrentPage, currentMemory, setCurrentMemory }) => {
    const Page = () => {
        if (currentPage == 'MemoryCreator') {
            return <MemoryCreator setCurrentPage={setCurrentPage} />
        }
        if (currentPage == "MemoryViewer") {
            return <MemoryViewer setCurrentPage={setCurrentPage} currentMemory={currentMemory} />
        }
        return <EmptyPage setCurrentPage={setCurrentPage} />
    }
    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                backgroundColor: 'rgb(14, 19, 29)',
                padding: 30,
                margin: 0,
                height: '100vh',
            }}
        >
            <Home setCurrentPage={setCurrentPage} setCurrentMemory={setCurrentMemory} isWeb={true} />
            <View style={{ margin: 10 }} />
            <Page />
        </View>
    );
}

export default WebViewer;