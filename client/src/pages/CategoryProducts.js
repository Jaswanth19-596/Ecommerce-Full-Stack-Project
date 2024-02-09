import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Product from '../components/Product/Product';
import axios from 'axios';
import './../utilitycss/product.css';
import './CategoryProducts.css';
import Loading from './../components/Loading';
import NoProductAvailable from '../components/NoProductAvailabe/NoProductAvailable';
import cartContext from '../store/cart-context';
import hottoast from 'react-hot-toast';

const CategoryProducts = () => {
  const { slug } = useParams();
  const [cartState, setCartState] = useContext(cartContext);

  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = (product) => {
    setCartState([...cartState, product]);
    localStorage.setItem('cartItems', JSON.stringify([...cartState, product]));
    // toast.success('Added');
    hottoast.success('Added to cart');
  };

  const getProductsOnCategory = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/products/get-by-category/${slug}`);

      if (data.success) {
        setProducts(data?.data);
      }
    } catch (error) {
      console.log('Error while fetching products based on category');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProductsOnCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <Layout>
      <div className="entire-container">
        <h1 className="text-center">Category : {slug}</h1>

        <div className="container category-container">
          <div className="row justify-content-center">
            {isLoading && <Loading />}

            {!isLoading &&
              products?.map((product) => {
                return (
                  <div
                    className="col-10 col-sm-6 col-md-6 col-lg-4"
                    key={product._id}
                  >
                    <Product
                      product={product}
                      handleAddToCart={handleAddToCart}
                    />
                  </div>
                );
              })}
            {!isLoading && products.length === 0 && <NoProductAvailable />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProducts;
