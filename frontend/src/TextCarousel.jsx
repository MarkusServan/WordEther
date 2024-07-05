import React, { useState, useEffect } from 'react';
import './TextCarousel.css'; // Ensure you import the CSS


function TextCarousel() {



  const [poems, setPoems] = useState([]);
  const [poem, setPoem] = useState(null);
  const [currentId, setCurrentId] = useState(null);

  const [animation, setAnimation] = useState('slide-in');

  //Remember to change this so that it doesn't load all poems, but a certain number
  useEffect(() => {
    fetch('http://localhost:5000/poems')
      .then(response => response.json())
      .then(data => {

        if (data.length > 0) {
          setPoems(data)
          
        }
        else(console.log("no poems fetched"));
      })
      .catch(error => console.error('Error:', error));
  },[]); //passing an empty array to make the effect run only after the intial render


  useEffect(() => {
    setCurrentId(getRandomNumber(poems.length - 1));
    setPoem(poems[currentId]);
    console.log(poems); // This will log the poems to the console after they are set
  }, [poems]);

  function getRandomNumber(x) {
    return Math.floor(Math.random() * (x + 1));
  }
  // Function to handle changing text on click
  const handleClick = () => {
    setAnimation('slide-out-up'); // Start by sliding out
    setTimeout(() => {
      let newId = getRandomNumber(poems.length - 1);
      while (newId === currentId) {
        newId = getRandomNumber(poems.length - 1)
      }
      setCurrentId(newId);
      setPoem(poems[currentId]);
      setAnimation('slide-in-up'); // Then slide in the new text
    }, 500);
  };

  const handleArrowUp = () => {
    setAnimation('slide-out-down');
    setTimeout(() => {
      let newId = getRandomNumber(poems.length - 1);
      while (newId === currentId) {
        newId = getRandomNumber(poems.length - 1)
      }
      setCurrentId(newId);
      setPoem(poems[currentId]);
      setAnimation('slide-in-down');
    }, 500);
  };

  //Remember to handle keyboard clicks on plus and help
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === ' ' || event.key === 'Enter' || event.key === "ArrowDown") {
        handleClick();
      }
      else if (event.key === 'ArrowUp') {
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
      <p className={`text-slide ${animation}`}>{poem ? poem.data : "Loading poem..."}</p>
    </div>
  );
}

export default TextCarousel;
