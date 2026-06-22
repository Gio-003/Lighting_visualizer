# Lighting Visualizer

Interaktivna web aplikacija za demonstraciju modela osvetljenja u računarskoj grafici. Korisnik u realnom vremenu može da menja parametre materijala, poziciju svetla i model senčenja, te da vizuelno uporedi **Flat**, **Gouraud** i **Phong** pristup na 3D objektima.

Aplikacija je razvijena kao edukativni alat za razumevanje kako se intenzitet svetla računa na nivou poligona, temena ili piksela u grafičkom pipeline-u.

---

## Mogućnosti

### Modeli senčenja (Shading)

| Model | Gde se računa osvetljenje | Karakteristika |
| :--- | :--- | :--- |
| **Flat** | Fragment šader (jedna normala po poligonu) | Oštar, poligonalan izgled |
| **Gouraud** | Vertex šader + interpolacija boje | Glatke prelaze, manje precizni spekularni refleksi |
| **Phong** | Fragment šader (interpolirane normale) | Najprecizniji model, po-piksel osvetljenje |

Za svaki model dostupna je teorija, matematička formula i prikaz izvornog GLSL koda kroz modal **Teorija Šadera**.

### Geometrijska tela

Podržani oblici:

- Sfera (32×32 segmenata)
- Kocka
- Cilindar
- Konus
- Torus
- Torus čvor
- Kapsula
- Icosahedron
- Dodecahedron

### Interaktivno osvetljenje

- **Point light** sa podesivim intenzitetom (0–10)
- **Žuta sfera (gizmo)** na sceni — kliknite i prevucite da pomerite izvor svetla
- Dugme **Resetuj poziciju svetla** vraća svetlo na podrazumevanu poziciju
- Komponente materijala u Phong/Gouraud modelu:
  - **Ambient (ka)** — ambijentalno osvetljenje (0–1)
  - **Diffuse (kd)** — difuzno rasipanje (0–1)
  - **Specular (ks)** — spekularni refleks (0–1)
  - **Shininess (n)** — eksponent sjaja (1–128)

### Vizualizacija

- **Wireframe** — prikaz žičanog modela preko površine
- **Normale** — prikaz normala poligona (crveno) i/ili temena (zeleno)
- **Teksturisanje** — učitavanje sopstvene slike i primena na objekat

### Upravljanje scenom

- **OrbitControls** — rotacija kamere oko objekta (prevlačenje mišem)
- **Reset Scene** — vraća celu scenu na početno stanje (materijal, oblik, senčenje, svetlo, normale, tekstura)
- Taster **`P`** — pauzira/nastavlja automatsku rotaciju objekta

---

## Podrazumevano stanje scene

Pri pokretanju aplikacija učitava „hero shot“ konfiguraciju:

| Parametar | Vrednost |
| :--- | :--- |
| Geometrija | Sfera (32×32) |
| Senčenje | Phong |
| Pozicija svetla | (30, 25, 30) |
| Ambient (ka) | 0.1 |
| Diffuse (kd) | 0.7 |
| Specular (ks) | 0.6 |
| Shininess (n) | 32 |
| Intenzitet svetla | 2.05 |
| Boja objekta | `#00adb5` (tirkizna) |
| Pozadina canvas-a | `#121824` |

---

## Tehnologije

