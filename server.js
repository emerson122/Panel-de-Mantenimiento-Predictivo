const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Datos simulados de máquinas
const machines = [
    {
        id: 1,
        name: "Prensa Hidráulica A-101",
        status: "Operativo",
        lastMaintenance: "2024-09-15",
        hoursUsed: 2500,
        temperature: 65,
        vibration: 2.3,
        predictions: {
            nextMaintenance: "2024-11-15",
            failureProbability: 15,
            criticalComponents: ["Sellos hidráulicos", "Bomba principal"]
        },
        maintenanceHistory: [
            {date: "2024-09-15", type: "Preventivo", issue: "Cambio de aceite"},
            {date: "2024-07-01", type: "Correctivo", issue: "Reparación de fugas"}
        ]
    },
    {
        id: 2,
        name: "Torno CNC B-203",
        status: "Advertencia",
        lastMaintenance: "2024-08-30",
        hoursUsed: 3200,
        temperature: 78,
        vibration: 3.1,
        predictions: {
            nextMaintenance: "2024-10-30",
            failureProbability: 35,
            criticalComponents: ["Husillo principal", "Sistema de refrigeración"]
        },
        maintenanceHistory: [
            {date: "2024-08-30", type: "Preventivo", issue: "Calibración"},
            {date: "2024-06-15", type: "Preventivo", issue: "Lubricación general"}
        ]
    }
];

app.get('/api/machines', (req, res) => {
    res.json(machines);
});

app.get('/api/machine/:id', (req, res) => {
    const machine = machines.find(m => m.id === parseInt(req.params.id));
    if (!machine) return res.status(404).send('Máquina no encontrada');
    res.json(machine);
});

app.post('/api/check-alert/:id', (req, res) => {
    const machine = machines.find(m => m.id === parseInt(req.params.id));
    if (!machine) return res.status(404).send('Máquina no encontrada');
    
    let alerts = [];
    if (machine.temperature > 75) {
        alerts.push("Temperatura crítica detectada");
    }
    if (machine.vibration > 3.0) {
        alerts.push("Niveles de vibración anormales");
    }
    if (machine.hoursUsed > 3000) {
        alerts.push("Mantenimiento preventivo requerido");
    }
    
    res.json({
        hasAlerts: alerts.length > 0,
        alerts: alerts
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});