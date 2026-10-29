const UI_TRANSLATIONS_COMMON = {
        document_title: 'CBT Assistant',
        app_title: 'CBT Assistant',
        new_chat: 'New Chat',
        restart_chat: 'Restart Chat',
        sos_button: 'SOS',
        sidebar_thoughts: 'Thought Diary',
        sidebar_sleep: 'Sleep Journal',
        sidebar_assessment: 'Self-Assessment',
        sidebar_calendar: 'Records Calendar',
        sidebar_dashboard: 'Progress Dashboard',
        sidebar_articles: 'Article Library',
        sidebar_videos: 'Video Library',
        sidebar_reminders: 'Reminders',
        sidebar_settings: 'Settings',
        sidebar_download: 'Download Summary',
        tts_title: 'Assistant voice',
        mic_title: 'Voice input',
        status_connecting: 'Connecting...',
        status_offline: 'Ollama offline',
        status_backend_down: 'Backend unavailable',
        input_placeholder: 'How can I help you today?',
        input_placeholder_idle: 'Ask a question...',
        input_placeholder_listening: 'Listening...',
        input_placeholder_mic_denied: 'Microphone access was denied',
        input_placeholder_mic_error: 'Could not start voice input',
        input_placeholder_mic_unsupported: 'Voice input is not supported in this browser',
        assistant_disclaimer: 'The assistant may be mistaken. In an acute state, contact a professional.',
        welcome_morning: 'Good morning',
        welcome_day: 'Good afternoon',
        welcome_evening: 'Good evening',
        welcome_night: 'Good night',
        assessment_title: 'Self-Assessment',
        assessment_phq_title: 'Depression (PHQ-9)',
        assessment_phq_desc: 'Screening for depressive symptoms and lowered mood severity',
        assessment_gad_title: 'Anxiety (GAD-7)',
        assessment_gad_desc: 'Assessment of general anxiety and worry level',
        assessment_esteem_title: 'Self-Esteem (Rosenberg)',
        assessment_esteem_desc: 'Assessment of self-attitude, self-respect, and inner support',
        mood_modal_title: 'Mood',
        mood_log_button: 'Save mood',
        thought_modal_title: 'Thoughts and Actions',
        thought_tab_diary: 'Thought Diary',
        thought_tab_gratitude: 'Gratitude',
        thought_tab_rhythm: 'Daily Rhythm',
        thought_modal_hint: 'Write down the situation, the thought, and a gentler response to it.',
        thought_label_situation: 'Situation (What happened?)',
        thought_label_thought: 'Automatic thought (What went through your mind?)',
        thought_label_emotion: 'Emotion',
        thought_placeholder_emotion: 'For example: anxiety',
        thought_label_intensity: 'Intensity (0-10)',
        thought_label_distortion: 'Cognitive distortion',
        distortion_catastrophizing: 'Catastrophizing',
        distortion_mind_reading: 'Mind reading',
        distortion_fortune_telling: 'Fortune telling',
        distortion_overgeneralization: 'Overgeneralization',
        distortion_black_white: 'Black-and-white thinking',
        distortion_discounting_positive: 'Discounting the positive',
        distortion_personalization: 'Personalization',
        distortion_unsure: 'Not sure',
        thought_label_response: 'Balanced response',
        gratitude_prompt: 'Write down 3 things you feel grateful for today, big or small.',
        gratitude_label: 'What am I grateful for?',
        gratitude_placeholder: '1. \n2. \n3. ',
        thought_save: 'Save thought',
        rhythm_mood_after: 'How do you feel after it?',
        skip: 'Skip',
        phq_modal_title: 'PHQ-9 - Depression Screen',
        phq_modal_desc: 'Over the past two weeks, how often have you been bothered by the following problems?',
        gad_modal_title: 'GAD-7 - Anxiety Screen',
        gad_modal_desc: 'Over the past two weeks, how often have you been bothered by the following problems?',
        esteem_modal_title: 'Self-Esteem - Rosenberg Scale',
        esteem_modal_desc: 'How strongly do you agree with the following statements about yourself?',
        get_result: 'Get result',
        assessment_dashboard_title: 'Self-Assessment (PHQ-9 / GAD-7 / Rosenberg)',
        calendar_legend_thoughts: 'Thoughts',
        calendar_legend_mood: 'Mood',
        calendar_legend_sleep: 'Sleep',
        calendar_legend_activities: 'Activities',
        calendar_legend_assessment: 'Assessment',
        calendar_pick_day: 'Pick a day',
        dashboard_title: 'Progress Dashboard',
        dashboard_insights: 'Insights',
        refresh: 'refresh',
        loading: 'Loading…',
        dashboard_mood_14: 'Mood over the last 14 days',
        dashboard_sleep_7: 'Sleep quality (7 days)',
        history_title: 'Thought Diary',
        new_entry: 'New entry',
        sleep_history_title: 'Sleep Journal',
        sleep_add_title: 'Add sleep entry',
        sleep_bedtime: 'Went to bed',
        sleep_wake: 'Woke up',
        sleep_awake_count: 'How many times did you wake up at night',
        sleep_quality: 'Sleep quality (0 = awful, 10 = excellent)',
        sleep_notes: 'Notes (dreams, reasons for poor sleep)',
        sleep_notes_placeholder: 'What might have affected your sleep?',
        save_entry: 'Save entry',
        sos_title: 'Emergency Help (SOS)',
        sos_tab_breathing: 'Breathing',
        sos_tab_grounding: 'Grounding',
        sos_tab_muscles: 'Muscles',
        sos_tab_stop: 'STOP',
        start_exercise: 'Start exercise',
        settings_title: 'Settings',
        language_title: 'Language',
        language_en: 'English',
        ollama_model_title: 'Ollama model',
        ollama_model_label: 'Chat model',
        ollama_model_loading: 'Loading models…',
        ollama_model_empty: 'No installed models found on the Ollama server',
        ollama_model_embedding_only: 'embeddings only',
        ollama_model_unavailable: 'The current model is unavailable on the server',
        ollama_model_load_error: 'Could not load models from the Ollama server',
        ollama_model_save_error: 'Could not switch the model',
        ollama_model_saved: 'Selected model: {model}',
        tts_settings_title: 'Microsoft TTS',
        tts_voice_en_label: 'Voice',
        tts_preview: 'Preview',
        reminders_title: 'Reminders',
        reminders_desc: 'Browser notifications can remind you to log your mood or do a practice. Keep this page open in your browser.',
        reminders_morning: 'Morning',
        reminders_evening: 'Evening',
        save: 'Save',
        article_library_title: 'Article Library',
        article_library_subtitle: 'A curated collection about depression, CBT, and evidence-based self-help.',
        video_library_title: 'Video Library',
        video_library_subtitle: 'Selected materials from specialists on depression, anxiety, and useful practices.',
        back_to_list: 'Back to list',
        download_title: 'Download Summary',
        download_desc: 'Choose an export format',
        download_pdf_desc: 'Styled report\nwith charts',
        download_txt_desc: 'Plain text file\nwith all data',
        skip_arrow: 'Skip →',
        done_arrow: 'Done →',
        breathe_phase: 'Breathing',
        cycle_one: 'Cycle 1',
        follow_circle: 'Follow the circle',
        sos_sound_on: 'Turn ambient sound on',
        sos_sound_off: 'Turn ambient sound off'
};


const UI_TRANSLATIONS = {
    ru: UI_TRANSLATIONS_COMMON,
    en: UI_TRANSLATIONS_COMMON
};

function getCurrentLanguage() {
    return localStorage.getItem('APP_LANG') || 'en';
}
window.getCurrentLanguage = getCurrentLanguage;

function getCurrentLocale() {
    return 'en-US';
}
window.getCurrentLocale = getCurrentLocale;

function escapeInlineJsString(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
window.escapeInlineJsString = escapeInlineJsString;

function t(key) {
    const lang = getCurrentLanguage();
    return (UI_TRANSLATIONS[lang] && UI_TRANSLATIONS[lang][key]) || UI_TRANSLATIONS.ru[key] || key;
}
window.t = t;

function updateLanguageButtons() {
    document.getElementById('settingsLangEn')?.classList.add('active');
}

const TTS_VOICE_OPTIONS = {
    en: [
        { value: 'en-US-JennyNeural', label: 'Jenny (Female)' },
        { value: 'en-US-GuyNeural', label: 'Guy (Male)' },
        { value: 'en-US-AriaNeural', label: 'Aria (Female)' }
    ]
};

function getTtsSettings() {
    const raw = JSON.parse(localStorage.getItem('ttsSettings') || '{}');
    return {
        enVoice: raw.enVoice || 'en-US-JennyNeural'
    };
}

function getPreferredTtsVoice(language) {
    const settings = getTtsSettings();
    return settings.enVoice || 'en-US-JennyNeural';
}

function populateTtsVoiceControls() {
    const settings = getTtsSettings();
    const select = document.getElementById('ttsVoiceEn');
    if (!select) return;
    select.innerHTML = (TTS_VOICE_OPTIONS.en || [])
        .map(function (voice) {
            return '<option value="' + voice.value + '"' + (voice.value === settings.enVoice ? ' selected' : '') + '>' + voice.label + '</option>';
        })
        .join('');
}
window.populateTtsVoiceControls = populateTtsVoiceControls;

const QUICK_SUGGESTIONS_COMMON = [
        {
            id: 'ddMood',
            icon: 'smile-plus',
            label: 'Mood',
            items: [
                { type: 'mood', score: 10, icon: 'laugh', label: 'Excellent (10)' },
                { type: 'mood', score: 8, icon: 'smile', label: 'Good (8)' },
                { type: 'mood', score: 5, icon: 'meh', label: 'Okay (5)' },
                { type: 'mood', score: 3, icon: 'annoyed', label: 'Bad (3)' },
                { type: 'mood', score: 1, icon: 'frown', label: 'Awful (1)' }
            ]
        },
        {
            id: 'ddSad',
            icon: 'frown',
            label: 'Sadness',
            items: [
                { text: 'I feel lonely and low', label: 'I feel lonely and low' },
                { text: 'I feel hopeless', label: 'I feel hopeless' },
                { text: 'I want to cry for no clear reason', label: 'I want to cry for no clear reason' },
                { text: 'Everything feels meaningless', label: 'Everything feels meaningless' },
                { text: 'I feel stuck', label: 'I feel stuck' }
            ]
        },
        {
            id: 'ddAnxious',
            icon: 'wind',
            label: 'Anxiety',
            items: [
                { text: 'I feel like something bad is about to happen', label: 'Something bad feels close' },
                { text: 'I cannot stop worrying', label: 'I cannot stop worrying' },
                { text: 'I have physical panic symptoms', label: 'Physical panic symptoms' },
                { text: 'I feel afraid of an upcoming event', label: 'Fear of an upcoming event' },
                { text: 'My mind is racing and I cannot focus', label: 'Too many thoughts to focus' }
            ]
        },
        {
            id: 'ddAngry',
            icon: 'flame',
            label: 'Anger',
            items: [
                { text: 'Everything irritates me right now', label: 'Everything irritates me' },
                { text: 'I am angry at a specific person', label: 'I am angry at someone' },
                { text: 'I cannot hold back my aggression', label: 'I cannot hold back my aggression' },
                { text: 'Something feels unfair', label: 'Something feels unfair' },
                { text: 'It is hard to understand my emotions', label: 'I cannot sort out my emotions' }
            ]
        },
        {
            id: 'ddTired',
            icon: 'battery-low',
            label: 'Fatigue',
            items: [
                { text: 'I have no energy even for simple tasks', label: 'No energy at all' },
                { text: 'I feel emotionally burned out', label: 'Emotional burnout' },
                { text: 'I keep procrastinating and cannot start', label: 'I keep procrastinating' },
                { text: 'I sleep badly and never feel rested', label: 'I sleep badly' },
                { text: 'I do not know what decision to make', label: 'I cannot decide what to do' }
            ]
        },
        {
            id: 'ddCalm',
            icon: 'sun',
            label: 'Calm',
            items: [
                { text: 'Today feels like a really good day', label: 'Today is a good day' },
                { text: 'I managed to handle a difficult task', label: 'I handled a difficult task' },
                { text: 'I want to reinforce this good state', label: 'I want to reinforce this state' },
                { text: 'I feel grateful for what I have right now', label: 'I feel grateful' }
            ]
        }
];

const QUICK_SUGGESTIONS = {
    ru: QUICK_SUGGESTIONS_COMMON,
    en: QUICK_SUGGESTIONS_COMMON
};
function renderQuickSuggestions() {
    const wrap = document.getElementById('quickSuggestions');
    if (!wrap) return;
    const lang = getCurrentLanguage();
    const groups = QUICK_SUGGESTIONS[lang] || QUICK_SUGGESTIONS.ru;
    wrap.innerHTML = groups.map((group) => {
        const items = group.items.map((item) => {
            if (item.type === 'mood') {
                return `<button class="suggest-item" onclick="logMoodFromWelcome(${item.score}); toggleSuggestMenu('${group.id}')"><i data-lucide="${item.icon}" style="width:14px; vertical-align:middle; margin-right:6px;"></i>${item.label}</button>`;
            }
            return `<button class="suggest-item" onclick="sendQuick('${escapeInlineJsString(item.text)}'); toggleSuggestMenu('${group.id}')">${item.label}</button>`;
        }).join('');
        return `
            <div class="suggest-dropdown" id="${group.id}">
                <button class="suggest-btn" onclick="toggleSuggestMenu('${group.id}')"><i data-lucide="${group.icon}" style="width:14px;color:var(--gray)"></i> ${group.label}</button>
                <div class="suggest-menu">${items}</div>
            </div>
        `;
    }).join('');
    if (window.lucide) lucide.createIcons();
}

function localizeStaticUi() {
    document.title = t('document_title');
    renderQuickSuggestions();
    refreshLocalizedExercises();
    if (document.getElementById('articleModal')?.style.display === 'flex') {
        if (document.getElementById('articleReaderContainer')?.style.display === 'block' && typeof window._articleReaderIndex === 'number') {
            openArticleReader(window._articleReaderIndex);
        } else {
            renderArticleList();
        }
    }
    if (document.getElementById('videoModal')?.style.display === 'flex' && document.getElementById('videoListContainer')?.style.display !== 'none') {
        renderVideoList();
    }
}

function applyTranslations() {
    document.documentElement.lang = getCurrentLanguage();
    localizeStaticUi();
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        el.setAttribute('title', t(el.dataset.i18nTitle));
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
        el.innerHTML = t(el.dataset.i18nHtml).replace(/\n/g, '<br>');
    });
    updateLanguageButtons();
    if (rec) rec.lang = 'en-US';
    updateWelcomeMsg();
    if (typeof window.refreshLocalizedTests === 'function') window.refreshLocalizedTests();
    if (typeof window.refreshLocalizedCBT === 'function') window.refreshLocalizedCBT();
    if (typeof checkH === 'function') checkH();
}
window.applyTranslations = applyTranslations;

