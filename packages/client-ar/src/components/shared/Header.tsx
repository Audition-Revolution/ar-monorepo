import React, { useContext, useState } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import { GlobalContext } from "../../globalContext";
import {
  AppBar,
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Toolbar
} from "@material-ui/core";
import UserMenu from "components/shared/UserMenu";
import ArLogo from "../../static/AR_Logo.png";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import styled from "styled-components";

const AppBarStyles = styled(AppBar)`
  display: flex;
  position: relative;
  z-index: 10;
  
  .image-container {
    display: flex;
    flex-grow: 1;
    justify-content: start;
    align-items: center;
    img {
      width: 12.8rem;
      maxHeight: 6.4rem;
      padding-left: 1.2rem
    }
  }
  
  .right-side {
    display: flex;
  }
`;
const Header = (props: any) => {
  const { state: {userType} } = useContext(GlobalContext);
  const { push } = useHistory();
  const [dbButtonToggle, setDbButtonToggle] = useState(null as any);
  if (
    props.location.pathname === "/login" ||
    props.location.pathname === "/register" ||
    props.location.pathname === "/passwordReset" ||
    props.location.pathname === "/register-company"
  ) {
    return null;
  }

  const handleLogoClick = () => {
    push("/profile");
  };

  return (
    <AppBarStyles id="fuse-toolbar" position="relative" color="default">
      <Toolbar style={{padding: 0}}>
        <div className="image-container" onClick={handleLogoClick}>
          <img src={ArLogo} alt="logo" />
        </div>

        <div className="right-side">
          {userType?.includes("theatre") && (
            <>
              <Button onClick={event => setDbButtonToggle(event.currentTarget)}>
                Talent Database
              </Button>
              <Popover
                open={Boolean(dbButtonToggle)}
                anchorEl={dbButtonToggle}
                onClose={() => setDbButtonToggle(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center"
                }}
                classes={{
                  paper: "py-8"
                }}
              >
                <MenuItem
                  component={Link}
                  to="/search/actor"
                  onClick={() => setDbButtonToggle(null)}
                >
                  <ListItemIcon className="min-w-40">
                    <Icon>search</Icon>
                  </ListItemIcon>
                  <ListItemText style={{paddingLeft: 0}} primary="Actor Search" />
                </MenuItem>
                <MenuItem
                  component={Link}
                  to={`/profile/tags`}
                  onClick={() => setDbButtonToggle(null)}
                >
                  <ListItemIcon style={{minWidth: '4rem'}}>
                    <LocalOfferOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText style={{paddingLeft:0}} primary={"My Tags"} />
                </MenuItem>
              </Popover>
            </>
          )}
          <UserMenu />
        </div>
      </Toolbar>
    </AppBarStyles>
  );
};

const HooksWrapper = (props: any) => {
  const { state: {userId, displayName} } = useContext(GlobalContext);
  return <Header {...props} userId={userId} displayName={displayName} />;
};

export default withRouter(HooksWrapper);
