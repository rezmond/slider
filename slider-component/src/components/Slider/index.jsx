/* author: makarov */

import PropTypes from 'prop-types';
import React from 'react';

import {Slide} from './components/Slide';
import * as api from './api';
import './style.css';

export class Slider extends React.PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
        delay: PropTypes.number,
        duration: PropTypes.number,
    };
    static defaultProps = {
        delay: 2000,
        duration: 700,
        height: 300,
    };
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            width: props.width,
            slides: [],
        };
        this._slidesData = null;
        this._carouselNode = null;
        this._onTransformEnd = () => {};
    }
    _onTransitionEndHandler = () => this._onTransformEnd();
    _refreshWidth () {
        const width = this._containerNode.offsetWidth;
        this.setState(() => ({
            width,
            carouselStyle: {
                width: width * this._slidesData.length,
                transform: `translate(-${width}px, 0)`,
            },
            slides: this._updateSlides(this._slidesData.map((s, i) => ({
                index: i,
            })), 0, width),
        }));
    }
    _onWithChange = e => {
        this._refreshWidth();
    };
    componentDidMount() {
        this._carouselNode.addEventListener("transitionend", this._onTransitionEndHandler);
        api.getIamges(this.props.url).then(({data}) => {
            console.log("data", data);
            this._slidesData = data.slides;
            window.addEventListener('resize', this._onWithChange);
            this._refreshWidth();
        });

        if (this.props.delay) {
            setInterval(() => {
                this.decIndex();
            }, this.props.delay)
        }
    }
    componentWillUnmount() {
        this._carouselNode.removeEventListener("transitionend", this._onTransitionEndHandler);
        window.removeEventListener('resize', this._onWithChange);
    }
    _updateSlides(slides, delta, width=null) {
        let newSlides;
        if (delta < 0) {
            newSlides = [...slides.slice(1), slides[0]];
        } else {
            newSlides = [slides[slides.length - 1], ...slides.slice(0, slides.length - 1)];
        }
        const result = newSlides.map((slide, i) => ({
            ...slide,
            offset: i * (width || this.state.width),
        }))
        return result;
    }
    _getNewIndex(delta) {
        let newIndex = this.state.index + delta;
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= this._slidesData.length) {
            newIndex = this._slidesData.length - 1;
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
                    transform: `translate(-${this.state.width}px, 0)`,
                    transition: 'unset',
                }
            });
        };
        this.setState(state => ({
            carouselStyle: {
                ...state,
                transform: `translate(${newPositionX}px, 0)`,
                transition: `transform ${this.props.duration}ms ease`,
            }
        }));
    }
    incIndex = () => {
        this._move(1, 0);
    };
    decIndex = () => {
        this._move(-1, -this.state.width * 2);
    };
    _grabCarouselNode = c => {
        this._carouselNode = c;
    };
    _grabContainer = c => {
        this._containerNode = c;
    };
    render() {
        const {
            width,
            height,
        } = this.props;
        return (
            <div
                ref={this._grabContainer}
                className="b-carousel-container"
                style={{
                    height,
                    width,
                }}
            >
                <ul
                    ref={this._grabCarouselNode}
                    className="b-carousel"
                    style={this.state.carouselStyle}
                >
                    {
                        this.state.slides.map((slide, i) => (
                            <Slide
                                {...this._slidesData[slide.index]}
                                offset={slide.offset}
                                key={`${i}-slide.url`}
                                width={this.state.width}
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