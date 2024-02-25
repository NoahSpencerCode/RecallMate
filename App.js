import React, { useState } from 'react';
import { Platform } from 'react-native';
import MemoryCreator from './components/MemoryCreator.js';
import MemoryViewer from './components/MemoryViewer.js';
import Home from './components/Home.js';
import store from './redux/store.js';
import { Provider } from 'react-redux';
import WebViewer from './components/WebViewer.js';
import LoginPage from './components/LoginPage.js';
import SignupPage from './components/SignupPage.js';


const App = () => {
  console.log("Render App");
  const [currentPage, setCurrentPage] = useState('Login');
  const [currentMemory, setCurrentMemory] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [myUID, setMyUID] = useState('');
  const Page = () => {
    if (Platform.OS == 'web') {
      if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        return <WebViewer myUID={myUID} setMyUID={setMyUID} currentPage={currentPage} setCurrentPage={setCurrentPage} setCurrentMemory={setCurrentMemory} currentMemory={currentMemory} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>
      }
    }
    
    if (currentPage == 'MemoryCreator') {
      return <MemoryCreator myUID={myUID} setMyUID={setMyUID} setCurrentPage={setCurrentPage} />
    }
    if (currentPage == "Home") {
      return <Home myUID={myUID} setCurrentPage={setCurrentPage} setCurrentMemory={setCurrentMemory} />
    }
    if (currentPage == "MemoryViewer") {
      return <MemoryViewer myUID={myUID} setCurrentPage={setCurrentPage} currentMemory={currentMemory} />
    }
    if (currentPage == "MemoryPreview") {
      return <MemoryViewer myUID={myUID} setCurrentPage={setCurrentPage} currentMemory={currentMemory} isPreview={true} />
    }
    if (currentPage == "Login") {
      return <LoginPage setMyUID={setMyUID} setCurrentPage={setCurrentPage} setLoggedIn={setLoggedIn} />
    }
    if (currentPage == "Signup") {
      return <SignupPage setMyUID={setMyUID} setCurrentPage={setCurrentPage} setLoggedIn={setLoggedIn} />
    }
  }
  return (
    <Provider store={store}>
      <Page/>
    </Provider>
  );
};

export default App;