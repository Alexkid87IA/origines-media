// Sections: Editorial guidelines (articles, vidéos, vignettes) + Voice

function SectionVoice() {
  const examples = [
    {
      ok: "Sarah a 34 ans. Elle n'arrive pas à finir ce qu'elle commence — et elle s'en veut depuis l'école primaire.",
      ko: "L'impact du TDAH dans la société moderne : enjeux et perspectives.",
      tag: "Ouvrir sur un humain, pas un concept.",
    },
    {
      ok: "On dort mal. La moitié des Français se plaignent d'un sommeil cassé ; les scientifiques cherchent pourquoi.",
      ko: "Le sommeil : un enjeu de santé publique à l'ère du 21ème siècle.",
      tag: "Dire 'on' quand on parle de nous. Chiffrer sans jargonner.",
    },
    {
      ok: "Ce n'est pas qu'on travaille trop — c'est qu'on ne sait plus arrêter.",
      ko: "Le burnout est un phénomène multifactoriel complexe.",
      tag: "Formuler l'intuition avant la définition.",
    },
  ];
  return (
    <Section id="ch05b" bg="ink">
      <Eyebrow style={{ color: '#F7F5F0' }}>Voix éditoriale</Eyebrow>
      <Display size="2xl" style={{ marginTop: 24, color: '#F7F5F0', maxWidth: 900, marginBottom: 64 }}>
        On écrit comme on parlerait à quelqu'un d'intelligent qui n'a pas encore le contexte.
      </Display>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: 'rgba(247,245,240,0.15)', border: '1px solid rgba(247,245,240,0.15)' }}>
        {examples.map((e, i) => (
          <div key={i} style={{ background: '#0A0A0A', padding: 32, color: '#F7F5F0' }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#2E9B74', marginBottom: 12,
            }}>✓ Oui</div>
            <p style={{
              fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 600,
              fontSize: 22, lineHeight: 1.3, margin: 0, marginBottom: 24, textWrap: 'balance',
            }}>« {e.ok} »</p>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#D64C90', marginBottom: 12,
            }}>✗ Non</div>
            <p style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 15, lineHeight: 1.4,
              margin: 0, marginBottom: 24, opacity: 0.55, textDecoration: 'line-through', textDecorationColor: 'rgba(214,76,144,0.5)',
            }}>{e.ko}</p>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 13, lineHeight: 1.5,
              opacity: 0.8, borderTop: '1px solid rgba(247,245,240,0.2)', paddingTop: 16,
            }}>{e.tag}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
        {[
          ['Phrases courtes', 'Moyenne 15-18 mots. On casse les longues en deux.'],
          ['Présent de l\'indicatif', 'Sauf dans les récits. Jamais de conditionnel fuyant.'],
          ['« On » plutôt que « l\'individu »', 'On parle à quelqu\'un, pas d\'un échantillon.'],
          ['Chiffres incarnés', '« Un salarié sur trois » mieux que « 33% des salariés ».'],
        ].map(([t, d]) => (
          <div key={t} style={{ color: '#F7F5F0' }}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.015em', marginBottom: 8 }}>{t}</div>
            <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, lineHeight: 1.5, opacity: 0.7 }}>{d}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SectionEditorial() {
  return (
    <Section id="ch06" bg="paper" chapter={{ number: 6, title: 'Guidelines éditoriales' }}>
      <Display size="2xl" style={{ marginBottom: 64 }}>
        Formats, durées, anatomies.
      </Display>

      <Rule label="Nos formats" />
      <div style={{ marginTop: 32, marginBottom: 80, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: '#E8E5DE', border: '1px solid #E8E5DE' }}>
        {[
          { f: 'Article court', d: '3-5 min', u: '800-1 500 mots', k: 'Éclairage, angle unique, une voix' },
          { f: 'Article long', d: '10-20 min', u: '2 500-5 000 mots', k: 'Enquête, multi-sources, narration' },
          { f: 'Série éditoriale', d: '4-6 épisodes', u: 'Sur 4-8 semaines', k: 'Thème fil rouge, chapitres reliés' },
          { f: 'Vidéo reportage', d: '12-25 min', u: 'YouTube principal', k: 'Sur le terrain, voix off, interviews' },
          { f: 'Témoignage', d: '6-12 min', u: 'Vertical + horizontal', k: 'Un sujet, caméra fixe, pas de voix off' },
          { f: 'Short / TikTok', d: '30-90 sec', u: 'Vertical 9:16', k: 'Hook 3 premières secondes, sous-titres' },
        ].map((x, i) => (
          <div key={i} style={{ background: '#F7F5F0', padding: 28 }}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '-0.02em', marginBottom: 8 }}>{x.f}</div>
            <div style={{ display: 'flex', gap: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 16 }}>
              <span>{x.d}</span><span>·</span><span>{x.u}</span>
            </div>
            <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, lineHeight: 1.5, opacity: 0.8 }}>{x.k}</div>
          </div>
        ))}
      </div>

      <Rule label="Anatomie d'un article long" />
      <div style={{ marginTop: 32, marginBottom: 80, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{ background: '#FFF', border: '1px solid #E8E5DE', padding: 40 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <span style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7B5CD6',
            }}>● Psychologie</span>
          </div>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1.02, margin: '0 0 20px', textWrap: 'balance' }}>
            Le syndrome de l'imposteur : pourquoi on doute de ses compétences
          </h3>
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 20, lineHeight: 1.4, margin: '0 0 24px', opacity: 0.85, textWrap: 'balance' }}>
            Vous venez d'obtenir une promotion. Les félicitations fusent. Et pourtant, au lieu de savourer ce succès, une petite voix s'invite…
          </p>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 20 }}>
            Par Claire M. — 12 avril 2026 — 14 min de lecture
          </div>
          <div style={{ height: 1, background: '#E8E5DE', margin: '20px 0' }} />
          <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, lineHeight: 1.55, margin: 0, opacity: 0.85 }}>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 52, lineHeight: 0.9, float: 'left', marginRight: 10, marginTop: 4 }}>S</span>
            arah a 34 ans. Elle travaille dans une agence parisienne où elle a été promue il y a trois mois. Sur le papier, tout va. Dans sa tête, c'est une autre histoire.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, lineHeight: 1.7 }}>
            <AnatomyItem n="01" label="Pastille catégorie" note="Toujours en haut. Couleur signature de la catégorie." />
            <AnatomyItem n="02" label="Titre (Archivo Black)" note="48-64px desktop, 32-40px mobile. 8-15 mots max." />
            <AnatomyItem n="03" label="Chapô (Fraunces italic)" note="Un paragraphe qui plante la scène. Pas de résumé plat." />
            <AnatomyItem n="04" label="Métadonnées (Mono)" note="Auteur · Date · Temps de lecture. Toujours ces 3." />
            <AnatomyItem n="05" label="Drop cap + corps (Inter Tight)" note="Première lettre en Archivo Black 52px. Lecture 17-18px." />
            <AnatomyItem n="06" label="Image pleine largeur" note="Après 2-3 paragraphes. Légende en Mono 11px." />
            <AnatomyItem n="07" label="Citations (Fraunces)" note="Italique, 28-36px, guillemets français « »." />
          </div>
        </div>
      </div>

      {/* Vignette rules */}
      <Rule label="Vignettes YouTube & Instagram" />
      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <Thumb title={["Le syndrome", "de l'imposteur"]} cat={CATS[5]} kicker="Carrière · Épisode 02" photoTone="office" />
        <Thumb title={["Pourquoi on", "dort mal"]} cat={CATS[7]} kicker="Santé · Reportage" photoTone="night" />
        <Thumb title={["L'origine", "du TDAH"]} cat={CATS[0]} kicker="Psychologie · Décryptage" photoTone="mind" />
      </div>
      <div style={{ marginTop: 24, padding: 24, background: '#FFF', border: '1px solid #E8E5DE' }}>
        <Body size="sm" style={{ opacity: 0.85 }}>
          <strong>Règles de vignette :</strong> logo complet (bloc encadré) posé en haut à gauche, fond photo documentaire (pas de stock, pas de gradient décoratif). Titre en Archivo Black, casse titre, max 2 lignes, ancré en bas sur un voile sombre. Un filet fin de la couleur de catégorie souligne le titre. Aucun emoji, aucun point final, aucune saturation agressive.
        </Body>
      </div>
    </Section>
  );
}

