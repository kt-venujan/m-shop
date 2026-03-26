import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useWishlist } from '../context/WishlistContext';
import { FlashGridSkeleton, ProductGridSkeleton, CategoryGridSkeleton } from './Skeleton';

export default function ProductList({ products, addToCart, loading = false }) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Extract unique categories from actual products
  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);

  // Flash sale products (using the first 6 products as flash sale items)
  const flashProducts = products.slice(0, 6);

  if (loading) {
    return (
      <section id="products" className="py-8 bg-[#f5f5f5] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-0 sm:px-4 space-y-6">
          <div>
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-2 ml-2 sm:ml-0" />
            <div className="bg-white px-5 py-4 shadow-sm mb-0 border-b border-gray-100 h-12 animate-pulse" />
            <FlashGridSkeleton count={6} />
          </div>
          <div>
            <div className="h-6 w-28 bg-gray-200 animate-pulse rounded mb-2 ml-2 sm:ml-0 mt-6" />
            <CategoryGridSkeleton count={8} />
          </div>
          <div>
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-2 ml-2 sm:ml-0 mt-8" />
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-8 bg-[#f5f5f5] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-0 sm:px-4 space-y-6">

        {/* Flash Sale Section */}
        <div>
          <h2 data-aos="fade-right" className="text-[22px] text-gray-700 pb-2 pl-2 sm:pl-0 font-medium tracking-tight">Flash Sale</h2>
          <div data-aos="fade-up" className="bg-white px-5 py-4 flex flex-col items-start shadow-sm mb-0 border-b border-gray-100">
            <div className="flex justify-between items-center w-full">
              <span className="text-orange-500 font-medium text-sm">On Sale Now</span>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="100" className="bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-gray-100 shadow-sm border-b border-gray-100">
            {flashProducts.map(product => (
              <div key={product._id} className="relative group">
                {/* Wishlist Heart */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg className={`w-3.5 h-3.5 transition-colors ${isInWishlist(product._id) ? 'text-red-500 fill-current' : 'text-gray-400 fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <Link to={`/product/${product._id}`} className="p-3 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-shadow block bg-white h-full flex flex-col justify-start">
                  <div className="aspect-square mb-2 relative overflow-hidden bg-white rounded-md">
                    {product.image ? (
                      <img src={product.image?.startsWith('/uploads') ? API_BASE_URL + product.image : product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-3xl">📦</div>
                    )}
                  </div>
                  <h3 className="text-[13px] text-[#212121] line-clamp-2 leading-tight mb-1 group-hover:text-orange-500 transition-colors h-[36px]" title={product.name}>{product.name}</h3>
                  <div className="flex flex-col mt-auto pt-1">
                    <span className="text-orange-500 text-lg font-medium leading-none">Rs.{typeof product.price === 'number' ? product.price.toFixed(0) : product.price}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 line-through">Rs.{typeof product.price === 'number' ? (product.price * 1.3).toFixed(0) : product.price}</span>
                      <span className="text-[10px] text-black font-semibold">-30%</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <h2 data-aos="fade-right" className="text-[22px] text-gray-700 pb-2 pl-2 sm:pl-0 font-medium tracking-tight mt-6">Categories</h2>
          <div data-aos="fade-up" data-aos-delay="100" className="bg-white shadow-sm border border-gray-100">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {uniqueCategories.map((category, idx) => {
                const catProduct = products.find(p => p.category === category);
                return (
                  <Link to={`/?category=${encodeURIComponent(category)}`} key={idx} className="flex flex-col items-center justify-center p-3 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-shadow group relative bg-white h-[160px] text-center border-b border-r border-gray-100">
                    <div className="w-[90px] h-[90px] mb-3 overflow-hidden bg-white rounded-md relative z-10 group-hover:scale-105 transition-transform flex-shrink-0 border border-gray-100">
                      {catProduct && catProduct.image ? (
                        <img src={catProduct.image?.startsWith('/uploads') ? API_BASE_URL + catProduct.image : catProduct.image} alt={category} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center text-3xl">📁</div>
                      )}
                    </div>
                    <span className="text-[13px] text-[#212121] leading-tight group-hover:text-orange-500 transition-colors line-clamp-2 px-1">{category}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Just Picked For You Section */}
        <div>
          <h2 data-aos="fade-right" className="text-[22px] text-gray-700 pb-2 pl-2 sm:pl-0 font-medium tracking-tight mt-8">Just Picked For You</h2>
          <div data-aos="fade-up" data-aos-delay="100" className="bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 divide-x divide-y divide-gray-100 shadow-sm border border-gray-100">
            {products.map(product => (
              <div key={product._id} className="relative group">
                {/* Wishlist Heart */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg className={`w-3.5 h-3.5 transition-colors ${isInWishlist(product._id) ? 'text-red-500 fill-current' : 'text-gray-400 fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <Link to={`/product/${product._id}`} className="p-3 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-shadow block bg-white h-full flex flex-col justify-start">
                  <div className="aspect-square mb-2 relative overflow-hidden bg-white rounded-md">
                    {product.image ? (
                      <img src={product.image?.startsWith('/uploads') ? API_BASE_URL + product.image : product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-3xl">📦</div>
                    )}
                  </div>
                  <h3 className="text-[13px] text-[#212121] line-clamp-2 leading-tight mb-1 group-hover:text-orange-500 transition-colors h-[36px]" title={product.name}>{product.name}</h3>
                  <div className="flex flex-col mt-auto pt-1">
                    <span className="text-orange-500 text-lg font-medium leading-none">Rs.{typeof product.price === 'number' ? product.price.toFixed(0) : product.price}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 line-through">Rs.{typeof product.price === 'number' ? (product.price * 1.3).toFixed(0) : product.price}</span>
                      <span className="text-[10px] text-black font-semibold">-30%</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Padding at bottom so footer isn't cramped */}
        <div className="h-10"></div>
      </div>
    </section>
  );
}
