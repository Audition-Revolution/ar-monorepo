import React, { FC, useContext, useState } from "react";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import ProfileBreakdown from "../../components/profile/ProfileBreakdown";
import { useQuery } from "@apollo/react-hooks";
import { GlobalContext } from "../../globalContext";
import { makeStyles, Tab, Tabs } from "@material-ui/core";
import TabPanel from "components/shared/TabPanel";
import ProfileImagePage from "./ProfileImagePage";
import ProfileHeader from "./ProfileHeader";
import ResumeSection from "./ResumeSection";
import ExperienceSection from "./ExperienceSection";
import ActorSearchPage from "../Search/ActorSearchPage";
import CompanyNotes from "./CompanyNotes";
import LightboxModal from "../../components/shared/LightboxModal";
import MyTags from "./MyTags";
import styled from "styled-components";

const GET_USER = require("../../graphql/queries/user/GET_USER.graphql");

const useStyles = makeStyles(theme => ({
  profilePic: {
    height: 300,
    width: 250,
    "object-fit": "scale-down"
  },
  header: {
    background:
      "linear-gradient(to right, " +
      theme.palette.primary.dark +
      " 0%, " +
      theme.palette.primary.main +
      " 100%)",
    color: theme.palette.primary.contrastText,
    backgroundSize: "cover",
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)'
  }
}));

const ActorProfileStyles = styled.div`
  padding: .5rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  .profile-pic {
    width: 33.3333%;
  }
  .profile-info-container {
    width: 66.6666%;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    height: 100%;
  }
  
  .MuiTabs-root {
    height: 6.4rem
  }
`;

const ResumeSectionStyles = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  @media(min-width: 1220px) {
    flex-direction: row;
  }
  
  .experience-section {
    margin-right: 2.4rem;
    @media(min-width: 1220px) {
      width: 66.6666%;
    }
  }
  .skill-section {
    @media(min-width: 1220px) {
      width: 33.3333%;
    }
  }
`

const ActorProfilePage: FC<any> = props => {
  const classes = useStyles();
  const { state: {userId} } = useContext(GlobalContext);
  const { readOnly, tabIndex = 0, auditionView = false } = props;
  const [selectedTab, setSelectedTab] = useState(tabIndex);
  const [open, setOpen] = useState(false);

  const id = readOnly ? props.match.params.userId : userId;
  const { data, loading, refetch } = useQuery(GET_USER, {
    variables: { id },
    skip: !id
  });

  const user = data && data.getUser;

  if (!user) {
    return <h1>loading</h1>;
  }

  if (!data || loading) {
    return <h1>loading</h1>;
  }
  let imageUrl =
    "https://image.shutterstock.com/z/stock-vector-default-avatar-profile-icon-grey-photo-placeholder-518740741.jpg";
  if (user.profilePicture && user.profilePicture.url) {
    imageUrl = user.profilePicture && user.profilePicture.url;
  }
  return (
    <div>
      <LightboxModal
        open={open}
        handleClose={() => setOpen(false)}
        images={[{ src: imageUrl }]}
      />
      <div className={classes.header}>
        <ActorProfileStyles>
          <div className={"profile-pic"}>
            <img
              data-cy="profile-picture"
              alt={user.displayName}
              className={classes.profilePic}
              onClick={() => setOpen(true)}
              src={imageUrl}
            />
          </div>
          <div className="profile-info-container">
            <ProfileHeader user={user} />
            <ProfileBreakdown breakdown={user.breakdown || {}} />
          </div>
        </ActorProfileStyles>
        <ProfileSidebar
          user={user}
          auditionView={auditionView}
          readOnly={props.readOnly}
          refetchUser={refetch}
        />
      </div>

      <div>
        <Tabs
          value={selectedTab}
          onChange={(_e: any, val: any) => setSelectedTab(val)}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="off"
        >
          <Tab label="General Resume" />
          <Tab label="Photos" />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <ResumeSectionStyles>
            <div className={"experience-section"}>
              <ExperienceSection
                user={user}
                type={"experience"}
                readOnly={props.readOnly}
              />
            </div>
            <div className={"skill-section"}>
              <ResumeSection
                type={"training"}
                title={"Training"}
                items={user.trainings}
                readOnly={props.readOnly}
                profileOrder={user.profileOrder}
                userId={user.id}
              />
              <ResumeSection
                type={"skill"}
                title={"Special Skills"}
                items={user.specialSkills}
                readOnly={props.readOnly}
                profileOrder={user.profileOrder}
                userId={user.id}
              />
            </div>
          </ResumeSectionStyles>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <ProfileImagePage userId={id} readOnly={readOnly} />
        </TabPanel>
      </div>
    </div>
  );
};

const CompanyProfileStyle = styled.div`
  display: flex;
  .search {
    margin-left: 1.0rem
    width: 66.6666%
  }
  .notes{
    width: 33.3333%
  }
`

const CompanyProfile = () => (
  <CompanyProfileStyle>
    <div className={"search"}>
      <ActorSearchPage fullWidth={true} />
    </div>
    <div className={"notes"}>
      <CompanyNotes />
      <MyTags />
    </div>
  </CompanyProfileStyle>
);

const ProfilePage: FC<any> = props => {
  const { readOnly } = props;
  const { state: {userType} } = useContext(GlobalContext);
  const [tab, setTab] = useState(0);
  if (!readOnly && userType.includes("theatre")) {
    if (userType.includes("actor")) {
      return (
        <>
          <Tabs
            value={tab}
            onChange={(_, tab) => setTab(tab)}
            aria-label="simple tabs example"
          >
            <Tab label="Company Dashboard" />
            <Tab label="Actor Profile" />
          </Tabs>
          <TabPanel value={tab} index={0}>
            <CompanyProfile />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <ActorProfilePage {...props} />
          </TabPanel>
        </>
      );
    }
    return <CompanyProfile />;
  } else {
    return <ActorProfilePage {...props} />;
  }
};

export default ProfilePage;
