export const login = async (email, password) => {
    const uri = import.meta.env.VITE_API_URL;
  try {
    const response = await fetch( `${uri}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data; // Assuming the API returns a token on successful login
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}