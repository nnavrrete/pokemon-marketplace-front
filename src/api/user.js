export const getUser = async (token) => {  
    const uri = import.meta.env.VITE_API_URL;
    try{
        const response = await fetch( `${uri}/api/usuarios`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        return data;

    }catch(error){
        console.error('Error fetching user data:', error);
        throw error;
    }
}