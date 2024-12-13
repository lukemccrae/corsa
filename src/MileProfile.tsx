import { styled } from "styled-components";

const ProfileBox = styled.div`
  display: inline-flex;
  align-items: baseline;
`;

const Point = styled.div`
  width: 2px;
  height: 1px;
  /* Media query for screens between 769px and 1024px */
  @media (max-width: 630px) {
    margin-right: 1px;
  }
`;

interface MileProfileProps {
  mileVertProfile: number[];
  multiplyPadding: number;
  color: string;
  marginRight: number;
}

export const MileProfile = (props: MileProfileProps) => {
  return (
    <ProfileBox>
      {props.mileVertProfile.map((p) => (
        <Point
          key={Math.random()}
          style={{ backgroundColor: props.color, paddingBottom: p * props.multiplyPadding + "px", marginRight: props.marginRight + "px" }}
        ></Point>
      ))}
    </ProfileBox>
  );
};
