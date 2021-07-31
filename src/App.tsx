import React from 'react';
import './App.css';
import AppRouter from './router';
import { setUpAxios } from './server';

function App(): JSX.Element {
    React.useEffect(() => {
        setUpAxios();
    });
    return <AppRouter />;
}

export default App;
