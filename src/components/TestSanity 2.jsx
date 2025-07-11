import { useEffect, useState } from 'react'
import { client } from '../lib/sanity'

export default function TestSanity() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const query = '*[_type == "post"] | order(_createdAt desc)[0...3]'
    client.fetch(query).then(data => {
      setPosts(data)
      console.log('Articles récupérés:', data)
    })
  }, [])

  return (
    <div>
      <h2>Test Sanity - Articles récents</h2>
      {posts.length === 0 ? (
        <p>Aucun article trouvé. Crée d'abord des articles dans Sanity Studio !</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post._id}>{post.title || 'Sans titre'}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
