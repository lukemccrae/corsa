import { Box } from "@mui/material"
import { PaceTable } from "./PaceTable"
import { ArticleElement, MileData, PaceTableType, Plan } from "./types"

interface PaceTableEditorProps {
    element: PaceTableType;
    mileData: MileData[];
    lastMileDistance: number;
}

export const PaceTableEditor = (props: PaceTableEditorProps) => {
    const plan = { mileData: props.mileData, lastMileDistance: props.lastMileDistance }
    return (<Box>
        <PaceTable
            cols={props.element.columns}
            miles={props.element.miles}
            backgroundColor="white"
            plan={plan}
        ></PaceTable>
    </Box>)
}