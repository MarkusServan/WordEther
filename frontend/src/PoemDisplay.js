/* // PoemDisplay.js
import React from 'react';
import { data } from './data';

const PoemDisplay = ({ id }) => {
  // Find the poem by id
  const poem = data.find(poem => poem.id === id);
  console.log("Rendering PoemDisplay with id:", id, "Found poem:", poem);

  
  return (
    <div className='center-text'>
      <p>{poem.text}</p>
    </div>
  );
};

export default PoemDisplay;
 */