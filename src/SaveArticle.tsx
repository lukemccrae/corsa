import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUser } from './context/UserContext';
import { saveArticle } from './services/saveArticle.service';

interface SaveArticleProps {
    label: string
    slug: string
    value: string
}


export const SaveArticle = (props: SaveArticleProps) => {
    // TODO: show the last time the document was saved, return this information from the mutation
    const { user } = useUser()

    const updateArticleData = async () => {
        if(user && user.userId) {
            const article = props.value;
            const slug = props.slug;
            const userId = user.userId
            const result = await saveArticle({article, slug, userId})    
        }
    }


    return (
        <>
            <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={updateArticleData}
                sx={{ backgroundColor: '#469CE3', '&:hover': {} }}
            >
                {props.label}
            </Button>
        </>
    );
};