import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';


export default function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState('2D');
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('A');
  const [deliveryLocation, setDeliveryLocation] = useState('Western, Colombo 1-15, Colombo 01 - Fort');
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Reviews logic
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const token = localStorage.getItem('mern_token');
  const user = JSON.parse(localStorage.getItem('mern_user') || 'null');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/reviews/product/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to load reviews");
      }
    };
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) return alert('Please login to submit a review.');
    setSubmittingReview(true);
    try {
      await axios.post(`${API_BASE_URL}/api/reviews`, {
        product: id,
        rating,
        comment
      }, { headers: { Authorization: `Bearer ${token}` } });
      setReviewMessage('Review submitted successfully! It is currently pending admin approval.');
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewMessage(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews.length ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : 0;

  const product = products.find(p => p._id === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold bg-white p-12 rounded-xl shadow-sm border border-gray-100">Product not found 🔍</h2>
        <Link to="/" className="text-white bg-orange-600 font-bold px-6 py-3 rounded-md mt-6 shadow hover:bg-orange-700 transition-colors">Return to Home</Link>
      </div>
    );
  }

  const discountPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price || 0);
  const originalPrice = discountPrice * 2;

  // Stock status derived from the product
  const stock = product.stock;
  const isOutOfStock = stock !== undefined && stock !== null && stock <= 0;
  const isLowStock = stock !== undefined && stock !== null && stock > 0 && stock <= 5;

  const handleDecrease = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  const handleIncrease = () => setQuantity(prev => prev + 1);

  const handleBuyNow = () => {
    if (isOutOfStock) { toast.error('This product is out of stock.'); return; }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (isOutOfStock) { toast.error('This product is out of stock.'); return; }
    addToCart(product, quantity);
    toast.success(`${product.name.substring(0, 30)}${product.name.length > 30 ? '...' : ''} added to cart!`);
  };

  return (
    <div data-aos="fade-up" className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500 font-medium">
        <Link to="/" className="text-blue-600 hover:text-orange-600 hover:underline transition-colors">Home</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-black">{product.category}</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500 truncate max-w-xs inline-block align-bottom">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">

          {/* Top 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">

            <div className="lg:col-span-4 flex flex-col items-center select-none">
              <div className="w-full aspect-square bg-[#f2f2f2] border border-gray-100 rounded-sm overflow-hidden flex items-center justify-center mb-4 relative group">
                {viewMode === '3D' ? (
                  <model-viewer
                    src={product.modelUrl || 'https://modelviewer.dev/shared-assets/models/Shoe.glb'}
                    alt={product.name}
                    auto-rotate
                    camera-controls
                    shadow-intensity="1"
                    style={{ width: '100%', height: '100%', backgroundColor: '#f2f2f2', outline: 'none' }}
                  ></model-viewer>
                ) : (
                  product.image ? (
                    <img src={product.image?.startsWith('/uploads') ? API_BASE_URL + product.image : product.image} alt={product.name} className="w-full h-full object-cover transform cursor-zoom-in group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <span className="text-9xl drop-shadow-lg transform cursor-zoom-in group-hover:scale-110 transition-transform duration-500">
                      {product.category === 'Electronics' ? '💻' :
                        product.category === 'Clothing' ? '👕' :
                          product.category === 'Sports' ? '⚽' :
                            product.category === 'Beauty' ? '💄' : '🛍️'}
                    </span>
                  )
                )}


                {/* View Mode Toggle Pill */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full shadow-lg p-1 flex gap-1 z-10 border border-gray-200">
                  <button
                    onClick={() => setViewMode('2D')}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${viewMode === '2D' ? 'bg-black text-white shadow' : 'text-gray-600 hover:text-black hover:bg-white'} focus:outline-none`}
                  >
                    2D Image
                  </button>
                  <button
                    onClick={() => setViewMode('3D')}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all flex items-center gap-1.5 ${viewMode === '3D' ? 'bg-orange-600 text-white shadow' : 'text-gray-600 hover:text-orange-600 hover:bg-white'} focus:outline-none`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
                    Interactive 3D
                  </button>
                </div>

                {/* Discount Badge overlay */}
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none z-20">
                  -50%
                </div>

                {/* Stock badge */}
                {isOutOfStock && (
                  <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none z-20">
                    Out of Stock
                  </div>
                )}
                {isLowStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none z-20">
                    Only {stock} left!
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Product Core Details (Center - width 5) */}
            <div className="lg:col-span-5 flex flex-col relative">
              <h1 className="text-[22px] font-semibold text-gray-900 leading-snug mb-3">
                {product.name}
              </h1>

              {/* Ratings & Brand Row */}
              <div className="flex items-center gap-4 text-sm mb-4 pb-4">
                <div className="flex items-center text-[#f57224] text-lg">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(averageRating || 0) ? "text-[#f57224]" : "text-gray-300"}>★</span>
                  ))}
                  <span className="text-blue-600 hover:text-orange-500 hover:underline ml-3 cursor-pointer text-sm">{reviews.length > 0 ? `${reviews.length} Ratings` : 'No Ratings Yet'}</span>
                </div>
                <div className="text-gray-300">|</div>
                <div className="text-gray-500 text-sm">
                  Brand: <span className="text-blue-600 hover:text-orange-500 hover:underline cursor-pointer">No Brand</span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 mb-4 absolute top-[110px]"></div>

              {/* Pricing Block */}
              <div className="mb-6 pt-2">
                <div className="text-4xl font-extrabold text-[#f57224] mb-2 tracking-tight">
                  Rs. {discountPrice.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </div>
                <div className="flex items-center gap-2 text-sm pt-1">
                  <span className="text-gray-400 line-through">Rs. {originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                  <span className="text-black font-extrabold">-50%</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-black border border-orange-500 rounded px-2 py-0.5 whitespace-nowrap bg-orange-50">Installment</span>
                  <span className="text-xs text-gray-600">Up to 3 months, as low as Rs. {(discountPrice / 3).toFixed(0)} per month.</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-6">

                {/* Quantity Selector */}
                <div className="mb-8 flex items-center gap-4">
                  <p className="text-gray-500 text-sm w-16">Quantity</p>
                  <div className="flex items-center">
                    <button onClick={handleDecrease} className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors text-xl focus:outline-none rounded-l border border-gray-300 border-r-0">-</button>
                    <input type="text" value={quantity} readOnly className="w-12 h-9 text-center text-sm font-semibold outline-none border-y border-gray-300 pointer-events-none" />
                    <button onClick={handleIncrease} className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors text-xl focus:outline-none rounded-r border border-gray-300 border-l-0">+</button>
                  </div>
                </div>

                {/* Buy Buttons */}
                <div className="flex gap-2 sm:gap-4 mt-auto">
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`flex-1 text-white font-semibold py-3.5 px-4 rounded shadow-sm transition-colors text-base focus:outline-none focus:ring-2 focus:ring-offset-1 ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#2abbe8] hover:bg-[#1bb0da] focus:ring-[#2abbe8]'}`}
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 text-white font-semibold py-3.5 px-4 rounded shadow-sm transition-colors text-base focus:outline-none focus:ring-2 focus:ring-offset-1 ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#f57224] hover:bg-[#e0621b] focus:ring-[#f57224]'}`}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3: Logistics & Seller (Right - width 3) */}
            <div className="lg:col-span-3 bg-[#fafafa] p-4 lg:p-0 lg:bg-transparent rounded-md lg:rounded-none flex flex-col gap-0 divide-y divide-gray-100 border border-gray-200 lg:border-none">

              {/* Delivery Options */}
              <div className="pb-4">
                <div className="flex justify-between items-center mb-4 lg:pr-2">
                  <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wide">Delivery Options</h3>
                  <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>

                <div className="flex gap-3 mb-4 items-start">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <div className="text-sm border-r border-gray-200 pr-3 flex-1 min-w-[50%]">
                    <p className="text-gray-800 leading-tight">{deliveryLocation}</p>
                  </div>
                  <button onClick={() => setShowLocationModal(true)} className="text-xs font-bold text-[#f57224] hover:text-[#e0621b] ml-auto whitespace-nowrap pt-0.5 focus:outline-none">CHANGE</button>
                </div>

                <div className="border border-gray-200 rounded divide-y divide-gray-200 bg-white shadow-sm">
                  <div className="p-3 flex items-start gap-3">
                    <span className="text-xl">🚚</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Standard</p>
                      <p className="text-[11px] text-gray-500">Guaranteed by 25-29 Mar</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 mt-0.5">Rs. 230</span>
                  </div>
                  <div className="p-3 flex items-start gap-3">
                    <span className="text-xl">💵</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 mt-1">Cash on Delivery Available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Returns & Warranty */}
              <div className="py-4">
                <div className="flex justify-between items-center mb-4 lg:pr-2">
                  <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wide">Return & Warranty</h3>
                  <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="space-y-4 px-1">
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>
                    <span className="text-sm text-gray-800 hover:underline cursor-pointer">14 days easy return</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <span className="text-sm text-gray-800 hover:underline cursor-pointer">6 Months Agent Warranty</span>
                  </div>
                </div>
              </div>


            </div>
          </div>

        </div>

        {/* NEW PRODUCT DESCRIPTION SECTION */}
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm border border-gray-200 mt-6 lg:mr-[26%]">
          <h2 className="text-lg font-bold bg-gray-50 inline-block px-4 py-2 border-l-4 border-orange-500 mb-6 text-gray-800">Product Details of {product.name}</h2>
          <div className="prose max-w-none text-gray-700 text-sm md:text-base leading-relaxed">
            <p className="mb-6 font-medium">
              {product.description || "Unleash the power of premium quality with this brand new item. Designed with meticulous attention to detail and engineered for peak performance, this product stands out as an indispensable addition to your collection. Whether you're upgrading your lifestyle or searching for the perfect gift, our selection guarantees unmatched durability and cutting-edge features."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded border border-gray-100 mb-6">
              <ul className="list-disc pl-5 space-y-3 font-medium text-gray-600">
                <li>High quality guarantee with a robust 6 months warranty.</li>
                <li>100% Authentic product sourced directly from the original brand partners.</li>
                <li>Sleek, modern design matching the latest trends in the marketplace.</li>
                <li>Incredibly easy installation and immediate out-of-the-box utility.</li>
              </ul>
              <ul className="list-disc pl-5 space-y-3 font-medium text-gray-600">
                <li>Available exclusively at the MERN Store with Cash on Delivery across the nation.</li>
                <li>Made with highly durable environmental-friendly industrial materials.</li>
                <li>Supports dual usage modes perfect for outdoor and indoor integration.</li>
                <li>Includes official packaging box and standard usage manual guides.</li>
              </ul>
            </div>

            <div className="mt-8 text-center text-sm text-gray-400 italic">
              * Please note that actual item colors may vary slightly from the images due to display settings or manufacturer changes.
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm border border-gray-200 mt-6 lg:mr-[26%]">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-extrabold text-gray-900">Customer Reviews</h2>
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <span className="text-orange-600 font-black text-sm">{averageRating}</span>
              <svg className="w-4 h-4 text-orange-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-gray-500 text-xs font-bold">({reviews.length})</span>
            </div>
          </div>

          {/* Submission Form */}
          <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={handleSubmitReview}>
                {reviewMessage && <div className="mb-4 text-sm font-bold text-orange-600 bg-orange-50 px-4 py-3 rounded border border-orange-100">{reviewMessage}</div>}

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} onClick={() => setRating(star)} className={`w-8 h-8 cursor-pointer transition-colors ${rating >= star ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current hover:text-amber-200'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                  <textarea required value={comment} onChange={e => setComment(e.target.value)} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors text-sm text-gray-800" placeholder="What did you like or dislike about this product?"></textarea>
                </div>

                <button type="submit" disabled={submittingReview} className="bg-black hover:bg-gray-800 text-white font-bold text-sm px-6 py-3 rounded shadow transition-colors w-full md:w-auto">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 border border-dashed border-gray-300 bg-white rounded">
                <p className="text-sm font-bold text-gray-500 mb-3">You must be logged in to leave a review.</p>
                <Link to="/auth" className="text-orange-600 font-bold hover:underline text-sm">Sign In / Register</Link>
              </div>
            )}
          </div>

          {/* Render Approved Reviews */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map(rev => (
                <div key={rev._id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-gray-500 uppercase">
                      {rev.user?.name?.substring(0, 2) || 'US'}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">{rev.user?.name || 'Verified Buyer'}</span>
                      <div className="flex text-amber-400 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium mt-3 pl-13 flex"><span className="w-13 inline-block hidden md:block opacity-0">...</span>{rev.comment}</p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Related Products Section */}
      {(() => {
        const related = products
          .filter(p => p.category === product.category && p._id !== product._id)
          .slice(0, 6);
        if (related.length === 0) return null;
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-4">
            <h2 className="text-[22px] font-bold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0 bg-white border border-gray-100 shadow-sm divide-x divide-y divide-gray-100">
              {related.map(rel => {
                const relImg = rel.image?.startsWith('/uploads') ? API_BASE_URL + rel.image : rel.image;
                const relPrice = typeof rel.price === 'number' ? rel.price : parseFloat(rel.price || 0);
                return (
                  <Link
                    to={`/product/${rel._id}`}
                    key={rel._id}
                    onClick={() => window.scrollTo(0, 0)}
                    className="p-3 hover:shadow-[0_0_12px_rgba(0,0,0,0.1)] transition-shadow group flex flex-col"
                  >
                    <div className="aspect-square mb-2 overflow-hidden bg-gray-50 rounded-md">
                      {rel.image ? (
                        <img src={relImg} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-50">📦</div>
                      )}
                    </div>
                    <h3 className="text-[12px] text-gray-700 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors flex-1">{rel.name}</h3>
                    <div className="mt-1">
                      <span className="text-orange-500 text-sm font-semibold">Rs.{relPrice.toFixed(0)}</span>
                      <span className="text-[10px] text-gray-400 line-through ml-1">Rs.{(relPrice * 1.3).toFixed(0)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}

      {showLocationModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm animate-[authFade_0.3s_ease-out]">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Select Delivery Location</h3>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {['Western, Colombo 1-15, Colombo 01 - Fort', 'Central, Kandy, Kandy Town Center', 'Southern, Galle, Galle Fort Area', 'Northern, Jaffna, Jaffna Town'].map(loc => (
                <div key={loc} onClick={() => { setDeliveryLocation(loc); setShowLocationModal(false); }} className={`p-3 rounded border cursor-pointer transition-colors ${deliveryLocation === loc ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{loc}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowLocationModal(false)} className="w-full bg-gray-100 text-gray-700 font-bold py-2.5 rounded shadow-sm text-sm border border-gray-200 hover:bg-gray-200 transition-colors focus:outline-none">CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
}
