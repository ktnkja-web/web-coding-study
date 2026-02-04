import React from 'react';
import { useEffect, useState, useRef, RefObject } from 'react';

export const useIntersectionObserver = (options = {}): [RefObject<HTMLDivElement | null>, boolean] => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (elementRef.current) observer.unobserve(elementRef.current);
            }
        }, options);

        const currentRef = elementRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [options]);

    return [elementRef, isVisible];
};