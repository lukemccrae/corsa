import React from "react";
import { styled } from "styled-components";


interface ElevationProps {
  points: number[][] | undefined
  multiplyPadding: number
  setHoveredPoint: Function
  min: number
  max: number
}

const ProfileBox = styled.div`
  display: flex;
  align-items: end;
  max-width: calc(100vw - 64px);
  height: 220px;
  overflow: hidden;
`;

const Point = styled.div`
  width: 1px;
  height: 10px;
  margin-right: 0px;
  background-color: #e3a446;
`;

const ElevationColumn = styled.div`
  background-color: transparent;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;

  &:hover {
    background-color: white;

    & > div {
      background-color: white;
    }
  }
`;
export const Elevation = (props: ElevationProps) => {
  // const [min, setMin] = React.useState<number>();
  // const [max, setMax] = React.useState<number>();
  const [points, setPoints] = React.useState<number[]>();
  const [condensedPointIndex, setCondensedPointIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (props.points) {

      // calculate number to use for % to arrive at 500 points for graph
      setCondensedPointIndex(Math.round(props.points.length / 500));

      const elevationPoints: number[] = props.points
        .flatMap((arr, index) => {
          if (index === 0 || index % condensedPointIndex === 0) {
            return arr.slice(2, 3);
          }
          return [];
        });
      setPoints(elevationPoints)

    }
  }, [props.points]);

  if (!props.points) {
    return <div></div>;
  }

  const handleMouseEnter = (index: number) => {
    props.setHoveredPoint(index * condensedPointIndex)
  }

  const handleMouseLeave = () => {
    // props.setHoveredPoint(0)
  };

  return (
    <ProfileBox>
      {points && points.map((p, index) => {
        return (
          <ElevationColumn onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            key={index}
            >
            <Point
              key={index}
              style={{
                paddingBottom: `${((p - props.min) / (props.max - props.min)) * 200 + 1}px`,
              }}

            ></Point>
          </ElevationColumn>

        )
      })}
    </ProfileBox>
  );
};