function AnatomyItem({ n, label, note }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 16, padding: '12px 0', borderBottom: '1px solid #E8E5DE' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', opacity: 0.5 }}>{n}</div>
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{note}</div>
      </div>
    </div>
  );
}

function Thumb({ title, cat, kicker, photoTone = 'office' }) {
  const lines = Array.isArray(title) ? title : [title];
  const photoBg = {
    office: 'radial-gradient(ellipse at 70% 40%, #4F5059 0%, #2A2B32 50%, #121318 100%)',
    night:  'radial-gradient(ellipse at 30% 60%, #2B3552 0%, #131A2C 50%, #080A12 100%)',
    mind:   'radial-gradient(ellipse at 60% 50%, #4B3768 0%, #251A3A 55%, #0E0818 100%)',
  }[photoTone];
  return (
    <div style={{
      aspectRatio: '16/9', position: 'relative', overflow: 'hidden',
      background: photoBg, color: '#F7F5F0',
    }}>
      {/* Photo texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 3px)',
        mixBlendMode: 'overlay',
      }} />
      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0) 70%)',
      }} />
      {/* Full logo block top-left */}
      <div style={{ position: 'absolute', top: 18, left: 18, background: '#F7F5F0', padding: 6 }}>
        <img src="assets/logo-black.png" alt="" style={{ width: 48, height: 48, display: 'block' }} />
      </div>
      {/* Placeholder tag */}
      <div style={{
        position: 'absolute', top: 22, right: 18,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(247,245,240,0.6)',
      }}>[ photo documentaire ]</div>
      {/* Title bottom-left, title case */}
      <div style={{
        position: 'absolute', left: 24, right: 24, bottom: 44,
        fontFamily: "'Archivo', sans-serif", fontWeight: 900,
        fontSize: 30, lineHeight: 1.02, letterSpacing: '-0.025em',
        textWrap: 'balance',
      }}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      {/* Thin category rule */}
      <div style={{
        position: 'absolute', bottom: 22, left: 24, right: 24,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ width: 28, height: 2, background: cat.hex }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(247,245,240,0.85)',
        }}>{kicker}</span>
      </div>
    </div>
  );
}

Object.assign(window, { SectionVoice, SectionEditorial });
