export const register = async (email, password) => {
    const uri = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch( `${uri}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      const data = await response.json();
      return data; // Assuming the API returns user data on successful registration
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }