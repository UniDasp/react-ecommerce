import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from '../products/ProductCard.jsx'
import { CartProvider, useCart } from '../../context/CartContext.jsx'




it('muestra badge de destacado cuando el producto es featured', () => {
    const product = { 
      id: 'TEST002', 
      name: 'Producto Destacado', 
      price: 49990, 
      category: 'Consolas', 
      image: 'https://picsum.photos/seed/featured/200/200',
      featured: true
    }
    
    renderWithProviders(<ProductCard product={product} />)
    
    expect(screen.getByText('Destacado')).toBeTruthy()
  })