- **[Three.js](https://threejs.org/)** — 3D scena, geometrija, kontrole
- **WebGL** — hardverski ubrzano renderovanje
- **GLSL** — prilagođeni vertex i fragment šaderi (`src/shaders/`)
- **[Vite](https://vitejs.dev/)** — razvojni server i build alat

---

## Preduslovi

- [Node.js](https://nodejs.org/) (preporučeno v18 ili novije)
- npm (dolazi sa Node.js)

---

## Instalacija i pokretanje

```bash
# Kloniraj repozitorijum i uđi u folder aplikacije
cd lighting-visualizer

# Instaliraj zavisnosti
npm install

# Pokreni razvojni server
npm run dev
```

Vite će prikazati lokalnu adresu (obično `http://localhost:5173`). Otvorite je u pretraživaču.

### Ostale npm komande

| Komanda | Opis |
| :--- | :--- |
| `npm run dev` | Razvojni server sa hot reload-om |
| `npm run build` | Produkcijski build u `dist/` |
| `npm run preview` | Lokalni pregled produkcijskog build-a |

---

## Korišćenje

1. **Rotacija kamere** — prevucite mišem po 3D prikazu.
2. **Pomeranje svetla** — kliknite na žutu sferu i prevucite je.
3. **Kontrolni panel** (desna strana, 30% ekrana) — menjajte senčenje, oblik, materijal i prikaz.
4. **Teorija** — dugmad *O Autoru* i *Teorija Šadera* otvaraju informativne modalne prozore.
5. **Reset** — *Reset Scene* vraća sve parametre; *Resetuj poziciju svetla* samo poziciju izvora.

---

## Struktura projekta

```
lighting-visualizer/
├── index.html              # HTML markup i modalni prozori
├── package.json
├── src/
│   ├── main.js             # Ulazna tačka — povezuje sve module
│   ├── style.css           # Dark Studio UI tema
│   ├── config/
│   │   └── constants.js    # Podrazumevane vrednosti i boje
│   ├── scene/
│   │   ├── createRenderer.js
│   │   └── createOrbitControls.js
│   ├── lighting/
│   │   ├── createLightSystem.js   # Point light + DragControls gizmo
│   │   └── gizmoPicker.js
│   ├── materials/
│   │   ├── createUniforms.js
│   │   ├── createShadingMaterials.js
│   │   └── textureManager.js
│   ├── mesh/
│   │   ├── createMainMesh.js
│   │   ├── geometryFactory.js
│   │   └── updateMeshGeometry.js
│   ├── shaders/            # GLSL šaderi (flat, gouraud, phong)
│   ├── helpers/
│   │   └── normalsHelpers.js
│   ├── ui/
│   │   ├── bindSidebarControls.js
│   │   ├── bindTextureControls.js
│   │   ├── bindCanvasEvents.js
│   │   └── modals.js
│   └── animation/
│       └── createAnimationLoop.js
└── public/
```

---

## Arhitektura

Aplikacija prati modularnu strukturu gde svaki modul ima jednu odgovornost:

```
main.js
  ├── createRenderer()        → WebGL renderer, kamera, scena
  ├── createOrbitControls()   → rotacija kamere
  ├── createLightSystem()     → point light + draggable gizmo
  ├── createUniforms()        → deljeni GPU uniformi
  ├── createShadingMaterials()→ tri ShaderMaterial instance
  ├── createMainMesh()        → glavni mesh + wireframe
  ├── setupNormalsHelpers()   → vizualizacija normala
  ├── bindSidebarControls()   → UI ↔ uniformi ↔ scena
  └── createAnimationLoop()   → render petlja
```

Sva tri modela senčenja dele iste `uniforms`, pa promena klizača odmah utiče na aktivni materijal bez ponovnog učitavanja šadera.

---

## Matematički modeli (kratko)

**Flat (Lambert):**

```
I = Ambient + Diffuse · max(N · L, 0)
```

**Gouraud / Phong (refleksioni model):**

```
I = (Ambient + Diffuse · max(N · L, 0)) · Kd + Specular · max(R · V, 0)^n
```

Gde su **N** normala, **L** smer ka svetlu, **V** smer ka posmatraču, **R** reflektovani vektor, a **n** shininess eksponent.

Detaljne formule, objašnjenja i kompletan GLSL kod dostupni su u aplikaciji pod **Teorija Šadera**.

---

## Licenca

Projekat je razvijen u edukativne svrhe kao deo diplomskog rada iz predmeta Računarska grafika.
