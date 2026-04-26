// Sections: Components (buttons, cards, nav, forms) & Grid/spacing

function SectionComponents() {
  return (
    <Section id="ch05" bg="paper" chapter={{ number: 5, title: 'Composants web' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 56 }}>
        <Display size="2xl">
          Les composants sont les mots de l'interface.
        </Display>
        <Body size="md" style={{ opacity: 0.8, paddingTop: 12 }}>
          Le système privilégie les formes franches : angle vif pour les conteneurs éditoriaux, pilule pour les actions, trait fin pour les séparateurs. Les arrondis sont volontairement rares — l'identité reste encadrée.
        </Body>
      </div>

      {/* Buttons */}
      <Rule label="Boutons" />
      <div style={{ marginTop: 32, marginBottom: 72, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        <CompCard label="Primaire / Catégorie">
          <button style={btnStyle('#5A66D6', '#FFF')}>▸ Lire l'histoire →</button>
        </CompCard>
        <CompCard label="Secondaire / Encre">
          <button style={btnStyle('#0A0A0A', '#F7F5F0')}>Raconter votre histoire</button>
        </CompCard>
        <CompCard label="Outline">
          <button style={{ ...btnStyle('transparent', '#0A0A0A'), border: '1.5px solid #0A0A0A' }}>Explorer la série</button>
        </CompCard>
        <CompCard label="Ghost / Lien">
          <button style={{ ...btnStyle('transparent', '#5A66D6'), padding: '8px 0', fontWeight: 600 }}>Voir plus →</button>
        </CompCard>
      </div>

      {/* Pills / Tags */}
      <Rule label="Pastilles & étiquettes" />
      <div style={{ marginTop: 32, marginBottom: 72, display: 'flex', flexWrap: 'wrap', gap: 12, padding: 32, background: '#FFF', border: '1px solid #E8E5DE' }}>
        {CATS.slice(0, 6).map(c => <CategoryPill key={c.key} cat={c} />)}
        {CATS.slice(6).map(c => (
          <span key={c.key} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', color: c.dark,
            border: `1.5px solid ${c.hex}`,
            padding: '6px 14px', borderRadius: 999,
            fontFamily: "'Inter Tight', sans-serif", fontSize: 12, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{c.label}</span>
        ))}
      </div>

      {/* Article cards */}
      <Rule label="Carte article" />
      <div style={{ marginTop: 32, marginBottom: 72, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
        {[CATS[0], CATS[5], CATS[7]].map((c, i) => (
          <ArticleCard key={i} cat={c}
            title={[
              "Redéfinir le TDAH : et si le problème n'était pas votre cerveau ?",
              "Le syndrome de l'imposteur : pourquoi on doute de ses compétences",
              "Dormir là où personne ne dort : les hébergements qui réinventent la nuit"
            ][i]}
            kicker={[
              '12 min de lecture',
              'Série — 4 épisodes',
              'Reportage · Islande'
            ][i]}
          />
        ))}
      </div>

      {/* Hero card */}
      <Rule label="Une — Article à la une" />
      <div style={{ marginTop: 32, marginBottom: 72 }}>
        <HeroCard />
      </div>

      {/* Navigation */}
      <Rule label="Navigation principale" />
      <div style={{ marginTop: 32, marginBottom: 72 }}>
        <NavPreview />
      </div>

      {/* Forms */}
      <Rule label="Champs & recherche" />
      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
        <CompCard label="Champ de recherche">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid #B8B6AF', borderRadius: 999, padding: '10px 18px',
            fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: '#6B6B6B',
            width: '100%', background: '#FFF',
          }}>
            <span>⌕</span>
            <span>Rechercher un article, une série…</span>
          </div>
        </CompCard>
        <CompCard label="Input simple">
          <div style={{
            padding: '12px 16px', border: '1.5px solid #0A0A0A',
            fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: '#6B6B6B',
            width: '100%', background: '#FFF',
          }}>
            Votre adresse email
          </div>
        </CompCard>
        <CompCard label="Inline submit">
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{
              flex: 1, padding: '12px 16px', borderTop: '1.5px solid #0A0A0A',
              borderBottom: '1.5px solid #0A0A0A', borderLeft: '1.5px solid #0A0A0A',
              fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: '#6B6B6B',
              background: '#FFF',
            }}>email@origines.media</div>
            <button style={{
              background: '#0A0A0A', color: '#F7F5F0', border: 'none',
              fontFamily: "'Inter Tight', sans-serif", fontSize: 13, fontWeight: 600,
              padding: '0 20px', cursor: 'pointer',
            }}>S'abonner →</button>
          </div>
        </CompCard>
      </div>

      {/* Spacing + radius */}
      <div style={{ marginTop: 96, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div>
          <Rule label="Espacement — base 8px" />
          <div style={{ marginTop: 24, background: '#FFF', border: '1px solid #E8E5DE', padding: 24 }}>
            {[4, 8, 12, 16, 24, 32, 48, 64, 96].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                <span style={{ width: 48, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, opacity: 0.6 }}>{n}px</span>
                <div style={{ height: 12, width: n, background: '#0A0A0A' }} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Rule label="Arrondis" />
          <div style={{ marginTop: 24, background: '#FFF', border: '1px solid #E8E5DE', padding: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[['0', 'Cartes, blocs'], ['4', 'Inputs'], ['8', 'Usage rare'], ['∞', 'Pills, boutons']].map(([r, u]) => (
              <div key={r}>
                <div style={{
                  aspectRatio: '1', background: '#0A0A0A',
                  borderRadius: r === '∞' ? 999 : parseInt(r),
                }} />
                <div style={{
                  marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  letterSpacing: '0.1em', opacity: 0.6, textAlign: 'center',
                }}>{r}{r !== '∞' ? 'PX' : ''}</div>
                <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 11, opacity: 0.5, textAlign: 'center', marginTop: 2 }}>{u}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function btnStyle(bg, fg) {
  return {
    background: bg, color: fg, border: 'none', borderRadius: 999,
    padding: '12px 20px', fontFamily: "'Inter Tight', sans-serif",
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 8,
  };
}

function CompCard({ label, children }) {
  return (
    <div>
      <Eyebrow style={{ marginBottom: 16 }}>{label}</Eyebrow>
      <div style={{
        background: '#FFF', border: '1px solid #E8E5DE',
        padding: '36px 24px', minHeight: 120,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{children}</div>
    </div>
  );
}

function ArticleCard({ cat, title, kicker }) {
  return (
    <article style={{ background: '#FFF', border: '1px solid #E8E5DE' }}>
      <Placeholder ratio="4/3" label="photo éditoriale" bg={cat.light} />
      <div style={{ padding: 20 }}>
        <div style={{
          fontFamily: "'Inter Tight', sans-serif", fontSize: 11, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: cat.dark,
          marginBottom: 12,
        }}>{cat.label}</div>
        <h3 style={{
          fontFamily: "'Archivo', sans-serif", fontWeight: 800,
          fontSize: 19, lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: 0, marginBottom: 16, textWrap: 'balance',
        }}>{title}</h3>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.55,
        }}>
          <span>{kicker}</span>
          <span style={{ color: cat.dark, opacity: 1 }}>Lire →</span>
        </div>
      </div>
    </article>
  );
}

function HeroCard() {
  return (
    <div style={{ position: 'relative', aspectRatio: '16/7', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #5A66D6, #7B5CD6, #3E7DD6)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 60%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 40, left: 48, right: 48, color: '#F7F5F0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 48,
      }}>
        <div style={{ flex: 1, maxWidth: 620 }}>
          <CategoryPill cat={CATS[0]} />
          <h2 style={{
            fontFamily: "'Archivo', sans-serif", fontWeight: 900,
            fontSize: 44, lineHeight: 1.02, letterSpacing: '-0.03em',
            margin: '20px 0 16px', textWrap: 'balance',
          }}>
            Redéfinir le TDAH : et si le problème n'était pas votre cerveau, mais le monde qui l'entoure ?
          </h2>
          <p style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 15, lineHeight: 1.5,
            margin: '0 0 24px', opacity: 0.85, maxWidth: 520,
          }}>Le TDAH n'est pas un simple déficit d'attention. C'est un mode de fonctionnement différent, souvent inadapté au monde…</p>
          <button style={btnStyle('#5A66D6', '#FFF')}>▸ Lire l'histoire →</button>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          letterSpacing: '0.12em', opacity: 0.7, whiteSpace: 'nowrap',
        }}>01 / 07</div>
      </div>
    </div>
  );
}

function NavPreview() {
  return (
    <div style={{ background: '#FFF', border: '1px solid #E8E5DE', padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 20 }}>
        <img src="assets/logo-black.png" style={{ height: 40 }} />
        <div style={{
          display: 'flex', gap: 18, flex: 1,
          fontFamily: "'Inter Tight', sans-serif", fontSize: 13,
          color: '#6B6B6B',
        }}>
          {['youtube','x','snapchat','facebook','instagram','tiktok'].map(s => (
            <span key={s} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>{s}</span>
          ))}
        </div>
        <div style={{
          flex: 1, maxWidth: 380,
          display: 'flex', alignItems: 'center', gap: 10,
          border: '1px solid #B8B6AF', borderRadius: 999, padding: '8px 16px',
          fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: '#6B6B6B',
        }}>
          <span>⌕</span>
          <span>Rechercher un article, une série…</span>
        </div>
        <button style={{ ...btnStyle('transparent', '#0A0A0A'), border: '1.5px solid #0A0A0A' }}>
          ✎ Raconter votre histoire
        </button>
      </div>
      <div style={{
        display: 'flex', gap: 28, justifyContent: 'center',
        fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 500,
        borderTop: '1px solid #E8E5DE', paddingTop: 16,
      }}>
        {['Articles', 'Vidéos', 'Histoires', 'Séries', 'Recos', 'Boutique'].map((x, i) => (
          <span key={x} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: i === 0 ? '#0A0A0A' : '#3A3A3A',
            fontWeight: i === 0 ? 700 : 500,
            borderBottom: i === 0 ? '2px solid #5A66D6' : 'none',
            paddingBottom: 4,
          }}>{x} <span style={{ opacity: 0.5 }}>⌄</span></span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { SectionComponents });
