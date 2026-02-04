import React from 'react';
import 'swiper/css';
import './Pickup.css';
import { Swiper, SwiperSlide } from 'swiper/react';

const Pickup: React.FC = () => {
    const images = [
        { id: 1, src: './images/pickup1.jpg', alt: 'Pickup1' },
        { id: 2, src: './images/pickup2.jpg', alt: 'Pickup2' },
        { id: 3, src: './images/pickup3.jpg', alt: 'Pickup3' },
        { id: 4, src: './images/pickup4.jpg', alt: 'Pickup4' },
        { id: 5, src: './images/pickup5.jpg', alt: 'Pickup5' },
        { id: 6, src: './images/pickup6.jpg', alt: 'Pickup6' },
        { id: 7, src: './images/pickup7.jpg', alt: 'Pickup7' },
        { id: 8, src: './images/pickup8.jpg', alt: 'Pickup8' },
        { id: 9, src: './images/pickup9.jpg', alt: 'Pickup9' }
    ];

    return (
        <section id="pickup" className="pickup">
            <h2 className="section-title">PICK UP</h2>

            <Swiper
                direction='horizontal'
                loop={true}
                centeredSlides={true}
                spaceBetween={40}
                slidesPerView={1.5}

                breakpoints={{
                    900: {
                        slidesPerView: 3.5,
                        spaceBetween: 60
                    },
                }
                }>
                {images.map((image) => (
                    <SwiperSlide key={image.id}>
                        <img src={image.src} alt={image.alt} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Pickup;