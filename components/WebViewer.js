import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, Button, Platform } from 'react-native';
import MemoryCreator from './MemoryCreator.js';
import MemoryViewer from './MemoryViewer.js';
import Home from './Home.js';
import EmptyPage from './EmptyPage.js';
import LoginPage from './LoginPage.js';
import SignupPage from './SignupPage.js';

const WebViewer = ({ currentPage, setCurrentPage, currentMemory, setCurrentMemory, setLoggedIn, setMyUID, myUID, loggedIn }) => {
    const Page = () => {
        if (currentPage == 'MemoryCreator') {
            return <MemoryCreator
                myUID={myUID}
                setMyUID={setMyUID}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setCurrentMemory={setCurrentMemory}
                currentMemory={currentMemory}
                setLoggedIn={setLoggedIn}
                loggedIn={loggedIn}
            />
        }
        if (currentPage == "MemoryViewer") {
            return <MemoryViewer
                smyUID={myUID}
                setMyUID={setMyUID}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setCurrentMemory={setCurrentMemory}
                currentMemory={currentMemory}
                setLoggedIn={setLoggedIn}
                loggedIn={loggedIn}
            />
        }
        return <EmptyPage setCurrentPage={setCurrentPage} />
    }
    if (currentPage == 'Login') {
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
                <LoginPage myUID={myUID} setMyUID={setMyUID} setCurrentPage={setCurrentPage} setLoggedIn={setLoggedIn} isWeb={true} />
            </View>
        );

    } else if (currentPage == 'Signup') {
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
                <SignupPage myUID={myUID} setMyUID={setMyUID} setCurrentPage={setCurrentPage} setLoggedIn={setLoggedIn} isWeb={true} />
            </View>
        );
    } else {
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
                <Home myUID={myUID} setMyUID={setMyUID} setCurrentPage={setCurrentPage} setCurrentMemory={setCurrentMemory} isWeb={true} />
                <View style={{ margin: 10 }} />
                <Page />
            </View>
        );
    }

}

export default WebViewer;