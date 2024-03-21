
import React, { useState, useMemo, } from 'react';
import { Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import Dashboards from "./screen/Dashboards"

import Context from './main/Context';
import store from './redux/store';
import Login from './screen/login/Login';
import Registers from './screen/Registers';

function App() {

    const [userToken, setUserToken] = useState(false);
    const authContext = useMemo(() => {
        return {
            signIn: () => setUserToken(true),
            signUp: () => setUserToken(true),
            signOut: () => setUserToken(false),
        };
    }, []);

    return (
        <Context.Provider value={authContext}>
            <Provider store={store}>
                {userToken ?
                    <Routes>
                        <Route
                            path="/"
                            element={<Dashboards />}
                        />
                        <Route
                            path="/registers"
                            element={<Registers />}
                />
                    </Routes> :
                    <Routes>
                        <Route
                            path="/"
                            element={<Login />}
                        />
                        <Route
                            path="/:id_company/:email"
                            element={<Login />}
                        />
                        <Route path="*" element={<Login />} />
                    </Routes>
                }
            </Provider>
        </Context.Provider>

    )
}

export default App
