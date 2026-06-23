/* ==========================================================================
   Background Canvas - Circuit Particles
   ========================================================================== */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const maxParticles = 60;
const connectionDistance = 120;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
    }
}

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
}

function drawGrid() {
    const gridSize = 80;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.02)';
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();

    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw lines connecting close particles
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                const alpha = (1 - dist / connectionDistance) * 0.15;
                ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initCanvas);
initCanvas();
animateParticles();


/* ==========================================================================
   Hero Section - Terminal Text Typing Effect
   ========================================================================== */
const words = ["HMI Application Developer", "C++ Simulation Specialist", "Real-Time Systems Engineer", "Qt/QML GUI Architect"];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const delayBetweenWords = 2000;
const typingContainer = document.getElementById('typing-text');

function type() {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
        typingContainer.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
    } else {
        typingContainer.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
    }

    let speed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIdx === currentWord.length) {
        isDeleting = true;
        speed = delayBetweenWords; // Pause at full word
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        speed = 500; // Pause before typing next word
    }

    setTimeout(type, speed);
}

if (typingContainer) {
    setTimeout(type, 1000);
}


/* ==========================================================================
   Navigation Menu
   ========================================================================== */
const mobileToggle = document.querySelector('.mobile-nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
        });
    });
}


/* ==========================================================================
   Lab Selector Tabs
   ========================================================================== */
const tabButtons = document.querySelectorAll('.lab-tab-btn');
const panels = document.querySelectorAll('.lab-panel');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        
        tabButtons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});


/* ==========================================================================
   John Deere Sprayer Machine Simulator
   ========================================================================== */
const sprayerPowerBtn = document.getElementById('sprayer-power-btn');
const rpmSlider = document.getElementById('rpm-slider');
const rpmTargetLbl = document.getElementById('rpm-target-lbl');
const rpmValue = document.getElementById('rpm-value');
const pressureValue = document.getElementById('pressure-value');
const valveBtn = document.getElementById('valve-btn');
const bypassBtn = document.getElementById('bypass-btn');
const fluidBody = document.querySelector('.fluid-body');
const fluidPercentage = document.querySelector('.fluid-percentage');
const sprayerJets = document.querySelectorAll('.jet');
const flowLight = document.getElementById('flow-light');
const tempLight = document.getElementById('temp-light');
const bypassLight = document.getElementById('bypass-light');
const sprayerLog = document.getElementById('sprayer-log');

// States
let isSprayerOn = true;
let targetRPM = 1200;
let currentRPM = 1200;
let isValveOpen = true;
let isBypassOpen = false;
let sprayerPressure = 4.2;

function formatHex(num) {
    let hex = Math.round(num).toString(16).toUpperCase();
    return '0x' + hex.padStart(4, '0');
}

function addSprayerLog(text, type = 'telemetry') {
    if (!sprayerLog) return;
    const time = new Date().toLocaleTimeString();
    const lineClass = type === 'system' ? 'text-system' : (type === 'error' ? 'text-err' : 'text-telemetry');
    const newLine = document.createElement('div');
    newLine.className = `log-line ${lineClass}`;
    newLine.innerHTML = `[${time}] ${text}`;
    sprayerLog.appendChild(newLine);
    sprayerLog.scrollTop = sprayerLog.scrollHeight;
    
    // Limit to 20 logs
    while (sprayerLog.children.length > 20) {
        sprayerLog.removeChild(sprayerLog.firstChild);
    }
}

