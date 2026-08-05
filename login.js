// login.js
document.addEventListener('DOMContentLoaded', () => {
    initHighwayCanvas();
    initAuthSwitch();
    initPasswordToggles();
    initRoleSelector();
    initFormSubmissions();
});

function initHighwayCanvas() {
    const canvas = document.getElementById('loginHighwayCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const streaks = [];
    const numStreaks = 42;

    const horizonX = width * 0.45;
    const horizonY = height * 0.4;

    class LightStreak {
        constructor() {
            this.reset();
        }

        reset() {
            this.angle = Math.PI * 0.2 + (Math.random() - 0.5) * 0.9;
            this.distance = Math.random() * 60;
            this.speed = 1.8 + Math.random() * 4.5;
            this.length = 20 + Math.random() * 50;
            this.isCyan = Math.random() > 0.4;
            this.color = this.isCyan ? 
                `hsla(${190 + Math.random() * 20}, 100%, 65%, ` : 
                `hsla(${350 + Math.random() * 15}, 100%, 60%, `;
        }

        update() {
            this.distance += this.speed;
            this.speed *= 1.02;
            this.length += 1.1;

            if (this.distance > width) {
                this.reset();
            }
        }

        draw() {
            const startX = horizonX + Math.cos(this.angle) * this.distance;
            const startY = horizonY + Math.sin(this.angle) * this.distance;

            const endX = horizonX + Math.cos(this.angle) * (this.distance + this.length);
            const endY = horizonY + Math.sin(this.angle) * (this.distance + this.length);

            const opacity = Math.min(1, this.distance / 200);

            const grad = ctx.createLinearGradient(startX, startY, endX, endY);
            grad.addColorStop(0, this.color + '0)');
            grad.addColorStop(0.5, this.color + opacity + ')');
            grad.addColorStop(1, this.color + opacity * 0.85 + ')');

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = Math.max(1, (this.distance / 100) * 2.2);
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    for (let i = 0; i < numStreaks; i++) {
        const streak = new LightStreak();
        streak.distance = Math.random() * width * 0.5;
        streaks.push(streak);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const horizonGrad = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY + 70);
        horizonGrad.addColorStop(0, 'rgba(0, 102, 255, 0)');
        horizonGrad.addColorStop(0.5, 'rgba(0, 210, 255, 0.12)');
        horizonGrad.addColorStop(1, 'rgba(3, 8, 22, 0)');

        ctx.fillStyle = horizonGrad;
        ctx.fillRect(0, horizonY - 50, width, 120);

        streaks.forEach(s => {
            s.update();
            s.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function initAuthSwitch() {
    const wrapper = document.querySelector('.app-viewport-wrapper');
    const gotoRegisterBtn = document.getElementById('gotoRegisterBtn');
    const gotoLoginBtn = document.getElementById('gotoLoginBtn');
    
    const heroLogin = document.getElementById('heroLoginState');
    const heroRegister = document.getElementById('heroRegisterState');

    if (gotoRegisterBtn && wrapper) {
        gotoRegisterBtn.addEventListener('click', () => {
            wrapper.classList.add('is-register');
            heroLogin.classList.remove('active');
            heroRegister.classList.add('active');
        });
    }

    if (gotoLoginBtn && wrapper) {
        gotoLoginBtn.addEventListener('click', () => {
            wrapper.classList.remove('is-register');
            heroRegister.classList.remove('active');
            heroLogin.classList.add('active');
        });
    }
}

function initPasswordToggles() {
    setupToggle('toggleLoginEye', 'loginPassword');
    setupToggle('toggleRegEye', 'regPassword');
    setupToggle('toggleRegConfirmEye', 'regConfirmPassword');

    function setupToggle(btnId, inputId) {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (!btn || !input) return;

        btn.addEventListener('click', () => {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = isPass ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
            }
        });
    }
}

function initRoleSelector() {
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

function initFormSubmissions() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const activeRole = document.querySelector('.role-card.active')?.dataset.role || 'officer';
            showAuthToast(`Signing in as ${activeRole.toUpperCase()}...`);
            setTimeout(() => {

    		const activeRole = document.querySelector(".role-card.active")?.dataset.role;

    		if (activeRole === "officer") {
        		window.location.href = "dashboard.html";
    		}
    		else if (activeRole === "admin") {
        		window.location.href = "dashboard.html";
    		}
    		else if (activeRole === "contractor") {
        		window.location.href = "user.html";
    		}

		}, 1200);
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showAuthToast('Account registration request submitted for verification...');
            setTimeout(() => {
                showAuthToast('Account created! Switching to Login...');
                document.getElementById('gotoLoginBtn')?.click();
            }, 1800);
        });
    }
}

function showAuthToast(message) {
    let toast = document.querySelector('.auth-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'auth-toast';
        toast.style.cssText = `
            position: fixed;
            top: 25px;
            right: 25px;
            background: #0F172A;
            border: 1px solid #38BDF8;
            color: #FFFFFF;
            padding: 0.85rem 1.4rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            font-size: 0.85rem;
            font-weight: 600;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.6rem;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin" style="color: #38BDF8;"></i> ${message}`;
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2800);
}

// ===========================
// GOOGLE LOGIN
// ===========================

async function googleLogin() {

    try {

        const result = await window.signInWithPopup(
            window.firebaseAuth,
            window.googleProvider
        );

        const user = result.user;

        // Firebase ID Token
        const idToken = await user.getIdToken();

        // Verify using FastAPI
        const response = await fetch("http://127.0.0.1:8000/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idToken: idToken
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {

            localStorage.setItem("roadfixUser", JSON.stringify(data));

            showAuthToast(`Welcome ${data.name}`);

            setTimeout(() => {

    		const activeRole = document.querySelector(".role-card.active")?.dataset.role;

    		if (activeRole === "officer") {
        		window.location.href = "dashboard.html";
    		}
    		else if (activeRole === "admin") {
        		window.location.href = "dashboard.html";
    		}
    		else if (activeRole === "contractor") {
        		window.location.href = "user.html";
    		}

		}, 1200);

        } else {

            alert("Authentication failed.");

        }

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

}

const googleBtn = document.getElementById("googleLoginBtn");

if (googleBtn) {
    googleBtn.addEventListener("click", googleLogin);
}

const googleSignupBtn = document.getElementById("googleSignupBtn");

if (googleSignupBtn) {
    googleSignupBtn.addEventListener("click", googleLogin);
}