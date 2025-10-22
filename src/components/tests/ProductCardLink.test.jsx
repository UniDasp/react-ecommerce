import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from '../products/ProductCard.jsx'
import { CartProvider, useCart } from '../../context/CartContext.jsx'



  it('contiene enlace a la página de detalle del producto', () => {
    const product = { 
      id: 'TEST003', 
      name: 'Producto con Link', 
      price: 15990, 
      category: 'Mouse', 
      image: 'https://picsum.photos/seed/link/200/200',
      featured: false
    }
    
    renderWithProviders(<ProductCard product={product} />)
    
    const detailLink = screen.getByText('Ver detalle')
    expect(detailLink).toBeTruthy()
    expect(detailLink.getAttribute('href')).toBe('/products/TEST003')
  })