import React from "react";
import { makeStyles } from "@material-ui/styles";
import { darken, fade } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import ArLogo from "../../static/AR_Logo.png";

export const useAuthStyles = makeStyles((theme: any) => ({
  root: {
    background:
      "linear-gradient(to right, " +
      theme.palette.primary.dark +
      " 0%, " +
      fade(darken(theme.palette.primary.dark, 0.5), 0.5) +
      " 100%), url(https://images.unsplash.com/photo-1530234332485-f2c7355bd1ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80)",
    backgroundSize: "cover",
    color: theme.palette.primary.contrastText
  }
}));

export const AuthPageSplash = () => {
  return (
    <div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
      <div>
        <img className="w-256 mb-32" src={ArLogo} alt="logo" />
      </div>

      <div>
        <Typography variant="h3" color="inherit" className="font-light">
          Welcome Back to Audition Revolution!
        </Typography>
      </div>

      <div>
        <Typography
          variant="subtitle1"
          color="inherit"
          className="max-w-512 mt-16"
        >
          Sign In Or Create New Account!
        </Typography>
      </div>
    </div>
  );
};
