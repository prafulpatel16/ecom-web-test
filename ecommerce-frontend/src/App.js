import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendUrl = `${process.env.REACT_APP_BACKEND_SERVICE}/api/products?timestamp=${Date.now()}`;
        console.log('Backend URL:', backendUrl);

        const response = await axios.get(backendUrl);
        console.log('Products response:', response);

        // Check if the response is JSON
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
          let productsData = response.data;

          // Ensure data is an array
          if (typeof productsData === 'string') {
            try {
              productsData = JSON.parse(productsData);
              if (Array.isArray(productsData)) {
                setProducts(productsData);
              } else {
                throw new Error('Invalid data format: Parsed data is not an array');
              }
            } catch (parseError) {
              console.error('Error parsing data:', parseError);
              setError(`Error parsing data: ${parseError.message}. Please try again later.`);
            }
          } else if (Array.isArray(productsData)) {
            setProducts(productsData);
          } else {
            throw new Error('Invalid data format: Response is not an array');
          }
        } else {
          throw new Error('Unexpected content type: Response is not JSON');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(`Error fetching products: ${error.message}. Please try again later.`);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return <div className="App">{error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Product List</h1>
        <ul>
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.id}>{product.name} - ${product.price}</li>
            ))
          ) : (
            <li>No products available</li>
          )}
        </ul>
      </header>
    </div>
  );
}

export default App;
