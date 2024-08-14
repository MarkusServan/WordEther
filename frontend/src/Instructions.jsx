import React from 'react';
import './Instructions.css';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { chakra } from '@chakra-ui/react';

function Instructions({isVisible}) {


    return (
        <div className="instructions" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-out' }}>
            <h2 className='legg til'>Legg til din egen textbit  <ArrowForwardIcon /></h2>
        </div>
    );
}

export default Instructions;
