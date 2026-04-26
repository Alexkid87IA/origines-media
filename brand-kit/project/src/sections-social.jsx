// Sections: Social kit (IG, TikTok, YouTube) + Footer

function SectionSocial() {
  return (
    <Section id="ch07" bg="stone" chapter={{ number: 7, title: 'Kit réseaux sociaux' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 64 }}>
        <Display size="2xl">Un récit, cinq formats, une seule voix.</Display>
        <Body size="md" style={{ opacity: 0.8, paddingTop: 12 }}>
          Le même sujet peut vivre en article, en shorts, en post Instagram et en vignette YouTube — à chaque fois avec son anatomie propre. Les templates ci-dessous définissent la zone de titre, la signature (O), la catégorie et la marge de sécurité vidéo (UI YouTube/TikTok/IG).
        </Body>
      </div>

      {/* Instagram post (square) */}
      <Rule label="Instagram — Post carré 1080×1080" />
      <div style={{ marginTop: 32, marginBottom: 72, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <IGPost variant="title" cat={CATS[0]} />
        <IGPost variant="quote" cat={CATS[5]} />
        <IGPost variant="number" cat={CATS[7]} />
      </div>

      {/* Story / Reel / TikTok vertical */}
      <Rule label="Story / Reel / TikTok — Vertical 1080×1920" />
      <div style={{ marginTop: 32, marginBottom: 72, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        <Vertical variant="hook" cat={CATS[0]} />
        <Vertical variant="stat" cat={CATS[2]} />
        <Vertical variant="intime" cat={CATS[6]} />
        <Vertical variant="serie" cat={CATS[4]} />
      </div>

      {/* YouTube thumbnail */}
      <Rule label="YouTube — Miniature 1280×720" />
      <div style={{ marginTop: 32, marginBottom: 72, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        <YTThumb title={["Pourquoi on n'arrive", "plus à dormir"]} kicker="Santé · Reportage" cat={CATS[7]} tone="night" />
        <YTThumb title={["Le TDAH n'est pas", "un déficit"]} kicker="Psycho · Décryptage" cat={CATS[0]} tone="mind" />
      </div>

      {/* Rules */}
      <Rule label="Principes de déclinaison" />
      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
        {[
          ['Marge de sécurité', '8% en haut et en bas des verticales pour laisser place aux UI natifs des plateformes.'],
          ['Signature logo', 'Le "O" en haut à gauche pour tous les formats sociaux. Taille 6-8% de la hauteur.'],
          ['Catégorie', 'Bandeau inférieur en Mid color + label en Mono 14px majuscules. Toujours visible.'],
          ['Titre', 'Archivo Black, majuscules, interligne 0.92, max 3 lignes. Pas de point final.'],
        ].map(([t, d]) => (
          <div key={t}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 18, letterSpacing: '-0.015em', marginBottom: 8 }}>{t}</div>
            <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, lineHeight: 1.5, opacity: 0.7 }}>{d}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function IGPost({ variant, cat }) {
  return (
    <div style={{ aspectRatio: '1', position: 'relative', background: variant === 'title' ? cat.light : (variant === 'quote' ? '#0A0A0A' : '#F7F5F0'), overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, background: variant === 'quote' ? '#F7F5F0' : '#0A0A0A', padding: 5 }}>
        <img src={variant === 'quote' ? 'assets/logo-black.png' : 'assets/logo-white.png'} alt="" style={{ width: 40, height: 40, display: 'block' }} />
      </div>
      {variant === 'title' && (
        <>
          <div style={{ position: 'absolute', top: '50%', left: 28, right: 28, transform: 'translateY(-50%)',
            fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 36, lineHeight: 0.92, letterSpacing: '-0.03em', color: '#0A0A0A' }}>
            REDÉFINIR<br/>LE TDAH
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: 28, right: 28, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0A0A0A', opacity: 0.75 }}>
            Psychologie · Nouvel article
          </div>
        </>
      )}
      {variant === 'quote' && (
        <>
          <div style={{ position: 'absolute', top: '50%', left: 28, right: 28, transform: 'translateY(-50%)',
            fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 26, lineHeight: 1.2, color: '#F7F5F0', textWrap: 'balance' }}>
            « On croit qu'on doute de ses compétences. En réalité, on doute de sa légitimité à exister là. »
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: 28, right: 28, color: cat.light, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            — Extrait · Carrière
          </div>
        </>
      )}
      {variant === 'number' && (
        <>
          <div style={{ position: 'absolute', top: 80, left: 28, right: 28,
            fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 140, lineHeight: 0.85, letterSpacing: '-0.05em', color: cat.dark }}>
            1<span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 600, fontWeight: 600, fontSize: 72 }}>/</span>3
          </div>
          <div style={{ position: 'absolute', bottom: 60, left: 28, right: 28,
            fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 22, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            des Français dorment moins de 6 heures par nuit.
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: 28, right: 28, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: cat.dark }}>
            Santé · Chiffre du jour
          </div>
        </>
      )}
    </div>
  );
}

function Vertical({ variant, cat }) {
  const bg = variant === 'intime' ? '#0A0A0A' : (variant === 'serie' ? cat.dark : cat.light);
  const fg = (variant === 'intime' || variant === 'serie') ? '#F7F5F0' : '#0A0A0A';
  // Fixed vertical canvas 270×480 (9:16) so text sizes stay predictable
  return (
    <div style={{ aspectRatio: '9/16', position: 'relative', background: bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', left: 14, background: fg, padding: 4 }}>
        <img src="assets/logo-black.png" alt="" style={{ width: 32, height: 32, display: 'block' }} />
      </div>

      {variant === 'hook' && (
        <div style={{ position: 'absolute', top: '30%', left: 16, right: 16, fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 26, lineHeight: 0.95, letterSpacing: '-0.025em', color: fg, textWrap: 'balance' }}>
          Et si ce n'était pas ton cerveau, le problème ?
        </div>
      )}
      {variant === 'stat' && (
        <div style={{ position: 'absolute', top: '26%', left: 16, right: 16 }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 92, lineHeight: 0.85, letterSpacing: '-0.05em', color: fg }}>
            72<span style={{ fontSize: 44 }}>%</span>
          </div>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 15, lineHeight: 1.2, marginTop: 10, color: fg }}>
            des parents se sentent seuls dans la charge mentale.
          </div>
        </div>
      )}
      {variant === 'intime' && (
        <div style={{ position: 'absolute', top: '32%', left: 16, right: 16, fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 600, fontSize: 21, lineHeight: 1.25, color: fg, textWrap: 'balance' }}>
          « Je croyais que c'était moi. En fait, c'était le monde autour. »
        </div>
      )}
      {variant === 'serie' && (
        <div style={{ position: 'absolute', top: '30%', left: 16, right: 16, color: fg }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', marginBottom: 12 }}>SÉRIE · ÉPISODE 03/06</div>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 26, lineHeight: 0.95, letterSpacing: '-0.025em', textWrap: 'balance' }}>
            Ce qu'on hérite sans le savoir
          </div>
        </div>
      )}

      {/* Category rule at bottom with safe-zone margin */}
      <div style={{ position: 'absolute', bottom: '12%', left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 22, height: 2, background: cat.hex }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: fg, opacity: 0.85 }}>{cat.label}</span>
      </div>
    </div>
  );
}

function YTThumb({ title, kicker, cat, tone = 'night' }) {
  const lines = Array.isArray(title) ? title : [title];
  const photoBg = {
    night: 'radial-gradient(ellipse at 30% 60%, #2B3552 0%, #131A2C 50%, #080A12 100%)',
    mind:  'radial-gradient(ellipse at 60% 50%, #4B3768 0%, #251A3A 55%, #0E0818 100%)',
  }[tone];
  return (
    <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden', background: photoBg, color: '#F7F5F0' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0) 75%)' }} />
      <div style={{ position: 'absolute', top: 20, left: 20, background: '#F7F5F0', padding: 6 }}>
        <img src="assets/logo-black.png" alt="" style={{ width: 56, height: 56, display: 'block' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: 48, left: 28, right: 28,
        fontFamily: "'Archivo', sans-serif", fontWeight: 900,
        fontSize: 40, lineHeight: 1, letterSpacing: '-0.03em', textWrap: 'balance',
      }}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <div style={{ position: 'absolute', bottom: 22, left: 28, right: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 28, height: 2, background: cat.hex }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(247,245,240,0.85)' }}>{kicker}</span>
      </div>
    </div>
  );
}

function SectionFooter() {
  return (
    <section data-screen-label="99 Footer" style={{ background: '#0A0A0A', color: '#F7F5F0', padding: '96px 48px 32px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, paddingBottom: 64, borderBottom: '1px solid rgba(247,245,240,0.15)' }}>
          <div>
            <img src="assets/logo-white.png" alt="Origines" style={{ width: 88, height: 88, display: 'block' }} />
            <Display size="2xl" style={{ marginTop: 32, color: '#F7F5F0', maxWidth: 600 }}>
              Un document vivant.<br/>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 600, fontWeight: 600 }}>
                À réviser chaque trimestre.
              </span>
            </Display>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32, alignContent: 'start' }}>
            <FooterCol title="Contact" items={['brand@origines.media', 'design@origines.media', '+33 1 00 00 00 00']} />
            <FooterCol title="Fichiers source" items={['Logos — /assets/logo', 'Tokens — /design/tokens.js', 'Templates Figma', 'Kit Social — /social']} />
            <FooterCol title="Révision" items={['V1.0 — Avril 2026', 'Prochain review — Juillet 2026', 'Responsable — Équipe Brand']} />
            <FooterCol title="Gouvernance" items={['Toute modif de charte', 'passe par un review', 'collectif de l\'équipe brand.']} />
          </div>
        </div>

        <div style={{
          paddingTop: 32,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.5,
        }}>
          <span>Origines Media © 2026 — Tous droits réservés</span>
          <span>Fin du document · V1.0</span>
          <span>← Retour au début</span>
        </div>
      </div>
    </section>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 14 }}>{title}</div>
      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, lineHeight: 1.75 }}>
        {items.map((it, i) => <div key={i}>{it}</div>)}
      </div>
    </div>
  );
}

Object.assign(window, { SectionSocial, SectionFooter });
