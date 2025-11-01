export const getPublicaciones = async () => {
    const uri = import.meta.env.VITE_API_URL;
    try{
        const response = await fetch( `${uri}/api/publicaciones`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(),
        });
       
        if (!response.ok) {
            throw new Error('Failed to fetch cartas data');
        }
        const data = await response.json();
        return data;

    }catch(error){
        console.error('Error fetching cartas data:', error);
        throw error;
    }
}