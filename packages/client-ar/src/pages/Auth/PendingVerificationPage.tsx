import React from "react";
import {
  Button,
  CardContent,
  Theme,
  Typography
} from "@material-ui/core";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@material-ui/styles";
import ARLogo from "../../static/AR_Logo.png";
import arAxios from "../../utils/axiosHelper";
import { useSnackbar } from "notistack";
import {AuthContainerStyles} from "./SharedAuth";
import {PendingPassCardStyles} from "./PendingPasswordResetPage";

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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

interface PendingVerificationProps {
  type: "actor" | "company";
}

function PendingVerificationPage(props: PendingVerificationProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  function sendVerificationEmail() {
    arAxios.get("/auth/resendVerification");
    enqueueSnackbar("Sent New Verification Email", {
      variant: "success",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right"
      }
    });
  }

  return (
    <AuthContainerStyles className={classes.root}>
          <PendingPassCardStyles >
            <CardContent>
              <img src={ARLogo} alt="logo" />

              <Typography variant="subtitle1">
                Thank you for joining Audition Revolution!
              </Typography>

              {props.type === "company" && (
                <>
                  <Typography color="textSecondary">
                    You’re almost there! We just sent an email to verify your
                    account. You should receive it soon - be on the lookout!
                  </Typography>
                  <Typography color="textSecondary">
                    Our Team will be in touch with you soon!
                  </Typography>
                </>
              )}
              {props.type === "actor" && (
                <>
                  <Typography color="textSecondary">
                    You’re almost there! We just sent an email to verify your
                    account. You should receive it soon - be on the lookout!
                  </Typography>
                  <br />
                  <Typography color="textSecondary">
                    To be sure you receive all notifications from Audition
                    Revolution, whitelist support@auditionrevolution.com and
                    check your spam and promotions folder.
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => sendVerificationEmail()}
                  >
                    Resend Verification Email
                  </Button>
                </>
              )}
            </CardContent>
          </PendingPassCardStyles>
    </AuthContainerStyles>
  );
}

export default PendingVerificationPage;
