/**
 * CBT Assistant AI — Editorial Experience & Bento Action Grid
 * Transforms the welcome screen into a world-class digital mental wellness platform.
 */

(function () {
    'use strict';

    function buildEditorialHeroHTML() {
        return `
        <div class="hero-editorial-wrap" id="welcome">
            <div class="hero-eyebrow">
                <span class="hero-eyebrow-dot"></span>
                <span>Evidence-Based Cognitive Behavioral Therapy</span>
            </div>
            
            <h1 class="hero-headline">
                Your Mind Deserves a <span class="gradient-text">Safe Space.</span>
            </h1>
            
            <p class="hero-subtext">
                A calmer space to understand your thoughts, explore your emotions, and build healthier patterns, one step at a time.
            </p>
            
            <div class="hero-greeting-pill">
                <i data-lucide="sparkles" id="welcomeIcon" style="width:16px; height:16px; color:var(--accent);"></i>
                <span id="welcomeText">Welcome back</span>
            </div>

            <!-- Bento Wellness Action Grid -->
            <div class="hero-bento-grid">
                <!-- Card 1: Thought Diary -->
                <div class="bento-card" onclick="openThoughtHistoryModal()" role="button" tabindex="0" title="Open Thought Diary">
                    <div>
                        <div class="bento-icon-wrap bento-icon-lavender">
                            <i data-lucide="notebook-pen" style="width:20px; height:20px;"></i>
                        </div>
                        <h3 class="bento-title">Thought Diary</h3>
                        <p class="bento-desc">Identify cognitive distortions and reframe negative thoughts with rational reflections.</p>
                    </div>
                    <div class="bento-action-arrow">Open Diary &rarr;</div>
                </div>

                <!-- Card 2: Mood Check-in -->
                <div class="bento-card" onclick="openModal('moodModal')" role="button" tabindex="0" title="Check in with your mood">
                    <div>
                        <div class="bento-icon-wrap bento-icon-peach">
                            <i data-lucide="smile" style="width:20px; height:20px;"></i>
                        </div>
                        <h3 class="bento-title">Mood Check-in</h3>
                        <p class="bento-desc">Log your emotional state on a 0–10 intensity scale with notes and reflections.</p>
                    </div>
                    <div class="bento-action-arrow">Check In &rarr;</div>
                </div>

                <!-- Card 3: Sleep Journal -->
                <div class="bento-card" onclick="openSleepHistoryModal()" role="button" tabindex="0" title="Log sleep patterns">
                    <div>
                        <div class="bento-icon-wrap bento-icon-blue">
                            <i data-lucide="moon" style="width:20px; height:20px;"></i>
                        </div>
                        <h3 class="bento-title">Sleep Journal</h3>
                        <p class="bento-desc">Record bedtime, rest duration, and sleep quality to build healthy circadian rhythms.</p>
                    </div>
                    <div class="bento-action-arrow">Log Sleep &rarr;</div>
                </div>

                <!-- Card 4: Self-Assessment -->
                <div class="bento-card" onclick="openModal('testsMenuModal')" role="button" tabindex="0" title="Clinical self-assessment questionnaires">
                    <div>
                        <div class="bento-icon-wrap bento-icon-sage">
                            <i data-lucide="clipboard-list" style="width:20px; height:20px;"></i>
                        </div>
                        <h3 class="bento-title">Clinical Assessments</h3>
                        <p class="bento-desc">Standardized PHQ-9 (Depression), GAD-7 (Anxiety), and Rosenberg Self-Esteem tests.</p>
                    </div>
                    <div class="bento-action-arrow">Start Test &rarr;</div>
                </div>

                <!-- Card 5: SOS Calming Portals -->
                <div class="bento-card" onclick="openModal('sosModal')" role="button" tabindex="0" title="Emergency distress relief">
                    <div>
                        <div class="bento-icon-wrap bento-icon-lavender">
                            <i data-lucide="life-buoy" style="width:20px; height:20px;"></i>
                        </div>
                        <h3 class="bento-title">SOS Portals</h3>
                        <p class="bento-desc">Guided paced breathing, 5-4-3-2-1 sensory grounding, progressive muscle relaxation & STOP.</p>
                    </div>
                    <div class="bento-action-arrow">Open Exercises &rarr;</div>
                </div>

                <!-- Card 6: Progress Dashboard -->
                <div class="bento-card" onclick="openDashboard()" role="button" tabindex="0" title="View mental health progress dashboard">
                    <div>
                        <div class="bento-icon-wrap bento-icon-blue">
                            <i data-lucide="bar-chart-2" style="width:20px; height:20px;"></i>
                        </div>
                        <h3 class="bento-title">Progress Analytics</h3>
                        <p class="bento-desc">Interactive weekly charts, mood trends, and downloadable clinical summary reports.</p>
                    </div>
                    <div class="bento-action-arrow">View Insights &rarr;</div>
                </div>
            </div>
        </div>
        `;
    }

    function renderEditorialWelcome() {
        const messages = document.getElementById('messages');
        if (!messages) return;
        
        // Remove old simple welcome if present
        const oldWelcome = document.getElementById('welcome');
        if (oldWelcome) oldWelcome.remove();

        const wrap = document.createElement('div');
        wrap.innerHTML = buildEditorialHeroHTML();
        const heroEl = wrap.firstElementChild;
        messages.prepend(heroEl);

        if (window.lucide) window.lucide.createIcons();
        if (typeof window.updateWelcomeMsg === 'function') window.updateWelcomeMsg();
    }

    // Expose globally
    window.renderEditorialWelcome = renderEditorialWelcome;

    // Wrap startNewChat to ensure the editorial welcome is restored on chat reset
    const originalStartNewChat = window.startNewChat;
    window.startNewChat = function () {
        if (typeof originalStartNewChat === 'function') {
            originalStartNewChat();
        }
        renderEditorialWelcome();
    };

    document.addEventListener('DOMContentLoaded', () => {
        // Delay slightly to let initial scripts attach
        setTimeout(() => {
            const messages = document.getElementById('messages');
            // If messages are empty or only contains simple welcome, mount the editorial hero
            if (messages && (!messages.children.length || document.getElementById('welcome'))) {
                renderEditorialWelcome();
            }
        }, 50);
    });
})();
