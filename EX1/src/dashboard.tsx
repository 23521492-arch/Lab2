// src/dashboard.tsx
/** @jsx createElement */
import { createElement, useState, VNode } from './jsx-runtime';
import { getMockChartData, randomizeData, ChartDatum } from './data-service';
import { BarChart, LineChart, CircleChart } from './chart';

const Dashboard = (): VNode => {
    const [getData, setData] = useState<ChartDatum[]>(getMockChartData());
    const [getType, setType] = useState<'bar' | 'line' | 'circle'>('bar');
    const data = getData();

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const avg = data.length ? Math.round(total / data.length) : 0;

    const reload = () => {
        setData(randomizeData(data));
    };

    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '15px' }}>
            <h2 style={{ marginTop: 0 }}>4. Dashboard</h2>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                <div style={{ background: '#f6f8fa', padding: '10px', borderRadius: '6px' }}>Tổng: {total}</div>
                <div style={{ background: '#f6f8fa', padding: '10px', borderRadius: '6px' }}>Trung bình: {avg}</div>
                <button onClick={reload} style={{ padding: '8px 12px', marginLeft: 'auto' }}>Randomize</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button onClick={() => setType('bar')} disabled={getType() === 'bar'}>Bar Chart</button>
                <button onClick={() => setType('line')} disabled={getType() === 'line'}>Line Chart</button>
                <button onClick={() => setType('circle')} disabled={getType() === 'circle'}>Circle Chart</button>
            </div>
            {getType() === 'bar' && <BarChart data={data} width={600} height={220} />}
            {getType() === 'line' && <LineChart data={data} width={600} height={220} />}
            {getType() === 'circle' && <CircleChart data={data} size={240} />}
        </div>
    );
};

export { Dashboard };