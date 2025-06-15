import React, { useEffect, useState } from 'react'
import { client } from '../lib/sanity'

const TestSanity = () => {
  const [status, setStatus] = useState('Connexion en cours...')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Test de connexion simple à Sanity
    const testConnection = async () => {
      try {
        // Query simple pour récupérer tous les types de documents
        const query = `*[_type == "sanity.imageAsset"][0...5] {
          _id,
          _type,
          _createdAt
        }`
        
        const result = await client.fetch(query)
        
        if (result) {
          setStatus('✅ Connexion réussie à Sanity!')
          setData(result)
        } else {
          setStatus('✅ Connexion réussie mais aucune donnée trouvée')
        }
      } catch (err) {
        setStatus('❌ Erreur de connexion')
        setError(err.message)
        console.error('Erreur Sanity:', err)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>Test de connexion Sanity</h1>
      
      <div style={{
        padding: '20px',
        backgroundColor: error ? '#ffeeee' : '#eeffee',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>{status}</h2>
        
        {error && (
          <p style={{ color: 'red' }}>
            Erreur: {error}
          </p>
        )}
      </div>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3>Informations de configuration:</h3>
        <ul>
          <li><strong>Project ID:</strong> sf5v7lj3</li>
          <li><strong>Dataset:</strong> production</li>
          <li><strong>API Version:</strong> 2024-03-01</li>
        </ul>
      </div>

      {data && (
        <div style={{
          marginTop: '20px',
          backgroundColor: '#f0f0f0',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h3>Données reçues:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default TestSanity