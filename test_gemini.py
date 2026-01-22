from google import genai

# Ta clé API
client = genai.Client(api_key="AIzaSyCzBg4IVfEJIrjoyhBoAlZg7wBDb7usIA8")

try:
    print("🤖 Test de Gemini 2.5 Flash...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Dis bonjour aux développeurs d'Origines Media !"
    )
    print("\n✅ SUCCÈS :")
    print(response.text)

except Exception as e:
    print(f"\n❌ ERREUR : {e}")
