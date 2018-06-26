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
                transform: `translate(-${props.width}px, 0)`,
            },
            slides: this._updateSlides(props.slides.map((s, i) => ({
                offset: i * props.width,
                index: i,
            })), 0),
        };
        this._carouselNode = null;
        this._onTransformEnd = () => {};
    }
    _onTransitionEndHandler = () => this._onTransformEnd();
    componentDidMount() {
        this._carouselNode.addEventListener("transitionend", this._onTransitionEndHandler);
    }
    componentWillUnmount() {
        this._carouselNode.removeEventListener("transitionend", this._onTransitionEndHandler);
    }
    _updateSlides(slides, delta) {
        const scopeWidth = this.props.width * this.props.slides.length;
        let newSlides;
        if (delta < 0) {
            newSlides = [...slides.slice(1), slides[0]];
        } else {
            newSlides = [slides[slides.length - 1], ...slides.slice(0, slides.length - 1)];
        }
        const result = newSlides.map((slide, i) => ({
            ...slide,
            offset: i * this.props.width,
        }))
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
    _move (delta, newPositionX) {
        const slides = this._updateSlides(this.state.slides, delta);
        this._onTransformEnd = () => {
            this.setState({
                index: this._getNewIndex(delta),
                slides,
                carouselStyle: {
                    ...this.state,
                    transform: `translate(-${this.props.width}px, 0)`,
                    transition: 'unset',
                }
            });
        };
        this.setState(state => ({
            carouselStyle: {
                ...state,
                transform: `translate(${newPositionX}px, 0)`,
                transition: 'transform .7s ease',
            }
        }));
    }
    incIndex = () => {
        this._move(1, 0);
    };
    decIndex = () => {
        this._move(-1, -this.props.width * 2);
    };
    _grabCarouselNode = c => {
        this._carouselNode = c;
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
                <ul
                    ref={this._grabCarouselNode}
                    className="b-carousel"
                    style={this.state.carouselStyle}
                >
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