import React, {useContext, useEffect, useState} from "react";
import {
    Button,
    Card,
    CardContent,
    Divider,
    TextField,
    Typography
} from "@material-ui/core";
import {useMutation} from "@apollo/react-hooks";
import {Link} from "react-router-dom";
import clsx from "clsx";
import {GlobalContext} from "globalContext";
import {useAuthStyles, AuthPageSplash} from "./SharedAuth";
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
        <div
            className={clsx(
                classes.root,
                "flex flex-col flex-auto flex-shrink-0 min-h-screen p-24 md:flex-row md:p-0"
            )}
        >
            <AuthPageSplash/>
            <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
                <CardContent className="flex flex-col items-center justify-center h-full p-32 md:p-48 md:pt-128 ">
                    <Typography variant="h6" className="md:w-full mb-32">
                        LOGIN TO YOUR ACCOUNT
                    </Typography>

                    <form
                        name="loginForm"
                        noValidate
                        className="flex flex-col justify-center w-full"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            id="login-email"
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
                            className="mb-16"
                            label="Password"
                            type="password"
                            name="password"
                            value={state.password}
                            onChange={(e) => setFormState({password: e.target.value})}
                            variant="outlined"
                            required
                            fullWidth
                        />

                        <div className="mt-8 mb-8 flex items-center justify-between">
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

                    <div className="my-24 flex items-center justify-center">
                        <Divider className="w-32"/>
                        <span className="mx-8 font-bold">OR</span>
                        <Divider className="w-32"/>
                    </div>

                    <div className="flex flex-col items-center justify-center pt-32 pb-24">
                        <span className="font-medium">Don't have an account?</span>
                        <Link className="font-medium" to="/register">
                            Actor? Create an account
                        </Link>
                        <Link className="font-medium" to="/register-company">
                            Company? Request Access
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginPage;
