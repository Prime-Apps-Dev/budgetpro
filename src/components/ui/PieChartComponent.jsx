import React from 'react';

const PieChartComponent = ({ data, title, colors, currencySymbol }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;

  let accumulatedAngle = 0;

  const segments = data.map((item, index) => {
    const angle = (item.value / total) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;

    return (
      <g key={index}>
        <path
          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
          fill={colors[index % colors.length]}
        />
      </g>
    );
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">{title}</h3>
      <div className="flex items-center justify-between">
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          {segments}
        </svg>
        <div className="flex-1 ml-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center mb-3">
              <div
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <div className="text-sm">
                <div className="font-medium">{item.name}</div>
                <div className="text-gray-500">{item.value.toLocaleString()} {currencySymbol}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;