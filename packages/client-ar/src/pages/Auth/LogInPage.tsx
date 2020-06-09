import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    CardContent,
    Divider,
    TextField,
    Typography
} from "@material-ui/core";
import {useMutation} from "@apollo/react-hooks";
import {Link} from "react-router-dom";
import {GlobalContext} from "globalContext";
import {useAuthStyles, AuthPageSplash, AuthContainerStyles, AuthCard} from "./SharedAuth";
import {useSnackbar} from "notistack";
import {ApolloError} from "apollo-boost";

const LOGIN = require("../../graphql/mutations/LOGIN.graphql");

function LoginPage(props: any) {
    const {enqueueSnackbar} = useSnackbar();
    const classes = useAuthStyles();
    const {setState} = useContext(GlobalContext);
    const [login, {data}] = useMutation(LOGIN, {
        onCompleted: () => {
            updateState({
              email: "",
              password: "",
            });
        },
        onError: (error: ApolloError) => {
            enqueueSnackbar(error.message, {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        }
    });

    const [state, updateState] = useState({
        email: "",
        password: "",
    });

    const setFormState = (newState) => updateState({...state, ...newState})

    function isFormValid() {
        return state.email.length > 0 && state.password.length > 0;
    }

    useEffect(() => {
        const user = data && data.login;
        if (user) {
            localStorage.setItem("accessToken", user.accessToken);
            setState({
                userId: user.userId,
                displayName: user.displayName
            });
            props.history.push("/profile");
            window.location.reload();
        }
    }, [data, setState, props.history]);

    function handleSubmit(ev: any) {
        ev.preventDefault();
        const {email, password} = state;
        login({variables: {email, password}});
    }

    return (
        <AuthContainerStyles className={classes.root}>
            <AuthPageSplash/>
            <AuthCard square>
                <CardContent>
                    <Typography variant="h6">
                        LOGIN TO YOUR ACCOUNT
                    </Typography>

                    <form
                        name="loginForm"
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            id="login-email"
                            style={{marginBottom: '1.6rem'}}
                            className="mb-16"
                            label="Email"
                            autoFocus
                            type="email"
                            name="email"
                            value={state.email}
                            onChange={(e) => setFormState({email: e.target.value})}
                            variant="outlined"
                            required
                            fullWidth
                        />

                        <TextField
                            id="login-password"
                            style={{marginBottom: '1.6rem'}}
                            label="Password"
                            type="password"
                            name="password"
                            value={state.password}
                            onChange={(e) => setFormState({password: e.target.value})}
                            variant="outlined"
                            required
                            fullWidth
                        />

                        <div className="forgot-password">
                            <Link className="font-medium" to={"/passwordReset"}>
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="w-full mx-auto mt-16"
                            aria-label="LOG IN"
                            disabled={!isFormValid()}
                        >
                            LOGIN
                        </Button>
                    </form>

                    <div className="divider">
                        <Divider/>
                        <span>OR</span>
                        <Divider/>
                    </div>

                    <div className="no-account">
                        <span className="font-medium">Don't have an account?</span>
                        <Link className="font-medium" to="/register">
                            Actor? Create an account
                        </Link>
                        <Link className="font-medium" to="/register-company">
                            Company? Request Access
                        </Link>
                    </div>
                </CardContent>
            </AuthCard>
        </AuthContainerStyles>
    );
}

export default LoginPage;
