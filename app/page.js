'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/products';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null); 
  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10)
    };

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setEditingId(null);
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    setForm({ name: '', description: '', price: '', stock: '' });
    fetchProducts(); 
  };

  const handleEditClick = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleCancelEdit = () => {
    setForm({ name: '', description: '', price: '', stock: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <h1 className="text-3xl font-bold mb-8 text-center">Mi Ecommerce</h1>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-blue-600">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? 'Editar Producto' : 'Añadir Producto'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Nombre" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input type="text" placeholder="Descripción" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input required type="number" step="0.01" placeholder="Precio" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          <input required type="number" placeholder="Stock" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
          
          <div className="flex gap-2">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition-colors">
              {editingId ? 'Actualizar Cambios' : 'Guardar Producto (Imagen - Api EXterna PicSum Photos)'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="w-1/3 bg-gray-400 text-white font-bold py-2 rounded hover:bg-gray-500 transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <p className="text-blue-600 font-bold text-xl">${product.price}</p>
              <p className="text-gray-500 text-sm mb-4">Stock: {product.stock}</p>
              
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEditClick(product)} className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600 font-semibold transition-colors">
                  Editar
                </button>
                <button onClick={() => handleDelete(product.id)} className="flex-1 bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 font-semibold transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}