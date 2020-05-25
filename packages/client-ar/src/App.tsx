import React, { useContext, useEffect } from "react";
import Router from "./Router";
import NavBar from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import { withRouter } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GlobalContext } from "./globalContext";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import createGenerateClassName from "@material-ui/styles/createGenerateClassName";
import clsx from "clsx";
import theme from './themeProvider'
import { SnackbarProvider } from "notistack";
import { Button, LinearProgress, Typography } from "@material-ui/core";
import { useAppStyles } from "./AppStyles";

const TOKEN_CHECK = require("./graphql/queries/TOKEN_CHECK.graphql");

const generateClassName = createGenerateClassName();

const App = () => {
  const { data, loading } = useQuery(TOKEN_CHECK);
  const { setState } = useContext(GlobalContext);
  const classes = useAppStyles();

  useEffect(() => {
    if (data && data.tokenCheck) {
      setState({
        userId: data.tokenCheck.id,
        userType: data.tokenCheck.userType,
        displayName: data.tokenCheck.displayName,
        verified: data.tokenCheck.verified,
        theatreVerified: data.tokenCheck.theatreVerified,
        userEmail: data.tokenCheck.email
      });
    } else if (!loading && !data) {
      setState({
        userId: "none"
      });
    }
  }, [data, loading, setState]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Typography className="text-20 mb-16" color="textSecondary">
          Loading...
        </Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    );
  } else {
    return (
      <StylesProvider generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            ref={notistackRef}
            maxSnack={5}
            action={(key: string) => (
              <Button onClick={onClickDismiss(key)}>Close</Button>
            )}
          >
            <div id="fuse-layout" className={clsx(classes.root)}>
              <div className="flex flex-1 flex-col overflow-hidden">
                <NavBar />
                <div className="flex-grow-1 flex flex-auto flex-col min-h-screen relative">
                  <div
                    style={{
                      marginBottom: "64px",
                      height: "100%",
                      minHeight: "100vh"
                    }}
                  >
                    <Router />
                  </div>
                  <Footer />
                </div>
              </div>
            </div>
          </SnackbarProvider>
        </ThemeProvider>
      </StylesProvider>
    );
  }
};
const notistackRef: any = React.createRef();
const onClickDismiss = (key: string) => () => {
  notistackRef.current.closeSnackbar(key);
};

export default withRouter(App);
