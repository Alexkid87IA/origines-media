import { createClient } from '@sanity/client'

// Configuration du client Sanity
export const client = createClient({
  projectId: 'sf5v7lj3', // Votre Project ID
  dataset: 'production', // Le dataset à utiliser
  useCdn: true, // Utilise le CDN pour de meilleures performances
  apiVersion: '2024-03-01', // Version de l'API Sanity
})

// Fonction helper pour récupérer des données
export async function fetchFromSanity(query: string) {
  try {
    const data = await client.fetch(query)
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des données Sanity:', error)
    throw error
  }
}