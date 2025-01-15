export interface Category {
    id: number;
    name: string;
    description: string;
}

export const initialCategories: Category[] = [
    {
        id: 1,
        name: "Tecnología",
        description: "Noticias sobre avances tecnológicos y tendencias digitales",
    },
    {
        id: 2,
        name: "Deportes",
        description: "Actualidad deportiva y eventos destacados",
    },
    {
        id: 3,
        name: "Cultura",
        description: "Arte, música, literatura y eventos culturales",
    }
]; 