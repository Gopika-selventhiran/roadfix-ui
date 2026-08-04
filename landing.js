// landing.js
document.addEventListener('DOMContentLoaded', () => {
    initHighwayCanvas();
    initAnimatedCounters();
    initInteractions();
    initMapNodes();
});

function initHighwayCanvas() {
    const canvas = document.getElementById('highwayCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const streaks = [];
    const numStreaks = 45;

    const horizonX = width * 0.65;
    const horizonY = height * 0.35;

    class LightStreak {
        constructor() {
            this.reset();
        }

        reset() {
            this.angle = Math.PI * 0.25 + (Math.random() - 0.5) * 0.85;
            this.distance = Math.random() * 50;
            this.speed = 2 + Math.random() * 5;
            this.length = 15 + Math.random() * 45;
            this.isCyan = Math.random() > 0.35;
            this.color = this.isCyan ? 
                `hsla(${190 + Math.random() * 20}, 100%, 65%, ` : 
                `hsla(${350 + Math.random() * 15}, 100%, 60%, `;
        }

        update() {
            this.distance += this.speed;
            this.speed *= 1.025;
            this.length += 1.2;

            if (this.distance > width) {
                this.reset();
            }
        }

        draw() {
            const startX = horizonX + Math.cos(this.angle) * this.distance;
            const startY = horizonY + Math.sin(this.angle) * this.distance;

            const endX = horizonX + Math.cos(this.angle) * (this.distance + this.length);
            const endY = horizonY + Math.sin(this.angle) * (this.distance + this.length);

            const opacity = Math.min(1, this.distance / 250);

            const grad = ctx.createLinearGradient(startX, startY, endX, endY);
            grad.addColorStop(0, this.color + '0)');
            grad.addColorStop(0.5, this.color + opacity + ')');
            grad.addColorStop(1, this.color + opacity * 0.9 + ')');

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = Math.max(1, (this.distance / 120) * 2.5);
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    for (let i = 0; i < numStreaks; i++) {
        const streak = new LightStreak();
        streak.distance = Math.random() * width * 0.6;
        streaks.push(streak);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const horizonGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 60);
        horizonGrad.addColorStop(0, 'rgba(0, 102, 255, 0)');
        horizonGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.15)');
        horizonGrad.addColorStop(1, 'rgba(5, 11, 24, 0)');

        ctx.fillStyle = horizonGrad;
        ctx.fillRect(0, horizonY - 40, width, 100);

        streaks.forEach(s => {
            s.update();
            s.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function initAnimatedCounters() {
    const counterElements = [
        { id: 'statScanned', target: 12543, suffix: ' km', formatComma: true },
        { id: 'statIssues', target: 3287, suffix: '', formatComma: true },
        { id: 'statRepairs', target: 1829, suffix: '', formatComma: true },
        { id: 'statVehicles', target: 41, suffix: '', formatComma: false },
        { id: 'heroConfVal', target: 98.7, suffix: '%', isFloat: true }
    ];

    counterElements.forEach(item => {
        const el = document.getElementById(item.id);
        if (!el) return;

        let start = 0;
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = item.target / steps;

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= item.target) {
                current = item.target;
                clearInterval(timer);
            }

            let formattedVal = item.isFloat ? current.toFixed(1) : Math.floor(current);
            if (item.formatComma) {
                formattedVal = formattedVal.toLocaleString();
            }
            el.textContent = formattedVal + item.suffix;
        }, stepTime);
    });
}

function initInteractions() {
    const aiActiveBox = document.getElementById('aiActiveBox');
    const closeBtn = aiActiveBox ? aiActiveBox.querySelector('.panel-close') : null;

    if (closeBtn && aiActiveBox) {
        closeBtn.addEventListener('click', () => {
            aiActiveBox.style.opacity = '0';
            aiActiveBox.style.transform = 'scale(0.9)';
            setTimeout(() => {
                aiActiveBox.style.display = 'none';
            }, 300);
        });
    }

    const launchBtn = document.getElementById('launchPlatformBtn');

if (launchBtn) {
    launchBtn.addEventListener('click', () => {
        window.location.href = "login.html";
    });
}

    const demoBtn = document.getElementById('watchDemoBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            showToast('Initializing Live Road Survey Stream Video Demo...');
        });
    }

    const loginBtn = document.getElementById('loginBtn');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        window.location.href = "login.html";
    });
}

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function initMapNodes() {
    const mapNodes = document.querySelectorAll('.map-node');
    mapNodes.forEach(node => {
        node.style.cursor = 'pointer';
        node.addEventListener('mouseenter', () => {
            node.setAttribute('transform', node.getAttribute('transform') + ' scale(1.3)');
        });
        node.addEventListener('mouseleave', () => {
            const originalTransform = node.getAttribute('transform').replace(' scale(1.3)', '');
            node.setAttribute('transform', originalTransform);
        });
    });
}

function showToast(message) {
    let toast = document.querySelector('.roadfix-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'roadfix-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(10, 25, 50, 0.95);
            border: 1px solid #00F0FF;
            color: #FFFFFF;
            padding: 1rem 1.6rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 240, 255, 0.3);
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 9999;
            backdrop-filter: blur(16px);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #00F0FF;"></i> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
    }, 3200);
}