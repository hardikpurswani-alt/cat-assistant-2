/**
 * CBT Assistant AI — Signature Full-Screen Mental Health Doodle System
 * Generates hand-drawn, organic SVG vector illustrations and glassmorphic frames.
 */

(function () {
    'use strict';

    function initDoodleBackground() {
        if (document.getElementById('doodleBackground')) return;

        const bg = document.createElement('div');
        bg.id = 'doodleBackground';
        bg.className = 'doodle-background';
        bg.setAttribute('aria-hidden', 'true');

        bg.innerHTML = `
        <!-- ─── CLUSTER 1: TOP-LEFT (Mindfulness, Serene Cloud & Sparkles) ─── -->
        <div class="doodle-cluster doodle-cluster-tl">
            <svg class="doodle-svg" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Ambient pastel background glow blobs -->
                <ellipse cx="140" cy="130" rx="90" ry="70" class="doodle-fill-lavender" />
                <ellipse cx="230" cy="80" rx="60" ry="45" class="doodle-fill-blue" />
                
                <!-- Meditating person in lotus contour -->
                <g class="doodle-stroke" transform="translate(60, 40)">
                    <!-- Halo / Calm ripple above head -->
                    <path d="M 50 15 C 40 15, 30 22, 30 32 C 30 42, 40 48, 50 48 C 60 48, 70 42, 70 32 C 70 22, 60 15, 50 15 Z" stroke-dasharray="3 3" />
                    <!-- Head & serene closed eyes -->
                    <circle cx="50" cy="32" r="14" fill="#F8F7F4" />
                    <path d="M 45 32 Q 47 35 49 32" />
                    <path d="M 51 32 Q 53 35 55 32" />
                    <path d="M 48 37 Q 50 39 52 37" />
                    <!-- Neck & Shoulders -->
                    <path d="M 50 46 L 50 54 M 32 68 C 38 56, 44 54, 50 54 C 56 54, 62 56, 68 68" />
                    <!-- Torso & Arms folded in lap -->
                    <path d="M 32 68 L 22 92 C 20 98, 30 106, 50 106 C 70 106, 80 98, 78 92 L 68 68" />
                    <!-- Lotus legs -->
                    <path d="M 16 102 C 12 112, 28 122, 50 122 C 72 122, 88 112, 84 102" />
                    <path d="M 28 112 C 40 118, 60 118, 72 112" />
                    <!-- Gentle Heart sparkle in chest -->
                    <path d="M 50 72 Q 46 66 43 70 Q 40 74 50 82 Q 60 74 57 70 Q 54 66 50 72 Z" fill="#DDD4F2" class="doodle-stroke-accent" />
                </g>

                <!-- Calming Cloud with soft rain lines -->
                <g class="doodle-stroke" transform="translate(180, 25)">
                    <path d="M 20 40 C 10 40, 5 32, 10 24 C 12 16, 24 14, 28 18 C 32 8, 48 8, 54 16 C 62 14, 72 20, 70 30 C 76 34, 74 42, 65 42 Z" fill="#FFFFFF" fill-opacity="0.8" />
                    <path d="M 25 50 L 22 58" stroke-dasharray="2 2" />
                    <path d="M 42 48 L 39 58" stroke-dasharray="2 2" />
                    <path d="M 58 50 L 55 58" stroke-dasharray="2 2" />
                </g>

                <!-- Botanical Eucalyptus Branch -->
                <g class="doodle-stroke-sage" transform="translate(15, 120)">
                    <path d="M 10 90 Q 35 60 70 20" />
                    <path d="M 24 75 C 15 72, 12 62, 22 64 C 28 66, 26 74, 24 75 Z" fill="#CFDFD1" />
                    <path d="M 38 60 C 45 52, 52 56, 46 65 C 42 70, 36 64, 38 60 Z" fill="#CFDFD1" />
                    <path d="M 52 42 C 42 38, 40 28, 50 32 C 58 35, 56 42, 52 42 Z" fill="#CFDFD1" />
                    <path d="M 66 25 C 72 18, 80 22, 74 30 C 70 34, 64 28, 66 25 Z" fill="#CFDFD1" />
                </g>

                <!-- Sparkle stars (✦) -->
                <path d="M 170 140 Q 170 146 176 146 Q 170 146 170 152 Q 170 146 164 146 Q 170 146 170 140 Z" fill="#DDD4F2" class="doodle-stroke-accent" />
                <path d="M 45 25 Q 45 29 49 29 Q 45 29 45 33 Q 45 29 41 29 Q 45 29 45 25 Z" fill="#F3E0D5" class="doodle-stroke" />
            </svg>
            <div class="doodle-glass-frame frame-tl">
                <span>✦ Mindful Presence</span>
            </div>
        </div>

        <!-- ─── CLUSTER 2: TOP-RIGHT (Botanical Brain, Radiant Sun & Growth) ─── -->
        <div class="doodle-cluster doodle-cluster-tr">
            <svg class="doodle-svg" viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Pastel background blobs -->
                <ellipse cx="180" cy="140" rx="95" ry="80" class="doodle-fill-sage" />
                <ellipse cx="100" cy="70" rx="60" ry="50" class="doodle-fill-peach" />
                
                <!-- Radiant Smiling Sun -->
                <g class="doodle-stroke" transform="translate(60, 20)">
                    <circle cx="45" cy="45" r="22" fill="#FAF2EC" stroke="#B3684B" />
                    <!-- Wavy organic sunbeams -->
                    <path d="M 45 15 Q 43 8 45 2" stroke="#B3684B" />
                    <path d="M 45 75 Q 47 82 45 88" stroke="#B3684B" />
                    <path d="M 15 45 Q 8 43 2 45" stroke="#B3684B" />
                    <path d="M 75 45 Q 82 47 88 45" stroke="#B3684B" />
                    <path d="M 24 24 Q 18 18 14 14" stroke="#B3684B" />
                    <path d="M 66 66 Q 72 72 76 76" stroke="#B3684B" />
                    <path d="M 24 66 Q 18 72 14 76" stroke="#B3684B" />
                    <path d="M 66 24 Q 72 18 76 14" stroke="#B3684B" />
                    <!-- Peaceful sleeping eyes & smile -->
                    <path d="M 38 43 Q 41 46 44 43" stroke="#B3684B" />
                    <path d="M 46 43 Q 49 46 52 43" stroke="#B3684B" />
                    <path d="M 42 49 Q 45 53 48 49" stroke="#B3684B" />
                </g>

                <!-- Botanical Human Brain (Neuroplasticity & Healing) -->
                <g class="doodle-stroke" transform="translate(150, 65)">
                    <!-- Left Hemisphere Contour -->
                    <path d="M 50 110 C 35 110, 20 95, 20 75 C 20 62, 28 52, 25 42 C 22 30, 32 18, 48 20 C 52 14, 62 10, 70 15 L 70 110 Z" fill="#F1EFF7" />
                    <!-- Right Hemisphere Contour -->
                    <path d="M 70 110 L 70 15 C 78 10, 88 14, 92 20 C 108 18, 118 30, 115 42 C 112 52, 120 62, 120 75 C 120 95, 105 110, 90 110 Z" fill="#F1EFF7" />
                    <!-- Inner Gyri Folds (Soft curves) -->
                    <path d="M 35 55 C 45 52, 45 70, 58 68 C 65 66, 68 80, 60 85" stroke-dasharray="2 1" />
                    <path d="M 105 55 C 95 52, 95 70, 82 68 C 75 66, 72 80, 80 85" stroke-dasharray="2 1" />
                    <path d="M 42 35 C 50 38, 55 28, 65 35" />
                    <path d="M 98 35 C 90 38, 85 28, 75 35" />
                    
                    <!-- Blooming Botanical Flowers from the top of the brain -->
                    <path d="M 70 20 Q 70 -5 70 -20" stroke="var(--sage-deep)" stroke-width="2" />
                    <!-- Flower petals -->
                    <circle cx="70" cy="-22" r="6" fill="#DDD4F2" stroke="var(--accent)" />
                    <circle cx="63" cy="-22" r="5" fill="#DDD4F2" stroke="var(--accent)" />
                    <circle cx="77" cy="-22" r="5" fill="#DDD4F2" stroke="var(--accent)" />
                    <circle cx="70" cy="-29" r="5" fill="#DDD4F2" stroke="var(--accent)" />
                    <circle cx="70" cy="-15" r="5" fill="#DDD4F2" stroke="var(--accent)" />
                    <circle cx="70" cy="-22" r="3" fill="#FAF0EA" />
                    <!-- Botanical leaves on brain stem -->
                    <path d="M 70 -5 Q 60 -12 60 -20 Q 70 -12 70 -5 Z" fill="#CFDFD1" stroke="var(--sage-deep)" />
                    <path d="M 70 5 Q 80 -2 80 -10 Q 70 -2 70 5 Z" fill="#CFDFD1" stroke="var(--sage-deep)" />
                </g>

                <!-- Floating Heart with Sprout -->
                <g class="doodle-stroke" transform="translate(250, 190)">
                    <path d="M 25 15 C 20 8, 8 10, 8 22 C 8 32, 25 45, 25 45 C 25 45, 42 32, 42 22 C 42 10, 30 8, 25 15 Z" fill="#FAF2EC" stroke="#B3684B" />
                    <path d="M 25 12 Q 25 2 28 -4" stroke="var(--sage-deep)" />
                    <path d="M 28 -4 Q 34 -6 32 -10 Q 26 -6 28 -4 Z" fill="#CFDFD1" stroke="var(--sage-deep)" />
                </g>
                
                <path d="M 40 180 Q 40 185 45 185 Q 40 185 40 190 Q 40 185 35 185 Q 40 185 40 180 Z" fill="#DDD4F2" class="doodle-stroke-accent" />
            </svg>
            <div class="doodle-glass-frame frame-tr">
                <span>🌱 Cognitive Growth</span>
            </div>
        </div>

        <!-- ─── CLUSTER 3: MID-LEFT (Thought Diary, Journal & Reflections) ─── -->
        <div class="doodle-cluster doodle-cluster-ml">
            <svg class="doodle-svg" viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="120" cy="150" rx="80" ry="90" class="doodle-fill-peach" />
                <ellipse cx="60" cy="240" rx="50" ry="40" class="doodle-fill-lavender" />

                <!-- Open Thought Diary Journal -->
                <g class="doodle-stroke" transform="translate(30, 80) rotate(-6)">
                    <!-- Journal Cover Backing -->
                    <rect x="0" y="0" width="110" height="85" rx="8" fill="#ECE6F8" stroke="var(--accent)" />
                    <!-- Left page & right page split -->
                    <rect x="5" y="5" width="48" height="75" rx="4" fill="#FFFFFF" />
                    <rect x="57" y="5" width="48" height="75" rx="4" fill="#FFFFFF" />
                    <!-- Center binding wire -->
                    <line x1="55" y1="5" x2="55" y2="80" stroke="var(--accent)" stroke-width="2" />
                    <!-- Ruled lines -->
                    <line x1="12" y1="20" x2="45" y2="20" stroke="#DDD4F2" />
                    <line x1="12" y1="32" x2="45" y2="32" stroke="#DDD4F2" />
                    <line x1="12" y1="44" x2="45" y2="44" stroke="#DDD4F2" />
                    <line x1="12" y1="56" x2="38" y2="56" stroke="#DDD4F2" />
                    
                    <line x1="64" y1="20" x2="97" y2="20" stroke="#DDD4F2" />
                    <line x1="64" y1="32" x2="97" y2="32" stroke="#DDD4F2" />
                    <line x1="64" y1="44" x2="97" y2="44" stroke="#DDD4F2" />
                    <!-- Bookmark Ribbon hanging out -->
                    <path d="M 55 80 L 55 96 L 60 92 L 65 96 L 65 80" fill="var(--accent)" />
                </g>

                <!-- Wooden Pencil writing -->
                <g class="doodle-stroke" transform="translate(145, 120) rotate(35)">
                    <rect x="0" y="0" width="12" height="60" rx="2" fill="#FAF2EC" stroke="#B3684B" />
                    <polygon points="0,60 12,60 6,74" fill="#FAF2EC" stroke="#B3684B" />
                    <polygon points="4,69 8,69 6,74" fill="#564D70" />
                    <!-- Eraser on top -->
                    <rect x="0" y="-8" width="12" height="8" rx="2" fill="#DDD4F2" stroke="var(--accent)" />
                </g>

                <!-- Speech thought bubble with gentle seedling -->
                <g class="doodle-stroke" transform="translate(45, 200)">
                    <path d="M 15 25 C 10 12, 25 5, 45 5 C 65 5, 80 14, 75 28 C 70 42, 50 42, 40 42 L 28 50 L 32 40 C 22 40, 18 35, 15 25 Z" fill="#FFFFFF" />
                    <path d="M 45 32 Q 45 22 48 18" stroke="var(--sage-deep)" />
                    <path d="M 48 18 Q 54 18 52 14 Q 46 16 48 18 Z" fill="#CFDFD1" stroke="var(--sage-deep)" />
                </g>

                <path d="M 180 60 Q 180 66 185 66 Q 180 66 180 72 Q 180 66 175 66 Q 180 66 180 60 Z" fill="#DDD4F2" class="doodle-stroke-accent" />
            </svg>
            <div class="doodle-glass-frame frame-ml">
                <span>📝 Thought Diary</span>
            </div>
        </div>

        <!-- ─── CLUSTER 4: MID-RIGHT (Breathing Wave, Empathy Faces & Lotus) ─── -->
        <div class="doodle-cluster doodle-cluster-mr">
            <svg class="doodle-svg" viewBox="0 0 290 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="150" cy="170" rx="90" ry="100" class="doodle-fill-blue" />
                <ellipse cx="220" cy="100" rx="55" ry="50" class="doodle-fill-lavender" />

                <!-- Paced Breathing Harmonics Wave / Spiral -->
                <g class="doodle-stroke-accent" transform="translate(60, 40)">
                    <path d="M 10 40 Q 30 10, 50 40 T 90 40 T 130 40 T 170 40" stroke-width="2.2" />
                    <path d="M 20 52 Q 40 26, 60 52 T 100 52 T 140 52" opacity="0.6" stroke-dasharray="3 3" />
                    <text x="35" y="72" font-size="9" font-family="sans-serif" font-weight="700" fill="var(--accent)" letter-spacing="1">INHALE • HOLD • EXHALE</text>
                </g>

                <!-- Two Empathetic Faces in Continuous Line Art -->
                <g class="doodle-stroke" transform="translate(40, 120)">
                    <!-- Left Profile -->
                    <path d="M 30 40 C 35 25, 50 20, 60 30 C 65 35, 62 48, 68 55 C 72 60, 65 68, 62 75 C 60 82, 65 92, 50 95 C 40 98, 30 90, 25 80" />
                    <!-- Serene closed eye & gentle smile -->
                    <path d="M 46 45 Q 50 49 54 45" />
                    <path d="M 52 65 Q 56 68 60 65" />
                    <!-- Right Profile in mutual understanding -->
                    <path d="M 110 40 C 105 25, 90 20, 80 30 C 75 35, 78 48, 72 55 C 68 60, 75 68, 78 75 C 80 82, 75 92, 90 95 C 100 98, 110 90, 115 80" stroke="var(--accent)" />
                    <path d="M 94 45 Q 90 49 86 45" stroke="var(--accent)" />
                    <path d="M 88 65 Q 84 68 80 65" stroke="var(--accent)" />
                    <!-- Supportive sparkle between their minds -->
                    <path d="M 70 35 Q 70 42 75 42 Q 70 42 70 49 Q 70 42 65 42 Q 70 42 70 35 Z" fill="#DDD4F2" class="doodle-stroke-accent" />
                </g>

                <!-- Hand-drawn 7-Petal Blooming Lotus -->
                <g class="doodle-stroke" transform="translate(90, 240)">
                    <!-- Ripple base -->
                    <ellipse cx="50" cy="50" rx="45" ry="10" stroke-dasharray="3 3" opacity="0.6" />
                    <!-- Center Petal -->
                    <path d="M 50 15 C 42 28, 44 42, 50 46 C 56 42, 58 28, 50 15 Z" fill="#FFFFFF" />
                    <!-- Inner Left & Right Petals -->
                    <path d="M 48 46 C 36 40, 28 26, 36 20 C 44 26, 46 36, 48 46 Z" fill="#ECE6F8" />
                    <path d="M 52 46 C 64 40, 72 26, 64 20 C 56 26, 54 36, 52 46 Z" fill="#ECE6F8" />
                    <!-- Outer Left & Right Petals -->
                    <path d="M 46 47 C 30 45, 18 34, 24 28 C 34 32, 40 40, 46 47 Z" fill="#DDD4F2" />
                    <path d="M 54 47 C 70 45, 82 34, 76 28 C 66 32, 60 40, 54 47 Z" fill="#DDD4F2" />
                </g>
            </svg>
            <div class="doodle-glass-frame frame-mr">
                <span>🌊 Paced Breathing</span>
            </div>
        </div>

        <!-- ─── CLUSTER 5: BOTTOM-LEFT (Zen Harmony Stones & Water Ripples) ─── -->
        <div class="doodle-cluster doodle-cluster-bl">
            <svg class="doodle-svg" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="140" cy="140" rx="85" ry="70" class="doodle-fill-sage" />

                <!-- Stacked Zen Balancing Stones -->
                <g class="doodle-stroke" transform="translate(70, 70)">
                    <!-- Base stone -->
                    <path d="M 20 85 C 20 70, 40 68, 65 68 C 90 68, 110 70, 110 85 C 110 100, 85 105, 65 105 C 45 105, 20 100, 20 85 Z" fill="#FAF9F6" />
                    <!-- Middle stone -->
                    <path d="M 32 58 C 32 46, 48 44, 65 44 C 82 44, 98 46, 98 58 C 98 70, 80 74, 65 74 C 50 74, 32 70, 32 58 Z" fill="#FAF9F6" />
                    <!-- Top stone -->
                    <path d="M 44 34 C 44 24, 54 22, 65 22 C 76 22, 86 24, 86 34 C 86 44, 74 46, 65 46 C 56 46, 44 44, 44 34 Z" fill="#FAF9F6" />
                    <!-- Wildflower branch resting on stones -->
                    <path d="M 65 22 Q 62 8 68 0" stroke="var(--sage-deep)" />
                    <circle cx="68" cy="-2" r="4" fill="#DDD4F2" stroke="var(--accent)" />
                </g>

                <!-- Water ripples around stones -->
                <ellipse cx="135" cy="165" rx="75" ry="16" class="doodle-stroke" stroke-dasharray="3 4" opacity="0.5" />
                <ellipse cx="135" cy="165" rx="95" ry="22" class="doodle-stroke" stroke-dasharray="2 5" opacity="0.35" />
            </svg>
        </div>

        <!-- ─── CLUSTER 6: BOTTOM-RIGHT (Caring Hands & Night Crescent Moon) ─── -->
        <div class="doodle-cluster doodle-cluster-br">
            <svg class="doodle-svg" viewBox="0 0 340 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="170" cy="140" rx="95" ry="75" class="doodle-fill-peach" />
                <ellipse cx="250" cy="90" rx="55" ry="45" class="doodle-fill-blue" />

                <!-- Sleeping Crescent Moon with Stars -->
                <g class="doodle-stroke" transform="translate(190, 40) rotate(-15)">
                    <path d="M 40 10 C 25 18, 18 35, 22 52 C 26 68, 42 78, 58 75 C 44 72, 34 60, 34 46 C 34 30, 45 18, 40 10 Z" fill="#FAF2EC" stroke="#B3684B" stroke-width="2" />
                    <!-- Sleeping face on moon -->
                    <path d="M 28 42 Q 31 45 34 42" stroke="#B3684B" />
                    <path d="M 29 50 Q 32 53 35 50" stroke="#B3684B" />
                </g>

                <!-- Caring Open Cupped Hands -->
                <g class="doodle-stroke" transform="translate(90, 110)">
                    <!-- Left hand palm & fingers -->
                    <path d="M 10 70 C 18 60, 24 50, 28 35 C 30 30, 36 32, 35 38 C 34 48, 30 58, 32 62 C 34 66, 40 40, 44 42 C 46 45, 42 58, 42 65 C 45 50, 52 48, 54 52 C 54 58, 50 70, 50 75 C 50 85, 30 95, 10 90 Z" fill="#F8F7F4" />
                    <!-- Right hand mirroring & cradling -->
                    <path d="M 110 70 C 102 60, 96 50, 92 35 C 90 30, 84 32, 85 38 C 86 48, 90 58, 88 62 C 86 66, 80 40, 76 42 C 74 45, 78 58, 78 65 C 75 50, 68 48, 66 52 C 66 58, 70 70, 70 75 C 70 85, 90 95, 110 90 Z" fill="#F8F7F4" />
                    <!-- Glowing droplet / seed of hope cradled in hands -->
                    <path d="M 60 52 C 54 62, 54 72, 60 76 C 66 72, 66 62, 60 52 Z" fill="#DDD4F2" class="doodle-stroke-accent" />
                </g>

                <!-- Scattered twinkle stars -->
                <path d="M 60 60 Q 60 65 65 65 Q 60 65 60 70 Q 60 65 55 65 Q 60 65 60 60 Z" fill="#DDD4F2" class="doodle-stroke-accent" />
                <path d="M 280 180 Q 280 186 286 186 Q 280 186 280 192 Q 280 186 274 186 Q 280 186 280 180 Z" fill="#FAF0EA" class="doodle-stroke" />
            </svg>
        </div>
        `;

        document.body.insertBefore(bg, document.body.firstChild);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDoodleBackground);
    } else {
        initDoodleBackground();
    }
})();
