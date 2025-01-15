export interface Video {
    id: number;
    title: string;
    thumbnail: string;
    youtubeId: string;
    description: string;
    author: string;
    created_at: string;
    category: string;
}

export const initialVideos: Video[] = [
    {
        id: 1,
        title: "¿Qué es la INTELIGENCIA ARTIFICIAL?",
        thumbnail: "https://i.ytimg.com/vi/yN7ypxC7838/maxresdefault.jpg",
        youtubeId: "yN7ypxC7838",
        description: "Explicación completa sobre la IA y su impacto en nuestra vida",
        author: "Dot CSV",
        created_at: "2024-03-21",
        category: "Tecnología"
    },
    {
        id: 2,
        title: "5 Avances Médicos que Cambiarán el Futuro",
        thumbnail: "https://i.ytimg.com/vi/Pnv-43XUEjY/maxresdefault.jpg",
        youtubeId: "PBj0H5LwT0E",
        description: "Los avances más revolucionarios en medicina que transformarán nuestras vidas",
        author: "Veritasium en español",
        created_at: "2024-03-20",
        category: "Salud"
    },
    {
        id: 3,
        title: "¿Qué es BLOCKCHAIN? Explicación DEFINITIVA",
        thumbnail: "https://i.ytimg.com/vi/V9Kr2SujqHw/maxresdefault.jpg",
        youtubeId: "V9Kr2SujqHw",
        description: "La tecnología blockchain explicada de manera simple",
        author: "Dot CSV",
        created_at: "2024-03-19",
        category: "Tecnología"
    },
    {
        id: 4,
        title: "Boston Dynamics: El Futuro de la Robótica",
        thumbnail: "https://i.ytimg.com/vi/fn3KWM1kuAw/maxresdefault.jpg",
        youtubeId: "fn3KWM1kuAw",
        description: "Los últimos avances en robótica y su impacto en el futuro",
        author: "Boston Dynamics",
        created_at: "2024-03-18",
        category: "Tecnología"
    },
    {
        id: 5,
        title: "Living Forever: The Science of Aging",
        thumbnail: "https://i.ytimg.com/vi/QRt7LjqJ45k/maxresdefault.jpg",
        youtubeId: "QRt7LjqJ45k",
        description: "Investigación sobre la longevidad y el futuro del envejecimiento",
        author: "Kurzgesagt",
        created_at: "2024-03-17",
        category: "Salud"
    },
    {
        id: 6,
        title: "El Futuro de la Energía Solar",
        thumbnail: "https://i.ytimg.com/vi/crAgssqpgQQ/maxresdefault.jpg",
        youtubeId: "crAgssqpgQQ",
        description: "Avances y futuro de la energía solar y renovable",
        author: "QuantumFracture",
        created_at: "2024-03-16",
        category: "Tecnología"
    },
    {
        id: 7,
        title: "The Future of Space Travel",
        thumbnail: "https://i.ytimg.com/vi/uqKGREZs6-w/maxresdefault.jpg",
        youtubeId: "uqKGREZs6-w",
        description: "Exploración espacial y el futuro de los viajes interplanetarios",
        author: "Real Engineering",
        created_at: "2024-03-15",
        category: "Tecnología"
    }
];

export const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

export const getYoutubeVideoInfo = async (videoId: string) => {
    try {
        const response = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );

        if (!response.ok) {
            throw new Error('Video no encontrado');
        }

        const data = await response.json();

        return {
            title: data.title,
            author: data.author_name,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            youtubeId: videoId
        };
    } catch (error) {
        throw new Error('Error al obtener la información del video');
    }
}; 