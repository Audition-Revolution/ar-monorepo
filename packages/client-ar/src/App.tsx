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
import { Button } from "@material-ui/core";
import { useAppStyles } from "./AppStyles";
import styled from "styled-components";

const TOKEN_CHECK = require("./graphql/queries/TOKEN_CHECK.graphql");

const generateClassName = createGenerateClassName();

const AppStyles = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
  
  .main {
    position: relative;
    min-height: 100vh;
    flex: 1 1 auto;
    flex-direction: column;
    display: flex;  
  }
`;

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
      <AppStyles>
        <div>Loading...</div>
      </AppStyles>
    );
  } else {
    return (
      <StylesProvider injectFirst generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            ref={notistackRef}
            maxSnack={5}
            action={(key: string) => (
              <Button onClick={onClickDismiss(key)}>Close</Button>
            )}
          >
            <div id="fuse-layout" className={clsx(classes.root)}>
              <AppStyles>
                <NavBar />
                <div className="main">
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
              </AppStyles>
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
