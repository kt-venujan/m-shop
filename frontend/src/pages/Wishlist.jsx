import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { API_BASE_URL } from '../config';

export default function Wishlist({ addToCart }) {
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <span className="text-sm text-gray-400 font-medium">({wishlist.length} item{wishlist.length !== 1 ? 's' : ''})</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="text-6xl mb-4">🤍</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 text-sm mb-6">Save items you love so you can find them easily later.</p>
            <Link to="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors text-sm">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map(product => {
              const imgSrc = product.image?.startsWith('/uploads') ? API_BASE_URL + product.image : product.image;
              const price = typeof product.price === 'number' ? product.price : parseFloat(product.price || 0);
              const originalPrice = (price * 1.3).toFixed(0);

              return (
                <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Link to={`/product/${product._id}`}>
                      {product.image ? (
                        <img src={imgSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                      )}
                    </Link>
                    {/* Remove from wishlist */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors group/heart"
                      title="Remove from wishlist"
                    >
                      <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-grow">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-[13px] text-gray-800 line-clamp-2 leading-tight mb-1 hover:text-orange-500 transition-colors">{product.name}</h3>
                    </Link>
                    <div className="mt-auto pt-2">
                      <span className="text-orange-500 text-base font-semibold">Rs.{price.toFixed(0)}</span>
                      <span className="text-xs text-gray-400 line-through ml-2">Rs.{originalPrice}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
