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
    expect(detailLink.getAttribute('href')).toBe('/react-ecommerce/products/TEST003')
  })

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
})