function setLanguage(lang) {
    localStorage.setItem('APP_LANG', lang);
    applyTranslations();
}
window.setLanguage = setLanguage;

function updateWelcomeMsg() {
    let h = new Date().getHours();
    let msg = t('welcome_day');
    if (h >= 5 && h < 12) { msg = t('welcome_morning'); }
    else if (h >= 18 && h < 23) { msg = t('welcome_evening'); }
    else if (h >= 23 || h < 5) { msg = t('welcome_night'); }

    let welText = document.getElementById('welcomeText');
    if (welText) welText.innerText = msg;
}

async function checkH() {
    try {
        let r = await fetch(API + '/api/health').then(r => r.json());
        let d = document.getElementById('dotStatus');
        let statusEl = document.getElementById('txtStatus');
        const isOnline = Boolean(r.status === 'ok' || r.gateway_connected || r.ollama_connected);
        if (isOnline) {
            if (d) d.className = 'status-dot online';
            if (statusEl) {
                statusEl.removeAttribute('data-i18n');
                statusEl.innerText = r.model || 'qwen-7b';
            }
        } else {
            if (d) d.className = 'status-dot';
            if (statusEl) {
                statusEl.removeAttribute('data-i18n');
                statusEl.innerText = t('status_offline');
            }
        }
    } catch (e) {
        let d = document.getElementById('dotStatus');
        let statusEl = document.getElementById('txtStatus');
        if (d) d.className = 'status-dot';
        if (statusEl) {
            statusEl.removeAttribute('data-i18n');
            statusEl.innerText = t('status_backend_down');
        }
    }
}
window.checkH = checkH;

function toggleSuggestMenu(id) {
    document.querySelectorAll('.suggest-dropdown.open').forEach(el => {
        if (el.id !== id) el.classList.remove('open');
    });
    let el = document.getElementById(id);
    if (el) el.classList.toggle('open');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.suggest-dropdown')) {
        document.querySelectorAll('.suggest-dropdown.open').forEach(el => el.classList.remove('open'));
    }
});

function openModal(id) {
    document.getElementById(id).style.display = 'flex';
    if (id === 'thoughtModal' && typeof window.renderActivities === 'function') {
        window.renderActivities();
    }
    if (window.lucide) lucide.createIcons();
    if (id === 'sosModal') { loadSosPlan(); if (window.switchSos) switchSos(0); }
}
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    if (id === 'sosModal') stopBreathing();
    if (id === 'thoughtModal' && typeof window.resetThoughtEditor === 'function') window.resetThoughtEditor();
    if (id === 'sleepModal' && typeof window.resetSleepEditor === 'function') window.resetSleepEditor();
}

let rec = null;
let isRec = false;
let micPrefix = '';
let micFinalText = '';
let micRestartTimer = null;
let micRecognitionError = null;

function setMicUi(active, placeholderKey) {
    const btn = document.getElementById('micBtn');
    const input = document.getElementById('msgInput');
    if (btn) {
        btn.style.color = active ? 'var(--accent)' : '';
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.innerHTML = '<i data-lucide="' + (active ? 'square' : 'mic') + '" style="width:18px;"></i>';
    }
    if (input && placeholderKey) input.placeholder = t(placeholderKey);
    if (window.lucide) lucide.createIcons();
}

function stopMicRecognition(placeholderKey = 'input_placeholder_idle') {
    isRec = false;
    if (micRestartTimer) clearTimeout(micRestartTimer);
    micRestartTimer = null;
    setMicUi(false, placeholderKey);
    if (rec) {
        try { rec.stop(); } catch (error) { /* Recognition is already stopped. */ }
    }
}
window.stopMicInput = stopMicRecognition;

const isSafariSpeech = /Safari/i.test(navigator.userAgent) && !/Chrome|CriOS|Edg/i.test(navigator.userAgent);

if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    rec = new SR();
    // Safari may start the microphone with continuous=true but never emit
    // result events. One-shot recognition still emits the transcript; onend
    // below restarts it while the user keeps the button active.
    rec.continuous = !isSafariSpeech;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
        micRecognitionError = null;
        setMicUi(true, 'input_placeholder_listening');
    };

    rec.onresult = (e) => {
        let finalText = '';
        let interimText = '';
        for (let i = 0; i < e.results.length; i++) {
            const transcript = e.results[i][0].transcript.trim();
            if (e.results[i].isFinal) finalText += (finalText ? ' ' : '') + transcript;
            else interimText += (interimText ? ' ' : '') + transcript;
        }
        micFinalText = finalText;
        const input = document.getElementById('msgInput');
        if (!input) return;
        input.value = [micPrefix, micFinalText, interimText].filter(Boolean).join(' ');
        input.dispatchEvent(new Event('input'));
    };

    rec.onerror = (event) => {
        micRecognitionError = event.error || 'unknown';
        if (!isRec && micRecognitionError === 'aborted') return;
        const permissionDenied = micRecognitionError === 'not-allowed' || micRecognitionError === 'service-not-allowed';
        stopMicRecognition(permissionDenied ? 'input_placeholder_mic_denied' : 'input_placeholder_mic_error');
    };

    rec.onend = () => {
        if (!isRec || micRecognitionError) return;
        micRestartTimer = setTimeout(() => {
            if (!isRec) return;
            try { rec.start(); }
            catch (error) { stopMicRecognition('input_placeholder_mic_error'); }
        }, 250);
    };
}

async function toggleMic() {
    if (!rec) {
        setMicUi(false, 'input_placeholder_mic_unsupported');
        return;
    }
    if (isRec) {
        stopMicRecognition();
        return;
    }

    const input = document.getElementById('msgInput');
    micPrefix = input ? input.value.trim() : '';
    micFinalText = '';
    micRecognitionError = null;
    isRec = true;
    setMicUi(true, 'input_placeholder_listening');

    try {
        rec.lang = 'en-US';

        // WebKit requires SpeechRecognition.start() to stay inside the
        // original click gesture. Awaiting getUserMedia first makes Safari
        // open the microphone but silently drop all recognition results.
        if (isSafariSpeech) {
            rec.start();
            return;
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });
            stream.getTracks().forEach(track => track.stop());
        }
        if (!isRec) return;
        rec.start();
    } catch (error) {
        const denied = error && (error.name === 'NotAllowedError' || error.name === 'SecurityError');
        stopMicRecognition(denied ? 'input_placeholder_mic_denied' : 'input_placeholder_mic_error');
    }
}
window.toggleMic = toggleMic;

let ttsEnabled = false;
let ttsAudio = null;
let ttsRequestController = null;

function stopTTSPlayback() {
    if (ttsRequestController) {
        ttsRequestController.abort();
        ttsRequestController = null;
    }
    if (ttsAudio) {
        ttsAudio.pause();
        if (ttsAudio.dataset.objectUrl) {
            URL.revokeObjectURL(ttsAudio.dataset.objectUrl);
        }
        ttsAudio = null;
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}
window.stopTTSPlayback = stopTTSPlayback;

function speakWithBrowserTts(text, language) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    const languagePrefix = utterance.lang.slice(0, 2).toLowerCase();
    const voice = window.speechSynthesis.getVoices().find(function (candidate) {
        return (candidate.lang || '').toLowerCase().startsWith(languagePrefix);
    });
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
    return true;
}

async function playRemoteTts(text, language, voice) {
    stopTTSPlayback();
    const controller = new AbortController();
    ttsRequestController = controller;

    try {
        const res = await fetch(API + '/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language, voice }),
            signal: controller.signal
        });
        if (!res.ok) {
            const detail = await res.text();
            throw new Error('TTS request failed (' + res.status + '): ' + detail);
        }

        const blob = await res.blob();
        if (controller.signal.aborted) return;
        if (!blob.size) throw new Error('TTS returned empty audio');

        const objectUrl = URL.createObjectURL(blob);
        const audio = new Audio(objectUrl);
        audio.dataset.objectUrl = objectUrl;
        const release = () => {
            URL.revokeObjectURL(objectUrl);
            if (ttsAudio === audio) ttsAudio = null;
        };
        audio.onended = release;
        audio.onerror = release;
        ttsAudio = audio;
        try {
            await audio.play();
        } catch (error) {
            release();
            throw error;
        }
    } finally {
        if (ttsRequestController === controller) ttsRequestController = null;
    }
}

