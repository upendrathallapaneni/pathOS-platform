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

let originalStreamGridHtml = '';
let originalHeroTitle = '';
let originalHeroDesc = '';
let originalSectTitle = '';

// Course specific data structure for dynamic UI rendering
const courseData = {
    cse: {
        title: "Computer Science",
        heroTitle: "Develop Core Systems. Scale Globally.",
        heroDesc: "Your node is connected to the Software & Systems pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "Software Engineer",
                desc: "Focuses on high-concurrency systems, system programming, and cloud infrastructure.",
                levels: [
                    { name: "Level 1: System Design Foundations", detail: "Learn asynchronous execution patterns, API gateways, load balancers, and vertical scaling mechanics." },
                    { name: "Level 2: Scalable Database Systems", detail: "Configure SQL read-replicas, master-slave failovers, Redis caches, and key-value clustering." },
                    { name: "Level 3: Orchestration & Networks", detail: "Deploy Docker containers, configure Kubernetes node networks, and set up CI/CD pipelines." }
                ],
                boss: "Final Boss Project: Distributed Key-Value Store",
                bossDesc: "Build a persistent, replicated key-value store with raft consensus protocol from scratch."
            },
            {
                name: "AI & Machine Learning",
                desc: "Focuses on data engineering pipelines, mathematical modeling, and deep learning architectures.",
                levels: [
                    { name: "Level 1: Mathematical Foundations", detail: "Linear algebra, multivariable calculus, probability structures, and gradient descent algorithms." },
                    { name: "Level 2: Deep Learning Architectures", detail: "Build and train CNNs, LSTMs, and transformer models from raw matrices using backpropagation." },
                    { name: "Level 3: MLOps & Real-time Inference", detail: "Model quantization, ONNX execution, and real-time streaming feature pipelines." }
                ],
                boss: "Final Boss Project: Autonomous LLM Agent",
                bossDesc: "Deploy a custom-trained transformer model optimized to execute terminal commands based on natural language."
            },
            {
                name: "Cybersecurity Node",
                desc: "Focuses on security principles, encryption protocols, and pentesting frameworks.",
                levels: [
                    { name: "Level 1: Security & Networking Core", detail: "Understand OSI layer security, certificate chains, TLS handshakes, and public-key infrastructure." },
                    { name: "Level 2: Cryptographic Architectures", detail: "Implement AES encryption, SHA hashing, zero-knowledge proofs, and secure authentication loops." },
                    { name: "Level 3: Penetration Testing & Audit", detail: "Configure firewalls, perform vulnerability audits, detect stack overflows, and secure memory gaps." }
                ],
                boss: "Final Boss Project: Security Auditing Tool",
                bossDesc: "Build an automated security scanner that analyzes code repositories for API key leaks and buffer overflow threats."
            },
            {
                name: "Frontend Architect",
                desc: "Focuses on layout performance, semantic layouts, and client-state machines.",
                levels: [
                    { name: "Level 1: Core Layout Performance", detail: "Master critical render paths, paint cycles, layouts, and hardware-accelerated transforms." },
                    { name: "Level 2: State Machines & Streams", detail: "Manage client-state structures, reactive observables, and virtual DOM reconciling loops." },
                    { name: "Level 3: Web App Performance", detail: "Implement code splitting, service worker caches, lazy loading, and edge rendering setups." }
                ],
                boss: "Final Boss Project: Interactive Visual IDE",
                bossDesc: "Construct a canvas-based browser editor that parses custom code blocks into working HTML previews."
            }
        ]
    },
    ece: {
        title: "Electronics & Communication",
        heroTitle: "Design Next-Gen Hardware & Networks.",
        heroDesc: "Your node is connected to the ECE pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "VLSI Digital Chip Designer",
                desc: "Focuses on transistor layout, logic gate design, and hardware description languages.",
                levels: [
                    { name: "Level 1: CMOS Logic & Gate Design", detail: "Understand transistor configurations, logical effort, and propagation delay loops." },
                    { name: "Level 2: RTL & Hardware Languages", detail: "Write synthesizable Verilog/VHDL code for registers, ALUs, and state controllers." },
                    { name: "Level 3: Verification & Testbench", detail: "Write SystemVerilog code, simulate test cases, and analyze logic timing constraints." }
                ],
                boss: "Final Boss Project: 8-Bit RISC-V Processor Core",
                bossDesc: "Design and verify a complete synthesizable RISC-V processor instruction set execution pipeline."
            },
            {
                name: "Embedded IoT Firmware",
                desc: "Focuses on microcontroller drivers, low-level scheduling, and communications protocols.",
                levels: [
                    { name: "Level 1: Bare-Metal Microcontrollers", detail: "Learn register manipulations, interrupt handlers, and hardware clocks using C." },
                    { name: "Level 2: Low-Level Protocols", detail: "Configure UART, SPI, I2C, and DMA buses to transfer sensor stream payloads." },
                    { name: "Level 3: Real-Time Operating Systems", detail: "Manage task priorities, mutexes, semaphores, and message queues in FreeRTOS." }
                ],
                boss: "Final Boss Project: Smart IoT Gate Controller",
                bossDesc: "Develop a secure firmware suite that processes encrypted sensor commands with real-time feedback loops."
            },
            {
                name: "5G Wireless Infrastructure",
                desc: "Focuses on software-defined radios, network layers, and signal processing pipelines.",
                levels: [
                    { name: "Level 1: DSP Foundations", detail: "Fast Fourier Transforms, digital filters, modulation schemes, and spectral analysis." },
                    { name: "Level 2: Antenna & Radio Frontend", detail: "MIMO architectures, beamforming physics, RF transmitters, and impedance matching." },
                    { name: "Level 3: Core Wireless Protocols", detail: "Understand 3GPP standards, LTE/5G MAC layers, and IP routing encapsulation." }
                ],
                boss: "Final Boss Project: Software-Defined Radio Transceiver",
                bossDesc: "Build a program that encodes, modulates, and transmits real-time digital streams over RF interfaces."
            }
        ]
    },
    eee: {
        title: "Electrical & Electronics",
        heroTitle: "Control Smart Power & Electric Systems.",
        heroDesc: "Your node is connected to the EEE pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "Smart Grid Automation",
                desc: "Focuses on substation SCADA systems, telemetry streams, and smart metering.",
                levels: [
                    { name: "Level 1: Telemetry & SCADA Interface", detail: "Learn Modbus protocols, RTU configurations, and monitoring dashboard design." },
                    { name: "Level 2: Grid Protection Systems", detail: "Deploy overcurrent relays, differential circuits, and automatic circuit breakers." },
                    { name: "Level 3: Smart Load Balancing", detail: "Build algorithms that dynamically shift generator speeds based on grid loading predictions." }
                ],
                boss: "Final Boss Project: Substation Control Simulation",
                bossDesc: "Build a graphical interface simulating load-shedding events and automated circuit restarts."
            },
            {
                name: "EV Powertrain Controls",
                desc: "Focuses on inverter gate drivers, brushless motor control, and battery management.",
                levels: [
                    { name: "Level 1: Inverter Power Electronics", detail: "Study IGBT switching states, gate driver isolations, and PWM harmonics." },
                    { name: "Level 2: Field-Oriented Motor Control", detail: "Implement vector controls for permanent magnet synchronous motors (PMSM)." },
                    { name: "Level 3: Battery Management Systems", detail: "Monitor state of charge, balance cell voltages, and deploy thermal cutoff checks." }
                ],
                boss: "Final Boss Project: EV Traction Inverter Controller",
                bossDesc: "Design a simulated control loop regulating EV motor torque dynamically based on acceleration input."
            },
            {
                name: "Industrial PLCs & Robotics",
                desc: "Focuses on ladder logic configurations, industrial buses, and factory automation.",
                levels: [
                    { name: "Level 1: Ladder Logic Programming", detail: "Write timers, counters, and logic comparators for Allen-Bradley or Siemens PLCs." },
                    { name: "Level 2: Industrial Communications", detail: "Configure Profibus, DeviceNet, and EtherNet/IP connections between motors and PLCs." },
                    { name: "Level 3: Motion Controllers", detail: "Synchronize multi-axis servo drives for pick-and-place robotic arm paths." }
                ],
                boss: "Final Boss Project: Automated Assembly Simulator",
                bossDesc: "Configure ladder logic to coordinate a conveyor belt line, sorting sensor inputs, and pneumatic pusher cycles."
            }
        ]
    },
    mech: {
        title: "Mechanical Engineering",
        heroTitle: "Simulate Kinetic Systems & Robotics.",
        heroDesc: "Your node is connected to the Mechanical pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "Mechatronics & Robotics",
                desc: "Focuses on servo kinematics, feedback loops, and sensor processing engines.",
                levels: [
                    { name: "Level 1: Sensor & Actuator Interface", detail: "Learn stepper controls, encoders, analog sensors, and operational amplifiers." },
                    { name: "Level 2: Robotic Kinematics", detail: "Calculate forward and inverse kinematics using Denavit-Hartenberg matrices." },
                    { name: "Level 3: Feedback Control Loops", detail: "Tune PID filters to regulate motor positions under varying torque loads." }
                ],
                boss: "Final Boss Project: 3-Axis Robotic Manipulator Core",
                bossDesc: "Design a control script that moves a robotic end-effector to precise coordinate locations dynamically."
            },
            {
                name: "Aero-Mechanical Simulator",
                desc: "Focuses on gas dynamics, thermal transfer, and turbine blades.",
                levels: [
                    { name: "Level 1: Gas Dynamics & Fluids", detail: "Learn Navier-Stokes equations, boundary layers, and compressible flow mechanics." },
                    { name: "Level 2: Heat Transfer Modeling", detail: "Run thermal conduction, convection, and radiation simulations for turbine shells." },
                    { name: "Level 3: Structural Vibrations", detail: "Analyze resonance frequencies, harmonics, and modal structures of rotating blades." }
                ],
                boss: "Final Boss Project: Turbine Blade Heat Spreader",
                bossDesc: "Compute the temperature distribution across a turbine blade model using finite difference algorithms."
            },
            {
                name: "Automated Design & FEA",
                desc: "Focuses on CAD scripting, solid modeling, and structural stress reviews.",
                levels: [
                    { name: "Level 1: CAD Design Automation", detail: "Write parametric scripts to build complex 3D parts inside solid modeling software." },
                    { name: "Level 2: Finite Element Analysis (FEA)", detail: "Define mesh sizes, boundary supports, and load forces for stress evaluations." },
                    { name: "Level 3: Topology Optimization", detail: "Run algorithms to subtract weight from load-bearing metal frames safely." }
                ],
                boss: "Final Boss Project: Optimizing Drone Arms",
                bossDesc: "Analyze static stress on a drone frame to minimize weight while keeping safety factors above 2.0."
            }
        ]
    },
    civil: {
        title: "Civil Engineering",
        heroTitle: "Plan Infrastructure. Build Resilient Structures.",
        heroDesc: "Your node is connected to the Civil & Structural pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "Parametric BIM Designer",
                desc: "Focuses on architectural metadata, design algorithms, and building information modeling.",
                levels: [
                    { name: "Level 1: BIM Foundations & Metadata", detail: "Study standard BIM protocols, asset tags, material libraries, and schedule links." },
                    { name: "Level 2: Visual Programming & CAD Scripts", detail: "Write visual scripts (Dynamo/Grasshopper) to generate parametric geometries." },
                    { name: "Level 3: Structural Coordination", detail: "Perform clash detection checks between HVAC, electrical, and concrete layouts." }
                ],
                boss: "Final Boss Project: Generative Tower Shell Layout",
                bossDesc: "Develop a script that updates structural column locations dynamically to minimize load offsets."
            },
            {
                name: "Structural Safety Auditor",
                desc: "Focuses on loading formulas, finite element calculations, and structural safety checks.",
                levels: [
                    { name: "Level 1: Loading Calculations", detail: "Calculate dead loads, live loads, wind forces, and seismic stresses on beams." },
                    { name: "Level 2: Frame Finite Elements", detail: "Calculate internal bending moments, shear diagrams, and joint deflections." },
                    { name: "Level 3: Soil-Structure Mechanics", detail: "Review foundation settlement profiles, bearing stress limits, and pile reactions." }
                ],
                boss: "Final Boss Project: Bridge Truss Fatigue Audit",
                bossDesc: "Simulate load distributions on a multi-span steel truss bridge to trace potential fatigue failure points."
            },
            {
                name: "Infrastructure Project Node",
                desc: "Focuses on critical paths, scheduling, cost projections, and construction logistics.",
                levels: [
                    { name: "Level 1: Project Critical Paths", detail: "Draw activity networks, map dependencies, and compute early start / late finish paths." },
                    { name: "Level 2: Cost Projections & Tenders", detail: "Create itemized quantity estimates, cost structures, and verify resource distributions." },
                    { name: "Level 3: Logistics & Safety Control", detail: "Design sitework traffic routes, layout storage bins, and coordinate crane clearances." }
                ],
                boss: "Final Boss Project: Metro Tunnel Construction Layout",
                bossDesc: "Build a scheduling logic sequence tracking tunnel boring steps, liner placements, and utility installations."
            }
        ]
    }
};

