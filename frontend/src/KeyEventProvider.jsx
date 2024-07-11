import React, { createContext, useContext, useEffect, useMemo } from 'react';

const KeyEventContext = createContext();

export function useKeyEvent() {
    return useContext(KeyEventContext);
}

export function KeyEventProvider({ children }) {
    const listeners = useMemo(() => [], []);

    const addKeyListener = (keys, callback) => {
        listeners.push({ keys, callback });
    };

    const removeKeyListener = (callback) => {
        const index = listeners.findIndex(listener => listener.callback === callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            listeners.forEach(({ keys, callback }) => {
                if (keys.includes(event.key)) {  // Changed keyCode to key
                    callback();
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [listeners]);  // Added listeners to the dependency array

    const value = useMemo(() => ({ addKeyListener, removeKeyListener }), []);

    return (
        <KeyEventContext.Provider value={value}>
            {children}
        </KeyEventContext.Provider>
    );
}
