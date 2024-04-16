import { styled } from "styled-components";
import React from "react";

const ProfileBox = styled.div`
  display: inline-flex;
  align-items: baseline;
`;

const Point = styled.div`
  width: 1px;
  height: 1px;
  margin-right: 2px;
  background-color: white;

  /* Media query for screens between 769px and 1024px */
  @media (max-width: 630px) {
    margin-right: 1px;
  }
`;

type MileVertProfile = {
  mileVertProfile: number[];
};

interface MileProfileProps {
  profile: MileVertProfile;
}

export const MileProfile = (props: MileProfileProps) => {
  return (
    <ProfileBox>
      {props.profile.mileVertProfile.map((p) => (
        <Point
          key={Math.random()}
          style={{ color: "white", paddingBottom: p + "px" }}
        ></Point>
      ))}
    </ProfileBox>
  );
};
