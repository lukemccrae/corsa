import { Typography } from "@mui/material"

interface TagsProps {
    tags: string[]
}

export const Tags = (props: TagsProps) => {
    return props.tags.map(tag => {
        return (
            <Typography sx={{
                borderRadius: "50px",
                borderWidth: "1px",
                borderStyle: "solid",
                padding: "5px 10px 5px 10px",
                display: "inline",
                fontSize: "12px"
            }}>{tag}
            </Typography>
        )
    })

}