// Power Button
if (sprayerPowerBtn) {
    sprayerPowerBtn.addEventListener('click', () => {
        isSprayerOn = !isSprayerOn;
        if (isSprayerOn) {
            sprayerPowerBtn.classList.remove('off');
            sprayerPowerBtn.classList.add('active');
            sprayerPowerBtn.innerHTML = '<i class="fa-solid fa-power-off"></i> SYSTEM POWER';
            flowLight.className = 'status-light green';
            tempLight.className = 'status-light green';
            addSprayerLog('[SYS] Powering up agitation controller unit...', 'system');
        } else {
            sprayerPowerBtn.classList.remove('active');
            sprayerPowerBtn.classList.add('off');
            sprayerPowerBtn.innerHTML = '<i class="fa-solid fa-power-off"></i> POWER OFF';
            flowLight.className = 'status-light';
            tempLight.className = 'status-light';
            bypassLight.className = 'status-light';
            addSprayerLog('[SYS] Commanded power down. Standby mode.', 'system');
            
            // Shut visuals
            targetRPM = 0;
            currentRPM = 0;
            sprayerPressure = 0;
            rpmValue.textContent = '0';
            pressureValue.textContent = '0.0';
            rpmTargetLbl.textContent = '0 RPM';
            rpmSlider.value = 0;
            fluidPercentage.textContent = '58%';
            fluidBody.style.height = '58%';
            sprayerJets.forEach(j => j.classList.remove('active'));
        }
    });
}

// Slider
if (rpmSlider) {
    rpmSlider.addEventListener('input', (e) => {
        if (!isSprayerOn) {
            rpmSlider.value = 0;
            return;
        }
        targetRPM = parseInt(e.target.value);
        rpmTargetLbl.textContent = `${targetRPM} RPM`;
        addSprayerLog(`[SYS] Agitation setpoint modified: ${targetRPM} RPM`, 'system');
    });
}

// Valve Toggles
if (valveBtn) {
    valveBtn.addEventListener('click', () => {
        if (!isSprayerOn) return;
        isValveOpen = !isValveOpen;
        valveBtn.classList.toggle('active', isValveOpen);
        document.getElementById('valve-state').textContent = isValveOpen ? 'OPEN' : 'CLOSED';
        addSprayerLog(`[CAN TX] Flow valve frame updated. State: ${isValveOpen ? '0x01 (OPEN)' : '0x00 (CLOSED)'}`, 'system');
    });
}
if (bypassBtn) {
    bypassBtn.addEventListener('click', () => {
        if (!isSprayerOn) return;
        isBypassOpen = !isBypassOpen;
        bypassBtn.classList.toggle('active', isBypassOpen);
        document.getElementById('bypass-state').textContent = isBypassOpen ? 'OPEN' : 'CLOSED';
        addSprayerLog(`[CAN TX] Bypass flow command. State: ${isBypassOpen ? '0x01 (ACTIVE)' : '0x00 (INACTIVE)'}`, 'system');
    });
}

// Sprayer Loop
function sprayerUpdateLoop() {
    if (isSprayerOn) {
        // Interpolate RPM towards Target RPM (Simulate motor lag)
        const diff = targetRPM - currentRPM;
        if (Math.abs(diff) > 2) {
            currentRPM += diff * 0.1;
        } else {
            currentRPM = targetRPM;
        }

        // Calculate pressure based on current speed and valves status
        let calcPressure = currentRPM * 0.0035; 
        
        if (!isValveOpen && currentRPM > 10) {
            calcPressure *= 1.35; // high load
        }
        
        if (isBypassOpen) {
            calcPressure *= 0.45;
        }

        sprayerPressure = Math.max(0, calcPressure);
        
        // Update elements
        rpmValue.textContent = Math.round(currentRPM);
        pressureValue.textContent = sprayerPressure.toFixed(1);

        // Fluid animation speed & height based on speed
        if (currentRPM > 100) {
            const waveSpeed = Math.max(0.5, 4 - (currentRPM / 700));
            const fluidHeight = 55 + Math.sin(Date.now() / 200) * (currentRPM / 800);
            fluidBody.style.height = `${fluidHeight}%`;
            fluidPercentage.textContent = `${Math.round(fluidHeight)}%`;
            fluidBody.querySelector('.wave').style.animationDuration = `${waveSpeed}s`;
            
            sprayerJets.forEach(j => j.classList.add('active'));
            flowLight.className = 'status-light green';
        } else {
            fluidBody.style.height = '58%';
            fluidPercentage.textContent = '58%';
            sprayerJets.forEach(j => j.classList.remove('active'));
            flowLight.className = 'status-light';
        }

        // Warnings Check
        if (sprayerPressure > 7.5) {
            bypassLight.className = 'status-light red';
            addSprayerLog(`[ALARM] HIGH PRESSURE PRESSURE WARNING: ${sprayerPressure.toFixed(1)} BAR!`, 'error');
            tempLight.className = 'status-light red';
        } else if (currentRPM > 2000) {
            bypassLight.className = 'status-light red';
            addSprayerLog(`[WARNING] High RPM Threshold Exceeded. Check relief valves.`, 'error');
            tempLight.className = 'status-light green';
        } else {
            bypassLight.className = isBypassOpen ? 'status-light green' : 'status-light';
            tempLight.className = 'status-light green';
        }

        // Periodic Telemetry Log
        if (Math.random() < 0.08) {
            const hexRPM = formatHex(currentRPM);
            const hexPres = formatHex(sprayerPressure * 10);
            addSprayerLog(`[CAN J1939 RX] PGN 65262: RPM=${hexRPM} (${Math.round(currentRPM)}), Pressure=${hexPres} (${sprayerPressure.toFixed(1)} Bar)`);
        }
    }
}
setInterval(sprayerUpdateLoop, 150);


