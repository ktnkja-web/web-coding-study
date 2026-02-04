import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import './Feature.css'

interface FeatureItemProps {
    imgSrc: string;
    category: string;
    introduction: string;
    date: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ imgSrc, category, introduction, date }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

    return (
        <div ref={ref} className="feature__item">

            <div className={`feature__img ${isVisible ? 'is-visible' : ''}`}>
                <img src={imgSrc} alt="" />
            </div>

            <div className='features__content'>
                <p className='feature__category'>{category}</p>
                <p className="feature__introduction">{introduction}</p>
                <time className='feature__time' dateTime={date}>{date.replace(/-/g, '.')}</time>
            </div>
        </div>
    );
};

export default FeatureItem;