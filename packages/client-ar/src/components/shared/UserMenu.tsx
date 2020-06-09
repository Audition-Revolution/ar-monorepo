import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { GlobalContext } from "globalContext";
import { gql } from "apollo-boost";
import styled from "styled-components";

const GET_ORGANIZATIONS_FOR_USER = require("graphql/queries/organization/GET_ORGANIZATIONS_FOR_USER.graphql");

const TsIcon: any = Icon;
const GET_ACTOR = gql`
  query getActor($id: String!) {
    getActor(id: $id) {
      id
      firstName
      lastName
      profilePicture {
        url
      }
      profileImages {
        s3Key
        url
      }
    }
  }
`;

const UserMenuStyles = styled.div`
  .menu-button {
    height: 6.4rem;
    margin-left: .8rem;
  }
  
  .menu-name {
    display: none;
    margin-left: 1.2rem;
    @media (min-width: 960px) {
      display: flex;
      flex-direction: column;
    }
  }
  .menu-icon {
  font-size: 1.6rem;
  margin-left: 1.2rem;
  display: none; 
    @media (min-width: 768px) {
      display: flex;
    }
  }
`;

function UserMenu(props: any) {
  const {
    state: { userId, userType }
  } = useContext(GlobalContext);
  const [getActor, { data, loading }] = useLazyQuery(GET_ACTOR, {
    variables: { id: userId }
  });
  const { loading: orgLoading, data: orgData } = useQuery(
    GET_ORGANIZATIONS_FOR_USER
  );

  let orgs = orgData && orgData.getAllOrganizationsForUser;
  const [userMenu, setUserMenu] = useState(null);
  useEffect(() => {
    getActor();
  }, [userId, getActor]);

  if (loading || orgLoading) {
    return <></>;
  }

  const notificationNumber = 0;
  orgs = orgs ? [...orgs.owned, ...orgs.member] : [];
  if (!data) {
    return <div></div>;
  }
  const user = {
    role: "member",
    data: {
      displayName: `${data.getActor.firstName} ${data.getActor.lastName}`,
      email: data.getActor.email,
      photoURL:
        data.getActor.profilePicture && data.getActor.profilePicture.url,
      shortcuts: []
    }
  };

  const userMenuClick = (event: any) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const logOut = () => {
    localStorage.removeItem("accessToken");
    props.history.push("/login");
    window.location.reload();
  };

  return (
    <UserMenuStyles>
      <Button className="menu-button" onClick={userMenuClick}>
        <Badge badgeContent={notificationNumber} color="primary">
          {user.data.photoURL ? (
            <Avatar alt="user photo" src={user.data.photoURL} />
          ) : (
            <Avatar >{user.data.displayName[0]}</Avatar>
          )}
        </Badge>
        <div className="menu-name items-start">
          <Typography component="span">
            {user.data.displayName}
          </Typography>
          <Typography color="textSecondary">
            {userType.join(", ")}
          </Typography>
        </div>

        <TsIcon className="menu-icon" variant="action">
          keyboard_arrow_down
        </TsIcon>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
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
        <MenuItem component={Link} to="/profile" onClick={userMenuClose}>
          <ListItemIcon style={{minWidth: '4rem'}}>
            <Icon>account_circle</Icon>
          </ListItemIcon>
          <ListItemText style={{paddingLeft: 0}} primary="My Profile" />
        </MenuItem>
        <MenuItem
          disabled={true}
          component={Link}
          to="/profile/notifications"
          onClick={userMenuClose}
        >
          <ListItemIcon style={{minWidth: '4rem'}}>
            <Badge badgeContent={notificationNumber} color="primary">
              <Icon>notifications</Icon>
            </Badge>
          </ListItemIcon>
          <ListItemText style={{paddingLeft: 0}} primary="My Notifications" />
        </MenuItem>
        <MenuItem
          disabled={true}
          component={Link}
          to="/profile/auditions"
          onClick={userMenuClose}
        >
          <ListItemIcon style={{minWidth: '4rem'}}>
            <Icon>audiotrack</Icon>
          </ListItemIcon>
          <ListItemText style={{paddingLeft: 0}} primary="My Auditions" />
        </MenuItem>
        {userType.includes("theatre") && (
          <>
            {orgs.map((org: any) => (
              <MenuItem
                disabled={true}
                key={org.id}
                component={Link}
                to={`/organization/${org.id}/projects`}
                onClick={userMenuClose}
              >
                <ListItemIcon style={{minWidth: '4rem'}}>
                  <Icon>group</Icon>
                </ListItemIcon>
                <ListItemText style={{paddingLeft: 0}} primary={org.name} />
              </MenuItem>
            ))}
          </>
        )}
        <MenuItem
          onClick={() => {
            window.location.href = "mailto:support@auditionrevolution.com";
          }}
        >
          <ListItemIcon style={{minWidth: '4rem'}}>
            <Icon>contact_support</Icon>
          </ListItemIcon>
          <ListItemText style={{paddingLeft: 0}} primary="Contact Support" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            userMenuClose();
            logOut();
          }}
        >
          <ListItemIcon style={{minWidth: '4rem'}}>
            <Icon>exit_to_app</Icon>
          </ListItemIcon>
          <ListItemText style={{paddingLeft: 0}} primary="Logout" />
        </MenuItem>
      </Popover>
    </UserMenuStyles>
  );
}

export default withRouter(UserMenu);
