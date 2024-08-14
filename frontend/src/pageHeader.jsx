import React, { useState, useEffect } from 'react';
import './pageHeader.css';

function PageHeader({isVisible}) {


    return (
        <div className="header" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-out' }}>
            <h1>TextBit</h1>
            <h2 className='sub-title'>-Små tekster, grukk og dikt</h2>
        </div>
    );
}

export default PageHeader;
