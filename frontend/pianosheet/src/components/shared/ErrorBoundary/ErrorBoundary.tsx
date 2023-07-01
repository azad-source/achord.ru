import * as React from 'react';
import styles from './ErrorBoundary.module.scss';

interface Props {
    children?: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
        console.log(`error: ${error}`);
        console.log(`errorInfo: ${errorInfo}`);
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return <div className={styles.title}>Нас странице произошла ошибка</div>;
        }
        return this.props.children;
    }
}
