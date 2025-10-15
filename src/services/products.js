import data from '../data/products.json'

function delay(ms) { return new Promise(res => setTimeout(res, ms)) }

export async function listProducts() {
  await delay(300)
  return data.products
}

export async function getProductById(id) {
  await delay(200)
  const prod = data.products.find(p => String(p.id) === String(id))
  if (!prod) throw new Error('Producto no encontrado')
  return prod
}
