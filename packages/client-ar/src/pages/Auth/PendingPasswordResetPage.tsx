import React from "react";
import { Card, CardContent, Theme, Typography } from "@material-ui/core";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@material-ui/styles";
import ARLogo from "../../static/AR_Logo.png";
import {AuthContainerStyles} from "./SharedAuth";
import styled from "styled-components";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background:
      "radial-gradient(" +
      darken(theme.palette.primary.dark, 0.5) +
      " 0%, " +
      theme.palette.primary.dark +
      " 80%)",
    color: theme.palette.primary.contrastText,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

interface PendingVerificationProps {
  type: "actor" | "company";
}

export const PendingPassCardStyles = styled(Card)`
  width: 100%;
  max-width: 38rem;
  
  .MuiCardContent-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3.2rem;
    text-align: center;
    
    img { margin: 3.2rem }
  }
`;

function PendingPasswordResetPage(props: PendingVerificationProps) {
  const classes = useStyles();

  return (
    <AuthContainerStyles className={classes.root}>
        <PendingPassCardStyles>
          <CardContent>
            <img src={ARLogo} alt="logo" />

            <Typography variant="subtitle1">
              Password Reset Complete!
            </Typography>
            <Typography color="textSecondary">
              We've sent you an email with further instructions.
            </Typography>
            <br />
            <Typography color="textSecondary">
              Please look out for an email from
              "support@auditionrevolution.com" to complete your password
              reset.
            </Typography>
          </CardContent>
        </PendingPassCardStyles>
    </AuthContainerStyles>
  );
}

export default PendingPasswordResetPage;
