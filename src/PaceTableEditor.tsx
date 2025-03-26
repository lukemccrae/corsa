import { Box } from "@mui/material"
import { PaceTable } from "./PaceTable"
import { ArticleElement, PaceTableType, Plan } from "./types"

interface PaceTableEditorProps {
    element: PaceTableType;
    plan: Plan;
}

export const PaceTableEditor = (props: PaceTableEditorProps) => {
    return (<Box>
        <PaceTable
            cols={props.element.columns}
            miles={props.element.miles}
            backgroundColor="white"
            plan={props.plan}
        ></PaceTable>
    </Box>)
}