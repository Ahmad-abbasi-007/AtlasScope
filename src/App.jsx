import { useState, useEffect } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("https://dummyjson.com/products?limit=1000")
      if (!res.ok) throw new Error("API Failed")
      const data = await res.json()
      setItems(data.products)
    } catch (err) {
      setError("Failed to fetch data. API down hai.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = items.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === "All" || p.category === category
    return matchSearch && matchCat
  })

  const categories = ["All", ...new Set(items.map(i => i.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] p-10 max-w-7xl mx-auto">
        <div className="h-10 w-1/3 bg-gray-200 animate-pulse rounded mb-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>)}
        </div>
        <p className="text-center mt-10 font-bold">Loading AtlasScope... ⏳</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center p-10 text-center">
        <h2 className="text-3xl font-bold text-red-500">{error} ❌</h2>
        <button onClick={fetchData} className="mt-6 bg-black text-white px-6 py-3 rounded-full font-bold">Retry Again</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-black">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-black">AtlasScope<span className="text-orange-500">.</span></h1>
        <p className="text-sm bg-black text-white px-3 py-1 rounded-full">{filtered.length} Items</p>
      </nav>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Search product... e.g. iPhone"
          className="flex-1 p-4 border border-black/10 rounded-xl bg-white outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-4 border border-black/10 rounded-xl bg-white outline-none md:w-52">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="bg-white border border-black/5 rounded-2xl overflow-hidden hover:shadow-xl transition">
            <img src={p.thumbnail} alt={p.title} className="h-44 w-full object-cover"/>
            <div className="p-4">
              <h2 className="font-bold text-lg truncate">{p.title}</h2>
              <p className="text-sm text-gray-500 capitalize">{p.category}</p>
              <p className="text-sm font-bold mt-2">${p.price} | ⭐ {p.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App