import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@sanity/client';

// Configuration Sanity
const client = createClient({
  projectId: 'sf5v7lj3',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-01',
});

export default function ArticlesDebug() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const query = `*[_type == "production"] | order(_createdAt desc) {
          _id,
          titre,
          "slug": slug.current,
          description,
          "verticaleName": verticale->nom,
          "hasBody": defined(body),
          "hasStructuredContent": defined(structuredContent),
          "hasContentHTML": defined(contentHTML)
        }`;
        
        const data = await client.fetch(query);
        setArticles(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Chargement des articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Debug - Toutes vos Productions/Articles</h1>
        
        <div className="mb-6 bg-blue-900/30 border border-blue-500 rounded-lg p-4">
          <p className="text-blue-300">
            💡 Cette page liste tous vos articles. Cliquez sur "Voir l'article" pour tester la nouvelle page Article.
          </p>
        </div>

        <div className="mb-4 text-gray-400">
          Total : {articles.length} productions trouvées
        </div>

        {articles.length === 0 ? (
          <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-6">
            <p className="text-yellow-300">
              ⚠️ Aucune production trouvée dans Sanity. Vérifiez que vous avez bien des documents de type "production".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-2">{article.titre || 'Sans titre'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-gray-400">Slug:</span>
                    <code className="ml-2 bg-gray-700 px-2 py-1 rounded text-sm">
                      {article.slug || 'pas-de-slug'}
                    </code>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Verticale:</span>
                    <span className="ml-2">
                      {article.verticaleName || 'Aucune'}
                    </span>
                  </div>
                </div>

                {article.description && (
                  <p className="text-gray-300 mb-4 text-sm">{article.description}</p>
                )}

                <div className="flex gap-4 items-center">
                  <Link
                    to={`/article/${article.slug || article._id}`}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                  >
                    Voir l'article →
                  </Link>
                  
                  <div className="text-sm text-gray-400">
                    Contenu: 
                    {article.hasBody && ' ✅ PortableText'}
                    {article.hasStructuredContent && ' ✅ Structuré'}
                    {article.hasContentHTML && ' ✅ HTML'}
                    {!article.hasBody && !article.hasStructuredContent && !article.hasContentHTML && ' ❌ Aucun'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}