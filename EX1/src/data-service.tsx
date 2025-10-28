// src/data-service.tsx
// Cung cấp dữ liệu mẫu cho biểu đồ/dashboard

export interface ChartDatum {
    label: string;
    value: number;
}

export function getMockChartData(): ChartDatum[] {
    return [
        { label: 'Jan', value: 12 },
        { label: 'Feb', value: 18 },
        { label: 'Mar', value: 9 },
        { label: 'Apr', value: 22 },
        { label: 'May', value: 15 },
        { label: 'Jun', value: 27 },
    ];
}

export function randomizeData(data: ChartDatum[]): ChartDatum[] {
    return data.map(d => ({ ...d, value: Math.max(0, Math.round(d.value * (0.7 + Math.random() * 0.6))) }));
}