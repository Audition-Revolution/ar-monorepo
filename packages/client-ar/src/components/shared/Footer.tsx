import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { GlobalContext } from "../../globalContext";
import {
  createStyles,
  makeStyles,
  Theme,
  Toolbar,
  Typography
} from "@material-ui/core";
import styled from "styled-components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      bottom: 0,
      width: '100vw',
      position: 'absolute',
      background: '#fff',
      marginTop: '12px',
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
    }
  })
);

const FooterTitle = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 .5rem;
`;
const Footer = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.appBar}>
      <Toolbar style={{padding: 0}}>
        <FooterTitle>
          <Typography variant={"body2"}>Audition Revolution.v2 Beta</Typography>
          <Typography variant={"body2"}>
            Contact Support: support@auditionrevolution.com
          </Typography>
        </FooterTitle>
      </Toolbar>
    </div>
  );
};

const HooksWrapper = (props: any) => {
  const { state: {userId, displayName} } = useContext(GlobalContext);
  return <Footer {...props} userId={userId} displayName={displayName} />;
};

export default withRouter(HooksWrapper);
