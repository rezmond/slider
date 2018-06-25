/* author: makarov */

import PropTypes from 'prop-types';
import React from 'react';

import "./style.css";

const slidePropTypes = {
    header: PropTypes.string,
    text: PropTypes.string,
    alt: PropTypes.string,
    offset: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export function Slide ({url, header, text, offset, alt, width, height}) {
    return (
        <li className="b-carousel-slide" style={{
            left: offset,
            width,
            height,
        }}>
            {
                header && <h4 className="b-carousel-slide__header">{header}</h4>
            }
            <div className="b-carousel-slide__text">{text}</div>
            <img src={url} alt={alt || text} className="b-carousel-slide__img"/>
        </li>
    )
}
Slide.propTypes = slidePropTypes;