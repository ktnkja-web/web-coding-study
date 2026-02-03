import React from 'react';
import './Hero.css'

const Hero: React.FC = () => {
    return (
        <section className="mainvisual">
            <video autoPlay muted loop playsInline>
                <source src="./images/mov_hts-samp001.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </section>
    );
};

export default Hero;