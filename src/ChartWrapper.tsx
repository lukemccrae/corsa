import { Box } from "@mui/material"
import { MapComponent } from "./MapComponent"
import { PaceTable } from "./PaceTable"
import { FeatureProperties, Plan } from "./types"
import AreaChart from "./testChart";
import GradePaceChart from "./gradePaceChart"
import React from "react";


interface ChartWrapperProps {
    properties: FeatureProperties
    plan: Plan
    handleSetHoveredPoint: Function
    coords: number[][]
    hoveredPoint: number
    elevationWidth: number;
}

export const ChartWrapper = (props: ChartWrapperProps) => {

    return (
        <>
            {/* <Box
                sx={{
                    backgroundColor: '#e3e3e3',
                    borderRadius: 2,
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}
            >
                {props.properties && <AreaChart handleSetHoveredPoint={props.handleSetHoveredPoint} hoveredPoint={props.hoveredPoint} properties={props.properties} width={props.elevationWidth} height={300}></AreaChart>}
            </Box> */}

            <Box
                sx={{
                    flex: 1,
                    backgroundColor: '#e3e3e3',
                    borderRadius: 2,
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}
            >
                <MapComponent hoverPoint={props.coords[props.hoveredPoint]} width={props.elevationWidth} coords={props.coords}></MapComponent>
            </Box>

            {/* <Box
                sx={{
                    backgroundColor: '#e3e3e3',
                    borderRadius: 2,
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}
            >
                {<GradePaceChart properties={props.properties} width={props.elevationWidth} height={300}></GradePaceChart>}

            </Box> */}
            <Box sx={{margin: 2}}></Box>
        </>
    )
}