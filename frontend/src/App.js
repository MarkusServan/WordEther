import './App.css';
import { Box} from "@chakra-ui/react";
import TextCarousel from "./TextCarousel";
import PageHeader from './pageHeader';
import BottomRightIcons  from "./edgeIcons";
import Instructions from "./Instructions"
import {useState} from 'react';
import ScrollInstructions from './ScrollInstructions';

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
        <Instructions />
       
        <TextCarousel showInput={showInput} toggleShowInput= {toggleShowInput}/>
        <BottomRightIcons toggleShowInput={toggleShowInput} />

      </Box>
    </Box>

  );
}



export default App;
