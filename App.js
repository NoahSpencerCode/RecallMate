import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TextInput, Button} from 'react-native';
import MemoryCreator from './components/MemoryCreator.js';
import MemoryViewer from './components/MemoryViewer.js';
import Home from './components/Home.js';
import store from './redux/store.js';
import { Provider } from 'react-redux';

const App = () => {
  console.log("Render App");
  const [currentPage, setCurrentPage] = useState('Home');
  const [currentMemory, setCurrentMemory] = useState('');
  const Page = () => {
    if (currentPage == 'MemoryCreator') {
      return <MemoryCreator setCurrentPage={setCurrentPage} />
    }
    if (currentPage == "Home") {
      return <Home setCurrentPage={setCurrentPage} setCurrentMemory={setCurrentMemory} />
    }
    if (currentPage == "MemoryViewer") {
      return <MemoryViewer setCurrentPage={setCurrentPage} currentMemory={currentMemory} />
    }
  }
  return (
    <Provider store={store}>
      <Page/>
    </Provider>
  );
};

export default App;