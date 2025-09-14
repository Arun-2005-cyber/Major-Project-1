import React from 'react'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom'


function ProductScreen({ product }) {
  return (
    <Card style={{ width: '18rem' }} className='my-3 p-3 rounded shadow-lg'>
      <Link to={`/products/${product.id}`}>
        <Card.Img 
  src={product.image && product.image.startsWith("http") 
    ? product.image 
    : `https://res.cloudinary.com/di7pfw5m1/${product.image}`} 
  style={{ width: '270px', height: '350px' }} 
/>

      </Link>

      <Card.Body>
        <Link to={`/products/${product.id}`}>
          <Card.Title>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='h5'>
          <div className="my-3">
            {product.rating} from {product.numReviews} reviews
          </div>
        </Card.Text>
        <Card.Text as='h6'>
          <div className="my-3">
            Rs {product.price}
          </div>
        </Card.Text>
        <Link to={`/products/${product.id}`}>
          <button type="button" className="btn btn-info">View More</button>
        </Link>
      </Card.Body>
    </Card>
  )
}

export default ProductScreen