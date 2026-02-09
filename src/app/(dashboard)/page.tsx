"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    Package,
    ShoppingCart,
    ClipboardList,
    TrendingUp,
    ArrowRight,
    Info,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";
import { usePageHeaderStore } from "@/stores/page-header.store";
import { Separator } from "@/components/ui/separator";

const chartData = [
    { tarih: "1 Şub", siparis: 12, tutar: 2400 },
    { tarih: "2 Şub", siparis: 19, tutar: 3800 },
    { tarih: "3 Şub", siparis: 15, tutar: 3100 },
    { tarih: "4 Şub", siparis: 22, tutar: 4500 },
    { tarih: "5 Şub", siparis: 18, tutar: 3600 },
    { tarih: "6 Şub", siparis: 25, tutar: 5200 },
    { tarih: "7 Şub", siparis: 21, tutar: 4100 },
];

const chartConfig = {
    siparis: { label: "Sipariş Sayısı", color: "var(--chart-1)" },
    tutar: { label: "Tutar (₺)", color: "var(--chart-2)" },
};

const sonSiparisler = [
    { no: "SIP-2024-0842", tarih: "07.02.2025", tutar: "₺1.240", durum: "Onaylandı" },
    { no: "SIP-2024-0841", tarih: "06.02.2025", tutar: "₺890", durum: "Kargoda" },
    { no: "SIP-2024-0840", tarih: "05.02.2025", tutar: "₺2.100", durum: "Teslim Edildi" },
    { no: "SIP-2024-0839", tarih: "04.02.2025", tutar: "₺456", durum: "Beklemede" },
    { no: "SIP-2024-0838", tarih: "03.02.2025", tutar: "₺1.780", durum: "Onaylandı" },
];

const durumBadgeVariant = (durum: string) => {
    if (durum === "Teslim Edildi") return "default";
    if (durum === "Onaylandı" || durum === "Kargoda") return "secondary";
    return "outline";
};

export default function DashboardPage() {
    const setPageHeader = usePageHeaderStore((s) => s.setPageHeader);

    useEffect(() => {
        setPageHeader({
            breadcrumbConfig: {
                strategy: "immediate",
            },
            breadcrumbs: [
                { label: "Ana Sayfa", href: "/" },
                { label: "Dashboard" },
            ],
        });
        return () => usePageHeaderStore.getState().reset();
    }, [setPageHeader]);

    return (
        <div className="flex-1 space-y-8 p-gutter">
            {/* Hoş geldin mesajı */}
            <Alert className="border-primary/30 bg-primary/5">
                <Info className="size-4" />
                <AlertTitle>Hoş geldiniz</AlertTitle>
                <AlertDescription>
                    B2B Portal paneline hoş geldiniz. Siparişlerinizi takip edebilir,
                    ürün kataloğunu inceleyebilir ve sepetinizden hızlıca sipariş
                    verebilirsiniz.
                </AlertDescription>
            </Alert>

            {/* İstatistik kartları */}
            <section>
                <h2 className="mb-4 text-sm font-medium text-muted-foreground">
                    Özet
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Toplam Sipariş
                            </CardTitle>
                            <ClipboardList className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1.248</div>
                            <p className="text-xs text-muted-foreground">
                                Bu ay +12% artış
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Bekleyen Sipariş
                            </CardTitle>
                            <ClipboardList className="size-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">
                                Onay veya kargo bekliyor
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Katalog Ürünü
                            </CardTitle>
                            <Package className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.847</div>
                            <p className="text-xs text-muted-foreground">
                                Aktif ürün sayısı
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sepetteki Ürün
                            </CardTitle>
                            <ShoppingCart className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-xs text-muted-foreground">
                                <Link
                                    href="/cart"
                                    className="text-primary hover:underline"
                                >
                                    Sepete git →
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <Separator />

            {/* Hızlı erişim */}
            <section>
                <h2 className="mb-4 text-sm font-medium text-muted-foreground">
                    Hızlı Erişim
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Link href="/products">
                        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Package className="size-6" />
                                </div>
                                <div className="flex-1 space-y-0">
                                    <CardTitle className="text-base">Ürünler</CardTitle>
                                    <CardDescription>
                                        Kataloğu inceleyin ve sipariş verin
                                    </CardDescription>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/orders">
                        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ClipboardList className="size-6" />
                                </div>
                                <div className="flex-1 space-y-0">
                                    <CardTitle className="text-base">Siparişlerim</CardTitle>
                                    <CardDescription>
                                        Sipariş geçmişi ve takip
                                    </CardDescription>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/cart">
                        <Card className="group transition-all hover:border-primary/50 hover:shadow-md">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ShoppingCart className="size-6" />
                                </div>
                                <div className="flex-1 space-y-0">
                                    <CardTitle className="text-base">Sepet</CardTitle>
                                    <CardDescription>
                                        Sepetinizi görüntüleyin ve ödeme yapın
                                    </CardDescription>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </section>

            {/* Grafik + Hedef ilerlemesi */}
            <section className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="size-5" />
                            Son 7 Gün – Sipariş & Tutar
                        </CardTitle>
                        <CardDescription>
                            Günlük sipariş sayısı ve toplam tutar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[280px] w-full">
                            <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="tarih"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <YAxis
                                    yAxisId="left"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(v) => `${v}`}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value, name) => [
                                                name === "tutar" && typeof value === "number"
                                                    ? `₺${value.toLocaleString("tr-TR")}`
                                                    : value,
                                                "",
                                            ]}
                                        />
                                    }
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="siparis"
                                    stroke="var(--color-siparis)"
                                    fill="var(--color-siparis)"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="tutar"
                                    stroke="var(--color-tutar)"
                                    fill="var(--color-tutar)"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Aylık Hedef</CardTitle>
                        <CardDescription>
                            Bu ayki sipariş hedefi ilerlemesi
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Hedef</span>
                                <span className="font-medium">150 sipariş</span>
                            </div>
                            <Progress value={68} className="h-3" />
                            <p className="text-xs text-muted-foreground">
                                <strong>102</strong> sipariş tamamlandı (%68)
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Ciro hedefi</span>
                                <span className="font-medium">₺200.000</span>
                            </div>
                            <Progress value={45} className="h-3" />
                            <p className="text-xs text-muted-foreground">
                                <strong>₺90.200</strong> (%45)
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Son siparişler tablosu */}
            <section>
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground">
                        Son Siparişler
                    </h2>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/orders">
                            Tümünü gör
                            <ArrowRight className="ml-1 size-4" />
                        </Link>
                    </Button>
                </div>
                <Card className="mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sipariş No</TableHead>
                                <TableHead>Tarih</TableHead>
                                <TableHead>Tutar</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead className="text-right">İşlem</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sonSiparisler.map((s) => (
                                <TableRow key={s.no}>
                                    <TableCell className="font-medium">{s.no}</TableCell>
                                    <TableCell>{s.tarih}</TableCell>
                                    <TableCell>{s.tutar}</TableCell>
                                    <TableCell>
                                        <Badge variant={durumBadgeVariant(s.durum)}>
                                            {s.durum}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href="/orders">Detay</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </section>
        </div>
    );
}
