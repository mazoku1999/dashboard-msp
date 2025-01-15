import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    NewspaperIcon,
    UsersIcon,
    PlayCircleIcon,
    ActivityIcon,
    TrendingUpIcon,
    Monitor,
    Smartphone
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const chartData = [
    { month: "Ene", noticias: 486, videos: 180 },
    { month: "Feb", noticias: 505, videos: 280 },
    { month: "Mar", noticias: 437, videos: 262 },
    { month: "Abr", noticias: 473, videos: 279 },
    { month: "May", noticias: 509, videos: 293 },
    { month: "Jun", noticias: 514, videos: 294 },
    { month: "Jul", noticias: 573, videos: 310 },
    { month: "Ago", noticias: 486, videos: 298 },
    { month: "Sep", noticias: 537, videos: 305 },
    { month: "Oct", noticias: 573, videos: 299 },
    { month: "Nov", noticias: 614, videos: 314 },
    { month: "Dic", noticias: 573, videos: 311 },
];

const chartConfig = {
    noticias: {
        label: "Noticias",
        icon: NewspaperIcon,
        color: "hsl(var(--chart-1))",
    },
    videos: {
        label: "Videos",
        icon: PlayCircleIcon,
        color: "hsl(var(--chart-2))",
    },
};

const DashboardContent = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Panel de Control</h2>
                    <div className="flex gap-2 mt-2">
                        <Button variant="default" className="rounded-full">General</Button>
                        <Button variant="ghost" className="rounded-full">Estadísticas</Button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button className="sm:w-auto">
                        <TrendingUpIcon className="mr-2 h-4 w-4" />
                        Exportar Datos
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center gap-2">
                        <NewspaperIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Total Noticias</h3>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-green-500">+2 este mes</p>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Editores</h3>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-green-500">+2 este mes</p>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-2">
                        <PlayCircleIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Videos</h3>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-green-500">+5 este mes</p>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-2">
                        <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Visitas Hoy</h3>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold">73</div>
                        <p className="text-xs text-green-500">+2 última hora</p>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="p-6 col-span-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-medium">Contenido Publicado</h3>
                            <p className="text-sm text-muted-foreground">Publicaciones mensuales por tipo</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">Mensual</Button>
                            <Button variant="outline" size="sm">Anual</Button>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ChartContainer config={chartConfig} className="w-full">
                            <BarChart data={chartData} accessibilityLayer>
                                <CartesianGrid vertical={false} className="stroke-muted" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar
                                    dataKey="noticias"
                                    fill="var(--color-noticias)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="videos"
                                    fill="var(--color-videos)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </Card>

                <Card className="p-6 col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-medium">Últimas Publicaciones</h3>
                            <p className="text-sm text-muted-foreground">Se han realizado 39 publicaciones este mes</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {[
                            { title: 'Nuevo avance tecnológico', type: 'Noticia', category: 'Tecnología', date: '2024-03-15' },
                            { title: 'Tutorial: React Avanzado', type: 'Video', category: 'Programación', date: '2024-03-14' },
                            { title: 'Lanzamiento de producto', type: 'Noticia', category: 'Negocios', date: '2024-03-13' },
                            { title: 'Entrevista con expertos', type: 'Video', category: 'Tecnología', date: '2024-03-12' },
                            { title: 'Actualización importante', type: 'Noticia', category: 'Software', date: '2024-03-11' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center">
                                <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium leading-none">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.type} - {item.category}</p>
                                </div>
                                <div className="text-sm text-muted-foreground">{item.date}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardContent;
