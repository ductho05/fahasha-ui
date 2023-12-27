import { PieChart, Pie, Cell } from 'recharts';

// Cấu hình màu sắc (nếu cần)
const COLORS = ['#00CC00', '#FF0033'];

const MyPieChart = ({ data }) => {
    return (
        <PieChart width={300} height={300}>
            <Pie
                data={data}
                cx={150}
                cy={150}
                innerRadius={0}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
        </PieChart>
    );
};

export default MyPieChart;
