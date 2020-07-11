import React, { FC, useContext, useState } from "react";
import { GlobalContext } from "../../globalContext";
import { Tab, Tabs } from "@material-ui/core";
import TabPanel from "components/shared/TabPanel";
import {CompanyProfile} from "./CompanyProfile";
import {ActorProfilePage} from "./ActorProfile";


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
