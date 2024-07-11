import './App.css';
import { Box} from "@chakra-ui/react";
import TextCarousel from "./TextCarousel";
import PageHeader from './pageHeader';
import BottomRightIcons, {TopLeftHamburgerIcon}  from "./edgeIcons";
import {useState} from 'react';

function App() {
  const bgColor = '#B4A175'
  const [showInput, setShowInput] = useState(false);

 

  const toggleShowInput = () => {
    setShowInput(!showInput);
  };

  return (
    <Box bg={bgColor} minH="100vh" >

      <Box>
        <PageHeader />
        <TextCarousel showInput={showInput} toggleShowInput= {toggleShowInput}/>
        <BottomRightIcons toggleShowInput={toggleShowInput} />
        <TopLeftHamburgerIcon />

      </Box>
    </Box>

  );
}



export default App;
