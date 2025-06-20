import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  if (!productId) {
    return null; // Handle the case where productId is not provided
  }

  return (
    <div>
      <h1>Individual product</h1>
      <p>Product ID: {productId}</p>
    </div>
  );
};

export default ProductPage;
