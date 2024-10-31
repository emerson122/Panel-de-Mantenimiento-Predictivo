document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupEventListeners();
    createTrendsChart();
    loadRecentAlerts();
    animateStatusRing(93);
});

function initializeDashboard() {
    // Inicializar la animación del anillo de progreso
    const circle = document.querySelector('.progress-ring-circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
}

function animateStatusRing(percentage) {
    const circle = document.querySelector('.progress-ring-circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100 * circumference);
    circle.style.strokeDashoffset = offset;
}

function createTrendsChart() {
    const ctx = document.getElementById('trendsChart').getContext('2d');
    const gradientTemp = ctx.createLinearGradient(0, 0, 0, 300);
    gradientTemp.addColorStop(0, 'rgba(255, 71, 87, 0.4)');
    gradientTemp.addColorStop(1, 'rgba(255, 71, 87, 0)');

    const gradientVib = ctx.createLinearGradient(0, 0, 0, 300);
    gradientVib.addColorStop(0, 'rgba(51, 102, 255, 0.4)');
    gradientVib.addColorStop(1, 'rgba(51, 102, 255, 0)');

    const gradientWear = ctx.createLinearGradient(0, 0, 0, 300);
    gradientWear.addColorStop(0, 'rgba(0, 176, 124, 0.4)');
    gradientWear.addColorStop(1, 'rgba(0, 176, 124, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Temperatura',
                    data: [65, 68, 70, 72, 75, 78],
                    borderColor: '#ff4757',
                    backgroundColor: gradientTemp,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Vibración',
                    data: [30, 32, 45, 40, 45, 48],
                    borderColor: '#3366ff',
                    backgroundColor: gradientVib,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Desgaste',
                    data: [20, 25, 25, 40, 45, 48],
                    borderColor: '#00b07c',
                    backgroundColor: gradientWear,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#a0a8b6',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#a0a8b6'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a0a8b6'
                    }
                }
            }
        }
    });
}

function loadRecentAlerts() {
    const alertsList = document.querySelector('.recent-alerts-list');
    const alerts = [
        {
            type: 'Vibración anormal',
            machine: 'Máquina 01',
            time: '11 horas'
        },
        {
            type: 'Mantenimiento preventivo requerido',
            machine: 'Máquina 01',
            time: '2 horas'
        }
    ];

    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = 'alert-item';
        alertElement.innerHTML = `
            <div class="alert-info">
                <i class="fas fa-exclamation-triangle" style="color: var(--accent-red)"></i>
                <div>
                    <div>${alert.type}</div>
                    <div style="color: var(--text-secondary)">Hace ${alert.time}</div>
                </div>
            </div>
            <button class="alert-action">Atender</button>
        `;
        alertsList.appendChild(alertElement);
    });
}

function setupEventListeners() {
    // Event listeners para las pestañas de máquinas
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Aquí se actualizarían los datos del dashboard según la máquina seleccionada
            updateDashboardData(button.dataset.machine);
        });
    });

    // Event listeners para los botones de alertas
    document.addEventListener('click', e => {
        if (e.target.classList.contains('alert-action')) {
            handleAlertAction(e.target);
        }
    });

    // Event listeners para los iconos de la barra de navegación
    document.querySelector('.nav-icons').addEventListener('click', e => {
        const button = e.target.closest('.icon-button');
        if (!button) return;
        
        if (button.querySelector('.fa-bell')) {
            toggleNotificationPanel();
        } else if (button.querySelector('.fa-cog')) {
            toggleSettingsPanel();
        }
    });
}

function handleAlertAction(button) {
    const alertItem = button.closest('.alert-item');
    // Efecto de desvanecimiento
    alertItem.style.opacity = '0';
    alertItem.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        // Actualizar contador de alertas
        const alertCounter = document.querySelector('.alert-number');
        const currentCount = parseInt(alertCounter.textContent);
        alertCounter.textContent = currentCount - 1;
        
        // Remover la alerta con animación
        alertItem.remove();
        
        // Mostrar notificación de confirmación
        showNotification('Alerta atendida correctamente');
    }, 300);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function updateDashboardData(machineId) {
    // Simular carga de datos
    showLoadingState();
    
    // Simular llamada a API
    setTimeout(() => {
        const machineData = getMachineData(machineId);
        updateStatusCard(machineData.status);
        updateMaintenanceCard(machineData.maintenance);
        updateAlertsCard(machineData.alerts);
        updateTrendsChart(machineData.trends);
        updateRecentAlerts(machineData.recentAlerts);
        hideLoadingState();
    }, 500);
}

