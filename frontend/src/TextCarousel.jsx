import React, { useState, useEffect, useRef } from 'react';
import './TextCarousel.css'; // Ensure you import the CSS
import { FaCloudUploadAlt, FaBackspace, FaRegHeart, FaHeart } from "react-icons/fa";
import { Box, Input, useColorMode, Icon, IconButton } from "@chakra-ui/react";


function TextCarousel({ showInput, toggleShowInput }) {

  const [poems, setPoems] = useState([]);
  const [currentPoem, setCurrentPoem] = useState(null);
  const [updated, setUpdate] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [animation, setAnimation] = useState('slide-in');
  const textareaRef = useRef(null);
  const carouselRef = useRef(null);
  const [text, setText] = useState('');
  const maxChars = 200;

  const [liked, setLiked] = useState(false);
  const [animatingLike, setAnimatingLike] = useState(false);

  const [likedPoems, setLikedPoems] = useState(() => {
    // Retrieve liked poems from Local Storage or set to an empty array if none
    const savedLikes = JSON.parse(localStorage.getItem('likedPoems') || '[]');
    return new Set(savedLikes);
  });

  useEffect(() => {
    // Convert the Set to an Array for storage
    localStorage.setItem('likedPoems', JSON.stringify([...likedPoems]));
  }, [likedPoems]);

  //Remember to change this so that it doesn't load all poems, but a certain number
  useEffect(() => {
    fetch('http://localhost:5000/poems')
      .then(response => response.json())
      .then(data => {

        if (data.length > 0) {
          setPoems(data)

        }
        else (console.log("no poems fetched"));
      })
      .catch(error => console.error('Error:', error));
  }, []); //passing an empty array to make the effect run only after the intial render


  useEffect(() => {
    if (!updated && poems.length > 0) {
      setCurrentId(getRandomNumber(poems.length - 1));
    }
    setUpdate(false);
    if (currentId !== null && poems.length > 0) {
      setCurrentPoem(poems[currentId]);
    }
  }, [poems]);


  function getRandomNumber(x) {
    return Math.floor(Math.random() * (x + 1));
  }

  function checkLiked() {
    // Ensure currentPoem is defined and has an _id property
    if (currentPoem && currentPoem._id) {
      // Return true if the currentPoem's ID is in the likedPoems set
      if (likedPoems.has(currentPoem._id)) {
        setLiked(true);
      }
      else {
        setLiked(false);
      }
    }
  }
  useEffect(() => {
    checkLiked()
  }, [currentPoem])


  const handleClick = () => {
    setAnimation('slide-out-up'); // Start by sliding out
    setTimeout(() => {
      let newId = getRandomNumber(poems.length - 1);
      while (newId === currentId) {
        newId = getRandomNumber(poems.length - 1);
      }
      setCurrentId(newId);
      // Sets the new ID
      setCurrentPoem(poems[newId]); // Immediately use newId to set the poem
      setAnimation('slide-in-up'); // Then slide in the new text
    }, 500);
  };

  const handleArrowUp = () => {
    setAnimation('slide-out-down');
    setTimeout(() => {
      let newId = getRandomNumber(poems.length - 1);
      while (newId === currentId) {
        newId = getRandomNumber(poems.length - 1);
      }
      setCurrentId(newId); // Sets the new ID
      setCurrentPoem(poems[newId]); // Immediately use newId to set the poem
      setAnimation('slide-in-down');
    }, 500);
  };


  //Remember to handle keyboard clicks on plus and help
  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.key === ' ' && showInput === false && document.activeElement === carouselRef.current) || (event.key === 'Enter' && showInput === false) || event.key === "ArrowDown") {
        handleClick();
      } else if (event.key === 'ArrowUp') {
        handleArrowUp();
      } else if (event.key === 'Escape' && showInput) {
        setText('');
        toggleShowInput();
      }
      else if (event.key === 'Escape' && !showInput) {
        handleFocusCarousel();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  },); // Added showInput as a dependency


  useEffect(() => {
    if (textareaRef.current && showInput) {
      textareaRef.current.focus();
      // Directly set the style height during input handling to reduce complexity
    }
  }, [showInput]);


  const handleInput = (event) => {
    const { value } = event.target;
    if (value.length <= maxChars) {
      setText(value);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  };



  const handleSubmit = async () => {
    if (text.trim().length > 0) {
      try {
        const response = await fetch('http://localhost:5000/poems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: text,
          }),
        });
        if (response.ok) {
          const newPoem = await response.json();
          setUpdate(true);
          setCurrentId(poems.length); //Such that this poem will show on return
          setPoems([...poems, newPoem]);
          setText('');
          //console.log(newPoem.likes);
          toggleShowInput();

        } else {
          console.error('Failed to save the poem');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleCancel = () => {
    setText('');  // Clear the text input
    toggleShowInput();  // Toggle the visibility of the input field
  };

  const handleLike = async () => {
    if (currentPoem && currentPoem._id) {
      try {
        let url = `http://localhost:5000/poems/${currentPoem._id}/`;
        url += likedPoems.has(currentPoem._id) ? "unlike" : "like";
  
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(currentPoem._id);
  
        if (!response.ok) {
          throw new Error(`Failed to ${likedPoems.has(currentPoem._id) ? "unlike" : "like"} the poem`);
        }
  
        const updatedPoem = await response.json();
        const newLikedPoems = new Set(likedPoems);
        if (likedPoems.has(currentPoem._id)) {
          newLikedPoems.delete(currentPoem._id);
        } else {
          newLikedPoems.add(currentPoem._id);
        }
        setLikedPoems(newLikedPoems);
  
        setPoems((prevPoems) => prevPoems.map(poem =>
          poem._id === currentPoem._id ? { ...poem, likes: updatedPoem.likes } : poem
        ));
  
        setAnimatingLike(true);
        setTimeout(() => {
          setAnimatingLike(false);
        }, 500);
  
      } catch (error) {
        console.error('Error:', error.message);
      }
    } else {
      console.log('No poem selected or poem ID is missing');
    }
  };
  

  const handleFocusCarousel = () => {
    if (carouselRef.current) {
      carouselRef.current.focus();
    }
  };

  return (
    <div className="carousel-container" tabIndex="0" ref={carouselRef}>
      {showInput ? (
        <div>
          <textarea
            ref={textareaRef}
            className="poem-input"
            placeholder="Enter your poem"
            value={text}
            onInput={handleInput}
            maxLength={maxChars}
          ></textarea>
          <IconButton
            aria-label='Cancel poem submission'
            variant='ghost'
            fontSize='20px'
            onClick={handleCancel}
            icon={<FaBackspace />} />
          <IconButton
            aria-label='Upload poem'
            variant='ghost'
            fontSize='20px'
            onClick={handleSubmit}
            icon={<FaCloudUploadAlt />} />

        </div>
      ) : (
        <><p className={`text-slide ${animation}`}>{currentPoem ? currentPoem.data : "Loading poem..."}</p>
          <div className={"like-button-container"}>
            <IconButton
              aria-label='Like Poem'
              variant='ghost'
              fontSize='24px'
              bottom='2px'
              onClick={handleLike}
              icon={liked ? <FaHeart className={animatingLike ? "like-animation" : ""} /> : <FaRegHeart />}
            />
            {currentPoem && currentPoem.likes ? currentPoem.likes : '0'}
          </div></>
      )}

    </div>
  );
}

export default TextCarousel;
