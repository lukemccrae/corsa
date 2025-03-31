import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material"
import { PaceTable } from "./PaceTable"
import { ArticleElement, MileData, PaceTableType, Plan } from "./types"
import { Edit, ArrowUpward, ArrowDownward, Delete, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ElementsMap } from "./Details";

interface PaceTableEditorProps {
    element: PaceTableType;
    mileData: MileData[];
    lastMileDistance: number;
    index: number;
    elements: ElementsMap;
    createNewElementsMap: Function;
    setElementIdsForOrder: Function;
    elementIdsForOrder: string[];
    updatePaceTableElement: Function;
}

export const PaceTableEditor = (props: PaceTableEditorProps) => {
    const [editing, setEditing] = useState(false);
    const [deleteCheck, setDeleteCheck] = useState(false);
    const [miles, setMiles] = useState<number[]>([]);
    const [columns, setColumns] = useState<string[]>([]);

    useEffect(() => {
        setColumns(props.element.columns);
        setMiles(props.element.miles);
    }, [props.element]); // Ensure useEffect runs when props.element changes
    
    const columnOptions = ["Mile", "Pace", "Profile", "Avg.", "Gain", "Loss", "GAP", "Elapsed"];
    
    const handleColumnChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        setColumns(typeof value === "string" ? value.split(",") : value);
    };
    
    const handleMileChange = (index: number, value: string) => {
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            setMiles((prev) => {
                const newMiles = [...prev];
                newMiles[index] = parsedValue;
                return newMiles; // Correctly updates state
            });
        }
    };
    const moveItem = (index: number, direction: number) => {
        const updatedElementIds = [...props.elementIdsForOrder];
        const newIndex = index + direction;
        // Ensure the new index is within bounds
        if (newIndex < 0 || newIndex >= updatedElementIds.length) {
            return; // Do nothing if the new index is out of bounds
        }

        // Swap the elements at index and newIndex
        [updatedElementIds[index], updatedElementIds[newIndex]] = [updatedElementIds[newIndex], updatedElementIds[index]];

        props.setElementIdsForOrder(updatedElementIds);
    };

    const deleteElement = () => {
        setDeleteCheck(true)
    }

    const handleCancelDelete = () => {
        setDeleteCheck(false);
    };

    const handleSave = () => {
        if (miles.length !== 2 || columns.length === 0) {
            alert("Please ensure you have both start and end miles set, and at least one column selected.");
            return;
        }
        // Validate mile range
        if (miles[0] >= miles[1]) {
            alert("Start mile must be less than end mile.");
            return;
        }
        props.updatePaceTableElement(miles, columns, props.index)
        setEditing(false)
    }

    const handleConfirmDelete = () => {
        props.createNewElementsMap([...Object.values(props.elements)].filter((_, i) => i !== props.index))
    };

    const plan = { mileData: props.mileData, lastMileDistance: props.lastMileDistance }

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            {editing ? <Box>
                <FormControl sx={{ minWidth: 200 }}>
                    <Select
                        multiple
                        value={columns}
                        onChange={handleColumnChange}
                        renderValue={(selected) => selected.join(", ")}
                    >
                        {columnOptions.map((col) => (
                            <MenuItem key={col} value={col}>
                                <Checkbox checked={columns.includes(col)} />
                                <ListItemText primary={col} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box>
                    <TextField
                        type="number"
                        label="Start Mile"
                        value={miles[0]}
                        onChange={(e) => handleMileChange(0, e.target.value)}
                    />
                    <TextField
                        type="number"
                        label="End Mile"
                        value={miles[1]}
                        onChange={(e) => handleMileChange(1, e.target.value)}
                    />
                </Box>
            </Box> : <></>}
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <PaceTable
                    cols={columns}
                    miles={miles}
                    plan={plan}
                ></PaceTable>
                <Stack direction="column">
                    <IconButton onClick={() => setEditing(!editing)}>
                        <Edit />
                    </IconButton>
                    <IconButton sx={{ display: editing ? "inline-flex" : "none" }} onClick={() => moveItem(props.index, -1)} disabled={props.index === 0}>
                        <ArrowUpward />
                    </IconButton>
                    <IconButton sx={{ display: editing ? "inline-flex" : "none" }} onClick={() => moveItem(props.index, 1)} disabled={props.index === props.elementIdsForOrder.length - 1}>
                        <ArrowDownward />
                    </IconButton>

                    <IconButton sx={{ display: editing ? "inline-flex" : "none" }} onClick={() => deleteElement()}>
                        <Delete />
                    </IconButton>
                    <IconButton sx={{ display: editing ? "inline-flex" : "none" }} onClick={() => handleSave()}>
                        <Save />
                    </IconButton>
                    <Dialog open={deleteCheck} onClose={handleCancelDelete}>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete this item?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelDelete} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmDelete} color="secondary">
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Stack>
            </Box>
        </Box>)
}