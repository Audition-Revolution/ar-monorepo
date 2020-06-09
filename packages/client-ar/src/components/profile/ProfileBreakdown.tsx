import React, { FC } from "react";
import { Typography, Chip } from "@material-ui/core";
import styled from "styled-components";

const BreakdownStyles = styled.div`
    width: 25%;
    margin-bottom: 1.6rem;
    display: flex;
    flex-wrap: wrap;
`
const Breakdown: React.FC<any> = ({ title, breakdownArray, width }) => {
  return (
    <>
      <p>{title}: </p>
      <BreakdownStyles>
        {breakdownArray.map(
          (a: string, i: number) =>
            a && (
              <div
                key={`${i}${a}`}
              >
                <Chip
                  size="small"
                  className="m-1"
                  data-cy={`${title}${a}`}
                  label={a}
                />
              </div>
            )
        )}
      </BreakdownStyles>
    </>
  );
};

const ProfileBreakdownStyles = styled.div`
    margin-top: 6.4rem;
    .breakdown-group {
        display: flex;
        width: 100%;
        .section {
            width: 50%;
        }
    }
`;

const ProfileBreakdown: FC<any> = ({ breakdown }) => {
  const ageRange = breakdown.ageRange || ["None"];
  const gender = breakdown.gender || ["None"];
  const unions = breakdown.unions || ["None"];
  const ethnicity = breakdown.ethnicity || ["None"];
  const vocalRange = breakdown.vocalRange || ["None"];
  return (
    <ProfileBreakdownStyles>
      <Typography variant="h6" color="inherit">
        Actor Breakdown
      </Typography>
      <div className="breakdown-group">
        <div className="section">
          <Breakdown title="Age Range" breakdownArray={ageRange} />
          <Breakdown title="Gender" breakdownArray={gender} />
          <Breakdown title="Ethnicity" breakdownArray={ethnicity} />
        </div>
        <div className="section">
          <Breakdown title="Unions" breakdownArray={unions} />
          <Breakdown title="Vocal Range" breakdownArray={vocalRange} />
        </div>
      </div>
    </ProfileBreakdownStyles>
  );
};

export default ProfileBreakdown;
