// Sections: Logo rules & usage

function SectionLogo() {
  return (
    <Section id="ch02" bg="paper" chapter={{ number: 2, title: 'Logotype' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        <div>
          <Eyebrow>Construction</Eyebrow>
          <Display size="2xl" style={{ marginTop: 16, marginBottom: 32 }}>
            Un cadre, un nom, une cible.
          </Display>
          <Body size="md" style={{ marginBottom: 24, opacity: 0.8 }}>
            Le logo est un bloc typographique : le nom <em>Origines</em> découpé en trois syllabes — <strong>O · RIGI · NES</strong> — posé dans un cadre carré. Le "O" initial prend la forme d'une cible : un point de visée, une mise au point. Le cadre tient l'ensemble : un geste éditorial stable, reconnaissable à petite comme à grande échelle.
          </Body>
          <Body size="md" style={{ opacity: 0.8 }}>
            Deux versions canoniques : noir sur clair, blanc sur sombre. Pas de monochrome couleur, pas de dégradé, pas de contour seul. Le contraste maximal est une règle, pas une suggestion.
          </Body>
        </div>
        <div style={{
          background: '#0A0A0A', padding: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          aspectRatio: '1',
        }}>
          <img src="assets/logo-white.png" alt="Origines logo blanc" style={{ width: '70%' }} />
        </div>
      </div>

      {/* Construction grid */}
      <div style={{ marginTop: 96 }}>
        <Rule label="Fig. 03 — Grille de construction" />
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          <LogoExample bg="#F7F5F0" label="Primaire — noir">
            <img src="assets/logo-black.png" alt="" style={{ width: '70%' }} />
          </LogoExample>
          <LogoExample bg="#0A0A0A" label="Inversé — blanc">
            <img src="assets/logo-white.png" alt="" style={{ width: '70%' }} />
          </LogoExample>
          <LogoExample bg="#F7F5F0" label="Pleine largeur">
            <img src="assets/logo-black.png" alt="" style={{ width: '90%' }} />
          </LogoExample>
          <LogoExample bg="#5A66D6" label="Sur couleur catégorie">
            <img src="assets/logo-black.png" alt="" style={{ width: '70%' }} />
          </LogoExample>
        </div>
      </div>

      {/* Clearspace */}
      <div style={{ marginTop: 96 }}>
        <Eyebrow>Zone de respiration</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 24 }}>
          <div>
            <Body size="md" style={{ opacity: 0.8 }}>
              La zone de protection minimale correspond à la hauteur du cadre "O" (noté <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>X</code>). Aucun texte, image ou bordure ne peut s'approcher à moins de <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>X/2</code> du logo.
            </Body>
            <div style={{ marginTop: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.1em', lineHeight: 2 }}>
              <div>MIN. WEB — 48PX DE CÔTÉ</div>
              <div>MIN. PRINT — 14MM DE CÔTÉ</div>
              <div>FAVICON — bloc complet maintenu</div>
            </div>
          </div>
          <div style={{ background: '#F0EDE6', padding: 32, position: 'relative' }}>
            <div style={{
              border: '1px dashed #6B6B6B', padding: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src="assets/logo-black.png" alt="" style={{ width: '50%' }} />
            </div>
            <div style={{
              position: 'absolute', top: 48, left: 16,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              letterSpacing: '0.1em', color: '#6B6B6B',
            }}>X/2</div>
          </div>
        </div>
      </div>

      {/* Do / Don't */}
      <div style={{ marginTop: 96 }}>
        <Eyebrow>Règles d'usage</Eyebrow>
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {[
            { ok: true, label: 'Noir sur clair', render: (c) => <img src="assets/logo-black.png" style={{ width: '60%' }} /> },
            { ok: true, label: 'Blanc sur sombre', render: (c) => <img src="assets/logo-white.png" style={{ width: '60%' }} />, bg: '#0A0A0A' },
            { ok: true, label: 'Sur couleur cat.', render: () => <img src="assets/logo-black.png" style={{ width: '60%' }} />, bg: '#5A66D6' },
            { ok: false, label: 'Ne pas étirer', render: () => <img src="assets/logo-black.png" style={{ width: '70%', transform: 'scaleX(1.6)' }} /> },
            { ok: false, label: 'Ne pas recolorer', render: () => <img src="assets/logo-black.png" style={{ width: '60%', filter: 'invert(30%) sepia(100%) saturate(400%) hue-rotate(-10deg)' }} /> },
            { ok: false, label: 'Ne pas incliner', render: () => <img src="assets/logo-black.png" style={{ width: '60%', transform: 'rotate(12deg)' }} /> },
          ].map((d, i) => (
            <div key={i}>
              <div style={{
                background: d.bg || '#F0EDE6',
                aspectRatio: '1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
                borderLeft: `3px solid ${d.ok ? '#2E9B74' : '#D64C90'}`,
              }}>
                {d.render()}
              </div>
              <div style={{
                marginTop: 10,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span style={{ color: d.ok ? '#2E9B74' : '#D64C90' }}>{d.ok ? '✓ Oui' : '✗ Non'}</span>
                <span style={{ opacity: 0.6 }}>{d.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function LogoExample({ bg, label, children }) {
  return (
    <div>
      <div style={{
        background: bg, aspectRatio: '1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: bg === '#F7F5F0' ? '1px solid #E8E5DE' : 'none',
      }}>
        {children}
      </div>
      <div style={{
        marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6,
      }}>{label}</div>
    </div>
  );
}

Object.assign(window, { SectionLogo });
