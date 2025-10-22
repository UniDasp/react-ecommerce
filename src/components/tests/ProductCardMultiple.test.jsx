import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from '../products/ProductCard.jsx'
import { CartProvider, useCart } from '../../context/CartContext.jsx'




  it('permite agregar múltiples productos al carrito', () => {
    const product = { 
      id: 'TEST004', 
      name: 'Producto Multiple', 
      price: 35990, 
      category: 'Juegos de Mesa', 
      image: 'https://picsum.photos/seed/multiple/200/200',
      featured: false
    }
    
    function Probe() {
      const { items } = useCart()
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
      return <div data-testid="total-quantity">{totalQuantity}</div>
    }
    
    renderWithProviders(<><ProductCard product={product} /><Probe /></>)
    
    const addButton = screen.getByTitle('Agregar al carrito')
    
    fireEvent.click(addButton)
    expect(screen.getByTestId('total-quantity').textContent).toBe('1')
    
    fireEvent.click(addButton)
    expect(screen.getByTestId('total-quantity').textContent).toBe('2')
    
    fireEvent.click(addButton)
    expect(screen.getByTestId('total-quantity').textContent).toBe('3')
  })

