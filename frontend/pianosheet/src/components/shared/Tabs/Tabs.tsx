import * as React from 'react';
import styles from './Tabs.module.scss';
import cn from 'classnames';

interface Props {
    items: string[];
    value: number;
    className?: string;
    onValueChange: (key: number) => void;
}

export const Tabs: React.FC<Props> = ({ items, value, className, onValueChange }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [tabs, setTabs] = React.useState<{
        width?: number;
        sliderStep: number;
        sliderWidth: number;
        transform?: string;
    }>({ sliderStep: 0, sliderWidth: 0 });

    React.useEffect(() => {
        const width = ref.current?.offsetWidth || 0;
        const sliderStep = width / items.length;
        const sliderWidth = 0.8 * sliderStep;

        setTabs((prev) => ({
            ...prev,
            width,
            sliderStep,
            sliderWidth,
            transform: `translateX(${(sliderStep - sliderWidth) / 2}px)`,
        }));
    }, [ref.current]);

    const [slider, setSlider] = React.useState({
        left: 0,
    });

    React.useEffect(() => {
        setSlider((prev) => ({ ...prev, left: value * tabs.sliderStep }));
    }, [value, tabs]);

    return (
        <div
            className={cn(styles.root, className)}
            style={{ width: tabs.width || undefined }}
            ref={ref}
        >
            <div className={styles.tabs}>
                {items.map((caption, index) => (
                    <div
                        key={caption}
                        className={styles.tabs__item}
                        onClick={() => onValueChange(index)}
                    >
                        {caption}
                    </div>
                ))}
            </div>
            <div className={styles.baseline}>
                <div
                    className={styles.baseline__slider}
                    style={{ ...slider, width: tabs.sliderWidth, transform: tabs.transform }}
                />
            </div>
        </div>
    );
};