window.toggleRoleDashboard = function(index) {
    const body = document.getElementById(`role-body-${index}`);
    const card = document.getElementById(`role-${index}`);
    const toggleIcon = card.querySelector('.toggle-icon');
    
    if (body.style.display === 'none') {
        body.style.display = 'block';
        toggleIcon.innerText = '-';
        toggleIcon.style.transform = 'rotate(180deg)';
        card.style.borderColor = 'rgba(0, 255, 102, 0.4)';
        card.style.boxShadow = '0 10px 30px rgba(0, 255, 102, 0.04)';
    } else {
        body.style.display = 'none';
        toggleIcon.innerText = '+';
        toggleIcon.style.transform = 'rotate(0deg)';
        card.style.borderColor = 'var(--glass-border)';
        card.style.boxShadow = 'none';
    }
};

function customizeDashboard() {
    const userBranch = localStorage.getItem('pathos_branch');
    const grid = document.querySelector('.stream-grid');
    const heroH1 = document.querySelector('.hero h1');
    const heroP = document.querySelector('.hero p');
    const sectTitle = document.getElementById('architectures');

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
    
    // Clear any previous Return button
    const prevReturnBtn = document.getElementById('returnToTrackBtn');
    if (prevReturnBtn) prevReturnBtn.remove();
    
    if (!normalizedBranch || !grid) {
        // Guest or unassigned node: Restore defaults
        if (heroH1 && originalHeroTitle) heroH1.innerText = originalHeroTitle;
        if (heroP && originalHeroDesc) heroP.innerText = originalHeroDesc;
        if (sectTitle && originalSectTitle) sectTitle.innerText = originalSectTitle;
        if (grid && originalStreamGridHtml) {
            grid.innerHTML = originalStreamGridHtml;
            grid.style.display = 'grid';
        }
        return;
    }
    
    // Update Hero Title & Description to match selected branch
    const branchMeta = courseData[normalizedBranch];
    if (heroH1) heroH1.innerText = branchMeta.heroTitle;
    if (heroP) heroP.innerText = branchMeta.heroDesc;
    if (sectTitle) sectTitle.innerText = `${branchMeta.title} Core Terminals`;
    
    // Build personalized dynamic interactive curriculum modules HTML
    let dashboardHtml = `<div class="dashboard-wrapper" style="width: 100%; grid-column: 1 / -1; display: flex; flex-direction: column; gap: 30px;">`;
    
    branchMeta.roles.forEach((role, rIndex) => {
        let iconSvg = '';
        if (normalizedBranch === 'cse') {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
        } else if (normalizedBranch === 'ece' || normalizedBranch === 'eee') {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="10" x2="6" y2="14"></line><line x1="18" y1="10" x2="18" y2="14"></line></svg>`;
        } else {
            iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
        }
        
        dashboardHtml += `
            <div class="role-card" style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 20px; overflow: hidden; transition: all 0.3s;" id="role-${rIndex}">
                <div class="role-header" onclick="toggleRoleDashboard(${rIndex})" style="padding: 24px 30px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.2s;">
                    <div style="display: flex; align-items: center; gap: 16px; text-align: left;">
                        <div class="role-icon" style="background: rgba(0, 255, 102, 0.1); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            ${iconSvg}
                        </div>
                        <div>
                            <h3 style="font-family: 'Syne', sans-serif; font-size: 1.3rem; margin-bottom: 4px; color: #fff;">${role.name}</h3>
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">${role.desc}</p>
                        </div>
                    </div>
                    <span class="toggle-icon" style="font-size: 1.5rem; color: var(--accent-green); transition: transform 0.3s; margin-left: 20px;">+</span>
                </div>
                <div class="role-body" id="role-body-${rIndex}" style="display: none; padding: 40px; border-top: 1px solid var(--border-line); text-align: left;">
                    
                    <div class="timeline" style="border-left: 2px solid var(--border-line, rgba(255,255,255,0.08)); margin-left: 20px; padding-left: 40px; position: relative; margin-bottom: 40px;">
                        ${role.levels.map((level, index) => `
                            <div class="timeline-item" data-level="${index + 1}" style="position: relative; margin-bottom: 40px;">
                                <style>
                                    #role-${rIndex} .timeline-item[data-level="${index + 1}"]::before {
                                        content: '${index + 1}';
                                        position: absolute;
                                        left: -57px;
                                        top: 0;
                                        width: 32px;
                                        height: 32px;
                                        background: var(--surface-light);
                                        border: 2px solid var(--accent-green);
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: 700;
                                        color: var(--accent-green);
                                        font-size: 0.9rem;
                                        font-family: 'Syne', sans-serif;
                                    }
                                    @media (max-width: 768px) {
                                        #role-${rIndex} .timeline-item[data-level="${index + 1}"]::before {
                                            left: -41px;
                                            width: 28px;
                                            height: 28px;
                                            font-size: 0.8rem;
                                        }
                                    }
                                </style>
                                <h4 style="font-family: 'Syne', sans-serif; font-size: 1.2rem; margin-bottom: 8px; color: #fff;">${level.name}</h4>
                                <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0;">${level.detail}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="boss-level" style="background: rgba(0, 255, 102, 0.03); border: 1px solid rgba(0, 255, 102, 0.15); border-radius: 16px; padding: 30px; position: relative;">
                        <h5 style="font-family: 'Syne', sans-serif; font-size: 1.1rem; color: var(--accent-green); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px rgba(0,255,102,0.4));">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                <path d="M4 22h16"></path>
                                <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
                                <path d="M12 2a6 6 0 0 1 6 6v3.34c0 .73-.13 1.45-.39 2.12l-.22.56a2 2 0 0 1-1.85 1.3H8.46a2 2 0 0 1-1.85-1.3l-.22-.56A5.99 5.99 0 0 1 6 8.34V8a6 6 0 0 1 6-6Z"></path>
                            </svg>
                            ${role.boss}
                        </h5>
                        <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0;">${role.bossDesc}</p>
                    </div>

                </div>
            </div>
        `;
    });
    
    // Add toggler to explore other branches at the bottom
    dashboardHtml += `
        <button class="logout-btn" id="toggleAlternativeBtn" style="width: auto; background: transparent; border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); padding: 12px 24px; border-radius: 12px; cursor: pointer; font-family: inherit; font-weight: 600; display: block; margin: 20px auto 0; transition: all 0.2s;">
            Explore Other Branches
        </button>
    `;
    
    dashboardHtml += `</div>`;
    
    // Replace grid with dashboard view
    grid.innerHTML = dashboardHtml;
    grid.style.display = 'block'; // Block layout for active role list
    
    // Bind click event to dynamic alternative explorer button
    const alternativeBtn = document.getElementById('toggleAlternativeBtn');
    if (alternativeBtn) {
        alternativeBtn.addEventListener('click', () => {
            // Restore regular architectures cards
            grid.innerHTML = originalStreamGridHtml;
            grid.style.display = 'grid';
            
            // Add a floating "Return to focus" button right above the core architectures grid
            const returnBtn = document.createElement('button');
            returnBtn.id = 'returnToTrackBtn';
            returnBtn.innerText = `← Return to ${branchMeta.title} Core`;
            returnBtn.style.background = 'rgba(0, 255, 102, 0.1)';
            returnBtn.style.border = '1px solid var(--accent-green)';
            returnBtn.style.color = 'var(--accent-green)';
            returnBtn.style.padding = '10px 20px';
            returnBtn.style.borderRadius = '12px';
            returnBtn.style.cursor = 'pointer';
            returnBtn.style.fontFamily = 'inherit';
            returnBtn.style.fontWeight = '700';
            returnBtn.style.marginBottom = '24px';
            returnBtn.style.display = 'block';
            
            returnBtn.addEventListener('click', () => {
                customizeDashboard();
            });
            
            grid.parentNode.insertBefore(returnBtn, grid);
            
            // Scroll to the button view
            returnBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Cache original states to enable fully interactive dynamic reverting
    const heroH1 = document.querySelector('.hero h1');
    const heroP = document.querySelector('.hero p');
    const sectTitle = document.getElementById('architectures');
    const grid = document.querySelector('.stream-grid');
    
    if (heroH1) originalHeroTitle = heroH1.innerText;
    if (heroP) originalHeroDesc = heroP.innerText;
    if (sectTitle) originalSectTitle = sectTitle.innerText;
    if (grid) originalStreamGridHtml = grid.innerHTML;

    updateProfileSummary();
    initCustomCursor();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_required') === 'true') {
        setTimeout(() => {
            window.openModal('requested');
        }, 100);
    }
});