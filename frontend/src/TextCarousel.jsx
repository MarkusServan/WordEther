import React, { useState, useEffect, useRef } from 'react';
import './TextCarousel.css'; // Ensure you import the CSS
import { FaCloudUploadAlt, FaBackspace, FaRegHeart, FaHeart } from "react-icons/fa";
import { IconButton } from "@chakra-ui/react";
import PageHeader from './pageHeader';


function TextCarousel({ showInput, toggleShowInput }) {

  const [poems, setPoems] = useState([]);
  const [currentPoem, setCurrentPoem] = useState(null);
  const [fetchedIds, setFetchedIds] = useState([]);
  const [index, setIndex] = useState(1);

  const [carouselAnimation, setCarouselAnimation] = useState('slide-in');
  const [textareaAnimation, setTextareaAnimation] = useState('fade-in');
  const [likeAnimation, setLikeAnimation] = useState('like-animation');
  const [showTextarea, setShowTextarea] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const hideHeader = () => {
    setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };


  const textareaRef = useRef(null);
  const carouselRef = useRef(null);
  const [text, setText] = useState('');
  const maxChars = 200;

  const [liked, setLiked] = useState(false);
  const [likedPoems, setLikedPoems] = useState(() => {
    // Retrieve liked poems from Local Storage or set to an empty array if none
    const savedLikes = JSON.parse(localStorage.getItem('likedPoems') || '[]');
    return new Set(savedLikes);
  });

  useEffect(() => {
    // Convert the Set to an Array for storage
    localStorage.setItem('likedPoems', JSON.stringify([...likedPoems]));
  }, [likedPoems]);


  const fetchStrings = async () => {
    try {
      const response = await fetch(`http://localhost:5000/poems/random?excludedIds=${encodeURIComponent(JSON.stringify(fetchedIds))}&limit=10`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Apply the new data update immediately, managing duplicates
      setPoems(prevPoems => {
        const newPoems = data.filter(poem => !prevPoems.some(p => p._id === poem._id));
        return [...prevPoems, ...newPoems];
      });
  
      setFetchedIds(prevIds => [...prevIds, ...data.map(item => item._id)]);
  
    } catch (error) {
      console.error("Error fetching poems:", error.message);
    }
  };
  

  //Fetch on first launch
  useEffect(() => {
    fetchStrings();
    handleFocusCarousel();
    setTimeout(() => {
      setIndex(0);
    },200);
  }, [])

  //Re-render when index changes
  useEffect(() => {
    setCurrentPoem(poems[index]);
    if(index !== 0 && index % 18 === 0 ){
      fetchStrings();
    }
    console.log(currentPoem)
    console.log("index: " + index)
  }, [index]);



  function checkLiked() {
    console.log("checkliked")
    if (currentPoem && currentPoem._id) {
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
    hideHeader();
    console.log("clicked");
    console.log(poems)
    setCarouselAnimation('slide-out-up');
    setTimeout(() => {
      setIndex(prevIndex => prevIndex + 1); // Start by sliding out
      setCarouselAnimation('slide-in-up'); // Then slide in the new text
      // Return the unchanged poems array
    }, 500);
  };

  const handleArrowUp = () => {
    console.log("arrowed");
    if (index !== 0) {
      setCarouselAnimation('slide-out-down');

      setTimeout(() => {

        setIndex(prevIndex => prevIndex - 1); // Immediately use newId to set the poem
        setCarouselAnimation('slide-in-down');
      }, 500);

    }
  };

  const handleCancel = () => {
    toggleShowInput();
    setTimeout(() => {
      setText('');  // Clear the text input
      // Toggle the visibility of the input field
    }, 100);
  };


  //Remember to handle keyboard clicks on plus and help
  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.key === ' ' && showInput === false && document.activeElement === carouselRef.current) || (event.key === 'Enter' && showInput === false && document.activeElement === carouselRef.current) || event.key === "ArrowDown") {
        handleClick();
      } else if (event.key === 'ArrowUp') {
        handleArrowUp();
      } else if (event.key === 'Escape' && showInput) {
        handleCancel();
        handleFocusCarousel();
      }
      else if (event.key === 'Escape' && !showInput) {
        handleFocusCarousel();
      }
    };
    const handleMouseClick = (event) => {
      // Implement logic based on where the click occurred or other conditions
      if (event.target === carouselRef.current) {
        setTimeout(() => {

          handleClick();
        }, 100);
      }
    };
    document.addEventListener('click', handleMouseClick);
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.addEventListener('click', handleMouseClick);
    };
  },); // Dependencies: showInput and carouselRef


  useEffect(() => {
    let timeoutId;
    let timeoutId2;

    if (showInput) {

      setCarouselAnimation('slide-out-up');
      setLikeAnimation('fade-out-like');

      timeoutId = setTimeout(() => {
        setShowTextarea(true);
      }, 400);

      timeoutId2 = setTimeout(() => {
        setTextareaAnimation('fade-in');

      }, 500);
    } else {

      setTextareaAnimation('fade-out');
      setCarouselAnimation('slide-in-down');
      setLikeAnimation('fade-in-like')

      timeoutId = setTimeout(() => {
        setShowTextarea(false);
      }, 500);
    }

    return () => clearTimeout(timeoutId);
  }, [showInput]);

  useEffect(() => {
    if (showTextarea && textareaRef.current) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          console.log("text-area current focus");
        }
      }, 500);

    }
  }, [showTextarea]);




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
          setPoems([...poems, newPoem]);
          setIndex(poems.length); //Such that this poem will show on return
          setText('');
          //console.log(newPoem.likes);
          setTimeout(() => {
            toggleShowInput();
            setTimeout(() => {

              handleFocusCarousel();
            }, 20)

          }, 20)

        } else {
          console.error('Failed to save the poem');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
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

        const newLikedPoems = new Set(likedPoems);
        if (likedPoems.has(currentPoem._id)) {
          newLikedPoems.delete(currentPoem._id);
          setLiked(false);
          currentPoem.likes -= 1;
          setLikeAnimation('')
        } else {
          newLikedPoems.add(currentPoem._id);
          setLiked(true);
          setLikeAnimation('like-animation')
          currentPoem.likes += 1;

        }
        setLikedPoems(newLikedPoems);

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
      console.log("carousel-focus")
    }
  };

  return (
    <div className="carousel-container" tabIndex="0" ref={carouselRef}>
      <PageHeader isVisible={isVisible} />
      {showTextarea ? (
        <div className={`textarea-fade ${textareaAnimation}`} >
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
        <><pre className={`text-slide ${carouselAnimation}`}>{currentPoem ? currentPoem.data : ""}</pre>
          <div className={`like-button-container ${likeAnimation}`}>
            <IconButton
              aria-label='Like Poem'
              variant='ghost'
              fontSize='24px'
              bottom='2px'
              onClick={handleLike}
              icon={liked ? <FaHeart /> : <FaRegHeart />}
            />
            {currentPoem && currentPoem.likes ? currentPoem.likes : '0'}
          </div></>
      )}

    </div>
  );
}

export default TextCarousel;
