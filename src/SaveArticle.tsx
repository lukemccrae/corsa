import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { useUser } from './context/UserContext';
import { saveArticle } from './services/saveArticle.service';
import { ElementsMap } from './Details';
import { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface SaveArticleProps {
    label: string
    slug: string
    elements: ElementsMap
    elementIdsForOrder: string[]
    planName: string;
}


export const SaveArticle = (props: SaveArticleProps) => {
    const [loading, setLoading] = useState(false);
    const { user } = useUser()

    const updateArticleData = async () => {
        if (user && user.userId && props.elements) {
            const slug = props.slug;
            const userId = user.userId;
            const elements = props.elementIdsForOrder.map((id) => props.elements[id]);
            const planName = props.planName;

            setLoading(true);

            try {
                await saveArticle({ elements, slug, userId, planName });
            } catch (error) {
                console.error('Error saving article:', error);
                // Optionally show an error message to the user
            } finally {
                setLoading(false);
            }
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