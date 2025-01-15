interface VideoInfo {
    id: string;
    title: string;
    description?: string;
}

export interface News {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    created_at: string;
    category: string;
    video?: VideoInfo;
}

export const initialNews: News[] = [
    {
        id: 1,
        title: "Introducción a la Inteligencia Artificial",
        excerpt: "Una visión general sobre la IA y su impacto en la sociedad moderna",
        content: `# Introducción a la Inteligencia Artificial`,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        author: "María García",
        created_at: new Date().toISOString(),
        category: "Tecnología",
        video: {
            id: "dQw4w9WgXcQ",
            title: "¿Qué es la IA?",
            description: "Una explicación detallada sobre la inteligencia artificial"
        }
    },
    {
        id: 2,
        title: "El Impacto del Cambio Climático en los Océanos",
        excerpt: "Nuevos estudios revelan cambios dramáticos en los ecosistemas marinos debido al calentamiento global",
        content: `# El Impacto del Cambio Climático en los Océanos

![Océano y cambio climático](https://images.unsplash.com/photo-1498623116890-37e912163d5d)

El cambio climático está afectando significativamente nuestros océanos, alterando ecosistemas completos y amenazando la biodiversidad marina.

## Principales Efectos

### 1. Acidificación

La absorción de CO2 está causando:

* Reducción del pH del agua
* Afectación a organismos calcáreos
* Alteración de cadenas alimentarias

### 2. Aumento del Nivel del Mar

> "El nivel del mar podría aumentar hasta 2 metros para 2100" - IPCC

#### Consecuencias:

1. Erosión costera
2. Inundación de zonas bajas
3. Pérdida de hábitats costeros

![Erosión costera](https://images.unsplash.com/photo-1621844061203-3f31a2a7d6ad)

## Especies Amenazadas

* Corales
* Tortugas marinas
* Ballenas
* Pingüinos

### Medidas de Conservación

1. **Áreas Marinas Protegidas**
   * Restricción de pesca
   * Monitoreo científico
   * Restauración de hábitats

2. **Reducción de Contaminación**
   * Control de plásticos
   * Tratamiento de aguas
   * Regulación industrial

## Conclusiones

Es crucial actuar ahora para proteger nuestros océanos y la vida marina que depende de ellos.`,
        image: "https://images.unsplash.com/photo-1498623116890-37e912163d5d",
        author: "Carlos Rodríguez",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        category: "Cultura"
    },
    {
        id: 3,
        title: "Mundial de Fútbol 2026: Las Sedes Confirmadas",
        excerpt: "FIFA anuncia las ciudades que albergarán los partidos del próximo Mundial",
        content: `# Mundial de Fútbol 2026: Las Sedes Confirmadas

![Estadio de fútbol](https://images.unsplash.com/photo-1522778119026-d647f0596c20)

La FIFA ha anunciado oficialmente las ciudades sede para el Mundial 2026, que será el primero en organizarse en tres países: Estados Unidos, México y Canadá.

## Sedes por País

### Estados Unidos
* Nueva York/Nueva Jersey
* Los Ángeles
* Dallas
* Miami
* Houston
* Philadelphia
* Seattle
* San Francisco
* Boston
* Kansas City
* Atlanta

### México
* Ciudad de México
* Monterrey
* Guadalajara

### Canadá
* Toronto
* Vancouver

## Estadios Destacados

1. **MetLife Stadium** (Nueva York)
   * Capacidad: 82,500
   * Sede propuesta para la final

2. **Estadio Azteca** (Ciudad de México)
   * Capacidad: 87,523
   * Único estadio en albergar tres mundiales

3. **SoFi Stadium** (Los Ángeles)
   * Capacidad: 70,240
   * Estadio más moderno y costoso

## Formato del Torneo

El Mundial 2026 será el primero en contar con 48 selecciones, lo que significa:

* Más partidos
* Más sedes necesarias
* Mayor duración del torneo

### Fase de Grupos

* 16 grupos de 3 equipos
* Los dos primeros avanzan a dieciseisavos
* Sin partidos simultáneos en la última fecha

## Impacto Económico

Se espera que el torneo genere:

* 5 millones de visitantes
* $11 mil millones en ingresos
* 180,000 empleos temporales

## Preparativos

- [ ] Modernización de estadios
- [ ] Mejora de infraestructura
- [ ] Sistemas de transporte
- [ ] Alojamiento para aficionados

## Conclusión

El Mundial 2026 promete ser el más grande de la historia, con una organización sin precedentes entre tres países y una expansión significativa del formato.`,
        image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20",
        author: "Ana Martínez",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        category: "Deportes",
        video: {
            id: "xyz789",
            title: "Tour por los Estadios",
            description: "Recorrido virtual por los estadios del Mundial 2026"
        }
    }
]; 