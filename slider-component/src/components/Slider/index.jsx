/* author: makarov */

import PropTypes from 'prop-types';
import React from 'react';

import {Slide} from './components/Slide';
import './style.css';

export class Slider extends React.PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
        duration: PropTypes.number,
        slides: PropTypes.arrayOf(PropTypes.object),
    };
    static defaultProps = {
        duration: 400,
        width: 960,
        height: 300,
        slides: [{
            text: "first slide",
            header: "first",
            url: "http://placekitten.com/400/200",
        }, {
            text: "second slide",
            header: "second",
            url: "http://placekitten.com/400/201",
        }, {
            text: "third slide",
            header: "third",
            url: "http://placekitten.com/400/202",
        }],
    };
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            carouselStyle: {
                width: props.width * props.slides.length,
            },
            slides: props.slides.map((s, i) => ({
                offset: i * props.width,
                index: i,
            })),
        };
    }
    _updateSlides(delta) {
        const scopeWidth = this.props.width * this.props.slides.length;
        const result = this.state.slides.map((slide, i) => {
            let newOffset = slide.offset + delta * this.props.width;
            if (Math.abs(newOffset) >= scopeWidth) {
                newOffset = -(newOffset % scopeWidth);
            }
            return {
                ...slide,
                offset: newOffset,
            }
        });
        return result;
    }
    _getNewIndex(delta) {
        let newIndex = this.state.index + delta;
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= this.props.slides.length) {
            newIndex = this.props.slides.length - 1;
        }
        return newIndex;
    }
    incIndex = () => {
        const slides = this._updateSlides(1);
        this.setState({
            index: this._getNewIndex(1),
            slides,
        })
    };
    decIndex = () => {
        const slides = this._updateSlides(-1);
        this.setState({
            index: this._getNewIndex(-1),
            slides,
        })
    };
    render() {
        const {
            width,
            height,
            slides,
        } = this.props;
        return (
            <div className="b-carousel-container" style={{
                width,
                height,
            }}>
                <ul className="b-carousel" style={this.state.carouselStyle}>
                    {
                        this.state.slides.map((slide, i) => (
                            <Slide
                                {...slides[slide.index]}
                                offset={slide.offset}
                                key={`${i}-slide.url`}
                                width={width}
                                height={height}
                            />
                        ))
                    }
                </ul>
                <div className="b-carousel__controls">
                    <div className="b-carousel__arrow-left" onClick={this.incIndex}></div>
                    <div className="b-carousel__arrow-right" onClick={this.decIndex}></div>
                </div>
            </div>
        );
    }
}