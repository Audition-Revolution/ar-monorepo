import React, {FC, useContext} from "react";
import {GlobalContext} from "../globalContext";
import {Redirect, Route} from "react-router-dom";
import PendingVerificationPage from "../pages/Auth/PendingVerificationPage";

export const PrivateRoute: FC<any> = ({component: Component, ...rest}) => {
    const {state: {userId, theatreVerified, verified, userType}} = useContext(GlobalContext);
    const loggedIn = userId !== "none";
    if (userType?.includes("theatre") && !theatreVerified) {
        return (
            <Route
                {...rest}
                render={() => <PendingVerificationPage type={"company"}/>}
            />
        );
    }
    if (userType?.includes("actor") && !verified) {
        return (
            <Route
                {...rest}
                render={() => <PendingVerificationPage type={"actor"}/>}
            />
        );
    }
    return (
        <Route
            {...rest}
            render={props =>
                loggedIn ? <Component {...props} /> : <Redirect to="/login"/>
            }
        />
    );
};

export const RedirectIfLoggedIn: FC<any> = (
    {component: Component, ...rest
    }) => {
    const {state: {userId}} = useContext(GlobalContext);
    const loggedIn = userId !== "none";
    return (
        <Route
            {...rest}
            render={props =>
                loggedIn ? <Redirect to="/profile"/> : <Component {...props} />
            }
        />
    );
};
