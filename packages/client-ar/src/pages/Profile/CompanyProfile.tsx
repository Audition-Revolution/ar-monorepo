import ActorSearchPage from "../Search/ActorSearchPage";
import CompanyNotes from "./CompanyNotes";
import MyTags from "./MyTags";
import React from "react";
import styled from "styled-components";


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

export const CompanyProfile = () => (
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
