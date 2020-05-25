import "whatwg-fetch";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "typeface-muli";
import "static/styles/index.css";
import { Provider } from "react-redux";
import { GlobalContextProvider } from "./globalContext";
import store from "redux/store";
import "./utils/stringUtils";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import client from "./graphQLClient";
import {BrowserRouter} from "react-router-dom";
import {ApolloProvider} from "@apollo/react-hooks";

ReactDOM.render(
  <GlobalContextProvider>
    <Provider store={store}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ApolloProvider>
        </MuiPickersUtilsProvider>
    </Provider>
  </GlobalContextProvider>,
  document.getElementById("root")
);
