// src/chart.tsx
/** @jsx createElement */
import { createElement, VNode } from './jsx-runtime';
import type { ChartDatum } from './data-service';

interface BarChartProps {
    data: ChartDatum[];
    width?: number;
    height?: number;
}

const BarChart = ({ data, width = 600, height = 200 }: BarChartProps): VNode => {
    const max = Math.max(...data.map(d => d.value), 1);
    const barWidth = Math.max(20, Math.floor(width / (data.length * 2)));
    const gap = Math.floor(barWidth * 0.6);

    return (
        <div style={{ width: `${width}px`, border: '1px solid #ddd', padding: '10px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: `${height}px` }}>
                {data.map((d) => {
                    const h = Math.round((d.value / max) * (height - 20));
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: `${gap}px` }}>
                            <div style={{ backgroundColor: '#4e79a7', width: `${barWidth}px`, height: `${h}px`, borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ marginTop: '6px', fontSize: '12px' }}>{d.label}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>{d.value}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface LineChartProps {
    data: ChartDatum[];
    width?: number;
    height?: number;
}

const LineChart = ({ data, width = 600, height = 200 }: LineChartProps): VNode => {
    const max = Math.max(...data.map(d => d.value), 1);
    const padding = 20;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;
    const xStep = data.length > 1 ? innerW / (data.length - 1) : innerW;
    const points = data.map((d, i) => {
        const x = padding + i * xStep;
        const y = padding + innerH - Math.round((d.value / max) * innerH);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ width: `${width}px`, border: '1px solid #ddd', padding: '10px', borderRadius: '6px' }}>
            <svg width={width} height={height} style={{ display: 'block' }}>
                {/* trục đơn giản */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" />
                {/* đường nối các điểm */}
                <polyline points={points} fill="none" stroke="#4e79a7" stroke-width="2" />
                {/* vẽ các điểm */}
                {data.map((d, i) => {
                    const x = padding + i * xStep;
                    const y = padding + innerH - Math.round((d.value / max) * innerH);
                    return (
                        <circle cx={x} cy={y} r={3} fill="#e15759" />
                    );
                })}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                {data.map(d => (
                    <span style={{ fontSize: '12px' }}>{d.label}</span>
                ))}
            </div>
        </div>
    );
};

interface CircleChartProps {
    data: ChartDatum[];
    size?: number;
}

const CircleChart = ({ data, size = 220 }: CircleChartProps): VNode => {
    const total = Math.max(1, data.reduce((s, d) => s + d.value, 0));
    const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7'];
    let acc = 0;
    const segments = data.map((d, i) => {
        const start = (acc / total) * 360;
        acc += d.value;
        const end = (acc / total) * 360;
        const color = colors[i % colors.length];
        return `${color} ${start}deg ${end}deg`;
    }).join(', ');

    return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', background: `conic-gradient(${segments})`, boxShadow: 'inset 0 0 0 40px #fff', outline: '1px solid #ddd' }}></div>
            <div>
                {data.map((d, i) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: colors[i % colors.length], borderRadius: '2px' }}></span>
                        <span style={{ fontSize: '13px' }}>{d.label}: {d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { BarChart, LineChart, CircleChart };