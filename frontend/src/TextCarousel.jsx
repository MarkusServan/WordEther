import React, { useState, useEffect } from 'react';
import './TextCarousel.css'; // Ensure you import the CSS
import { data } from './data';


function TextCarousel() {



  const initialId = getRandomNumber(data.length - 1);
  const [currentId, setCurrentId] = useState(initialId);
  const [poem, setPoem] = useState(data.find(poem => poem.id === currentId));
  const [animation, setAnimation] = useState('slide-in');

  function getRandomNumber(x) {
    return Math.floor(Math.random() * (x + 1));
  }


  // Function to handle changing text on click
  const handleClick = () => {
    setAnimation('slide-out-up'); // Start by sliding out
    setTimeout(() => {
      let newId = getRandomNumber(data.length - 1);
      while (newId === currentId) {
        newId = getRandomNumber(data.length - 1)
      }
      setCurrentId(newId);
      setPoem(data.find(poem => poem.id === newId));
      setAnimation('slide-in-up'); // Then slide in the new text
    }, 500);
  };

  const handleArrowUp = () => {
    setAnimation('slide-out-down'); 
    setTimeout(() => {
      let newId = getRandomNumber(data.length - 1);
      while (newId === currentId) {
        newId = getRandomNumber(data.length - 1)
      }
      setCurrentId(newId);
      setPoem(data.find(poem => poem.id === newId));
      setAnimation('slide-in-down'); 
    }, 500);
  };

//Remember to handle keyboard clicks on plus and help
useEffect(() => {
  const handleKeyPress = (event) => {
    if (event.key === ' ' || event.key === 'Enter' || event.key === "ArrowDown") {
      handleClick();
    }
    else if (event.key == 'ArrowUp') {
      handleArrowUp();
    }
  };

  // Attach global event listener to the document
  document.addEventListener('keydown', handleKeyPress);

  // Clean up the listener when the component unmounts
  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
}, [currentId]);

return (
  <div className="carousel-container" tabIndex="0" onClick={handleClick}>
    <p className={`text-slide ${animation}`}>{poem ? poem.text : "Loading poem..."}</p>
  </div>
);
}

export default TextCarousel;
