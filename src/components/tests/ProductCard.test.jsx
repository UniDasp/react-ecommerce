import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductCard from '../products/ProductCard.jsx'
import { CartProvider, useCart } from '../../context/CartContext.jsx'

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <CartProvider>{ui}</CartProvider>
    </BrowserRouter>
  )
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra nombre, precio, categoría y permite agregar al carrito', () => {
    const product = { 
      id: 'TEST001', 
      name: 'Producto Test', 
      price: 25990, 
      category: 'Accesorios', 
      image: 'https://picsum.photos/seed/test/200/200',
      featured: false
    }
    
    function Probe() {
      const { items } = useCart()
      return <div data-testid="count">{items.length}</div>
    }
    
    renderWithProviders(<><ProductCard product={product} /><Probe /></>)
    
    expect(screen.getByText('Producto Test')).toBeTruthy()
    expect(screen.getByText('$25.990')).toBeTruthy()
    expect(screen.getByText('Accesorios')).toBeTruthy()
    expect(screen.getByTestId('count').textContent).toBe('0')
    
    const addButton = screen.getByTitle('Agregar al carrito')
    fireEvent.click(addButton)
    
    expect(screen.getByTestId('count').textContent).toBe('1')
  })


  
})
