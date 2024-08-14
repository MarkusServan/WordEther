import React from 'react';
import './ScrollInstructions.css';
import { FaAnglesDown, FaAnglesUp} from "react-icons/fa6";
import { chakra } from '@chakra-ui/react';

function ScrollInstructions({isVisible}) {


    return (
        <div className="scrollInstructions" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-out' }}>
            <div> <FaAnglesUp /> Scroll / Piltaster <FaAnglesDown /></div> 
        </div>
    );
}

export default ScrollInstructions;
