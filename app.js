// Firebase Configuration and Hub Application Scripts

// Immediate Route Guard Check (Flash-Free)
(function() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const protectedPages = ['cse.html', 'ece.html', 'eee.html', 'mech.html', 'civil.html', 'vibe.html'];
    
    if (protectedPages.includes(filename)) {
        if (!localStorage.getItem('pathos_uni')) {
            window.location.href = 'index.html?auth_required=true';
        }
    }
})();

const firebaseConfig = {
    apiKey: "AIzaSyB5H7dpDwZ522YD_yY6SetfNVR2344hXcM",
    authDomain: "pathos-platform.firebaseapp.com",
    projectId: "pathos-platform",
    storageBucket: "pathos-platform.firebasestorage.app",
    messagingSenderId: "716065317478",
    appId: "1:716065317478:web:fb7ae832080fe18ed803a7"
};

// Initialize Firebase if library is available
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();

    // Dynamically monitor auth state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            let name = user.displayName || 'Google User';
            let uni = 'Google Verified Node';
            let branch = 'Unassigned Architecture';

            // Parse serialized profile info from displayName if possible
            if (user.displayName) {
                try {
                    const profile = JSON.parse(user.displayName);
                    if (profile && typeof profile === 'object') {
                        name = profile.name || name;
                        uni = profile.uni || uni;
                        branch = profile.branch || branch;
                    }
                } catch (e) {
                    name = user.displayName;
                }
            }

            localStorage.setItem('pathos_name', name);
            localStorage.setItem('pathos_uni', uni);
            localStorage.setItem('pathos_branch', branch);
            localStorage.setItem('pathos_email', user.email || '');
        } else {
            // Reset to guest mode on sign-out
            localStorage.removeItem('pathos_name');
            localStorage.removeItem('pathos_uni');
            localStorage.removeItem('pathos_branch');
            localStorage.removeItem('pathos_email');
        }
        updateProfileSummary();
    });
}

function getElement(id) {
    return document.getElementById(id);
}

function updateProfileSummary() {
    const navAvatar = getElement('navAvatar');
    const navName = getElement('navName');
    const sideAvatar = getElement('sideAvatar');
    const sideName = getElement('sideName');
    const statusBadge = getElement('statusBadge');
    const profileUni = getElement('profileUni');
    const profileBranch = getElement('profileBranch');
    const authBtn = getElement('authBtn');

    const fullName = localStorage.getItem('pathos_name') || 'Guest Node';
    const university = localStorage.getItem('pathos_uni') || 'Unknown';
    const branch = localStorage.getItem('pathos_branch') || 'Not Assigned';
    const isLoggedIn = Boolean(localStorage.getItem('pathos_uni'));

    const initials = fullName.trim().charAt(0).toUpperCase() || '?';

    if (navAvatar) navAvatar.textContent = initials;
    if (navName) navName.textContent = fullName;
    if (sideAvatar) sideAvatar.textContent = initials;
    if (sideName) sideName.textContent = isLoggedIn ? fullName : 'Unauthorized';
    
    if (statusBadge) {
        statusBadge.textContent = isLoggedIn ? 'System Status: Unlocked' : 'System Status: Locked';
        statusBadge.style.color = isLoggedIn ? '#00ff66' : '#ff4444';
        statusBadge.style.background = isLoggedIn ? 'rgba(0, 255, 102, 0.1)' : 'rgba(255, 68, 68, 0.1)';
    }
    if (profileUni) profileUni.textContent = university;
    if (profileBranch) profileBranch.textContent = branch;

    if (authBtn) {
        if (isLoggedIn) {
            authBtn.textContent = 'Disconnect Node';
            authBtn.onclick = logoutUser;
        } else {
            authBtn.textContent = 'Authenticate Now';
            authBtn.onclick = () => {
                window.location.href = 'login.html';
            };
        }
    }

    // Apply dashboard personalization if on index.html
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    if (filename === 'index.html' || filename === '') {
        customizeDashboard();
    }
}

window.logoutUser = function() {
    if (typeof firebase !== 'undefined') {
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('pathos_name');
            localStorage.removeItem('pathos_uni');
            localStorage.removeItem('pathos_branch');
            localStorage.removeItem('pathos_email');
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error("Sign out error", error);
            // Fallback clear
            localStorage.removeItem('pathos_name');
            localStorage.removeItem('pathos_uni');
            localStorage.removeItem('pathos_branch');
            localStorage.removeItem('pathos_email');
            window.location.href = 'index.html';
        });
    } else {
        localStorage.removeItem('pathos_name');
        localStorage.removeItem('pathos_uni');
        localStorage.removeItem('pathos_branch');
        localStorage.removeItem('pathos_email');
        window.location.href = 'index.html';
    }
};

window.toggleProfile = function() {
    const sidebar = getElement('profileSidebar');
    const overlay = getElement('overlay');

    if (!sidebar || !overlay) {
        return;
    }

    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');

    updateProfileSummary();
};

window.openModal = function(courseName, targetUrl) {
    const isLoggedIn = Boolean(localStorage.getItem('pathos_uni'));

    if (isLoggedIn && targetUrl) {
        window.location.href = targetUrl;
        return;
    }

    if (targetUrl) {
        localStorage.setItem('redirect_after_login', targetUrl);
    }

    const modal = getElement('accessModal');
    const modalCourseName = getElement('modalCourseName');

    if (!modal) {
        window.location.href = 'login.html';
        return;
    }

    if (modalCourseName) {
        modalCourseName.textContent = courseName;
    }

    modal.classList.add('active');
};

window.closeModal = function() {
    const modal = getElement('accessModal');

    if (modal) {
        modal.classList.remove('active');
    }
};

// --- Custom Fluid Particle Cursor (HTML5 Canvas) ---
function initCustomCursor() {
    if (window.matchMedia('(pointer: fine)').matches) {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999999';
        document.body.appendChild(canvas);

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Hide default cursor on desktop
        const style = document.createElement('style');
        style.textContent = `
            @media (pointer: fine) {
                body, a, button, select, input, textarea, [role="button"], .profile-trigger, .stream-card, .auth-tab, .modal-close-text, .close-btn {
                    cursor: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        const particles = [];
        let mouseX = -100;
        let mouseY = -100;
        let lastMouseX = -100;
        let lastMouseY = -100;
        let active = false;
        let isHovered = false;

        class Particle {
            constructor(x, y, vx, vy, size, color, alpha, decay) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.size = size;
                this.color = color;
                this.alpha = alpha;
                this.decay = decay;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.92; // Fluid resistance/friction
                this.vy *= 0.92;
                this.alpha -= this.decay;
            }
            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 6;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!active) {
                active = true;
                lastMouseX = mouseX;
                lastMouseY = mouseY;
            }
        });

        let cursorVisible = true;
        document.addEventListener('mouseleave', () => { cursorVisible = false; });
        document.addEventListener('mouseenter', () => { cursorVisible = true; });

        // Hover handling via event delegation
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (target.closest('a, button, select, input, textarea, [role="button"], .profile-trigger, .stream-card, .auth-tab, .modal-close-text, .close-btn')) {
                isHovered = true;
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target;
            if (target.closest('a, button, select, input, textarea, [role="button"], .profile-trigger, .stream-card, .auth-tab, .modal-close-text, .close-btn')) {
                isHovered = false;
            }
        });

        function renderCursor() {
            ctx.clearRect(0, 0, width, height);

            if (active && cursorVisible) {
                // 1. Draw central dot pointer
                ctx.save();
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, isHovered ? 6 : 3.5, 0, Math.PI * 2);
                ctx.fillStyle = isHovered ? '#ffffff' : '#00ff66';
                ctx.shadowBlur = isHovered ? 12 : 4;
                ctx.shadowColor = '#00ff66';
                ctx.fill();
                ctx.restore();

                // 3. Emit fluid trail particles on movement
                const dx = mouseX - lastMouseX;
                const dy = mouseY - lastMouseY;
                const speed = Math.sqrt(dx * dx + dy * dy);

                if (speed > 0.5) {
                    const count = isHovered ? 3 : Math.min(2, Math.floor(speed / 6) + 1);
                    for (let i = 0; i < count; i++) {
                        // Direction opposite to mouse vector, with spread angle
                        const angle = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 1.2;
                        const force = (Math.random() * speed * 0.15) + 0.4;
                        const vx = Math.cos(angle) * force;
                        const vy = Math.sin(angle) * force;
                        
                        const size = Math.random() * 3 + 1.2;
                        const decay = Math.random() * 0.03 + 0.02; // Quick fade out for performance
                        const color = isHovered ? '#00ffcc' : '#00ff66';
                        
                        particles.push(new Particle(mouseX, mouseY, vx, vy, size, color, 0.8, decay));
                    }
                } else if (isHovered && Math.random() < 0.25) {
                    // Drift particles while hovering still
                    const angle = Math.random() * Math.PI * 2;
                    const force = Math.random() * 0.4;
                    const vx = Math.cos(angle) * force;
                    const vy = Math.sin(angle) * force;
                    const size = Math.random() * 2 + 1;
                    const decay = Math.random() * 0.02 + 0.015;
                    particles.push(new Particle(mouseX, mouseY, vx, vy, size, '#00ffcc', 0.6, decay));
                }

                lastMouseX = mouseX;
                lastMouseY = mouseY;
            }

            // Render and update active particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                } else {
                    p.draw(ctx);
                }
            }

            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);
    }
}

function customizeDashboard() {
    const userBranch = localStorage.getItem('pathos_branch');
    const cards = document.querySelectorAll('.stream-card');
    
    // Normalize branch key (extract short code if it contains parentheses, e.g. "Computer Science (CSE)" -> "cse")
    let normalizedBranch = null;
    if (userBranch) {
        const lower = userBranch.toLowerCase();
        if (lower.includes('cse') || lower.includes('computer science')) {
            normalizedBranch = 'cse';
        } else if (lower.includes('ece') || lower.includes('electronics')) {
            normalizedBranch = 'ece';
        } else if (lower.includes('eee') || lower.includes('electrical')) {
            normalizedBranch = 'eee';
        } else if (lower.includes('mech') || lower.includes('mechanical')) {
            normalizedBranch = 'mech';
        } else if (lower.includes('civil')) {
            normalizedBranch = 'civil';
        }
    }
    
    // Clear any previous toggler and badges to reset state
    const previousToggle = document.getElementById('toggleAlternativeBtn');
    if (previousToggle) {
        previousToggle.remove();
    }
    document.querySelectorAll('.track-badge').forEach(badge => badge.remove());
    
    if (!normalizedBranch) {
        // Guest or unassigned, show all
        cards.forEach(card => card.style.display = 'flex');
        return;
    }
    
    let matchedCardExists = false;
    cards.forEach(card => {
        const stream = card.getAttribute('data-stream');
        if (stream === normalizedBranch) {
            card.style.display = 'flex';
            
            // Add a badge inside the card saying "Your Active Track"
            const badge = document.createElement('span');
            badge.className = 'track-badge';
            badge.innerHTML = '[ Primary Node Track ]';
            badge.style.fontSize = '0.75rem';
            badge.style.color = '#00ff66';
            badge.style.border = '1px solid rgba(0, 255, 102, 0.3)';
            badge.style.background = 'rgba(0, 255, 102, 0.05)';
            badge.style.padding = '4px 10px';
            badge.style.borderRadius = '12px';
            badge.style.alignSelf = 'flex-start';
            badge.style.marginBottom = '16px';
            badge.style.fontWeight = '700';
            badge.style.letterSpacing = '1px';
            badge.style.display = 'inline-block';
            
            const contentDiv = card.querySelector('div');
            if (contentDiv) {
                contentDiv.insertBefore(badge, contentDiv.firstChild);
            }
            
            matchedCardExists = true;
        } else {
            // Hide alternative courses
            card.style.display = 'none';
        }
    });
    
    // If a card matched, show a toggler below the stream grid to show the rest
    if (matchedCardExists) {
        const grid = document.querySelector('.stream-grid');
        if (grid) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'toggleAlternativeBtn';
            toggleBtn.innerText = 'Show Other Terminals';
            toggleBtn.style.background = 'transparent';
            toggleBtn.style.border = '1px solid rgba(255, 255, 255, 0.08)';
            toggleBtn.style.color = '#a1a1aa';
            toggleBtn.style.padding = '12px 24px';
            toggleBtn.style.borderRadius = '12px';
            toggleBtn.style.cursor = 'pointer';
            toggleBtn.style.fontFamily = 'inherit';
            toggleBtn.style.fontWeight = '600';
            toggleBtn.style.marginTop = '20px';
            toggleBtn.style.transition = 'all 0.2s';
            toggleBtn.style.display = 'block';
            toggleBtn.style.margin = '0 auto 40px';
            
            toggleBtn.addEventListener('mouseenter', () => {
                toggleBtn.style.borderColor = '#fff';
                toggleBtn.style.color = '#fff';
            });
            toggleBtn.addEventListener('mouseleave', () => {
                toggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                toggleBtn.style.color = '#a1a1aa';
            });
            
            toggleBtn.addEventListener('click', () => {
                const isShowingAll = toggleBtn.getAttribute('data-showing-all') === 'true';
                cards.forEach(card => {
                    if (card.getAttribute('data-stream') !== normalizedBranch) {
                        card.style.display = isShowingAll ? 'none' : 'flex';
                    }
                });
                toggleBtn.setAttribute('data-showing-all', isShowingAll ? 'false' : 'true');
                toggleBtn.innerText = isShowingAll ? 'Show Other Terminals' : 'Hide Other Terminals';
            });
            
            grid.parentNode.insertBefore(toggleBtn, grid.nextSibling);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateProfileSummary();
    initCustomCursor();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_required') === 'true') {
        setTimeout(() => {
            window.openModal('requested');
        }, 100);
    }
});