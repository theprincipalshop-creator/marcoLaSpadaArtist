import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Title and Metadata
content = content.replace(
    "<title>Marco Artist | Portfolio & Preventivi d'Arte</title>",
    "<title>Marco La Spada Artist | Portfolio & Preventivi d'Arte</title>"
)
content = content.replace(
    '''<meta name="description"
        content="Benvenuto nel mio spazio creativo. Sono Marco, artista e artigiano. Realizzo quadri personalizzati, murales d'impatto, sculture in legno ed esche da pesca custom. Contattami per trasformare la tua idea in realtà.">''',
    '''<meta name="description"
        content="Benvenuto nel mio spazio creativo. Sono Marco, realizzo per te quadri e manufatti personalizzati . Contattami per trasformare la tua idea in realtà. Lavorerò fianco a fianco con te per trasformare le tue idee in realtà.">'''
)
content = content.replace(
    '''<meta property="og:title" content="Marco Artist | Arte e Artigianato">''',
    '''<meta property="og:title" content="Marco La Spada Artist | Arte e Artigianato">'''
)
content = content.replace(
    '''<meta property="og:description"
        content="Benvenuto nel mio spazio creativo. Sono Marco, realizzo quadri , murales e manufatti e gadget personalizzati . Contattami per trasformare la tua idea in realtà.">''',
    '''<meta property="og:description"
        content="Benvenuto nel mio spazio creativo. Sono Marco, realizzo per te quadri e manufatti personalizzati . Contattami per trasformare la tua idea in realtà.">'''
)
content = content.replace(
    '''"name": "Marco Artist",''',
    '''"name": "Marco La Spada Artist",'''
)

# 2. Hero Section
content = content.replace(
    '''<div class="hero-tag">La mia Arte, il tuo Spazio</div>''',
    '''<div class="hero-tag">pittura e manufatti</div>'''
)
content = content.replace(
    '''<h1 class="hero-title">
                    Dò forma alla <span class="gradient-text-purple">Materia</span>. <br>
                    E respiro ai <span class="gradient-text-gold">Colori</span>.
                </h1>''',
    '''<h1 class="hero-title">
                    L'arte che prende forma
                </h1>'''
)
content = content.replace(
    '''<p class="hero-description">
                    Ciao, sono Marco. Realizzo quadri personalizzati, murales d'impatto, sculture in legno ed esche da
                    pesca fatte a mano. Lavoro fianco a fianco con te per trasformare le tue idee in opere uniche,
                    mettendoci tutto il mio tempo, la mia esperienza e la mia passione.
                </p>''',
    '''<p class="hero-description">
                    Benvenuto nel mio spazio creativo. Sono Marco, realizzo per te quadri e manufatti personalizzati . Contattami per trasformare la tua idea in realtà.
Lavorerò fianco a fianco con te per trasformare le tue idee in realtà.
                </p>'''
)

# 3. Portofolio Section - Pittorica
content = content.replace(
    '''<h3 class="category-section-title">L'anima del colore <span class="subtitle-inline">| Su tela e su
                        parete</span></h3>''',
    '''<h3 class="category-section-title">arte pittorica tele, pareti ed altre superfici</h3>'''
)
content = content.replace('''<h3>Quadri b/n ritratti persone</h3>''', '''<h3>persone</h3>''')
content = content.replace('''<h3>Quadri b/n ritratti animali</h3>''', '''<h3>animali</h3>''')
content = content.replace('''<h3>Quadri a colori</h3>''', '''<h3>quadri a colori</h3>''')
content = content.replace('''<h3>Pareti interno/esterno</h3>''', '''<h3>pareti interno/esterno</h3>''')
content = content.replace('''<h3>Digital art</h3>''', '''<h3>tecnica mista</h3>''')

# 4. Portofolio Section - Artistica
content = content.replace(
    '''<h3 class="category-section-title">Dò forma alla materia <span class="subtitle-inline">| Legno, design e
                        artigianato</span></h3>''',
    '''<h3 class="category-section-title">manufatti e creazioni</h3>'''
)
content = content.replace('''<h3>Piccoli manufatti in legno</h3>''', '''<h3>piccoli manufatti in legno</h3>''')
content = content.replace('''<h3>Esche per la pesca</h3>''', '''<h3>gadget e portachiavi</h3>''')
content = content.replace('''<h3>Gadget e portachiavi</h3>''', '''<h3>arredo e design</h3>''')
# Delete the 4th item in Artistica (Tecniche miste)
# We need to find the block for "Tecniche miste" and remove it.
# The block looks like:
#                     <!-- Tecniche miste -->
#                     <div class="portfolio-item category-box reveal-element" data-cat="miste">
#                     ...
#                     </div>
import re
pattern = re.compile(r'<!-- Tecniche miste -->.*?</div>\s*</div>\s*</div>', re.DOTALL)
content = re.sub(pattern, '', content)

# 5. Replace "Marco Artist" with "Marco La Spada Artist" where applicable
content = content.replace('''alt="Marco Artist Logo"''', '''alt="Marco La Spada Artist Logo"''')
content = content.replace('''MARCO<span>ARTIST</span>''', '''MARCO LA SPADA <span>ARTIST</span>''')
content = content.replace('''alt="Marco Artist Opera Astratta"''', '''alt="Marco La Spada Artist Opera Astratta"''')
content = content.replace('''alt="Ritratto di Marco Artist nel suo laboratorio"''', '''alt="Ritratto di Marco La Spada Artist nel suo laboratorio"''')
content = content.replace('''&copy; 2026 Marco Artist.''', '''&copy; 2026 Marco La Spada Artist.''')
content = content.replace('''@marco_artist_''', '''@marco_laspada_artist_''') # optionally? no, the user just said change site name, not ig handle. Revert this mentally.
content = content.replace('''@marco_laspada_artist_''', '''@marco_artist_''')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
