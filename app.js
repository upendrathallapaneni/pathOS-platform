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

// Detailed course-specific roadmap structures for dynamic landing page generation
const courseData = {
    cse: {
        title: "Computer Science",
        heroTitle: "Develop Core Systems. Scale Globally.",
        heroDesc: "Your node is connected to the Software & Systems pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "Machine Learning Engineer",
                desc: "Don't just use AI—build it. Teach systems to recognize patterns, process natural language, and run inference cycles.",
                levels: [
                    { name: "Level 1: Language Foundation (Python)", detail: "Master loops, functions, object-oriented design, list comprehensions, and system standard libraries." },
                    { name: "Level 2: Data Manipulation (Pandas & NumPy)", detail: "Clean messy tabular data, calculate matrix statistics, filter arrays, and configure CSV/Parquet pipelines." },
                    { name: "Level 3: Classical Predictors (Scikit-Learn)", detail: "Implement linear regressions, decision tree classifiers, support vector machines, and evaluate error metrics." },
                    { name: "Level 4: Deep Learning Networks (PyTorch)", detail: "Build multi-layer artificial neural networks, compute backpropagation loops, train CNNs, and tune gradient descent." }
                ],
                boss: "Final Boss Project: Intelligent Recommendation Engine",
                bossDesc: "Build and deploy a live API that analyzes a user's Spotify history and predicts song choices using custom PyTorch embeddings."
            },
            {
                name: "Data Engineer",
                desc: "The plumber of big data. Build pipelines that move millions of data points instantly and securely.",
                levels: [
                    { name: "Level 1: Storage Foundations (SQL)", detail: "Master database schemas, complex joins, indexing, partitions, and execution plan optimization." },
                    { name: "Level 2: Pipeline Scripting (Python)", detail: "Write automation scripts, query REST APIs, parse JSON blobs, and schedule batch tasks." },
                    { name: "Level 3: Distributed Streams (Kafka & Spark)", detail: "Configure event-streaming brokers, handle pub-sub topics, and process large-scale data in memory." },
                    { name: "Level 4: Warehousing & Cloud (Snowflake)", detail: "Design cloud storage warehouses, manage ETL pipelines on AWS/GCP, and run analytical queries." }
                ],
                boss: "Final Boss Project: Live Stock Market Tracker",
                bossDesc: "Write a high-frequency script to pull live market values, stream them through Apache Kafka, and load them into a cloud database."
            },
            {
                name: "Cyber Security Analyst / Ethical Hacker",
                desc: "Act as the digital shield. Audit systems, find vulnerabilities, and fix code bugs before attackers do.",
                levels: [
                    { name: "Level 1: Computer Networking Core", detail: "Master IP subnetting, DNS routing, firewalls, and the OSI model packet flows." },
                    { name: "Level 2: Secure Operating Systems (Linux)", detail: "Navigate via CLI, manage user groups, edit secure permissions, and review log audit files." },
                    { name: "Level 3: Web Vulnerabilities (OWASP Top 10)", detail: "Understand SQL Injections, Cross-Site Scripting (XSS), CSRF, and authentication loopholes." },
                    { name: "Level 4: Penetration Testing Tools", detail: "Intercept HTTP traffic with Burp Suite, run vulnerability audits via Nmap, and run metasploit shells." }
                ],
                boss: "Final Boss Project: Automated Threat Scanner",
                bossDesc: "Build a Python utility that scans any target URL for open ports, missing SSL certificates, and out-of-date scripts."
            },
            {
                name: "Full-Stack Web Developer",
                desc: "Build responsive interfaces and backend servers. Bridge client experiences with secure databases.",
                levels: [
                    { name: "Level 1: Interactive Client (HTML/CSS & React)", detail: "Design responsive layouts with Flexbox/Grid, manage state, and render components in React." },
                    { name: "Level 2: Server Applications (Node.js)", detail: "Write asynchronous server logic, handle routing, and implement middleware handlers." },
                    { name: "Level 3: Database Integrations (PostgreSQL)", detail: "Design relational models, query records, and coordinate secure user password hashing." },
                    { name: "Level 4: API Bridges & Systems (REST)", detail: "Build RESTful endpoints, parse body requests, configure CORS policies, and test via Postman." }
                ],
                boss: "Final Boss Project: Social Platform Engine",
                bossDesc: "Develop a functional micro-blogging site complete with user registration, tweet updates, follower lines, and live feed updates."
            }
        ]
    },
    ece: {
        title: "Electronics & Communication",
        heroTitle: "Design Next-Gen Hardware & Networks.",
        heroDesc: "Your node is connected to the ECE pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "ASIC / VLSI Design Engineer",
                desc: "Designs the micro-architecture of silicon chips that power modern consumer electronics and AI model training.",
                levels: [
                    { name: "Level 1: Digital Logic Design", detail: "Master logic gate structures, Karnaugh maps, flip-flop state machines, and clock timing constraints." },
                    { name: "Level 2: RTL Hardware Languages", detail: "Write synthesizable Verilog/VHDL configurations to describe registers, logic multiplexers, and ALUs." },
                    { name: "Level 3: CMOS Gate Fabrication", detail: "Study transistor layouts, CMOS gate steps, propagation delay factors, and silicon scaling limits." },
                    { name: "Level 4: verification & Verification Testing", detail: "Write SystemVerilog code, simulate testbench boundaries, and deploy UVM (Universal Verification) cycles." }
                ],
                boss: "Final Boss Project: Custom 16-bit ALU Core",
                bossDesc: "Write the Verilog RTL for a 16-bit Arithmetic Logic Unit, create a comprehensive testbench, and synthesize on an FPGA."
            },
            {
                name: "Embedded Firmware Engineer",
                desc: "Writes low-level software that runs directly on microcontroller hardware without standard operating systems.",
                levels: [
                    { name: "Level 1: Memory-Safe C & Pointers", detail: "Master memory allocation in C, register pointer arithmetic, and bit-masking manipulations." },
                    { name: "Level 2: Bare-Metal Microcontrollers", detail: "Program STM32 (ARM Cortex) or ESP32 boards using direct memory-mapped register configurations." },
                    { name: "Level 3: Real-Time Kernels (RTOS)", detail: "Configure scheduler priorities, manage thread tasks, mutex locks, and queue semaphores in FreeRTOS." },
                    { name: "Level 4: Hardware Interfaces", detail: "Configure hardware communication protocols including I2C, SPI, UART, and analyze signals with oscilloscopes." }
                ],
                boss: "Final Boss Project: RTOS Weather Node",
                bossDesc: "Build a physical weather sensor node. Parse sensor data via I2C in FreeRTOS and post securely to an AWS dashboard via MQTT."
            },
            {
                name: "Network Infrastructure Engineer",
                desc: "Designs and optimizes high-frequency signal processing networks and wireless communications.",
                levels: [
                    { name: "Level 1: Signal Mathematics (DSP)", detail: "Understand digital signal processing, Fast Fourier Transforms, frequency domains, and modulation." },
                    { name: "Level 2: MATLAB Signal Modeling", detail: "Build MATLAB/Simulink projects to model signal attenuation, white noise, and filter conversions." },
                    { name: "Level 3: Software-Defined Radios (SDR)", detail: "Work with GNU Radio block configurations, decode RF bands, and configure software mixers." },
                    { name: "Level 4: Network Sockets & Automation", detail: "Learn Python to automate TCP/IP network testing, configure sockets, and run connection checks." }
                ],
                boss: "Final Boss Project: Custom SDR FM Receiver",
                bossDesc: "Connect an RTL-SDR receiver to capture live FM radio signals, filtering and decoding the audio streams via GNU Radio."
            }
        ]
    },
    eee: {
        title: "Electrical & Electronics",
        heroTitle: "Control Smart Power & Electric Systems.",
        heroDesc: "Your node is connected to the EEE pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "Smart Grid Systems Engineer",
                desc: "Writes grid automation logic to balance load spikes, isolate line faults, and sync smart meters.",
                levels: [
                    { name: "Level 1: Power Flow Calculations", detail: "Calculate AC/DC currents, active/reactive power loads, phase angles, and line impedances." },
                    { name: "Level 2: ETAP Grid Simulations", detail: "Model grid networks in ETAP/MATLAB to simulate power system transients and load distribution." },
                    { name: "Level 3: Substation SCADA Networks", detail: "Configure remote telemetry units (RTUs), SCADA dashboards, and Modbus communication loops." },
                    { name: "Level 4: Python Telemetry Analytics", detail: "Process smart meter logs, clean load databases, and write predictive consumption scripts." }
                ],
                boss: "Final Boss Project: Simulated Microgrid Load Balancer",
                bossDesc: "Write a simulation model in MATLAB that balances household power loads by switching dynamically between solar and storage."
            },
            {
                name: "EV Powertrain Control Engineer",
                desc: "Develops the high-voltage logic boards that invert battery currents and drive electric traction motors.",
                levels: [
                    { name: "Level 1: Three-Phase Inverter Circuits", detail: "Design IGBT gate drivers, study switching layouts, and minimize PWM harmonics." },
                    { name: "Level 2: Field-Oriented Control (FOC)", detail: "Master FOC motor algorithms to regulate speed and torque profiles dynamically." },
                    { name: "Level 3: Simulink Modeling & Testing", detail: "Build block diagrams in MATLAB/Simulink to simulate EV motor behavior on high-speed roads." },
                    { name: "Level 4: CAN Bus Communications", detail: "Implement CAN bus configurations to send cell logs to dashboard interfaces." }
                ],
                boss: "Final Boss Project: Motor Control Simulation",
                bossDesc: "Implement a Field Oriented Control pipeline for a brushless motor in Simulink, handling simulated load torque spikes."
            },
            {
                name: "Industrial Automation Engineer",
                desc: "Programs robotic cells, industrial PLCs, and factory assembly lines.",
                levels: [
                    { name: "Level 1: PLC Ladder Logic", detail: "Program Allen-Bradley/Siemens PLC units, write timers, counter loops, and comparators." },
                    { name: "Level 2: PID Control Loop Tuning", detail: "Tune proportional-integral-derivative parameters to maintain speed/temperature limits." },
                    { name: "Level 3: Sensor & Signal Conditioning", detail: "Connect industrial sensors, calibrate analog voltages, and filter electrical noise." },
                    { name: "Level 4: Industrial IoT Integration", detail: "Bridge operational PLC hardware networks with enterprise databases via MQTT protocols." }
                ],
                boss: "Final Boss Project: Automated Sorting Conveyor Logic",
                bossDesc: "Develop PLC ladder logic to manage a conveyor sorting system, routing packages by size based on sensor registers."
            }
        ]
    },
    mech: {
        title: "Mechanical Engineering",
        heroTitle: "Simulate Kinetic Systems & Robotics.",
        heroDesc: "Your node is connected to the Mechanical pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "Robotics Control Engineer",
                desc: "Write controller logic that coordinates mechanical joints, reads sensor feedback, and navigates environments.",
                levels: [
                    { name: "Level 1: Microcontrollers & Motors (C++)", detail: "Learn stepper/servo controls, analog-to-digital sensor reads, and coordinate C++ scripts." },
                    { name: "Level 2: Joint Kinematics Math", detail: "Calculate forward and inverse kinematics using Denavit-Hartenberg transformation matrices." },
                    { name: "Level 3: Robot Operating System (ROS)", detail: "Configure node topics, launch configurations, publish sensor telemetry, and subscribe to controllers." },
                    { name: "Level 4: Computer Vision (OpenCV)", detail: "Write python OpenCV scripts to track objects, detect edge outlines, and guide robotic paths." }
                ],
                boss: "Final Boss Project: Autonomous Navigation Rover",
                bossDesc: "Create a 3D rover simulation in Gazebo/ROS. Program it to navigate a maze using simulated LiDAR sensors."
            },
            {
                name: "Simulation & FEA Architect",
                desc: "Predict heat, stress, and flow failures using engineering software before parts are ever manufactured.",
                levels: [
                    { name: "Level 1: Parametric 3D CAD Modeling", detail: "Master SolidWorks/CATIA to build clean, constrained 3D parts and assembly models." },
                    { name: "Level 2: Static & Dynamic Physics", detail: "Review solid mechanics, stress tensors, thermal conduction, and flow boundary calculations." },
                    { name: "Level 3: Mesh Geometry Generation", detail: "Generate optimized FEA meshes, balance coordinate resolution against CPU execution, and fix node errors." },
                    { name: "Level 4: Structural ANSYS Simulations", detail: "Apply loads, constraints, and boundary properties to analyze strain distributions in ANSYS." }
                ],
                boss: "Final Boss Project: Weight Reduction Optimization",
                bossDesc: "Design a load bracket in SolidWorks, run static stress analysis in ANSYS, and optimize shape to reduce weight by 20%."
            },
            {
                name: "EV Battery Systems Engineer",
                desc: "Design battery thermal housing layouts and BMS logic constraints for electric vehicles.",
                levels: [
                    { name: "Level 1: Lithium-ion Cell Physics", detail: "Study battery chemistry, charge profiles, heat generation, and capacity degradation curves." },
                    { name: "Level 2: Embedded Firmware (C)", detail: "Write C micro-controllers to monitor cell temperatures and balance cell charging." },
                    { name: "Level 3: Vehicle CAN Networking", detail: "Decode automotive CAN networks to relay battery health registers to controller nodes." },
                    { name: "Level 4: BMS Simulink Modeling", detail: "Model battery state-of-charge loops and thermal boundaries in MATLAB/Simulink." }
                ],
                boss: "Final Boss Project: EV Battery Management System",
                bossDesc: "Develop a simulated BMS state machine that monitors voltage thresholds, balances cells, and cuts off power on fault logs."
            }
        ]
    },
    civil: {
        title: "Civil Engineering",
        heroTitle: "Plan Infrastructure. Build Resilient Structures.",
        heroDesc: "Your node is connected to the Civil & Structural pipeline. Access your operational modules and clear your final boss projects below.",
        roles: [
            {
                name: "BIM Computational Designer",
                desc: "Uses script automation to coordinate structural designs and manage 3D modeling metadata.",
                levels: [
                    { name: "Level 1: Parametric BIM Modelling (Revit)", detail: "Learn Autodesk Revit parameters, manage asset families, and structure model schedules." },
                    { name: "Level 2: Dynamo Visual Scripting", detail: "Develop visual scripts to automate column layouts, generate geometries, and clean metadata." },
                    { name: "Level 3: Python API Plugins (PyRevit)", detail: "Write Python scripts accessing the Revit API to create custom modeling workflows." },
                    { name: "Level 4: Spatial Coordination (Navisworks)", detail: "Run spatial clash detection tests across structural concrete, HVAC ducting, and piping systems." }
                ],
                boss: "Final Boss Project: Automated Structural Support Generator",
                bossDesc: "Build a Dynamo/Python script that analyzes a Revit structural plan and places steel column families matching spacing codes."
            },
            {
                name: "Urban GIS Data Architect",
                desc: "Manages geographic databases and spatial telemetry used for infrastructure routing.",
                levels: [
                    { name: "Level 1: GIS Spatial Geometries", detail: "Master coordinate systems, projections, vector raster datasets, and remote sensing maps." },
                    { name: "Level 2: Spatial SQL Databases (PostGIS)", detail: "Write SQL databases using PostGIS extensions to query spatial shapes and distances." },
                    { name: "Level 3: Python Geo-Libraries", detail: "Analyze spatial patterns using GeoPandas, execute shape joins, and map overlays in Jupyter." },
                    { name: "Level 4: Web Maps & Interfaces", detail: "Publish spatial coordinates to web frameworks using Leaflet or Folium map widgets." }
                ],
                boss: "Final Boss Project: Flood Risk Heatmap API",
                bossDesc: "Use PostGIS and Python to cross-reference elevation models with water flows, generating a flood risk heatmap."
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
    const grid = document.querySelector('.stream-grid');
    const heroH1 = document.querySelector('.hero h1');
    const heroP = document.querySelector('.hero p');
    const sectTitle = document.getElementById('architectures');
    const userBranch = localStorage.getItem('pathos_branch');

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
    customizeDashboard();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_required') === 'true') {
        setTimeout(() => {
            window.openModal('requested');
        }, 100);
    }
});