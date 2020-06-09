import React from "react";
import { makeStyles } from "@material-ui/styles";
import { darken, fade } from "@material-ui/core/styles";
import {Card, Typography} from "@material-ui/core";
import ArLogo from "../../static/AR_Logo.png";
import styled from "styled-components";

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

export const AuthContainerStyles = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 2.4rem;
    @media(min-width: 960px) {
       flex-direction: row;
       padding: 0;
    }  
`;

export const AuthCard = styled(Card)`
    width: 100%;
    max-width: 40rem;
    margin: 1.6rem auto;
    @media(min-width: 960px) {
        margin: 0;
    } 
   
   .MuiCardContent-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 3.2rem;
        @media(min-width: 960px) {
            padding: 4.8rem;
            padding-top: 12.8rem;
        }
        
        .MuiTypography-root {
            margin-bottom: 3.2rem;
            @media(min-width: 960px) {
                width: 100%;
            }
        } 
        .MuiFormControlLabel-label {
            margin-bottom: 0;
        }
        
        form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
        }
        
        .forgot-password {
            margin: .8rem 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .divider {
            margin: 2.4rem 0;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                margin: 0 .8rem;
                font-weight: bold;
            }
        }
        
        .no-account {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3.2rem 0 2.4rem 0; 
            
            .font-medium {
                font-weight: 500;
            }
        }
        
        .MuiDivider-root {
            width: 3.6rem;
        }
   }
   
   
`;

const AuthSplashStyles = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    flex-grow: 0;
    color: white;
    padding: 1.6rem;
    @media (min-width 960px){
        padding: 12.8rem;
        align-items: flex-start;
        flex-shrink: 0;
        flex-grow: 1;
        text-align: left
    }
    
    img {
        width: 25.6rem;
        margin-bottom: 3.2rem;
    }
`;

export const AuthPageSplash = () => {
  return (
    <AuthSplashStyles>
        <img src={ArLogo} alt="logo" />

      <div>
        <Typography variant="h3" color="inherit">
          Welcome Back to Audition Revolution!
        </Typography>
      </div>

      <div>
        <Typography
          variant="subtitle1"
          color="inherit"
        >
          Sign In Or Create New Account!
        </Typography>
      </div>
    </AuthSplashStyles>
  );
};
