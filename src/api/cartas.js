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

export const getCartas = async () => {
    const uri = import.meta.env.VITE_API_URL;
    try{
        const response = await fetch( `${uri}/api/cartas`, {
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

export const getCartaById = async (id) => {
    const uri = import.meta.env.VITE_API_URL;
    try{
        const response = await fetch( `${uri}/api/publicaciones/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(),
        });
       
        if (!response.ok) {
            throw new Error('Failed to fetch carta data');
        }
        const data = await response.json();
        return data;

    }catch(error){
        console.error('Error fetching carta data:', error);
        throw error;
    }
}

export const getHistoricoCartas = async (id) => {  
    const uri = import.meta.env.VITE_API_URL;
    try{
        const response = await fetch( `${uri}/api/cartas/${id}/historial`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch historico cartas data');
        }
        const data = await response.json();
        return data;

    }catch(error){
        console.error('Error fetching historico cartas data:', error);
        throw error;
    }
}

export const crearPublicacion = async (cartaData) => {
    const uri = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch( `${uri}/api/publicaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(cartaData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create publicacion');
      }
  
      const data = await response.json();
      return data; // Assuming the API returns the created publicacion data
    } catch (error) {
      console.error('Error creating publicacion:', error);
      throw error;
    }
}