/* ==========================================================================
   DRDO War Gaming Radar Simulator (Canvas)
   ========================================================================== */
const radarCanvas = document.getElementById('radar-canvas');
const radarCtx = radarCanvas ? radarCanvas.getContext('2d') : null;
const radarLog = document.getElementById('radar-log');
const udpPktCount = document.getElementById('udp-pkt-count');
const radarTracks = document.getElementById('radar-tracks');
const radarResetBtn = document.getElementById('radar-reset-btn');
const radarTriggerBtn = document.getElementById('radar-trigger-btn');

let sweepAngle = 0;
const sweepSpeed = 0.015;
let targets = [
    { azimuth: 45, range: 120, size: 5, alpha: 0, id: 'TGT-102', speed: 380, detected: false },
    { azimuth: 135, range: 80, size: 4, alpha: 0, id: 'TGT-104', speed: 410, detected: false },
    { azimuth: 270, range: 160, size: 6, alpha: 0, id: 'TGT-107', speed: 290, detected: false }
];
let packetsReceived = 482;

function addRadarLog(text, type = 'info') {
    if (!radarLog) return;
    const time = new Date().toLocaleTimeString();
    const lineClass = type === 'info' ? 'text-info' : (type === 'error' ? 'text-err' : 'text-rx');
    const newLine = document.createElement('div');
    newLine.className = `log-line ${lineClass}`;
    newLine.innerHTML = `[${time}] ${text}`;
    radarLog.appendChild(newLine);
    radarLog.scrollTop = radarLog.scrollHeight;

    while (radarLog.children.length > 20) {
        radarLog.removeChild(radarLog.firstChild);
    }
}

// Radar Trigger - Inject Target
if (radarTriggerBtn) {
    radarTriggerBtn.addEventListener('click', () => {
        const idNum = Math.floor(Math.random() * 900) + 100;
        const newTarget = {
            azimuth: Math.floor(Math.random() * 360),
            range: Math.floor(Math.random() * 140) + 40,
            size: Math.floor(Math.random() * 3) + 4,
            alpha: 0,
            id: `TGT-${idNum}`,
            speed: Math.floor(Math.random() * 350) + 200,
            detected: false
        };
        targets.push(newTarget);
        addRadarLog(`[NET] UDP Inject Frame -> Host: 192.168.1.100. Pushed track ${newTarget.id}.`, 'info');
    });
}

// Radar Reset
if (radarResetBtn) {
    radarResetBtn.addEventListener('click', () => {
        targets = [
            { azimuth: 45, range: 120, size: 5, alpha: 0, id: 'TGT-102', speed: 380, detected: false },
            { azimuth: 135, range: 80, size: 4, alpha: 0, id: 'TGT-104', speed: 410, detected: false },
            { azimuth: 270, range: 160, size: 6, alpha: 0, id: 'TGT-107', speed: 290, detected: false }
        ];
        packetsReceived = 0;
        if (udpPktCount) udpPktCount.textContent = '0';
        if (radarTracks) radarTracks.textContent = '3';
        addRadarLog('[NET] Reset command sent. Clearing tracked radar buffers.', 'info');
    });
}

