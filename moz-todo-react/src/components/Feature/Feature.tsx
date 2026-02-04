import React from 'react';
import FeatureItem from './FeatureItem';

const FEATURE_DATA = [
    { id: 1, img: "/images/feature1.jpg", cat: "category", text: "テキスト...", date: "2024.01.01" },
    { id: 2, img: "/images/feature2.jpg", cat: "category", text: "テキスト...", date: "2024.01.01" },
    { id: 3, img: "/images/feature3.jpg", cat: "category", text: "テキスト...", date: "2024.01.01" },
    { id: 4, img: "/images/feature4.jpg", cat: "category", text: "テキスト...", date: "2024.01.01" },
    { id: 5, img: "/images/feature5.jpg", cat: "category", text: "テキスト...", date: "2024.01.01" },
    { id: 6, img: "/images/feature6.jpg", cat: "category", text: "テキスト...", date: "2024.01.01" },
    { id: 7, img: "/images/feature7.jpg", cat: "category", text: "テキスト...", date: "2024.01.01" },
    { id: 8, img: "/images/feature8.jpg", cat: "category", text: "テキスト...", date: "2024.01.01" },
    { id: 9, img: "/images/feature9.jpg", cat: "category", text: "テキスト...", date: "2024.01.01" },
];

const Feature: React.FC = () => {
    return (
        <section className="feature" id="feature">
            <h2 className="section-title">FEATURE</h2>
            <div className='feature__wrapper'>
                {
                    FEATURE_DATA.map((item) => (
                        <FeatureItem
                            key={item.id}
                            imgSrc={item.img}
                            category={item.cat}
                            introduction={item.text}
                            date={item.date}
                        />
                    ))
                }
            </div>
        </section>
    );
};

export default Feature;