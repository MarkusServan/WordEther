import React from 'react';
import './Instructions.css';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { chakra } from '@chakra-ui/react';

function Instructions({isVisible}) {


    return (
        <div className="instructions" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-out' }}>
            <h2 className='legg til'>Legg til dine egne ord  <ArrowForwardIcon /></h2>
        </div>
    );
}

export default Instructions;