function drawRadarGrid(cx, cy, radius) {
    radarCtx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    radarCtx.lineWidth = 1;
    
    for (let r = 50; r <= radius; r += 50) {
        radarCtx.beginPath();
        radarCtx.arc(cx, cy, r, 0, Math.PI * 2);
        radarCtx.stroke();
        
        radarCtx.fillStyle = 'rgba(0, 229, 255, 0.3)';
        radarCtx.font = '8px Orbitron';
        radarCtx.fillText(`${r * 10}m`, cx + r + 3, cy - 3);
    }
    
    radarCtx.beginPath();
    radarCtx.moveTo(cx - radius, cy);
    radarCtx.lineTo(cx + radius, cy);
    radarCtx.moveTo(cx, cy - radius);
    radarCtx.lineTo(cx, cy + radius);
    radarCtx.stroke();

    radarCtx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
    radarCtx.beginPath();
    radarCtx.moveTo(cx - radius * 0.707, cy - radius * 0.707);
    radarCtx.lineTo(cx + radius * 0.707, cy + radius * 0.707);
    radarCtx.moveTo(cx - radius * 0.707, cy + radius * 0.707);
    radarCtx.lineTo(cx + radius * 0.707, cy - radius * 0.707);
    radarCtx.stroke();
}

function animateRadar() {
    if (!radarCtx) return;
    
    radarCtx.fillStyle = 'rgba(3, 8, 20, 0.15)';
    radarCtx.fillRect(0, 0, radarCanvas.width, radarCanvas.height);
    
    const cx = radarCanvas.width / 2;
    const cy = radarCanvas.height / 2;
    const radius = Math.min(cx, cy) - 15;
    
    drawRadarGrid(cx, cy, radius);
    
    const sweepX = cx + Math.cos(sweepAngle) * radius;
    const sweepY = cy + Math.sin(sweepAngle) * radius;
    
    radarCtx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
    radarCtx.lineWidth = 2.5;
    radarCtx.shadowColor = 'rgba(0, 229, 255, 0.6)';
    radarCtx.shadowBlur = 10;
    radarCtx.beginPath();
    radarCtx.moveTo(cx, cy);
    radarCtx.lineTo(sweepX, sweepY);
    radarCtx.stroke();
    
    radarCtx.shadowBlur = 0;
    
    const sweepAngleDegrees = (sweepAngle * 180 / Math.PI + 360) % 360;
    
    targets.forEach(t => {
        const rad = t.azimuth * Math.PI / 180;
        const tx = cx + Math.cos(rad) * (t.range * (radius / 200));
        const ty = cy + Math.sin(rad) * (t.range * (radius / 200));
        
        const degDiff = Math.abs(sweepAngleDegrees - t.azimuth);
        
        if (degDiff < 4 && !t.detected) {
            t.alpha = 1.0;
            t.detected = true;
            packetsReceived += 1;
            if (udpPktCount) udpPktCount.textContent = packetsReceived;
            
            const azimuthF = t.azimuth.toString().padStart(3, '0');
            const rangeF = Math.round(t.range * 10).toString().padStart(4, '0');
            addRadarLog(`[UDP RX] 192.168.1.42:5005 | ID:${t.id} | AZ:${azimuthF}° | RNG:${rangeF}m | VEL:${t.speed}kn`, 'rx');
        }
        
        if (degDiff > 20) {
            t.detected = false;
        }
        
        if (t.alpha > 0) {
            t.alpha -= 0.008;
        }
        
        if (t.alpha > 0.05) {
            radarCtx.fillStyle = `rgba(0, 229, 255, ${t.alpha})`;
            radarCtx.shadowColor = 'rgba(0, 229, 255, 0.8)';
            radarCtx.shadowBlur = 8;
            radarCtx.beginPath();
            radarCtx.arc(tx, ty, t.size, 0, Math.PI * 2);
            radarCtx.fill();
            
            radarCtx.fillStyle = `rgba(0, 229, 255, ${t.alpha * 0.8})`;
            radarCtx.font = '7px Fira Code';
            radarCtx.fillText(`${t.id}`, tx + t.size + 4, ty + 2);
            radarCtx.fillText(`[${t.speed}KT]`, tx + t.size + 4, ty + 10);
            
            radarCtx.shadowBlur = 0;
        }
    });
    
    if (radarTracks) {
        const activeCount = targets.filter(t => t.alpha > 0.05).length;
        radarTracks.textContent = activeCount;
    }
    
    sweepAngle = (sweepAngle + sweepSpeed) % (Math.PI * 2);
    
    requestAnimationFrame(animateRadar);
}

