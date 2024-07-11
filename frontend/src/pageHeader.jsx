import React, { useState, useEffect } from 'react';
import { useKeyEvent } from './KeyEventProvider';
import './pageHeader.css';

function PageHeader() {
    const [isVisible, setIsVisible] = useState(true);
    const { addKeyListener, removeKeyListener } = useKeyEvent();

    // Function to hide the header
    const hideHeader = () => {  
        setIsVisible(false);
    };

    useEffect(() => {
        // Registers key listener through the global context
        addKeyListener([32, 13, 37, 38, 39, 40], hideHeader);
    // Clean up for global key listener
        return () => {
            removeKeyListener(hideHeader);
        };
    }, [addKeyListener, removeKeyListener]);

    useEffect(() => {
        // Function triggered by mouse clicks and keydowns locally
        const handleMouseClick = () => {
            hideHeader();
        };

        const handleKeyDown = (event) => {
            // Key codes: Space (32), Enter (13), Arrow Keys (37, 38, 39, 40)
            if ([32, 13, 37, 38, 39, 40].includes(event.keyCode)) {
                hideHeader();
            }
        };

        // Add local event listeners
        window.addEventListener('click', handleMouseClick);
        window.addEventListener('keydown', handleKeyDown);

        // Clean up local event listeners
        return () => {
            window.removeEventListener('click', handleMouseClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    

    return (
        <div className="header" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-out' }}>
            <h1>Sidetittelen går her</h1>
            <h2 className='sub-title'>-Små tekster, grukk og dikt</h2>
        </div>
    );
}

export default PageHeader;
