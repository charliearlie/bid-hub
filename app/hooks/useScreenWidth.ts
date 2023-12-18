import { useEffect, useState } from 'react'

export type WindowWidth = 'sm' | 'lg';

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState('');

    const setScreenSize = () => {
        if (window.innerWidth < 640) {
            setWindowWidth('sm')
        } else {
            setWindowWidth('lg')
        }
    }

    useEffect(() => {
        if (windowWidth === '') {
            setScreenSize()
        }
        window.addEventListener("resize", setScreenSize);

        return () => {
            window.removeEventListener("resize", setScreenSize)
        }
    }, [windowWidth]);

    return windowWidth as WindowWidth
};

export default useWindowWidth
