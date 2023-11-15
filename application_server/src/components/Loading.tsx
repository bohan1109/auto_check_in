import React from 'react';
import { CircularProgress, Backdrop } from '@mui/material';

interface LoadingComponentProps {
    loading: boolean;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ loading }) => {
    return (
        <Backdrop open={loading} style={{ color: '#fff', zIndex: 1000 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingComponent;