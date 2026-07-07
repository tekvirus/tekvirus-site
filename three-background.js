// ============================================================
// TEKVIRUS — "SIGNAL BOARD" 3D BACKGROUND
// A low, wide circuit-board field viewed at a raking angle.
// Manhattan-routed traces carry glowing pulses; small chip
// modules hover above the board. Built to feel like the inside
// of the product Tekvirus builds, not a generic hero orb.
// ============================================================

import * as THREE from 'three';

class SignalBoard {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.mouse = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.pulses = [];
        this.chips = [];
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0a0c10, 0.05);

        this.camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.5, 100);
        this.camera.position.set(0, 6.4, 12.5);
        this.camera.lookAt(0, -0.6, -3);

        this.rig = new THREE.Group();
        this.scene.add(this.rig);

        this.buildBoard();
        this.buildChips();
        this.buildDust();
        this.addLights();

        this.animate();

        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    // ---- Manhattan-routed circuit traces ----
    buildBoard() {
        this.tracesGroup = new THREE.Group();
        this.rig.add(this.tracesGroup);

        const traceMat = new THREE.LineBasicMaterial({
            color: 0x4c7cff,
            transparent: true,
            opacity: 0.32,
        });

        const nodeMat = new THREE.MeshBasicMaterial({ color: 0x4c7cff, transparent: true, opacity: 0.5 });
        const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);

        const areaX = 15, areaZ = 11, baseY = -1.7;
        const traceCount = 16;
        this.tracePaths = [];

        for (let i = 0; i < traceCount; i++) {
            const points = [];
            let x = (Math.random() - 0.5) * areaX;
            let z = (Math.random() - 0.5) * areaZ - 2;
            points.push(new THREE.Vector3(x, baseY, z));

            const segments = 3 + Math.floor(Math.random() * 4);
            let horizontal = Math.random() > 0.5;

            for (let s = 0; s < segments; s++) {
                const step = 0.8 + Math.random() * 2.2;
                if (horizontal) x += (Math.random() > 0.5 ? 1 : -1) * step;
                else z += (Math.random() > 0.5 ? 1 : -1) * step;
                x = THREE.MathUtils.clamp(x, -areaX / 2, areaX / 2);
                z = THREE.MathUtils.clamp(z, -areaZ / 2 - 2, areaZ / 2);
                points.push(new THREE.Vector3(x, baseY, z));
                horizontal = !horizontal;
            }

            const geo = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geo, traceMat);
            this.tracesGroup.add(line);

            // registration nodes at each joint
            points.forEach((p) => {
                if (Math.random() > 0.55) {
                    const node = new THREE.Mesh(nodeGeo, nodeMat);
                    node.position.copy(p);
                    this.tracesGroup.add(node);
                }
            });

            // precompute cumulative arc length for pulse travel
            const dists = [0];
            for (let p = 1; p < points.length; p++) {
                dists.push(dists[p - 1] + points[p].distanceTo(points[p - 1]));
            }
            this.tracePaths.push({ points, dists, total: dists[dists.length - 1] });
        }

        // a handful of traveling signal pulses
        const pulseGeoAmber = new THREE.SphereGeometry(0.075, 8, 8);
        const pulseMatAmber = new THREE.MeshBasicMaterial({ color: 0xffb020, transparent: true, opacity: 0.95 });
        const pulseMatCircuit = new THREE.MeshBasicMaterial({ color: 0x7aa2ff, transparent: true, opacity: 0.95 });

        const pulseCount = 9;
        for (let i = 0; i < pulseCount; i++) {
            const path = this.tracePaths[Math.floor(Math.random() * this.tracePaths.length)];
            const mesh = new THREE.Mesh(pulseGeoAmber, i % 3 === 0 ? pulseMatAmber : pulseMatCircuit);
            const glow = new THREE.PointLight(i % 3 === 0 ? 0xffb020 : 0x4c7cff, 0.6, 2.2);
            mesh.add(glow);
            this.tracesGroup.add(mesh);
            this.pulses.push({
                mesh,
                path,
                t: Math.random(),
                speed: 0.05 + Math.random() * 0.06,
            });
        }
    }

    // ---- floating chip modules ----
    buildChips() {
        this.chipGroup = new THREE.Group();
        this.rig.add(this.chipGroup);

        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x12151c, roughness: 0.6, metalness: 0.2 });
        const edgeColors = [0x4c7cff, 0xffb020];

        for (let i = 0; i < 9; i++) {
            const w = 0.5 + Math.random() * 0.5;
            const d = 0.5 + Math.random() * 0.5;
            const geo = new THREE.BoxGeometry(w, 0.1, d);
            const mesh = new THREE.Mesh(geo, bodyMat);

            const edgeGeo = new THREE.EdgesGeometry(geo);
            const edgeMat = new THREE.LineBasicMaterial({ color: edgeColors[i % 2], transparent: true, opacity: 0.6 });
            const edges = new THREE.LineSegments(edgeGeo, edgeMat);
            mesh.add(edges);

            mesh.position.set(
                (Math.random() - 0.5) * 12,
                0.3 + Math.random() * 2.2,
                (Math.random() - 0.5) * 9 - 2
            );
            mesh.rotation.y = Math.random() * Math.PI;

            this.chipGroup.add(mesh);
            this.chips.push({ mesh, phase: Math.random() * Math.PI * 2, speed: 0.4 + Math.random() * 0.3, baseY: mesh.position.y });
        }
    }

    buildDust() {
        const count = 400;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 24;
            positions[i + 1] = Math.random() * 6 - 1;
            positions[i + 2] = (Math.random() - 0.5) * 18 - 3;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            size: 0.03,
            color: 0x8ba8ff,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        this.dust = new THREE.Points(geo, mat);
        this.rig.add(this.dust);
    }

    addLights() {
        this.scene.add(new THREE.AmbientLight(0x2a3350, 0.9));
        const dir = new THREE.DirectionalLight(0x99b6ff, 0.5);
        dir.position.set(2, 5, 3);
        this.scene.add(dir);
    }

    positionOnPath(path, t) {
        const target = t * path.total;
        for (let i = 1; i < path.dists.length; i++) {
            if (target <= path.dists[i] || i === path.dists.length - 1) {
                const segLen = path.dists[i] - path.dists[i - 1] || 1;
                const localT = (target - path.dists[i - 1]) / segLen;
                return path.points[i - 1].clone().lerp(path.points[i], THREE.MathUtils.clamp(localT, 0, 1));
            }
        }
        return path.points[0];
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const t = this.clock.getElapsedTime();

        // gentle parallax toward mouse
        this.target.x += (this.mouse.x * 0.4 - this.target.x) * 0.04;
        this.target.y += (this.mouse.y * 0.2 - this.target.y) * 0.04;
        this.rig.rotation.y = this.target.x * 0.15 + Math.sin(t * 0.05) * 0.05;
        this.rig.rotation.x = this.target.y * 0.06;

        this.pulses.forEach((p) => {
            p.t += p.speed * 0.016;
            if (p.t > 1) p.t = 0;
            const pos = this.positionOnPath(p.path, p.t);
            p.mesh.position.copy(pos);
        });

        this.chips.forEach((c) => {
            c.mesh.position.y = c.baseY + Math.sin(t * c.speed + c.phase) * 0.15;
            c.mesh.rotation.y += 0.002;
        });

        if (this.dust) this.dust.rotation.y += 0.0004;

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

new SignalBoard();
