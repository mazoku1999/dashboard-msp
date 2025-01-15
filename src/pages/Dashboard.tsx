import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DollarSignIcon,
    UsersIcon,
    CreditCardIcon,
    ActivityIcon,
    TrendingUpIcon,
    Monitor,
    Smartphone
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const chartData = [
    { month: "Ene", desktop: 2486, mobile: 2180 },
    { month: "Feb", desktop: 3105, mobile: 2800 },
    { month: "Mar", desktop: 2837, mobile: 2620 },
    { month: "Abr", desktop: 2973, mobile: 2790 },
    { month: "May", desktop: 3209, mobile: 2930 },
    { month: "Jun", desktop: 3214, mobile: 2940 },
    { month: "Jul", desktop: 3373, mobile: 3100 },
    { month: "Ago", desktop: 3186, mobile: 2980 },
    { month: "Sep", desktop: 3337, mobile: 3050 },
    { month: "Oct", desktop: 3273, mobile: 2990 },
    { month: "Nov", desktop: 3414, mobile: 3140 },
    { month: "Dic", desktop: 3373, mobile: 3110 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        icon: Monitor,
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        icon: Smartphone,
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
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Ingresos Totales</h3>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-green-500">+20.1% este mes</p>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Suscripciones</h3>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold">+2,350</div>
                        <p className="text-xs text-green-500">+180.1% este mes</p>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-2">
                        <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Ventas</h3>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-green-500">+19% este mes</p>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-2">
                        <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Activos Ahora</h3>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-green-500">+201 última hora</p>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="p-6 col-span-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-medium">Visitas por Dispositivo</h3>
                            <p className="text-sm text-muted-foreground">Visitas mensuales por tipo de dispositivo</p>
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
                                    dataKey="desktop"
                                    fill="var(--color-desktop)"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="mobile"
                                    fill="var(--color-mobile)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </Card>

                <Card className="p-6 col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-medium">Ventas Recientes</h3>
                            <p className="text-sm text-muted-foreground">Has realizado 265 ventas este mes</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {[
                            { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '$1,999.00' },
                            { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '$39.00' },
                            { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '$299.00' },
                            { name: 'William Kim', email: 'will@email.com', amount: '$99.00' },
                            { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '$39.00' }
                        ].map((sale, i) => (
                            <div key={i} className="flex items-center">
                                <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                                    <p className="text-sm text-muted-foreground">{sale.email}</p>
                                </div>
                                <div className="text-sm font-medium">{sale.amount}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardContent;