if (radarCanvas) {
    animateRadar();
}


/* ==========================================================================
   Project Scope & Cost Calculator Engine
   ========================================================================== */
const scopeOptions = document.querySelectorAll('.segment-option');
const calcPlatform = document.getElementById('calc-platform');
const calcBus = document.getElementById('calc-bus');
const urgencyButtons = document.querySelectorAll('.urgency-btn');

const labelScope = document.getElementById('summary-scope');
const labelPlatform = document.getElementById('summary-platform');
const labelBus = document.getElementById('summary-bus');
const resultHours = document.getElementById('calc-hours');
const resultCost = document.getElementById('calc-cost');
const applyQuoteBtn = document.getElementById('apply-quote-btn');

// Setup default calculator state
let calcState = {
    scope: 'hmi',
    platform: 'linux',
    bus: 'can',
    urgency: 'standard'
};

const scopeNames = {
    hmi: 'HMI / GUI Development',
    telemetry: 'Telemetry & Sockets',
    simulation: 'Test Rigs & Simulators',
    optimization: 'Performance Auditing'
};

const platformNames = {
    linux: 'Embedded Linux',
    windows: 'Windows OS (Win32/MFC)',
    cross: 'Cross-Platform (Linux/Win)'
};

const busNames = {
    can: 'CAN Bus Protocols',
    tcpudp: 'TCP/UDP Sockets',
    serial: 'Low-level Serial (UART/SPI)',
    none: 'Pure Software Logic'
};

const urgencyNames = {
    standard: 'Standard Delivery (4-6 weeks)',
    expedited: 'Expedited Sweep (1-2 weeks)'
};

function updateEstimator() {
    // Pricing matrices
    const baseHours = { hmi: 80, telemetry: 60, simulation: 100, optimization: 50 };
    const basePrices = { hmi: 3800, telemetry: 2800, simulation: 4800, optimization: 2400 };

    const platformMultipliers = { linux: 1.0, windows: 0.95, cross: 1.25 };
    const busMultipliers = { can: 1.15, tcpudp: 1.10, serial: 1.05, none: 1.0 };
    const urgencyMultipliers = { standard: 1.0, expedited: 1.35 };

    const selectedScope = calcState.scope;
    const selectedPlatform = calcState.platform;
    const selectedBus = calcState.bus;
    const selectedUrgency = calcState.urgency;

    // Calculate effort hours
    const rawHours = baseHours[selectedScope] * platformMultipliers[selectedPlatform] * busMultipliers[selectedBus];
    const minHours = Math.round(rawHours * 0.9);
    const maxHours = Math.round(rawHours * 1.1);

    // Calculate cost
    const rawCost = basePrices[selectedScope] * platformMultipliers[selectedPlatform] * busMultipliers[selectedBus] * urgencyMultipliers[selectedUrgency];
    const minCost = Math.round(rawCost * 0.9);
    const maxCost = Math.round(rawCost * 1.1);

    // Display updates
    if (labelScope) labelScope.textContent = scopeNames[selectedScope];
    if (labelPlatform) labelPlatform.textContent = platformNames[selectedPlatform];
    if (labelBus) labelBus.textContent = busNames[selectedBus];
    
    if (resultHours) resultHours.textContent = `${minHours} - ${maxHours} Hrs`;
    if (resultCost) resultCost.textContent = `$${minCost.toLocaleString()} - $${maxCost.toLocaleString()}`;
}

// Attach scope segment clicks
scopeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        scopeOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        calcState.scope = opt.getAttribute('data-type');
        updateEstimator();
    });
});