function sanitizeTextForSpeech(text) {
    return (text || '')
        .replace(/(?:^|\n)\s*(?:Retrieved evidence)\s*:\s*(?:\[KB:[^\]]+\](?:\s*,\s*)?)+\s*$/gmi, ' ')
        .replace(/\[KB:[^\]]+\]/gi, ' ')
        .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/gi, '$1')
        .replace(/https?:\/\/\S+/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[*_`#]+/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s+([.,!?;:])/g, '$1')
        .trim();
}
window.sanitizeTextForSpeech = sanitizeTextForSpeech;

async function playAssistantSpeech(text, language) {
    const lang = language || getCurrentLanguage();
    const cleanText = sanitizeTextForSpeech(text).slice(0, 1000);

    if (!cleanText) return;

    // Never let speech recognition transcribe the assistant's own voice.
    // The recognition service owns the microphone stream, so browser echo
    // cancellation constraints cannot reliably protect this interval.
    if (isRec) stopMicRecognition();

    try {
        await playRemoteTts(cleanText, lang, getPreferredTtsVoice(lang));
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Microsoft TTS playback failed', err);
            speakWithBrowserTts(cleanText, lang);
        }
    }
}
window.playAssistantSpeech = playAssistantSpeech;

async function previewTtsVoice(language = 'en') {
    const text = 'This is how the selected Microsoft voice sounds.';
    const select = document.getElementById('ttsVoiceEn');
    const voice = select ? select.value : getPreferredTtsVoice('en');
    try {
        await playRemoteTts(text, 'en', voice);
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Microsoft TTS preview failed', err);
            speakWithBrowserTts(text, 'en');
        }
    }
}
window.previewTtsVoice = previewTtsVoice;

function toggleTTS() {
    ttsEnabled = !ttsEnabled;
    let btn = document.getElementById('ttsBtn');
    if (ttsEnabled) {
        if (isRec) stopMicRecognition();
        btn.style.color = 'var(--accent)';
        btn.setAttribute('aria-pressed', 'true');
        btn.innerHTML = '<i data-lucide="volume-2" style="width:18px;"></i>';
        speakWithBrowserTts('Voice enabled', 'en');
    } else {
        btn.style.color = '';
        btn.setAttribute('aria-pressed', 'false');
        btn.innerHTML = '<i data-lucide="volume-x" style="width:18px;"></i>';
        stopTTSPlayback();
    }
    lucide.createIcons();
}

function getLocalizedUiContent() {
    const commonContent = {
            sosHints: [
                '',
                '',
                '',
                ''
            ],
            breathingPane: {
                title: 'Breathing practices',
                desc: 'Choose the breathing rhythm that best matches you.'
            },
            breatheTypes: [
                {
                    desc: 'Helps slow your pulse and interrupt panic.',
                    bgImage: 'img/bg/forest.png',
                    cardTitle: 'Box 4-4-4-4',
                    cardDesc: 'Slows the pulse and interrupts panic',
                    steps: [
                        { text: 'Inhale...', dur: 4000, scale: '1.5', bg: 'var(--accent-light)', color: 'var(--accent)' },
                        { text: 'Hold', dur: 4000, scale: '1.5', bg: 'var(--accent-light)', color: 'var(--accent)' },
                        { text: 'Exhale...', dur: 4000, scale: '1', bg: 'var(--border)', color: 'var(--text)' },
                        { text: 'Hold', dur: 4000, scale: '1', bg: 'var(--border)', color: 'var(--text)' }
                    ]
                },
                {
                    desc: 'A technique for lowering anxiety and falling asleep faster.',
                    bgImage: 'img/bg/stars.png',
                    cardTitle: '4-7-8',
                    cardDesc: 'Reduces anxiety and helps you fall asleep',
                    steps: [
                        { text: 'Inhale...', dur: 4000, scale: '1.5', bg: 'var(--accent-light)', color: 'var(--accent)' },
                        { text: 'Hold...', dur: 7000, scale: '1.5', bg: 'var(--accent-light)', color: 'var(--accent)' },
                        { text: 'Exhale...', dur: 8000, scale: '1', bg: 'var(--border)', color: 'var(--text)' }
                    ]
                },
                {
                    desc: 'A longer exhale activates the parasympathetic nervous system.',
                    bgImage: 'img/bg/ocean.png',
                    cardTitle: 'Soothing 4-6',
                    cardDesc: 'Activates the parasympathetic system',
                    steps: [
                        { text: 'Inhale...', dur: 4000, scale: '1.5', bg: 'var(--accent-light)', color: 'var(--accent)' },
                        { text: 'Exhale...', dur: 6000, scale: '1', bg: 'var(--border)', color: 'var(--text)' }
                    ]
                }
            ],
            breatheTips: [
                'Breathe through your nose for the strongest effect',
                'Focus on what you feel in your body',
                'Imagine tension leaving with every exhale',
                'Close your eyes if that helps you relax',
                'Each cycle helps lower stress hormones',
                'No need to rush, this pace is enough',
                'Slow breathing activates the vagus nerve',
                'You are doing something important for your health'
            ],
            groundingPane: {
                title: 'Grounding 5-4-3-2-1',
                desc: 'A technique to ground you in the present during anxiety or panic.',
                items: ['Things you can see', 'Objects you can touch', 'Sounds you can hear', 'Scents you can notice', 'One good thing about yourself']
            },
            pmrPane: {
                title: 'Progressive Muscle Relaxation',
                desc: 'Tense and release muscles to ease tension and anxiety.',
                items: ['Face - tense and release', 'Shoulders and neck', 'Arms and hands', 'Stomach and chest', 'Legs and feet']
            },
            stopPane: {
                title: 'STOP Technique',
                desc: 'A fast 4-step method that interrupts the spiral of anxious thoughts.',
                items: ['Stop - pause', 'Take a breath - breathe deeply', 'Observe - notice without judging', 'Proceed - act with intention']
            },
            groundSteps: [
                { num: '5', sense: 'Sight', text: 'Name 5 things you can see around you' },
                { num: '4', sense: 'Touch', text: 'Touch 4 objects near you' },
                { num: '3', sense: 'Hearing', text: 'Notice 3 sounds right now' },
                { num: '2', sense: 'Smell', text: 'Notice 2 smells or remember them' },
                { num: '1', sense: 'You', text: 'Name 1 good thing about yourself' }
            ],
            groundDone: { sense: 'Done', text: 'You are back in the here and now. Well done.', button: 'Close' },
            pmrSteps: [
                { num: '1', muscle: 'Face', tenseText: 'Tense your face: squeeze your eyes shut, frown, clench your jaw', relaxText: 'Slowly relax all the muscles in your face and notice the warmth' },
                { num: '2', muscle: 'Shoulders and neck', tenseText: 'Lift your shoulders to your ears and tense your neck', relaxText: 'Drop your shoulders and feel the tension leave' },
                { num: '3', muscle: 'Arms and hands', tenseText: 'Clench your fists and tense your forearms', relaxText: 'Unclench your fists and open your fingers' },
                { num: '4', muscle: 'Stomach and chest', tenseText: 'Tense your abdomen and chest as if bracing for impact', relaxText: 'Relax your stomach and breathe freely' },
                { num: '5', muscle: 'Legs and feet', tenseText: 'Stretch your legs and tense your thighs and calves', relaxText: 'Relax your legs and notice heaviness and warmth' }
            ],
            pmrPhaseTense: 'Tense',
            pmrPhaseRelax: 'Release',
            pmrDone: 'Done',
            pmrDoneText: 'Your whole body is more relaxed now. Well done.',
            pmrClose: 'Close',
            stopSteps: [
                { letter: 'S', word: 'Stop', text: 'Tell yourself “Stop,” silently or out loud. Interrupt the stream of thoughts.' },
                { letter: 'T', word: 'Take a breath', text: 'Take a deep breath in through the nose for 4 counts, then exhale through the mouth for 6.' },
                { letter: 'O', word: 'Observe', text: 'Notice your thoughts and sensations from a small distance, without judging them.' },
                { letter: 'P', word: 'Proceed', text: 'Now act intentionally. What matters most right now?' }
            ],
            stopDone: { word: 'Done', text: 'You have regained control. Move forward with intention.', button: 'Close' },
            notifications: {
                title: 'CBT Assistant',
                morning: '🌅 Good morning. How are you feeling? Log your mood.',
                evening: '🌙 Good evening. It may be a good time to record gratitude or thoughts from the day.'
            },
            aiBreathingStarted: '🌬️ I started a breathing practice for you. Follow the instructions on the screen.'
    };
    return commonContent;
}

sosHints = window.sosHints || [];
let BREATHE_TYPES = [];
let BREATHE_TIPS = [];
let GROUND_STEPS = [];
let PMR_STEPS = [];
let STOP_STEPS = [];

function refreshLocalizedExercises() {
    const content = getLocalizedUiContent();
    if (!content) return;
    sosHints = content.sosHints.slice();
    BREATHE_TYPES = content.breatheTypes.map((item) => ({ ...item, steps: item.steps.map((step) => ({ ...step })) }));
    BREATHE_TIPS = content.breatheTips.slice();
    GROUND_STEPS = content.groundSteps.map((step) => ({ ...step }));
    PMR_STEPS = content.pmrSteps.map((step) => ({ ...step }));
    STOP_STEPS = content.stopSteps.map((step) => ({ ...step }));

    const sosHint = document.getElementById('sosHint');
    if (sosHint && document.getElementById('sosPane0')?.style.display !== 'none') {
        sosHint.textContent = sosHints[0] || '';
    }

    const breatheButtons = document.querySelectorAll('#breatheTypes .breathe-option');
    BREATHE_TYPES.forEach((type, idx) => {
        const btn = breatheButtons[idx];
        if (!btn) return;
        const icon = btn.querySelector('span');
        const contentWrap = btn.querySelectorAll('span')[1];
        if (contentWrap) {
            contentWrap.innerHTML = `${type.cardTitle}<br><span style="font-weight:400; font-size:11px;">${type.cardDesc}</span>`;
        }
    });

    const ids = [
        ['breathePaneTitle', content.breathingPane.title],
        ['breathePaneDesc', content.breathingPane.desc],
        ['groundPaneTitle', content.groundingPane.title],
        ['groundPaneDesc', content.groundingPane.desc],
        ['pmrPaneTitle', content.pmrPane.title],
        ['pmrPaneDesc', content.pmrPane.desc],
        ['stopPaneTitle', content.stopPane.title],
        ['stopPaneDesc', content.stopPane.desc],
        ['groundSense', GROUND_STEPS[groundStepIdx]?.sense || GROUND_STEPS[0]?.sense || ''],
        ['groundInstruction', GROUND_STEPS[groundStepIdx]?.text || GROUND_STEPS[0]?.text || ''],
        ['pmrMuscle', PMR_STEPS[pmrStepIdx]?.muscle || PMR_STEPS[0]?.muscle || ''],
        ['pmrPhase', pmrPhaseIsTense ? content.pmrPhaseTense : content.pmrPhaseRelax],
        ['pmrInstruction', pmrPhaseIsTense
            ? (PMR_STEPS[pmrStepIdx]?.tenseText || PMR_STEPS[0]?.tenseText || '')
            : (PMR_STEPS[pmrStepIdx]?.relaxText || PMR_STEPS[0]?.relaxText || '')],
        ['stopWord', STOP_STEPS[stopStepIdx]?.word || STOP_STEPS[0]?.word || ''],
        ['stopInstruction', STOP_STEPS[stopStepIdx]?.text || STOP_STEPS[0]?.text || '']
    ];
    ids.forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el && value) el.textContent = value;
    });

    content.groundingPane.items.forEach((text, idx) => {
        const el = document.getElementById(`groundPaneItem${idx}`);
        if (el) el.textContent = text;
    });
    content.pmrPane.items.forEach((text, idx) => {
        const el = document.getElementById(`pmrPaneItem${idx}`);
        if (el) el.textContent = text;
    });
    content.stopPane.items.forEach((text, idx) => {
        const el = document.getElementById(`stopPaneItem${idx}`);
        if (el) el.textContent = text;
    });
    STOP_STEPS.forEach((step, idx) => {
        const el = document.getElementById(`stopPaneLetter${idx}`);
        if (el) el.textContent = step.letter;
    });
}

/* === SOS ambient sound === */
const SOS_AUDIO_TRACKS = Object.freeze({
    breathing: 'audio/sos/breathing-soft-air.mp3',
    grounding: 'audio/sos/grounding-open-field.mp3',
    pmr: 'audio/sos/muscle-relaxation-sea.mp3',
    stop: 'audio/sos/stop-night-forest.mp3'
});
const SOS_DEFAULT_SCENES = Object.freeze({
    breathing: 'air',
    grounding: 'field',
    pmr: 'sea',
    stop: 'night_forest'
});
const SOS_SCENES = Object.freeze({
    air: {
        image: 'img/bg/forest.png',
        audio: SOS_AUDIO_TRACKS.breathing,
        label: { ru: 'Air', en: 'Air' }
    },
    field: {
        image: 'img/bg/sos-grounding-field.png',
        audio: SOS_AUDIO_TRACKS.grounding,
        label: { ru: 'Field', en: 'Field' }
    },
    sea: {
        image: 'img/bg/sos-muscle-relaxation-sea.png',
        audio: SOS_AUDIO_TRACKS.pmr,
        label: { ru: 'Sea', en: 'Sea' }
    },
    night_forest: {
        image: 'img/bg/stars.png',
        audio: SOS_AUDIO_TRACKS.stop,
        label: { ru: 'Night forest', en: 'Night forest' }
    }
});
const SOS_AUDIO_VOLUME = 0.28;
let sosAmbientAudio = null;
let sosAmbientTechnique = null;
let sosAmbientScene = null;
let sosAmbientRunId = 0;
let sosAmbientEnabled = localStorage.getItem('sosAmbientSound') !== 'off';
let sosPortalTimerId = null;
let sosPortalTechnique = null;

function updateSosSoundButtons() {
    const label = t(sosAmbientEnabled ? 'sos_sound_off' : 'sos_sound_on');
    document.querySelectorAll('[data-sos-audio-toggle]').forEach(function (button) {
        button.dataset.enabled = sosAmbientEnabled ? 'true' : 'false';
        button.setAttribute('aria-pressed', sosAmbientEnabled ? 'true' : 'false');
        button.setAttribute('aria-label', label);
        button.title = label;
    });
}

function fadeSosAudio(audio, targetVolume, duration, onComplete) {
    if (!audio) return;
    if (audio._sosFadeFrame) cancelAnimationFrame(audio._sosFadeFrame);
    const startVolume = audio.volume;
    const startedAt = performance.now();

    function step(now) {
        const progress = Math.min(1, (now - startedAt) / duration);
        audio.volume = startVolume + ((targetVolume - startVolume) * progress);
        if (progress < 1) {
            audio._sosFadeFrame = requestAnimationFrame(step);
        } else {
            audio._sosFadeFrame = null;
            if (onComplete) onComplete();
        }
    }

    audio._sosFadeFrame = requestAnimationFrame(step);
}

function resolveSosScene(technique, scene) {
    const resolvedName = SOS_SCENES[scene] ? scene : SOS_DEFAULT_SCENES[technique];
    return { name: resolvedName, ...SOS_SCENES[resolvedName] };
}

function playSosAmbient(technique, scene) {
    const resolvedScene = resolveSosScene(technique, scene);
    const track = resolvedScene.audio || SOS_AUDIO_TRACKS[technique];
    if (!track) return;

    sosAmbientTechnique = technique;
    sosAmbientScene = resolvedScene.name;
    sosAmbientRunId++;
    const runId = sosAmbientRunId;

    if (sosAmbientAudio) {
        if (sosAmbientAudio._sosFadeFrame) cancelAnimationFrame(sosAmbientAudio._sosFadeFrame);
        sosAmbientAudio.pause();
        sosAmbientAudio = null;
    }

    updateSosSoundButtons();
    if (!sosAmbientEnabled) return;

    const audio = new Audio(track);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    sosAmbientAudio = audio;

    const playPromise = audio.play();
    if (playPromise) {
        playPromise.then(function () {
            if (runId !== sosAmbientRunId || sosAmbientAudio !== audio) {
                audio.pause();
                return;
            }
            fadeSosAudio(audio, SOS_AUDIO_VOLUME, 900);
        }).catch(function () {
            if (sosAmbientAudio === audio) sosAmbientAudio = null;
        });
    }
}

function stopSosAmbient(technique) {
    if (technique && sosAmbientTechnique !== technique) return;
    sosAmbientTechnique = null;
    sosAmbientScene = null;
    sosAmbientRunId++;
    const audio = sosAmbientAudio;
    sosAmbientAudio = null;
    if (!audio) return;
    fadeSosAudio(audio, 0, 300, function () {
        audio.pause();
        audio.currentTime = 0;
    });
}

function toggleSosAmbientSound() {
    sosAmbientEnabled = !sosAmbientEnabled;
    localStorage.setItem('sosAmbientSound', sosAmbientEnabled ? 'on' : 'off');
    if (sosAmbientEnabled && sosAmbientTechnique) {
        playSosAmbient(sosAmbientTechnique, sosAmbientScene);
    } else if (!sosAmbientEnabled) {
        const activeTechnique = sosAmbientTechnique;
        const activeScene = sosAmbientScene;
        stopSosAmbient(activeTechnique);
        sosAmbientTechnique = activeTechnique;
        sosAmbientScene = activeScene;
    }
    updateSosSoundButtons();
}
window.toggleSosAmbientSound = toggleSosAmbientSound;

function applySosPortalScene(overlay, technique, scene, gradient, fallbackImage) {
    const image = scene ? resolveSosScene(technique, scene).image : fallbackImage;
    overlay.dataset.sosScene = scene || SOS_DEFAULT_SCENES[technique];
    overlay.style.backgroundImage = gradient + ', url(' + image + ')';
}

function stopSosPortalTimer(technique) {
    if (technique && sosPortalTechnique !== technique) return;
    if (sosPortalTimerId) clearInterval(sosPortalTimerId);
    sosPortalTimerId = null;
    sosPortalTechnique = null;
    document.querySelectorAll('.sos-portal-timer').forEach(function (timer) {
        timer.remove();
    });
}

function startSosPortalTimer(technique, scene, duration) {
    stopSosPortalTimer();
    const minutes = Number(duration);
    if (!Number.isFinite(minutes) || minutes <= 0) return;

    const safeMinutes = Math.max(1, Math.min(Math.round(minutes), 10));
    const overlayIds = {
        breathing: 'breatheOverlay',
        grounding: 'groundOverlay',
        pmr: 'pmrOverlay',
        stop: 'stopOverlay'
    };
    const closeFunctions = {
        breathing: closeBreatheScreen,
        grounding: closeGroundScreen,
        pmr: closePmrScreen,
        stop: closeStopScreen
    };
    const overlay = document.getElementById(overlayIds[technique]);
    if (!overlay) return;

    const resolvedScene = resolveSosScene(technique, scene);
    const badge = document.createElement('div');
    badge.className = 'sos-portal-timer';
    badge.setAttribute('role', 'timer');
    badge.setAttribute('aria-live', 'off');
    overlay.appendChild(badge);

    let remaining = safeMinutes * 60;
    sosPortalTechnique = technique;
    function render() {
        const minutePart = Math.floor(remaining / 60);
        const secondPart = String(remaining % 60).padStart(2, '0');
        const lang = getCurrentLanguage();
        badge.textContent = resolvedScene.label[lang] + ' · ' + minutePart + ':' + secondPart;
    }
    render();
    sosPortalTimerId = setInterval(function () {
        remaining--;
        render();
        if (remaining <= 0) {
            const close = closeFunctions[technique];
            stopSosPortalTimer(technique);
            if (close) close();
        }
    }, 1000);
}

/* === SOS Tabs === */
function switchSosTab(n) {
    const tb = document.getElementById('sosTabBody');
    if (tb) tb.setAttribute('data-tab', String(n));
    if (n !== 0) stopBreathing();
}
window.switchSosTab = switchSosTab;
let breatheTimer = null;
let breatheStepIdx = 0;
let breatheTypeIdx = 0;

function setBreatheType(idx) {
    stopBreathing();
    breatheTypeIdx = idx;
}
window.setBreatheType = setBreatheType;

function openBreatheScreen(options = {}) {
    console.log('openBreatheScreen called');
    var overlay = document.getElementById('breatheOverlay');
    if (!overlay) { console.error('breatheOverlay not found!'); return; }

    // Set background image based on selected type
    const type = BREATHE_TYPES[breatheTypeIdx];
    applySosPortalScene(
        overlay,
        'breathing',
        options.scene,
        'linear-gradient(to bottom, rgba(5,5,16,0.6) 0%, rgba(5,5,16,0.85) 100%)',
        type.bgImage
    );

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    playSosAmbient('breathing', options.scene);
    startSosPortalTimer('breathing', options.scene, options.duration);
    // Reset visuals
    var phase = document.getElementById('breathePhase');
    var timer = document.getElementById('breatheTimer');
    var flower = document.getElementById('breatheFlower');
    var glow = document.querySelector('.breathe-bg-glow');
    var cycleEl = document.getElementById('breatheCycleCount');
    var tipEl = document.getElementById('breatheTip');
    if (phase) phase.innerText = t('breathe_phase');
    if (timer) timer.innerText = '';
    if (flower) {
        flower.className = 'breathe-portal';
        flower.style.transitionDuration = '0.5s'; // reset quickly
    }
    if (glow) {
        glow.className = 'breathe-bg-glow';
        glow.style.transitionDuration = '0.5s'; // reset quickly
    }
    if (cycleEl) cycleEl.innerText = t('cycle_one');
    if (tipEl) tipEl.innerText = '';
    _breatheCycleNum = 1;
    // Spawn particles
    spawnBreatheParticles();
    // Auto-start after 0.8s
    setTimeout(function () { toggleBreathing(); }, 800);
}
window.openBreatheScreen = openBreatheScreen;

function closeBreatheScreen() {
    stopBreathing();
    stopSosAmbient('breathing');
    stopSosPortalTimer('breathing');
    destroyBreatheParticles();
    var overlay = document.getElementById('breatheOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
}
window.closeBreatheScreen = closeBreatheScreen;

/* === Particle system === */
let _particleInterval = null;

function spawnBreatheParticles() {
    destroyBreatheParticles();
    var container = document.getElementById('breatheParticles');
    if (!container) return;
    function createParticle() {
        var p = document.createElement('div');
        p.className = 'breathe-particle';
        var size = 2 + Math.random() * 3;
        var left = Math.random() * 100;
        var dur = 10 + Math.random() * 15;
        var delay = Math.random() * 8;
        var hue = 240 + Math.random() * 40;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = left + '%';
        p.style.bottom = '-10px';
        p.style.background = 'hsla(' + hue + ', 75%, 70%, ' + (0.3 + Math.random() * 0.4) + ')';
        p.style.animationDuration = dur + 's';
        p.style.animationDelay = delay + 's';
        p.style.boxShadow = '0 0 ' + (size * 3) + 'px hsla(' + hue + ', 75%, 70%, 0.4)';
        container.appendChild(p);
    }
    for (var i = 0; i < 30; i++) createParticle();
    _particleInterval = setInterval(function () {
        if (container.children.length < 40) createParticle();
        if (container.children.length > 50) container.removeChild(container.children[0]);
    }, 2500);
}

function destroyBreatheParticles() {
    if (_particleInterval) { clearInterval(_particleInterval); _particleInterval = null; }
    var container = document.getElementById('breatheParticles');
    if (container) container.innerHTML = '';
}

let _tipIdx = 0;

function showBreatheTip() {
    var tipEl = document.getElementById('breatheTip');
    if (!tipEl) return;
    tipEl.style.opacity = '0';
    setTimeout(function () {
        tipEl.innerText = BREATHE_TIPS[_tipIdx % BREATHE_TIPS.length];
        tipEl.style.transition = 'opacity 1.2s ease';
        tipEl.style.opacity = '1';
        _tipIdx++;
    }, 400);
}

let _breatheCountdown = null;
let _breatheCycleNum = 1;

function toggleBreathing() {
    if (breatheTimer) { stopBreathing(); return; }
    breatheStepIdx = 0;
    _breatheCycleNum = 1;
    showBreatheTip();
    runBreatheStep();
}

function runBreatheStep() {
    const type = BREATHE_TYPES[breatheTypeIdx];
    const step = type.steps[breatheStepIdx % type.steps.length];
    const stepInCycle = breatheStepIdx % type.steps.length;
    const flower = document.getElementById('breatheFlower');
    const glow = document.querySelector('.breathe-bg-glow');
    const phase = document.getElementById('breathePhase');
    const timer = document.getElementById('breatheTimer');
    const cycleEl = document.getElementById('breatheCycleCount');

    if (phase) phase.innerText = step.text;

    // Determine phase type (expanded or collapsed) based directly on the scale property
    let phaseClass = step.scale === '1.5' ? 'expanded' : 'collapsed';

    // Set transition duration to match the step dur precisely
    const durSeconds = (step.dur / 1000) + 's';

    // Animate portal ring (formerly flower)
    if (flower) {
        flower.className = 'breathe-portal ' + phaseClass;
        flower.style.transitionDuration = durSeconds;
    }

    // Animate background glow
    if (glow) {
        glow.className = 'breathe-bg-glow ' + phaseClass;
        glow.style.transitionDuration = durSeconds;
    }

    // Cycle counter update
    if (stepInCycle === 0 && breatheStepIdx > 0) {
        _breatheCycleNum++;
        if (cycleEl) cycleEl.innerText = 'Cycle ' + _breatheCycleNum;
        showBreatheTip();
    }

    // Countdown timer
    var secs = Math.round(step.dur / 1000);
    if (timer) timer.innerText = secs;
    if (_breatheCountdown) clearInterval(_breatheCountdown);
    var remaining = secs - 1;
    _breatheCountdown = setInterval(function () {
        if (remaining > 0 && timer) { timer.innerText = remaining; remaining--; }
        else { clearInterval(_breatheCountdown); _breatheCountdown = null; }
    }, 1000);

    breatheTimer = setTimeout(function () {
        breatheStepIdx++;
        if (breatheTimer) runBreatheStep();
    }, step.dur);
}

function stopBreathing() {
    if (breatheTimer) { clearTimeout(breatheTimer); breatheTimer = null; }
    if (_breatheCountdown) { clearInterval(_breatheCountdown); _breatheCountdown = null; }
    const flower = document.getElementById('breatheFlower');
    const glow = document.querySelector('.breathe-bg-glow');
    const phase = document.getElementById('breathePhase');
    const timer = document.getElementById('breatheTimer');
    if (flower) {
        flower.className = 'breathe-portal';
        flower.style.transitionDuration = '0.5s';
    }
    if (glow) {
        glow.className = 'breathe-bg-glow';
        glow.style.transitionDuration = '0.5s';
    }
    if (phase) phase.innerText = t('breathe_phase');
    if (timer) timer.innerText = '';
}

var groundStepIdx = 0;

function openGroundScreen(options = {}) {
    groundStepIdx = 0;
    var overlay = document.getElementById('groundOverlay');
    if (!overlay) return;
    applySosPortalScene(
        overlay,
        'grounding',
        options.scene,
        'linear-gradient(to bottom, rgba(9,16,12,0.48) 0%, rgba(9,16,12,0.78) 100%)',
        'img/bg/sos-grounding-field.png'
    );
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    playSosAmbient('grounding', options.scene);
    startSosPortalTimer('grounding', options.scene, options.duration);
    renderGroundStep();
}
window.openGroundScreen = openGroundScreen;

function closeGroundScreen() {
    stopSosAmbient('grounding');
    stopSosPortalTimer('grounding');
    var overlay = document.getElementById('groundOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
}
window.closeGroundScreen = closeGroundScreen;

function renderGroundStep() {
    var step = GROUND_STEPS[groundStepIdx];
    var numEl = document.getElementById('groundNumber');
    var senseEl = document.getElementById('groundSense');
    var instrEl = document.getElementById('groundInstruction');
    var btn = document.getElementById('groundNextBtn');
    var dots = document.querySelectorAll('.ground-dot');
    var scene = document.querySelector('.ground-scene');

    if (numEl) { numEl.innerText = step.num; numEl.style.animation = 'none'; numEl.offsetHeight; numEl.style.animation = ''; }
    if (senseEl) { senseEl.innerText = step.sense; senseEl.style.animation = 'none'; senseEl.offsetHeight; senseEl.style.animation = ''; }
    if (instrEl) { instrEl.innerText = step.text; instrEl.style.animation = 'none'; instrEl.offsetHeight; instrEl.style.animation = ''; }
    if (btn) {
        btn.innerText = (groundStepIdx < 4) ? t('done_arrow') : 'Complete';
        btn.onclick = groundNext;
    }
    if (scene) scene.classList.remove('ground-complete');

    dots.forEach(function (d, i) {
        d.className = 'ground-dot' + (i < groundStepIdx ? ' done' : '') + (i === groundStepIdx ? ' active' : '');
    });
}

function groundNext() {
    groundStepIdx++;
    if (groundStepIdx >= GROUND_STEPS.length) {
        showGroundComplete();
        return;
    }
    renderGroundStep();
}
window.groundNext = groundNext;

function showGroundComplete() {
    var numEl = document.getElementById('groundNumber');
    var senseEl = document.getElementById('groundSense');
    var instrEl = document.getElementById('groundInstruction');
    var btn = document.getElementById('groundNextBtn');
    var dots = document.querySelectorAll('.ground-dot');
    var scene = document.querySelector('.ground-scene');

    if (scene) scene.classList.add('ground-complete');
    if (numEl) { numEl.innerText = '\u2713'; numEl.style.animation = 'none'; }
    const content = getLocalizedUiContent();
    if (senseEl) senseEl.innerText = content.groundDone.sense;
    if (instrEl) instrEl.innerText = content.groundDone.text;
    if (btn) { btn.innerText = content.groundDone.button; btn.onclick = closeGroundScreen; }
    dots.forEach(function (d) { d.className = 'ground-dot done'; });
}

var pmrStepIdx = 0;
var pmrPhaseIsTense = true;
var pmrTimerId = null;

function openPmrScreen(options = {}) {
    pmrStepIdx = 0;
    pmrPhaseIsTense = true;
    var overlay = document.getElementById('pmrOverlay');
    if (!overlay) return;
    applySosPortalScene(
        overlay,
        'pmr',
        options.scene,
        'linear-gradient(to bottom, rgba(7,10,22,0.52) 0%, rgba(7,10,22,0.8) 100%)',
        'img/bg/sos-muscle-relaxation-sea.png'
    );
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    playSosAmbient('pmr', options.scene);
    startSosPortalTimer('pmr', options.scene, options.duration);
    renderPmrStep();
    startPmrTimer(5);
}
window.openPmrScreen = openPmrScreen;

function closePmrScreen() {
    clearInterval(pmrTimerId);
    pmrTimerId = null;
    stopSosAmbient('pmr');
    stopSosPortalTimer('pmr');
    var overlay = document.getElementById('pmrOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
}
window.closePmrScreen = closePmrScreen;

function renderPmrStep() {
    var step = PMR_STEPS[pmrStepIdx];
    var numEl = document.getElementById('pmrStepNum');
    var muscleEl = document.getElementById('pmrMuscle');
    var phaseEl = document.getElementById('pmrPhase');
    var instrEl = document.getElementById('pmrInstruction');
    var btn = document.getElementById('pmrNextBtn');
    var scene = document.querySelector('.pmr-scene');
    var dots = document.querySelectorAll('.pmr-dot');

    if (numEl) {
        numEl.innerText = step.num;
        numEl.className = 'pmr-step-num' + (pmrPhaseIsTense ? ' tense' : ' relax');
    }
    if (muscleEl) { muscleEl.innerText = step.muscle; }
    if (phaseEl) {
        const content = getLocalizedUiContent();
        phaseEl.innerText = pmrPhaseIsTense ? content.pmrPhaseTense : content.pmrPhaseRelax;
        phaseEl.className = 'pmr-phase' + (pmrPhaseIsTense ? ' tense' : ' relax');
    }
    if (instrEl) instrEl.innerText = pmrPhaseIsTense ? step.tenseText : step.relaxText;
    if (btn) {
        btn.innerText = t('skip_arrow');
        btn.onclick = pmrNext;
    }
    if (scene) scene.classList.remove('pmr-complete');

    dots.forEach(function (d, i) {
        d.className = 'pmr-dot' + (i < pmrStepIdx ? ' done' : '') + (i === pmrStepIdx ? ' active' : '');
    });
}

function startPmrTimer(seconds) {
    clearInterval(pmrTimerId);
    var remaining = seconds;
    var timerEl = document.getElementById('pmrTimer');
    if (timerEl) timerEl.innerText = remaining;
    pmrTimerId = setInterval(function () {
        remaining--;
        if (timerEl) timerEl.innerText = remaining > 0 ? remaining : '';
        if (remaining <= 0) {
            clearInterval(pmrTimerId);
            if (pmrPhaseIsTense) {
                pmrPhaseIsTense = false;
                renderPmrStep();
                startPmrTimer(7);
            } else {
                pmrStepIdx++;
                if (pmrStepIdx >= PMR_STEPS.length) {
                    showPmrComplete();
                } else {
                    pmrPhaseIsTense = true;
                    renderPmrStep();
                    startPmrTimer(5);
                }
            }
        }
    }, 1000);
}

function pmrNext() {
    clearInterval(pmrTimerId);
    if (pmrPhaseIsTense) {
        pmrPhaseIsTense = false;
        renderPmrStep();
        startPmrTimer(7);
    } else {
        pmrStepIdx++;
        if (pmrStepIdx >= PMR_STEPS.length) {
            showPmrComplete();
        } else {
            pmrPhaseIsTense = true;
            renderPmrStep();
            startPmrTimer(5);
        }
    }
}
window.pmrNext = pmrNext;

function showPmrComplete() {
    clearInterval(pmrTimerId);
    var numEl = document.getElementById('pmrStepNum');
    var muscleEl = document.getElementById('pmrMuscle');
    var phaseEl = document.getElementById('pmrPhase');
    var instrEl = document.getElementById('pmrInstruction');
    var timerEl = document.getElementById('pmrTimer');
    var btn = document.getElementById('pmrNextBtn');
    var dots = document.querySelectorAll('.pmr-dot');
    var scene = document.querySelector('.pmr-scene');

    if (scene) scene.classList.add('pmr-complete');
    if (numEl) { numEl.innerText = '\u2713'; numEl.className = 'pmr-step-num relax'; }
    if (muscleEl) muscleEl.innerText = '';
    const content = getLocalizedUiContent();
    if (phaseEl) { phaseEl.innerText = content.pmrDone; phaseEl.className = 'pmr-phase relax'; }
    if (instrEl) instrEl.innerText = content.pmrDoneText;
    if (timerEl) timerEl.innerText = '';
    if (btn) { btn.innerText = content.pmrClose; btn.onclick = closePmrScreen; }
    dots.forEach(function (d) { d.className = 'pmr-dot done'; });
}

var stopStepIdx = 0;

function openStopScreen(options = {}) {
    stopStepIdx = 0;
    var overlay = document.getElementById('stopOverlay');
    if (!overlay) return;
    applySosPortalScene(
        overlay,
        'stop',
        options.scene,
        'linear-gradient(to bottom, rgba(6,8,18,0.54) 0%, rgba(6,8,18,0.82) 100%)',
        'img/bg/stars.png'
    );
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    playSosAmbient('stop', options.scene);
    startSosPortalTimer('stop', options.scene, options.duration);
    renderStopStep();
}
window.openStopScreen = openStopScreen;

function closeStopScreen() {
    stopSosAmbient('stop');
    stopSosPortalTimer('stop');
    var overlay = document.getElementById('stopOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
}
window.closeStopScreen = closeStopScreen;

function renderStopStep() {
    var step = STOP_STEPS[stopStepIdx];
    var letterEl = document.getElementById('stopLetter');
    var wordEl = document.getElementById('stopWord');
    var instrEl = document.getElementById('stopInstruction');
    var btn = document.getElementById('stopNextBtn');
    var dots = document.querySelectorAll('.stop-dot');
    var scene = document.querySelector('.stop-scene');

    if (letterEl) { letterEl.innerText = step.letter; letterEl.style.animation = 'none'; letterEl.offsetHeight; letterEl.style.animation = ''; }
    if (wordEl) { wordEl.innerText = step.word; wordEl.style.animation = 'none'; wordEl.offsetHeight; wordEl.style.animation = ''; }
    if (instrEl) { instrEl.innerText = step.text; instrEl.style.animation = 'none'; instrEl.offsetHeight; instrEl.style.animation = ''; }
    if (btn) { btn.innerText = (stopStepIdx < 3) ? t('done_arrow') : 'Complete'; btn.onclick = stopNext; }
    if (scene) scene.classList.remove('stop-complete');

    dots.forEach(function (d, i) {
        d.className = 'stop-dot' + (i < stopStepIdx ? ' done' : '') + (i === stopStepIdx ? ' active' : '');
    });
}

function stopNext() {
    stopStepIdx++;
    if (stopStepIdx >= STOP_STEPS.length) {
        showStopComplete();
        return;
    }
    renderStopStep();
}
window.stopNext = stopNext;

function showStopComplete() {
    var letterEl = document.getElementById('stopLetter');
    var wordEl = document.getElementById('stopWord');
    var instrEl = document.getElementById('stopInstruction');
    var btn = document.getElementById('stopNextBtn');
    var dots = document.querySelectorAll('.stop-dot');
    var scene = document.querySelector('.stop-scene');

    if (scene) scene.classList.add('stop-complete');
    if (letterEl) { letterEl.innerText = '\u2713'; letterEl.style.animation = 'none'; }
    const content = getLocalizedUiContent();
    if (wordEl) wordEl.innerText = content.stopDone.word;
    if (instrEl) instrEl.innerText = content.stopDone.text;
    if (btn) { btn.innerText = content.stopDone.button; btn.onclick = closeStopScreen; }
    dots.forEach(function (d) { d.className = 'stop-dot done'; });
}

/* === Crisis Plan === */
function saveSosPlan() {
    const text = document.getElementById('sosPlanText')?.value || '';
    localStorage.setItem('sosCrisisPlan', text);
}
function loadSosPlan() {
    const el = document.getElementById('sosPlanText');
    if (el) el.value = localStorage.getItem('sosCrisisPlan') || '';
}
window.saveSosPlan = saveSosPlan;

/* === Notifications === */
let _notifTimers = [];
let _activeOllamaModel = '';

function setOllamaModelStatus(message, isError) {
    const status = document.getElementById('ollamaModelStatus');
    if (!status) return;
    status.textContent = message || '';
    status.classList.toggle('error', Boolean(isError));
}

async function loadOllamaModels() {
    const select = document.getElementById('ollamaModelSelect');
    const refresh = document.getElementById('refreshOllamaModels');
    if (!select) return;

    select.disabled = true;
    if (refresh) refresh.disabled = true;
    select.innerHTML = '<option>' + t('ollama_model_loading') + '</option>';
    setOllamaModelStatus('', false);

    try {
        const response = await fetch(API + '/api/models');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        const models = Array.isArray(data.models) ? data.models : [];
        _activeOllamaModel = data.selected_model || '';
        select.innerHTML = '';

        models.forEach(function (model) {
            if (!model || !model.name) return;
            const option = document.createElement('option');
            const capabilities = Array.isArray(model.capabilities) ? model.capabilities : null;
            const supportsChat = !capabilities || capabilities.includes('completion');
            option.value = model.name;
            option.textContent = supportsChat ? model.name : model.name + ' — ' + t('ollama_model_embedding_only');
            option.disabled = !supportsChat;
            option.selected = model.name === _activeOllamaModel;
            select.appendChild(option);
        });

        if (!models.length) {
            const option = document.createElement('option');
            option.textContent = t('ollama_model_empty');
            select.appendChild(option);
            setOllamaModelStatus(t('ollama_model_empty'), true);
        } else if (_activeOllamaModel && !models.some(function (model) { return model.name === _activeOllamaModel; })) {
            const option = document.createElement('option');
            option.value = _activeOllamaModel;
            option.textContent = _activeOllamaModel + ' — ' + t('ollama_model_unavailable');
            option.disabled = true;
            option.selected = true;
            select.prepend(option);
            setOllamaModelStatus(t('ollama_model_unavailable'), true);
        }
        select.disabled = !models.some(function (model) {
            const capabilities = Array.isArray(model && model.capabilities) ? model.capabilities : null;
            return model && model.name && (!capabilities || capabilities.includes('completion'));
        });
    } catch (error) {
        select.innerHTML = '<option>' + t('ollama_model_load_error') + '</option>';
        setOllamaModelStatus(t('ollama_model_load_error'), true);
    } finally {
        if (refresh) refresh.disabled = false;
    }
}
window.loadOllamaModels = loadOllamaModels;

async function saveOllamaModelSelection() {
    const select = document.getElementById('ollamaModelSelect');
    const selectedModel = select && !select.disabled ? select.value : '';
    if (!selectedModel || selectedModel === _activeOllamaModel) return true;

    try {
        const response = await fetch(API + '/api/settings/model', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: selectedModel })
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        _activeOllamaModel = selectedModel;
        setOllamaModelStatus(t('ollama_model_saved').replace('{model}', selectedModel), false);
        return true;
    } catch (error) {
        setOllamaModelStatus(t('ollama_model_save_error'), true);
        return false;
    }
}

function openNotifModal() {
    const s = JSON.parse(localStorage.getItem('notifSettings') || '{}');
    document.getElementById('notifMorning').checked = s.morning || false;
    document.getElementById('notifMorningTime').value = s.morningTime || '09:00';
    document.getElementById('notifEvening').checked = s.evening || false;
    document.getElementById('notifEveningTime').value = s.eveningTime || '21:00';
    populateTtsVoiceControls();
    openModal('notifModal');
    loadOllamaModels();
}
window.openNotifModal = openNotifModal;

async function saveNotifSettings() {
    if (!await saveOllamaModelSelection()) return;
    const s = {
        morning: document.getElementById('notifMorning').checked,
        morningTime: document.getElementById('notifMorningTime').value,
        evening: document.getElementById('notifEvening').checked,
        eveningTime: document.getElementById('notifEveningTime').value,
    };
    const ttsSettings = {
        enVoice: document.getElementById('ttsVoiceEn')?.value || 'en-US-JennyNeural'
    };
    localStorage.setItem('notifSettings', JSON.stringify(s));
    localStorage.setItem('ttsSettings', JSON.stringify(ttsSettings));
    scheduleNotifications(s);
    closeModal('notifModal');
    // Update bell icon to show active state
    const bell = document.getElementById('notifSidebarBtn');
    if (bell) bell.style.color = (s.morning || s.evening) ? 'var(--accent)' : '';
}
window.saveNotifSettings = saveNotifSettings;

function scheduleNotifications(s) {
    _notifTimers.forEach(t => clearTimeout(t));
    _notifTimers = [];
    if (!('Notification' in window)) return;
    const proceed = () => {
        if (Notification.permission !== 'granted') return;
        function scheduleAt(timeStr, message) {
            const [h, m] = timeStr.split(':').map(Number);
            const now = new Date();
            const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
            if (target <= now) target.setDate(target.getDate() + 1);
            const delay = target - now;
            _notifTimers.push(setTimeout(() => {
                const notif = getLocalizedUiContent().notifications;
                new Notification(notif.title, { body: message });
                scheduleAt(timeStr, message);
            }, delay));
        }
        const notif = getLocalizedUiContent().notifications;
        if (s.morning) scheduleAt(s.morningTime, notif.morning);
        if (s.evening) scheduleAt(s.eveningTime, notif.evening);
    };
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(proceed);
    } else {
        proceed();
    }
}

function startSosExerciseFromAI(event = {}) {
    const technique = ['breathing', 'grounding', 'pmr', 'stop'].includes(event.technique)
        ? event.technique
        : 'breathing';
    const options = {
        scene: event.scene,
        duration: event.duration
    };
    const launchers = {
        breathing: openBreatheScreen,
        grounding: openGroundScreen,
        pmr: openPmrScreen,
        stop: openStopScreen
    };
    const overlays = {
        breathing: ['breatheOverlay', closeBreatheScreen],
        grounding: ['groundOverlay', closeGroundScreen],
        pmr: ['pmrOverlay', closePmrScreen],
        stop: ['stopOverlay', closeStopScreen]
    };

    Object.entries(overlays).forEach(function ([name, [overlayId, close]]) {
        const overlay = document.getElementById(overlayId);
        if (name !== technique && overlay?.style.display !== 'none') close();
    });
    closeModal('sosModal');
    launchers[technique](options);
}
window.startSosExerciseFromAI = startSosExerciseFromAI;

function startBreathingFromAI() {
    startSosExerciseFromAI({ technique: 'breathing', scene: 'air', duration: 2 });
}
window.startBreathingFromAI = startBreathingFromAI;

refreshLocalizedExercises();

// --- Article Library ---
const ARTICLE_CATALOG_EN = [
    {
        kicker: 'Article 1',
        title: 'What Depression Is: WHO and NIMH Data',
        excerpt: 'A grounded overview of depression, including prevalence, risk factors, treatment paths, and practical support steps.',
        sources: ['WHO', 'NIMH'],
        body: [
            'According to the World Health Organization, depression remains one of the most common mental disorders worldwide and affects about 5.7% of the adult population. Women experience it more often than men.',
            'WHO emphasizes that depression does not arise from one single cause. It usually develops through a complex interaction of social, psychological, and biological factors, and the risk rises after difficult life events such as loss, trauma, or serious stress.',
            'The National Institute of Mental Health notes that for milder forms of depression, psychotherapy is often the first step. If therapy alone is not enough, medication may be added later. In moderate and severe depression, medication is often introduced earlier.',
            'WHO also stresses that effective treatments exist for mild, moderate, and severe depression, and that some brief psychological interventions can be delivered even outside highly specialized psychotherapy settings.',
            'Key publications: WHO Comprehensive Mental Health Action Plan 2013–2030; NIMH Depression Publication (NIH); Global Burden of Disease Study 2021.'
        ],
        bullets: [
            'Try to include at least 30 minutes of physical activity a day, even if it is only walking.',
            'Keep sleep and meals as regular as you reasonably can.',
            'Stay connected with close people instead of isolating yourself.',
            'Avoid alcohol, nicotine, and illicit substances when possible.',
            'If you can, delay major life decisions until your state is more stable.'
        ]
    },
    {
        kicker: 'Article 2',
        title: 'Cognitive Therapy for Depression: Aaron Beck’s Legacy',
        excerpt: 'How Aaron Beck laid the foundation for CBT and why working with automatic thoughts changes the course of depression.',
        sources: ['Beck Institute', 'PMC', 'StatPearls'],
        body: [
            'Aaron T. Beck, an American psychiatrist and professor at the University of Pennsylvania, is widely seen as the father of cognitive therapy. In the 1960s he developed the approach that later became cognitive behavioral therapy.',
            'Working with depressed patients, Beck noticed that persistent negative beliefs about loss, failure, and personal inadequacy often sat underneath their emotional suffering. These beliefs show up through automatic thoughts that feel immediate and true.',
            'One of Beck’s key ideas is the cognitive triad of depression: a negative view of the self, the world, and the future. When experience is filtered through that triad, mood and behavior begin to maintain the depressive cycle.',
            'A major clinical trial published in 1977 helped establish cognitive therapy as an evidence-based talking treatment by comparing it with antidepressant medication.',
            'Key publications: Beck, A.T. et al. (1979). Cognitive Therapy of Depression; Rush, A.J., Beck, A.T. et al. (1977). Cognitive Therapy and Research, 1, 17–37.'
        ],
        bullets: [
            'Notice automatic negative thoughts instead of accepting them as facts.',
            'Test a thought with evidence for and against it.',
            'Look for distortions such as catastrophizing, overgeneralization, and mind reading.',
            'Replace harsh conclusions with a more balanced alternative.'
        ]
    },
    {
        kicker: 'Article 3',
        title: 'Learned Helplessness and Learned Optimism: Martin Seligman',
        excerpt: 'Why the feeling that “nothing I do matters” is tied to depression and how a more realistic explanatory style helps.',
        sources: ['PMC', 'Positive Psychology Center'],
        body: [
            'Martin Seligman and Steven Maier described learned helplessness in 1967. They showed that repeated uncontrollable negative events can teach a person or animal that their actions make no difference.',
            'Seligman treated learned helplessness as a laboratory model of clinical depression. A crucial factor turned out to be how a person explains bad events to themselves.',
            'A pessimistic explanatory style treats setbacks as permanent, personal, and global. A more optimistic style sees them as temporary, limited, and not equal to the whole self. That shift can reduce vulnerability to depression.',
            'In Learned Optimism, Seligman translated this into practice through the ABC model: adversity, belief, consequence.',
            'Key publications: Seligman, M.E.P. & Maier, S.F. (1967). Journal of Experimental Psychology, 74, 1–9; Seligman, M.E.P. (1990). Learned Optimism; Abramson, L.Y., Seligman, M.E.P. & Teasdale, J.D. (1978). Reformulated Learned Helplessness.'
        ],
        bullets: [
            'Watch how you explain setbacks to yourself.',
            'Ask whether this really means always, everywhere, and all because of me.',
            'Look for a more limited and realistic explanation.',
            'Separate an unpleasant event from a global judgment about your worth.'
        ]
    },
    {
        kicker: 'Article 4',
        title: 'Physical Activity as a Depression Treatment: Meta-Analyses',
        excerpt: 'What large meta-analyses show: walking, jogging, yoga, and strength training can meaningfully reduce depressive symptoms.',
        sources: ['JAMA Psychiatry', 'BMJ', 'American Journal of Psychiatry'],
        body: [
            'The Pearce et al. meta-analysis in JAMA Psychiatry included 15 prospective studies and more than 2 million person-years of follow-up. People who reached the recommended amount of activity had about a 25% lower risk of developing depression than inactive people.',
            'Even half of the recommended level of activity was linked to meaningful benefit. This matters because starting to move does not require an ideal routine from day one.',
            'The 2024 network meta-analysis by Noetel et al. in BMJ found that walking, jogging, yoga, and strength training all produced moderate reductions in depression symptoms compared with usual care.',
            'Possible mechanisms include changes in neurogenesis, the hippocampus, inflammation, and natural stress-regulation systems.',
            'Key publications: Pearce, M. et al. (2022). JAMA Psychiatry, 79(6), 550–559; Noetel, M. et al. (2024). BMJ, 384, e075847; Schuch, F.B. et al. (2018). American Journal of Psychiatry, 175(7), 631–648.'
        ],
        bullets: [
            'Start small: even 15 minutes of walking a day matters.',
            'Build gradually toward about 150 minutes of moderate activity per week.',
            'Choose a form you can realistically tolerate or enjoy.',
            'Treat movement as part of care, not as a test of discipline.'
        ]
    },
    {
        kicker: 'Article 5',
        title: 'Mindfulness-Based Cognitive Therapy (MBCT) and Relapse Prevention',
        excerpt: 'Why MBCT lowers relapse risk and how the idea that “thoughts are not facts” weakens rumination.',
        sources: ['Segal, Williams & Teasdale', 'PMC', 'NICE'],
        body: [
            'MBCT was developed by Zindel Segal, Mark Williams, and John Teasdale with support from Jon Kabat-Zinn. It combines mindfulness practice with cognitive therapy for relapse prevention.',
            'The core aim is to help a person notice mood deterioration earlier and stop fusing automatically with familiar depressive thought patterns. Mindfulness provides an observing position, while the cognitive component helps reshape the relationship to thoughts.',
            'Meta-analyses suggest that for people with three or more prior depressive episodes, MBCT can lower relapse risk meaningfully compared with usual care.',
            'The classic program lasts 8 weeks and includes group sessions, home practice, body scans, seated meditation, gentle yoga, and recognition of early warning signs.',
            'Key publications: Segal, Z.V., Williams, J.M.G., & Teasdale, J.D. (2002). Mindfulness-Based Cognitive Therapy for Depression; Teasdale, J.D. et al. (2000). Journal of Consulting and Clinical Psychology, 68, 615–623; Kabat-Zinn, J. (1990). Full Catastrophe Living.'
        ],
        bullets: [
            'Notice early mood shifts before a larger downturn.',
            'Practice short moments of mindfulness, not only long meditations.',
            'Train the stance that a thought is a mental event, not a fact.',
            'Bring attention back to the body and present moment when rumination starts.'
        ]
    },
    {
        kicker: 'Article 6',
        title: 'Sleep and Depression: A Two-Way Relationship',
        excerpt: 'Why insomnia may be both a symptom of depression and a factor that raises the risk of a new episode.',
        sources: ['Neuroscience Research', 'Journal of Clinical Sleep Medicine', 'PMC'],
        body: [
            'Sleep disturbances are among the most frequent symptoms of depression, but current evidence suggests the relationship works both ways. Depression often changes sleep architecture, while poor sleep itself worsens emotional regulation and stress load.',
            'Longitudinal research shows that insomnia is an independent risk factor for first and recurrent depressive episodes across age groups.',
            'This means sleep problems are not just background noise. They may be an early warning sign of worsening mental health.',
            'Systematic reviews also support a bidirectional link between insomnia, anxiety, and depression, with inflammation being one possible pathway.',
            'Key publications: Yasugaki, S. et al. (2023). Neuroscience Research, 211, 57–64; Fang, H. et al. (2019). J Clin Sleep Med, 15(3), 405–411; Baglioni, C. et al. (2011). J Affect Disord, 135(1-3), 10–19.'
        ],
        bullets: [
            'Keep bedtime and wake time as stable as possible.',
            'Remove screens for at least one hour before sleep.',
            'Treat insomnia as an important marker, not a trivial side issue.',
            'When insomnia and depression overlap, CBT-I is worth considering as a first-line treatment.'
        ]
    },
    {
        kicker: 'Article 7',
        title: 'Social Connection and Loneliness: Julianne Holt-Lunstad',
        excerpt: 'Why loneliness is linked not only to mood, but also to long-term depression risk and poorer health outcomes.',
        sources: ['World Psychiatry', 'Perspectives on Psychological Science', 'Harvard T.H. Chan School'],
        body: [
            'Julianne Holt-Lunstad, a professor of psychology and neuroscience at Brigham Young University, has done major work on how social isolation and loneliness affect mental and physical health.',
            'Current evidence shows a stable link between isolation, loneliness, and depression across the lifespan. Stronger and more meaningful social connection is associated with lower depressive risk.',
            'A 2024 review in World Psychiatry showed that people who often feel lonely have more than twice the risk of developing a new depression compared with those who rarely or never feel lonely.',
            'Her meta-analytic work also suggests that social isolation and loneliness are linked to higher mortality risk, while strong social ties improve survival odds.',
            'Key publications: Holt-Lunstad, J. (2024). World Psychiatry, 23(3), 312–332; Holt-Lunstad, J. et al. (2015). Perspectives on Psychological Science, 10(2), 227–237; US Surgeon General\'s Advisory (2023).'
        ],
        bullets: [
            'Keep regular contact with at least one close person.',
            'Look for group-based activities such as volunteering, hobbies, or sport.',
            'Focus on the quality of connection, not only the number of contacts.',
            'Treat isolation as a real risk factor rather than just a personality trait.'
        ]
    },
    {
        kicker: 'Article 8',
        title: 'Nutrition and Depression: The SMILES Trial',
        excerpt: 'How the first major randomized trial showed that improving diet can meaningfully reduce clinical depression symptoms.',
        sources: ['BMC Medicine', 'Food & Mood Centre'],
        body: [
            'Felice Jacka, a professor at Deakin University and founder of the Food & Mood Centre, became one of the leading researchers in nutritional psychiatry. The SMILES trial was the first randomized controlled study designed specifically to test whether improving diet could help treat clinical depression.',
            'Over 12 weeks, participants with moderate to severe depression received either support for a modified Mediterranean-style diet or social support. The diet-support group showed stronger symptom improvement, and some participants reached remission.',
            'The SMILES pattern emphasized vegetables, fruit, whole grains, legumes, nuts, olive oil, fish, and moderate lean meat, while reducing ultra-processed foods, sweets, and refined carbohydrates.',
            'An important result was that the people who improved their diet the most also showed the greatest drop in depressive symptoms.',
            'Key publications: Jacka, F.N. et al. (2017). BMC Medicine, 15, 23; Parletta, N. et al. (2019). Nutritional Neuroscience; Bayes, J. et al. (2022). American Journal of Clinical Nutrition.'
        ],
        bullets: [
            'Shift your diet toward vegetables, fruit, legumes, and whole grains.',
            'Use fish, nuts, and olive oil as a steadier base for meals.',
            'Reduce ultra-processed foods and excess sugar.',
            'See nutrition as one supportive part of treatment, not as magic.'
        ]
    },
    {
        kicker: 'Article 9',
        title: 'The Gut-Brain Axis and Depression: A New Scientific Frontier',
        excerpt: 'What current research suggests about microbiota, inflammation, neurotransmitters, and depressive symptoms.',
        sources: ['Nature Communications', 'University College Cork', 'Frontiers in Microbiology'],
        body: [
            'The microbiota-gut-brain axis has become one of the fastest-growing areas in depression research. Large cohort studies suggest links between gut microbial composition and the severity of depressive symptoms.',
            'Studies in major Dutch cohorts found associations between several microbial taxa and depressive symptoms. These organisms are involved in pathways related to glutamate, butyrate, serotonin, and GABA.',
            'John Cryan and colleagues showed that the microbiota of people with depression differs from that of healthy individuals. Experimental transfer studies also suggest downstream effects on behavior and tryptophan metabolism.',
            'This field is still developing, but it is already clear that the gut can influence the brain through immune, metabolic, and neurotransmitter pathways. Nutrition matters here as well because it affects both inflammation and microbial composition.',
            'Key publications: Radjabzadeh, D. et al. (2022). Nature Communications, 13, 7128; Cryan, J. & Dinan, T. (2012). Nature Reviews Neuroscience, 13, 701–712; Bizzozero-Peroni, B. et al. (2025).'
        ],
        bullets: [
            'Increase fiber intake through vegetables, legumes, and whole grains.',
            'Add fermented foods if they suit you.',
            'Limit ultra-processed foods and excess sugar.',
            'Think of probiotics as a possible add-on, not a replacement for treatment.'
        ]
    },
    {
        kicker: 'Article 10',
        title: 'Newer Treatments: Ketamine, TMS, and Digital Interventions',
        excerpt: 'A brief look at modern options for cases where standard treatment is not fast enough or not effective enough.',
        sources: ['NIMH', 'Clinical Pharmacology & Therapeutics', 'APA'],
        body: [
            'For treatment-resistant depression, when standard antidepressants do not help enough, newer options are available. One of the most visible examples is ketamine and its form esketamine, which can act within hours rather than weeks.',
            'Esketamine is FDA-approved for treatment-resistant depression as a nasal spray administered under medical supervision. It is not a home self-help strategy but a specialized intervention.',
            'Another important direction is neurostimulation, including transcranial magnetic stimulation. Research suggests these methods can be useful in severe depression and may produce fewer side effects than some older approaches.',
            'Digital interventions are also developing quickly, including online cognitive therapy programs, telehealth, and app-based support between sessions. They do not replace all care, but they can expand access and continuity.',
            'APA guidance emphasizes that depression treatment should be individualized. If medication response remains insufficient after about 6 to 8 weeks, the treatment plan should be reviewed with a clinician.',
            'Key publications: Raja, S.M. et al. (2024). Clinical Pharmacology & Therapeutics, 116(5), 1314–1324; APA Clinical Practice Guideline (2019); NIMH Brain Stimulation Therapies overview.'
        ],
        bullets: [
            'Discuss severe or treatment-resistant depression options only with a clinician.',
            'Do not wait for months without reassessing a treatment plan that is not helping.',
            'Use digital interventions as support, not as a complete replacement.',
            'Keep an individualized view: the same method will not fit everyone.'
        ]
    }
];

const ARTICLE_CATALOG = ARTICLE_CATALOG_EN;

function getArticleCatalog() {
    return ARTICLE_CATALOG_EN;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function openArticleLibrary() {
    renderArticleList();
    document.getElementById('articleListContainer').style.display = 'block';
    document.getElementById('articleReaderContainer').style.display = 'none';
    openModal('articleModal');
}
window.openArticleLibrary = openArticleLibrary;

function closeArticleLibraryModal() {
    closeArticleReader();
    closeModal('articleModal');
}
window.closeArticleLibraryModal = closeArticleLibraryModal;

function renderArticleList() {
    const grid = document.getElementById('articleListGrid');
    if (!grid) return;
    const catalog = getArticleCatalog();

    let html = '';
    catalog.forEach((article, index) => {
        html += `
            <div class="article-card" onclick="openArticleReader(${index})">
                <div class="article-card-kicker">${escapeHtml(article.kicker)}</div>
                <div class="article-card-title">${escapeHtml(article.title)}</div>
                <div class="article-card-excerpt">${escapeHtml(article.excerpt)}</div>
                <div class="article-card-sources">
                    ${article.sources.map(source => `<span class="article-source-chip">${escapeHtml(source)}</span>`).join('')}
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}

function openArticleReader(index) {
    const article = getArticleCatalog()[index];
    if (!article) return;
    window._articleReaderIndex = index;

    document.getElementById('articleListContainer').style.display = 'none';
    document.getElementById('articleReaderContainer').style.display = 'block';
    document.getElementById('articleReaderKicker').innerText = article.kicker;
    document.getElementById('articleReaderTitle').innerText = article.title;
    document.getElementById('articleReaderSources').innerHTML = article.sources
        .map(source => `<span class="article-source-chip">${escapeHtml(source)}</span>`)
        .join('');

    let bodyHtml = article.body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('');
    if (article.bullets && article.bullets.length) {
        bodyHtml += `<ul>${article.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    }
    document.getElementById('articleReaderBody').innerHTML = bodyHtml;

    if (window.lucide) window.lucide.createIcons();
}
window.openArticleReader = openArticleReader;

function closeArticleReader() {
    const list = document.getElementById('articleListContainer');
    const reader = document.getElementById('articleReaderContainer');
    if (list) list.style.display = 'block';
    if (reader) reader.style.display = 'none';
    window._articleReaderIndex = null;
}
window.closeArticleReader = closeArticleReader;

// --- Video Library ---
const VIDEO_CATALOG_EN = [
    { title: 'What Is Depression?', author: 'TED-Ed', id: 'z-IR48Mb3W0', duration: '4:29' },
    { title: 'How Does Cognitive Behavioral Therapy Work?', author: 'Psych Hub', id: 'ZdyOwZ4_RnI', duration: '4:55' },
    { title: 'ABC Model of Cognitive Behavioral Therapy', author: 'Therapist Aid', id: 'WRRdSm4ZjX4', duration: '3:52' },
    { title: 'What Is Anxiety Really?', author: 'Therapy in a Nutshell', id: 'db3K8b3ftaY', duration: '12:00' },
    { title: 'How to Stop a Panic Attack: The Anti-Struggle Technique', author: 'Therapy in a Nutshell', id: '2CQpyA485wc', duration: '8:15' },
    { title: 'Progressive Muscle Relaxation: An Essential Anxiety Skill', author: 'Therapy in a Nutshell', id: 'SNqYG95j_UQ', duration: '9:05' },
    { title: '20 Minute Guided Meditation for Reducing Anxiety and Stress', author: 'The Mindful Movement', id: 'MIr3RsUWrdo', duration: '20:16' },
    { title: 'Catastrophizing: How to Stop Making Yourself More Anxious', author: 'Therapy in a Nutshell', id: 'bS2LPNlO07s', duration: '17:22' }
];

const VIDEO_CATALOG = VIDEO_CATALOG_EN;

function getVideoCatalog() {
    return VIDEO_CATALOG_EN;
}

function openVideoLibrary() {
    renderVideoList();
    document.getElementById('videoListContainer').style.display = 'block';
    document.getElementById('videoPlayerContainer').style.display = 'none';
    document.getElementById('videoIframe').src = '';

    // Open the modal explicitly
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}
window.openVideoLibrary = openVideoLibrary;

function closeVideoLibraryModal() {
    closeModal('videoModal');
    document.getElementById('videoIframe').src = '';
}
window.closeVideoLibraryModal = closeVideoLibraryModal;

function renderVideoList() {
    const grid = document.getElementById('videoListGrid');
    if (!grid) return;

    let html = '';
    getVideoCatalog().forEach(vid => {
        // Use i.ytimg.com as it often bypasses local file restrictions better than img.youtube.com
        let thumbUrl = `https://i.ytimg.com/vi/${vid.id}/mqdefault.jpg`;
        html += `
            <div onclick="playVideo('${vid.id}')" style="display:flex; gap:16px; background:var(--bg); border:1px solid var(--border); border-radius:12px; padding:12px; cursor:pointer; transition:all 0.2s; align-items:center;" onmouseover="this.style.borderColor='var(--gray)'" onmouseout="this.style.borderColor='var(--border)'">
                <div style="position:relative; width:120px; height:70px; border-radius:8px; overflow:hidden; flex-shrink:0; background:var(--panel); display:flex; align-items:center; justify-content:center;">
                    <img src="${thumbUrl}" style="width:100%; height:100%; object-fit:cover; opacity:0.8; transition: opacity 0.3s;" onerror="this.style.opacity='0';">
                    <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.2);">
                        <i data-lucide="play" style="width:24px; color:rgba(255,255,255,0.8); fill:rgba(255,255,255,0.2);"></i>
                    </div>
                </div>
                <div style="flex:1; min-width:0;">
                    <div style="font-size:14px; font-weight:600; color:var(--text); margin-bottom:6px; line-height:1.4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${vid.title}</div>
                    <div style="display:flex; align-items:center; gap:12px; font-size:12px; color:var(--gray);">
                        <span style="display:flex; align-items:center; gap:4px;"><i data-lucide="user" style="width:12px; opacity:0.6;"></i> ${vid.author}</span>
                        <span style="display:flex; align-items:center; gap:4px;"><i data-lucide="clock" style="width:12px; opacity:0.6;"></i> ${vid.duration}</span>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}

function playVideo(youtubeId) {
    document.getElementById('videoListContainer').style.display = 'none';
    const playerContainer = document.getElementById('videoPlayerContainer');
    playerContainer.style.display = 'block';
    const iframe = document.getElementById('videoIframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&origin=${window.location.origin}`;
}
window.playVideo = playVideo;

function closeVideoPlayer() {
    document.getElementById('videoListContainer').style.display = 'block';
    document.getElementById('videoPlayerContainer').style.display = 'none';
    document.getElementById('videoIframe').src = '';
}
window.closeVideoPlayer = closeVideoPlayer;
