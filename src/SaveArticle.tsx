import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { useUser } from './context/UserContext';
import { saveArticle } from './services/saveArticle.service';
import { ArticleElement } from './types';
import { ElementsMap } from './Details';
import { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface SaveArticleProps {
    label: string
    slug: string
    elements: ElementsMap
    elementIdsForOrder: string[]
}


export const SaveArticle = (props: SaveArticleProps) => {
    console.log(props.elements, '<< els')
    const [loading, setLoading] = useState(false);
    // TODO: show the last time the document was saved, return this information from the mutation
    const { user } = useUser()

    const updateArticleData = async () => {
        if (user && user.userId && props.elements) {
            const slug = props.slug;
            const userId = user.userId
            const elements = props.elementIdsForOrder.map((id) => props.elements[id])
            setLoading(true)
            const result = await saveArticle({ elements, slug, userId });
            setLoading(false)
        }
    }

    return (
        <>
            {loading ? <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box> : <Button
                variant="contained"
                color="error"
                startIcon={<SaveIcon />}
                onClick={updateArticleData}
                sx={{ backgroundColor: '#469CE3', '&:hover': {} }}
            >
                {props.label}
            </Button>}

        </>
    );
};