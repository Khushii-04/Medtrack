import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonthlyAdherenceHeatmap = () => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState('');

    useEffect(() => {
        fetchAdherenceData();
    }, []);

    const fetchAdherenceData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/medications', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = generateMonthlyHeatmap(response.data);
            setHeatmapData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching adherence data:', error);
            setLoading(false);
        }
    };

    const generateMonthlyHeatmap = (medications) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        // Set current month name
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        setCurrentMonth(monthNames[month]);
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 6 = Saturday
        
        const days = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ isEmpty: true });
        }
        
        // Generate data for each day of the month
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const isFuture = date > today;
            
            // Calculate adherence for this day
            let takenCount = 0;
            let totalCount = 0;

            if (!isFuture) {
                medications.forEach(med => {
                    if (med.dailyStatus) {
                        const dayStatus = med.dailyStatus.find(ds => {
                            const dsDate = new Date(ds.date);
                            return dsDate.toDateString() === date.toDateString();
                        });
                        
                        if (dayStatus) {
                            totalCount++;
                            if (dayStatus.status === 'taken') {
                                takenCount++;
                            }
                        }
                    }
                });
            }

            const adherenceRate = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;
            
            days.push({
                date: date.toISOString().split('T')[0],
                day: day,
                adherenceRate,
                count: takenCount,
                total: totalCount,
                isToday,
                isFuture,
                isEmpty: false
            });
        }
        
        return days;
    };

    const getColor = (day) => {
        if (day.isEmpty) return 'transparent';
        if (day.isFuture) return '#f3f4f6';
        if (day.total === 0) return '#e5e7eb';
        
        const rate = day.adherenceRate;
        if (rate === 0) return '#fecaca';
        if (rate < 25) return '#fca5a5';
        if (rate < 50) return '#f87171';
        if (rate < 75) return '#fb923c';
        if (rate < 100) return '#a3e635';
        return '#22c55e';
    };

    const getBorderStyle = (day) => {
        if (day.isToday) {
            return '3px solid #667eea';
        }
        return '1px solid #e5e7eb';
    };

    if (loading) {
        return (
            <div className="heatmap-container">
                <h4 className="heatmap-title">Monthly Adherence</h4>
                <div className="heatmap-loading">Loading...</div>
            </div>
        );
    }

    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
        weeks.push(heatmapData.slice(i, i + 7));
    }

    return (
        <div className="heatmap-container">
            <h4 className="heatmap-title">{currentMonth} Adherence</h4>
            
            <div className="heatmap-calendar">
                {/* Day headers */}
                <div className="calendar-header">
                    <div className="day-header">Sun</div>
                    <div className="day-header">Mon</div>
                    <div className="day-header">Tue</div>
                    <div className="day-header">Wed</div>
                    <div className="day-header">Thu</div>
                    <div className="day-header">Fri</div>
                    <div className="day-header">Sat</div>
                </div>
                
                {/* Calendar grid */}
                <div className="calendar-grid">
                    {heatmapData.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-day ${day.isEmpty ? 'empty' : ''} ${day.isToday ? 'today' : ''}`}
                            style={{
                                backgroundColor: getColor(day),
                                border: getBorderStyle(day)
                            }}
                            title={day.isEmpty ? '' : 
                                day.isFuture ? 'Future date' :
                                `${day.date}\n${day.adherenceRate.toFixed(0)}% adherence\n${day.count}/${day.total} medications taken`}
                        >
                            {!day.isEmpty && <span className="day-number">{day.day}</span>}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Legend */}
            <div className="heatmap-legend">
                <span className="legend-label">Less</span>
                <div className="legend-colors">
                    <div className="legend-box" style={{ backgroundColor: '#e5e7eb' }} title="No data"></div>
                    <div className="legend-box" style={{ backgroundColor: '#fecaca' }} title="0%"></div>
                    <div className="legend-box" style={{ backgroundColor: '#f87171' }} title="1-49%"></div>
                    <div className="legend-box" style={{ backgroundColor: '#fb923c' }} title="50-74%"></div>
                    <div className="legend-box" style={{ backgroundColor: '#a3e635' }} title="75-99%"></div>
                    <div className="legend-box" style={{ backgroundColor: '#22c55e' }} title="100%"></div>
                </div>
                <span className="legend-label">More</span>
            </div>

            <style jsx>{`
                .heatmap-container {
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    height: 100%;
                }

                .dark-theme .heatmap-container {
                    background: #374151;
                }

                .heatmap-title {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    text-align: center;
                    color: #1f2937;
                }

                .dark-theme .heatmap-title {
                    color: #f3f4f6;
                }

                .heatmap-loading {
                    text-align: center;
                    color: #6b7280;
                    padding: 40px 0;
                }

                .heatmap-calendar {
                    margin: 20px 0;
                }

                .calendar-header {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 8px;
                    margin-bottom: 10px;
                }

                .day-header {
                    text-align: center;
                    font-size: 12px;
                    font-weight: 600;
                    color: #6b7280;
                    padding: 5px 0;
                }

                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 8px;
                }

                .calendar-day {
                    aspect-ratio: 1;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .calendar-day:not(.empty):hover {
                    transform: scale(1.1);
                    z-index: 10;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .calendar-day.empty {
                    cursor: default;
                    border: none;
                }

                .calendar-day.today {
                    font-weight: bold;
                    box-shadow: 0 0 0 2px #667eea;
                }

                .day-number {
                    font-size: 14px;
                    font-weight: 500;
                    color: #1f2937;
                }

                .dark-theme .day-number {
                    color: #f3f4f6;
                }

                .heatmap-legend {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 20px;
                }

                .legend-label {
                    font-size: 12px;
                    color: #6b7280;
                    font-weight: 500;
                }

                .legend-colors {
                    display: flex;
                    gap: 4px;
                }

                .legend-box {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                    border: 1px solid #e5e7eb;
                    cursor: pointer;
                }

                .legend-box:hover {
                    transform: scale(1.2);
                }
            `}</style>
        </div>
    );
};

export default MonthlyAdherenceHeatmap;