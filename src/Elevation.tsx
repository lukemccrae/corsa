import React from "react";
import { styled } from "styled-components";


interface ElevationProps {
  points: number[][] | undefined
  multiplyPadding: number
  setHoveredPoint: Function
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
  background-color: #E3A446;

  &:hover {
    background-color: white;
  }
`;
export const Elevation = (props: ElevationProps) => {
  const [min, setMin] = React.useState<number>();
  const [max, setMax] = React.useState<number>();
  const [points, setPoints] = React.useState<number[]>();

  React.useEffect(() => {
    if (props.points) {

      // calculate number to use for % to arrive at 500 points for graph
      const condensedPointIndex = Math.round(props.points.length / 500);

      const elevationPoints: number[] = props.points
      .flatMap((arr, index) => {
        if (index === 0 || index % condensedPointIndex === 0) {
          return arr.slice(2, 3);
        }
        return [];
      });

      setMin(Math.min(...elevationPoints));
      setMax(Math.max(...elevationPoints));
      setPoints(elevationPoints)

    }
  }, [props.points]);

  if (!props.points || !max || !min) {
    return <div></div>;
  }
    
  const handleMouseEnter = (index: number) => {
    props.setHoveredPoint(index)
  }

  const handleMouseLeave = () => {
    props.setHoveredPoint(0)
  };

  return (
    <ProfileBox>
      {points && points.map((p, index) => {
          return (
            <Point
              key={index}
              style={{
                paddingBottom: `${((p - min) / (max - min)) * 200 + 1}px`,
              }}
              onMouseEnter={() => handleMouseEnter(index)} // Handle mouse enter
              onMouseLeave={handleMouseLeave} // Handle mouse leave
            ><div style={{color: "#e3e3e3"}}></div></Point>
          )
      })}
    </ProfileBox>
  );
};