// Dropdowns
if (calcPlatform) {
    calcPlatform.addEventListener('change', (e) => {
        calcState.platform = e.target.value;
        updateEstimator();
    });
}
if (calcBus) {
    calcBus.addEventListener('change', (e) => {
        calcState.bus = e.target.value;
        updateEstimator();
    });
}

// Urgency Buttons
urgencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        urgencyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        calcState.urgency = btn.getAttribute('data-urgency');
        updateEstimator();
    });
});

// Initial calculate run
if (applyQuoteBtn) {
    updateEstimator();
}

// Apply Quote to Contact Form
if (applyQuoteBtn) {
    applyQuoteBtn.addEventListener('click', () => {
        const formService = document.getElementById('form-service');
        const formMessage = document.getElementById('form-message');
        const contactSection = document.getElementById('contact');

        // Map Scope to service dropdown option
        const serviceMapping = {
            hmi: 'HMI / GUI Development',
            telemetry: 'Communication Protocol Integration',
            simulation: 'Simulation / SIL Engineering',
            optimization: 'Performance Optimization'
        };

        if (formService) {
            formService.value = serviceMapping[calcState.scope];
        }

        // Format message textarea pre-fill
        if (formMessage) {
            const scopeText = scopeNames[calcState.scope];
            const platformText = platformNames[calcState.platform];
            const busText = busNames[calcState.bus];
            const urgencyText = urgencyNames[calcState.urgency];
            const bracketText = resultCost.textContent;
            const hoursText = resultHours.textContent;

            formMessage.value = `Hello Jaya Bharath,

I would like to discuss a freelance project with you. Below are my preliminary requirements configured from your estimator:
- Project Scope: ${scopeText}
- Operating Platform: ${platformText}
- Hardware/Communication Interface: ${busText}
- Required Schedule: ${urgencyText}
- Pre-check Scope: ${hoursText} (${bracketText} range)

Additional Project Details: 
[Please describe your hardware board, inputs, and GUI objectives here...]`;
        }

        // Scroll to form and focus message
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                if (formMessage) formMessage.focus();
            }, 800);
        }
    });
}


/* ==========================================================================
   Technical Skills Shell Tabs
   ========================================================================== */
const shellTabs = document.querySelectorAll('.shell-tab');
const skillPanes = document.querySelectorAll('.skill-pane');

shellTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const skillId = tab.getAttribute('data-skill');
        
        shellTabs.forEach(t => t.classList.remove('active'));
        skillPanes.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`skills-${skillId}`).classList.add('active');
    });
});


/* ==========================================================================
   FAQ Accordion Panels
   ========================================================================== */
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');

        // Close all other accordions first
        document.querySelectorAll('.faq-item').forEach(other => {
            other.classList.remove('active');
            other.querySelector('.faq-answer').style.maxHeight = null;
        });

        // Toggle clicked
        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});


/* ==========================================================================
   Contact Form Validation & Processing
   ========================================================================== */
const contactForm = document.getElementById('freelance-form');
const submitBtn = document.getElementById('form-submit-btn');
const btnIdleText = document.getElementById('btn-idle-text');
const btnLoadingText = document.getElementById('btn-loading-text');
const formStatusMsg = document.getElementById('form-status-msg');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        btnIdleText.style.display = 'none';
        btnLoadingText.style.display = 'inline-block';
        
        formStatusMsg.className = 'form-status';
        formStatusMsg.textContent = '';

        const clientName = document.getElementById('form-name').value;
        const clientEmail = document.getElementById('form-email').value;
        const requiredService = document.getElementById('form-service').value;

        setTimeout(() => {
            submitBtn.disabled = false;
            btnIdleText.style.display = 'inline-block';
            btnLoadingText.style.display = 'none';
            
            formStatusMsg.className = 'form-status success';
            formStatusMsg.innerHTML = `
                <i class="fa-solid fa-circle-check"></i> [TRANSMISSION SUCCESSFUL]<br>
                Thank you, ${clientName}. Inquiry for "${requiredService}" has been dispatched. I will reply to ${clientEmail} within 12 hours.
            `;
            
            contactForm.reset();
        }, 1800);
    });
}
