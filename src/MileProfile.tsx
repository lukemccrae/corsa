import { styled } from "styled-components";
import React from "react";
import { MileData } from "./types";

const ProfileBox = styled.div`
  display: inline-flex;
  align-items: baseline;
`;

const Point = styled.div`
  width: 1px;
  height: 1px;
  margin-right: 2px;
  background-color: black;

  /* Media query for screens between 769px and 1024px */
  @media (max-width: 630px) {
    margin-right: 1px;
  }
`;

interface MileProfileProps {
  mileData: MileData;
}

export const MileProfile = (props: MileProfileProps) => {
  console.log(props, "props");
  return (
    <ProfileBox>
      {props.mileData.mileVertProfile.map((p) => (
        <Point
          key={Math.random()}
          style={{ color: "white", paddingBottom: p + "px" }}
        ></Point>
      ))}
    </ProfileBox>
  );
};