function showLoadingState() {
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.classList.add('loading');
        card.style.opacity = '0.7';
    });
}

function hideLoadingState() {
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.classList.remove('loading');
        card.style.opacity = '1';
    });
}

function getMachineData(machineId) {
    // Simular datos diferentes para cada máquina
    const machines = {
        '1': {
            status: 93,
            maintenance: { days: 15, type: 'Mantenimiento preventivo' },
            alerts: 2,
            trends: {
                temperature: [65, 68, 70, 72, 75, 78],
                vibration: [30, 32, 45, 40, 45, 48],
                wear: [20, 25, 25, 40, 45, 48]
            },
            recentAlerts: [
                { type: 'Vibración anormal', time: '11 horas' },
                { type: 'Mantenimiento preventivo requerido', time: '2 horas' }
            ]
        },
        '2': {
            status: 87,
            maintenance: { days: 8, type: 'Mantenimiento correctivo' },
            alerts: 1,
            trends: {
                temperature: [60, 62, 65, 68, 70, 71],
                vibration: [25, 28, 30, 35, 38, 40],
                wear: [15, 18, 20, 25, 30, 35]
            },
            recentAlerts: [
                { type: 'Temperatura elevada', time: '4 horas' }
            ]
        },
        '3': {
            status: 95,
            maintenance: { days: 30, type: 'Mantenimiento preventivo' },
            alerts: 0,
            trends: {
                temperature: [58, 60, 61, 62, 63, 65],
                vibration: [20, 22, 25, 26, 28, 30],
                wear: [10, 12, 15, 18, 20, 22]
            },
            recentAlerts: []
        }
    };
    
    return machines[machineId] || machines['1'];
}

function updateStatusCard(status) {
    const percentageText = document.querySelector('.percentage-text');
    const statusText = document.querySelector('.status-text');
    
    // Animar el cambio de porcentaje
    animateStatusRing(status);
    animateNumber(percentageText, status);
    
    // Actualizar texto de estado
    let statusMessage = 'Funcionamiento óptimo';
    if (status < 90) statusMessage = 'Funcionamiento normal';
    if (status < 80) statusMessage = 'Requiere atención';
    statusText.textContent = statusMessage;
}

function updateMaintenanceCard(data) {
    const daysCounter = document.querySelector('.days');
    const maintenanceType = document.querySelector('.maintenance-type');
    
    animateNumber(daysCounter, data.days);
    maintenanceType.textContent = data.type;
}

function updateAlertsCard(count) {
    const alertNumber = document.querySelector('.alert-number');
    animateNumber(alertNumber, count);
}

function updateTrendsChart(trends) {
    const chart = Chart.getChart('trendsChart');
    if (chart) {
        chart.data.datasets[0].data = trends.temperature;
        chart.data.datasets[1].data = trends.vibration;
        chart.data.datasets[2].data = trends.wear;
        chart.update();
    }
}

function updateRecentAlerts(alerts) {
    const alertsList = document.querySelector('.recent-alerts-list');
    alertsList.innerHTML = '';
    
    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = 'alert-item';
        alertElement.innerHTML = `
            <div class="alert-info">
                <i class="fas fa-exclamation-triangle" style="color: var(--accent-red)"></i>
                <div>
                    <div>${alert.type}</div>
                    <div style="color: var(--text-secondary)">Hace ${alert.time}</div>
                </div>
            </div>
            <button class="alert-action">Atender</button>
        `;
        alertsList.appendChild(alertElement);
    });
}

function animateNumber(element, target) {
    const start = parseInt(element.textContent);
    const duration = 1000;
    const steps = 60;
    const increment = (target - start) / steps;
    let current = start;
    let step = 0;
    
    const animation = setInterval(() => {
        current += increment;
        element.textContent = Math.round(current);
        step++;
        
        if (step >= steps) {
            element.textContent = target;
            clearInterval(animation);
        }
    }, duration / steps);
}

// Agregar estilos CSS adicionales para las notificaciones
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--accent-green);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .loading {
        position: relative;
        overflow: hidden;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 200%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(50%);
        }
    }
`;

document.head.appendChild(style);
