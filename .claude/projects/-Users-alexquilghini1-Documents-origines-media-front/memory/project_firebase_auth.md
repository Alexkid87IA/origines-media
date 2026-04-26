---
name: Firebase Auth & Firestore Setup
description: Firebase project "origines" (origines-b5dcb) with Auth (email+Google) and Firestore (eur3) configured
type: project
---

Firebase project "origines" (ID: origines-b5dcb) is fully set up:
- **Auth**: Email/password + Google Sign-In enabled
- **Firestore**: Standard edition, eur3 (Europe), mode test
- **Auth architecture**: AuthContext + useAuth hook, AuthProvider wraps app in main.tsx
- **Account pages**: /inscription, /connexion, /deconnexion, /compte (pre-auth + dashboard), /compte/profil, /compte/liste, /compte/journaux, /compte/parametres
- **Firestore hooks**: useSavedList (saved articles/videos/recos), useJournals (journal entries with prompts and moods)
- **SaveButton component**: Added to ArticlePageV2, VideoPage, RecommandationPage
- **SiteHeader**: Auth-aware (shows user name + dropdown when logged in, "Se connecter" link when not)

**Why:** User wants members to create accounts, save content, write personal journals. Paid subscription (ad-free) planned for later.

**How to apply:** All user data goes in Firestore under `users/{uid}/`. AI journal prompts deferred to later phase.
