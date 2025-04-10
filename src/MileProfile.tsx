interface MileProfileProps {
  mileVertProfile: number[];
  multiplyPadding: number;
  color: string;
  marginRight: number;
}

const profileBoxStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "baseline",
};

const pointBaseStyle: React.CSSProperties = {
  width: "2px",
  height: "1px",
};

export const MileProfile = (props: MileProfileProps) => {
  return (
    <div style={profileBoxStyle}>
      {props.mileVertProfile.map((p, index) => (
        <div
          key={index}
          style={{
            ...pointBaseStyle,
            backgroundColor: props.color,
            paddingBottom: p * props.multiplyPadding + "px",
            marginRight: props.marginRight + "px",
          }}
        ></div>
      ))}
    </div>
  );
};