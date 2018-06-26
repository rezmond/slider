/* author: makarov */

import PropTypes from 'prop-types';
import React from 'react';

import {Slide} from './components/Slide';
import './style.css';

export class Slider extends React.PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
        duration: PropTypes.number,
    };
    static defaultProps = {
        duration: 400,
        width: 960,
        height: 300,
    };
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            carouselStyle: {
                width: props.width,
            }
        };
        this._slidesData = [{
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
        }];
        this._slides = [...this._slidesData];
    }
    render() {
        const {
            width,
            height,
        } = this.props;
        return (
            <div className="b-carousel-container" style={{
                width,
                height,
            }}>
                <ul className="b-carousel" style={this.state.carouselStyle}>
                    {
                        this._slides.map((slide, i) => (
                            <Slide
                                {...slide}
                                key={i + slide.url}
                                offset={(width * i) - (this.state.index * width)}
                                width={width}
                                height={height}
                            />
                        ))
                    }
                </ul>
                <div className="b-carousel__controls">
                    <div className="b-carousel__arrow-left"></div>
                    <div className="b-carousel__arrow-right"></div>
                </div>
            </div>
        );
    }
}