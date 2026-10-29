/**
 * CBT Assistant - Chat Manager
 * Handles message sending, streaming SSE, markdown formatting, draft preservation,
 * expandable knowledge-source cards, and session history restoration.
 */

var isProc = false;
window.isProc = false;

function currentChatLanguage() {
    return (window.getCurrentLanguage && window.getCurrentLanguage()) || 'en';
}

function sendQuick(txt) {
    const inEl = document.getElementById('msgInput');
    if (!inEl) return;
    inEl.value = txt;
    inEl.style.height = 'auto';
    inEl.style.height = Math.min(inEl.scrollHeight, 120) + 'px';
    sendMessage();
}
window.sendQuick = sendQuick;

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatMarkdown(content) {
    if (!content) return '';
    
    // Check if content already contains rendered HTML (e.g. loader icon)
    if (content.includes('<i data-lucide="loader-2"') || content.startsWith('<div') || content.startsWith('<p>')) {
        return content;
    }

    // Split code blocks out to protect them from inline formatting
    const codeBlocks = [];
    let text = content.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const token = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push(`<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(code.trim())}</code></pre>`);
        return token;
    });

    // Inline code
    const inlineCodes = [];
    text = text.replace(/`([^`\n]+)`/g, (match, code) => {
        const token = `__INLINE_CODE_${inlineCodes.length}__`;
        inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
        return token;
    });

    // Escape HTML in the remaining text
    text = escapeHtml(text);

    // Bold: **text**
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text* or _text_
    text = text.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_\n]+)_/g, '<em>$1</em>');

    // KB Citation badges: [KB:chunk_id]
    text = text.replace(/\[KB:([a-zA-Z0-9_-]+)\]/g, '<span class="cbt-citation" style="display:inline-block; padding:1px 6px; font-size:11px; font-weight:600; border-radius:4px; background:rgba(121,114,152,0.15); color:var(--accent); margin:0 2px;">[KB:$1]</span>');

    // Process lines for paragraphs and lists
    const lines = text.split('\n');
    let inList = false;
    let listType = '';
    const formattedLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Unordered list item
        if (/^[-*•]\s+/.test(trimmed)) {
            if (!inList || listType !== 'ul') {
                if (inList) formattedLines.push(`</${listType}>`);
                formattedLines.push('<ul style="margin: 8px 0; padding-left: 20px;">');
                inList = true;
                listType = 'ul';
            }
            formattedLines.push(`<li>${trimmed.replace(/^[-*•]\s+/, '')}</li>`);
            continue;
        }

        // Ordered list item
        if (/^\d+\.\s+/.test(trimmed)) {
            if (!inList || listType !== 'ol') {
                if (inList) formattedLines.push(`</${listType}>`);
                formattedLines.push('<ol style="margin: 8px 0; padding-left: 20px;">');
                inList = true;
                listType = 'ol';
            }
            formattedLines.push(`<li>${trimmed.replace(/^\d+\.\s+/, '')}</li>`);
            continue;
        }

        // End active list
        if (inList) {
            formattedLines.push(`</${listType}>`);
            inList = false;
            listType = '';
        }

        // Empty line -> paragraph separator
        if (trimmed === '') {
            formattedLines.push('</p><p>');
        } else {
            formattedLines.push(trimmed + '<br>');
        }
    }

    if (inList) {
        formattedLines.push(`</${listType}>`);
    }

    let result = '<p>' + formattedLines.join('') + '</p>';
    // Clean up empty paragraphs and consecutive br tags
    result = result
        .replace(/<p><\/p>/g, '')
        .replace(/<br><\/p>/g, '</p>')
        .replace(/<p><br>/g, '<p>')
        .replace(/(<br>){3,}/g, '<br><br>');

    // Restore code blocks
    codeBlocks.forEach((block, idx) => {
        result = result.replace(`__CODE_BLOCK_${idx}__`, block);
    });
    inlineCodes.forEach((code, idx) => {
        result = result.replace(`__INLINE_CODE_${idx}__`, code);
    });

    return result;
}

function shouldAutoScroll(container) {
    if (!container) return false;
    const threshold = 120;
    return (container.scrollHeight - container.scrollTop - container.clientHeight) < threshold;
}

function scrollToBottom(container, smooth = true) {
    if (!container) return;
    container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

function addMsg(role, content, id = '') {
    const list = document.getElementById('messages');
    if (!list) return null;

    const div = document.createElement('div');
    div.className = 'msg ' + role;
    if (id) div.id = id;

    const avatarIcon = role === 'user' ? 'user' : 'sparkles';
    const parsed = formatMarkdown(content);

    div.innerHTML = `
        <div class="msg-avatar"><i data-lucide="${avatarIcon}" style="width:18px;"></i></div>
        <div class="msg-content">${parsed}</div>
    `;

    const wasNearBottom = shouldAutoScroll(list);
    list.appendChild(div);
    if (window.lucide) window.lucide.createIcons();
    
    if (wasNearBottom || role === 'user') {
        scrollToBottom(list, true);
    }
    return div;
}
window.addMsg = addMsg;

function addRagSources(context, trace, afterElement = null) {
    if (!context || !context.length) return;
    const list = document.getElementById('messages');
    if (!list) return;

    const panel = document.createElement('details');
    panel.className = 'rag-sources';
    panel.style.cursor = 'pointer';

    const titleText = 'Retrieved knowledge sources';
    const summary = document.createElement('summary');
    summary.className = 'rag-sources-title';
    summary.style.display = 'flex';
    summary.style.alignItems = 'center';
    summary.style.justifyContent = 'space-between';
    summary.style.fontWeight = '600';
    summary.style.cursor = 'pointer';
    summary.innerHTML = `<span><i data-lucide="book-open" style="width:14px;vertical-align:middle;margin-right:6px;"></i>${titleText} (${context.length})</span><span style="font-size:11px;color:var(--gray);font-weight:normal;">▼</span>`;
    panel.appendChild(summary);

    context.forEach(item => {
        const source = document.createElement('div');
        source.className = 'rag-source';
        source.style.marginTop = '8px';
        source.style.padding = '8px 10px';
        source.style.background = 'rgba(0,0,0,0.03)';
        source.style.borderRadius = '8px';

        const label = document.createElement('div');
        label.className = 'rag-source-label';
        label.style.fontWeight = '500';
        label.style.marginBottom = '2px';
        label.textContent = item.section_path || item.title || item.source;

        const meta = document.createElement('code');
        meta.style.display = 'block';
        meta.style.color = 'var(--gray)';
        meta.style.fontSize = '11px';
        const scoreStr = item.score !== undefined ? ` · score ${Number(item.score).toFixed(3)}` : '';
        meta.textContent = `[KB:${item.chunk_id || 'chunk'}] · ${item.source || 'guidelines'}${scoreStr}`;

        source.appendChild(label);
        source.appendChild(meta);

        if (item.preview) {
            const preview = document.createElement('div');
            preview.className = 'rag-source-preview';
            preview.style.fontSize = '11px';
            preview.style.color = 'var(--text)';
            preview.style.opacity = '0.85';
            preview.style.marginTop = '4px';
            preview.style.lineHeight = '1.4';
            preview.textContent = item.preview;
            source.appendChild(preview);
        }

        panel.appendChild(source);
    });

    if (trace && trace.trace_id) {
        panel.dataset.traceId = trace.trace_id;
        panel.title = `RAG trace ${trace.trace_id}, index ${trace.index_version || ''}`;
    }

    if (afterElement && afterElement.nextSibling) {
        list.insertBefore(panel, afterElement.nextSibling);
    } else {
        list.appendChild(panel);
    }
    if (window.lucide) window.lucide.createIcons();
    scrollToBottom(list, true);
}
window.addRagSources = addRagSources;

async function loadChatHistory() {
    const list = document.getElementById('messages');
    if (!list) return;

    try {
        const res = await fetch(API + '/api/session/' + encodeURIComponent(SESSION_ID));
        if (!res.ok) return;
        const session = await res.json();
        const history = session.messages || [];

        if (history.length > 0) {
            document.getElementById('welcome')?.remove();
            document.getElementById('mainContainer')?.classList.remove('empty-state');

            history.forEach(msg => {
                let text = msg.content || '';
                // Check if message has evidence block
                let citations = [];
                const evidenceMatch = text.match(/(?:Retrieved evidence):\s*(.+)$/i);
                if (evidenceMatch) {
                    text = text.replace(/(?:\n+)?(?:Retrieved evidence):\s*.+$/i, '').trim();
                }

                const msgEl = addMsg(msg.role, text);
                if (evidenceMatch && msg.role === 'assistant') {
                    // Extract [KB:id] tokens
                    const kbIds = [...evidenceMatch[1].matchAll(/\[KB:([^\]]+)\]/g)].map(m => m[1]);
                    if (kbIds.length > 0) {
                        const fakeContext = kbIds.map(id => ({ chunk_id: id, source: 'clinical_guidelines.md', title: `Guideline chunk ${id}` }));
                        addRagSources(fakeContext, null, msgEl);
                    }
                }
            });

            scrollToBottom(list, false);
        }
    } catch (e) {
        console.warn('Could not restore chat history:', e);
    }
}
window.loadChatHistory = loadChatHistory;

function dispatchClientEvents(events) {
    if (!Array.isArray(events)) return;
    events.forEach(ev => {
        if (!ev || !ev.type) return;
        try {
            if (ev.type === 'add_activity' && window.addActivityFromAI) {
                window.addActivityFromAI(ev.text);
            } else if (ev.type === 'add_thought_record' && window.addThoughtRecordFromAI) {
                window.addThoughtRecordFromAI(ev.record);
            } else if (ev.type === 'add_sleep_log' && window.addSleepLogFromAI) {
                window.addSleepLogFromAI(ev.log);
            } else if (ev.type === 'start_sos_exercise' && window.startSosExerciseFromAI) {
                window.startSosExerciseFromAI(ev);
            } else if (ev.type === 'start_breathing' && window.startBreathingFromAI) {
                window.startBreathingFromAI();
            } else if (ev.type === 'open_test' && window.openTestFromAI) {
                window.openTestFromAI(ev.test_type);
            }
        } catch (err) {
            console.error('Failed to dispatch client event:', ev, err);
        }
    });
}

async function streamChatResponse(messageText, lang) {
    const list = document.getElementById('messages');
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.remove();

    // Create assistant message container for streaming
    const assistantDiv = document.createElement('div');
    assistantDiv.className = 'msg assistant';
    assistantDiv.innerHTML = `
        <div class="msg-avatar"><i data-lucide="sparkles" style="width:18px;"></i></div>
        <div class="msg-content"><p><span class="stream-cursor" style="display:inline-block;width:8px;height:14px;background:var(--accent);vertical-align:middle;animation:blink 0.8s infinite;"></span></p></div>
    `;
    list.appendChild(assistantDiv);
    if (window.lucide) window.lucide.createIcons();
    scrollToBottom(list, true);

    const contentEl = assistantDiv.querySelector('.msg-content');
    let accumulatedText = '';
    let contextUsed = [];
    let ragTrace = null;
    let clientEvents = [];

    const res = await fetch(API + '/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, session_id: SESSION_ID, language: lang })
    });

    if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep partial line in buffer

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const dataStr = trimmed.slice(5).trim();
            if (!dataStr) continue;

            try {
                const parsed = JSON.parse(dataStr);
                if (parsed.error) {
                    throw new Error(parsed.error);
                }
                if (parsed.token) {
                    accumulatedText += parsed.token;
                    contentEl.innerHTML = formatMarkdown(accumulatedText);
                    if (shouldAutoScroll(list)) scrollToBottom(list, false);
                }
                if (parsed.context_used) {
                    contextUsed = parsed.context_used;
                }
                if (parsed.rag_trace) {
                    ragTrace = typeof parsed.rag_trace === 'object' ? parsed.rag_trace : { trace_id: parsed.rag_trace };
                }
                if (parsed.client_event) {
                    clientEvents.push(parsed.client_event);
                }
                if (parsed.done) {
                    if (parsed.full_response) {
                        accumulatedText = parsed.full_response;
                    }
                    if (parsed.context_used) {
                        contextUsed = parsed.context_used;
                    }
                }
            } catch (err) {
                // If it's an explicit error from the server stream, bubble it up
                if (err.message && err.message !== 'Unexpected end of JSON input') {
                    throw err;
                }
            }
        }
    }

    // Finalize assistant message
    contentEl.innerHTML = formatMarkdown(accumulatedText);
    if (contextUsed && contextUsed.length > 0) {
        addRagSources(contextUsed, ragTrace, assistantDiv);
    }
    dispatchClientEvents(clientEvents);

    if (window.ttsEnabled && window.playAssistantSpeech) {
        window.playAssistantSpeech(accumulatedText, lang).catch(() => {});
    }
}

async function sendMessage() {
    const inEl = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');
    if (!inEl) return;

    const txt = inEl.value.trim();
    if (!txt || isProc) return;

    if (window.stopMicInput) window.stopMicInput();

    isProc = true;
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.5';
    }

    // Clear input box
    inEl.value = '';
    inEl.style.height = 'auto';

    document.getElementById('welcome')?.remove();
    document.getElementById('mainContainer')?.classList.remove('empty-state');

    // Add user message to UI immediately
    addMsg('user', txt);

    // Add loading placeholder
    addMsg('assistant', '<i data-lucide="loader-2" style="width:20px; animation: spin 1.5s linear infinite; color: var(--gray);"></i>', 'loading');

    const lang = currentChatLanguage();

    try {
        // Attempt streaming first
        if (window.ReadableStream) {
            try {
                await streamChatResponse(txt, lang);
                return;
            } catch (streamErr) {
                console.warn('Streaming encountered an error; falling back to non-streaming chat:', streamErr);
                // Remove failed stream container if loading indicator is gone
                const loading = document.getElementById('loading');
                if (!loading) {
                    const list = document.getElementById('messages');
                    const lastMsg = list?.lastElementChild;
                    if (lastMsg && lastMsg.classList.contains('assistant')) {
                        lastMsg.remove();
                    }
                    addMsg('assistant', '<i data-lucide="loader-2" style="width:20px; animation: spin 1.5s linear infinite; color: var(--gray);"></i>', 'loading');
                }
            }
        }

        // Non-streaming fallback
        const res = await fetch(API + '/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: txt, session_id: SESSION_ID, language: lang })
        });

        if (!res.ok) {
            throw new Error(`Server returned HTTP ${res.status}`);
        }

        const data = await res.json();
        document.getElementById('loading')?.remove();

        const assistantEl = addMsg('assistant', data.response);
        if (data.context_used && data.context_used.length > 0) {
            addRagSources(data.context_used, data.rag_trace, assistantEl);
        }

        if (data.client_events) {
            dispatchClientEvents(data.client_events);
        }

        if (window.ttsEnabled && window.playAssistantSpeech) {
            window.playAssistantSpeech(data.response, lang).catch(() => {});
        }
    } catch (e) {
        document.getElementById('loading')?.remove();
        console.error('Chat request failed:', e);

        // Restore draft to input box so the user never loses their typed thought
        inEl.value = txt;
        inEl.style.height = 'auto';
        inEl.style.height = Math.min(inEl.scrollHeight, 120) + 'px';

        const errMsg = '⚠️ Connection to the assistant server failed. Your draft has been restored in the input box below. Please try again.';
        addMsg('assistant', errMsg);
    } finally {
        isProc = false;
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
        }
        inEl.focus();
    }
}
window.sendMessage = sendMessage;

async function startNewChat() {
    const oldSessionId = window.SESSION_ID || localStorage.getItem('SESSION_ID');
    if (oldSessionId) {
        try {
            await fetch((window.API || '') + '/api/session/' + encodeURIComponent(oldSessionId) + '/clear', {
                method: 'POST'
            });
        } catch (e) {
            console.warn('Could not clear session on backend:', e);
        }
    }

    // Generate new isolated session id
    const newSessionId = 'session_' + Date.now().toString(36);
    localStorage.setItem('SESSION_ID', newSessionId);
    window.SESSION_ID = newSessionId;

    // Reset input
    const inEl = document.getElementById('msgInput');
    if (inEl) {
        inEl.value = '';
        inEl.style.height = 'auto';
        inEl.focus();
    }

    // Clear messages DOM
    const messages = document.getElementById('messages');
    if (messages) {
        messages.innerHTML = '';

        // Inject initial greeting welcome block
        const welcome = document.createElement('div');
        welcome.id = 'welcome';
        welcome.style.cssText = 'display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding: 60px 0 32px; text-align:center;';
        welcome.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <i data-lucide="sparkle" id="welcomeIcon" style="width:32px; height:32px; color:var(--accent);"></i>
                <h1 id="welcomeText" style="font-family: Georgia, 'Times New Roman', serif; font-size:30px; font-weight:normal; color:var(--text); letter-spacing:-0.5px;">Good afternoon</h1>
            </div>`;
        messages.appendChild(welcome);
    }

    // Reset container to empty-state layout
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
        mainContainer.classList.add('empty-state');
    }

    if (window.lucide) window.lucide.createIcons();
    if (typeof updateWelcomeMsg === 'function') updateWelcomeMsg();
    if (window.applyTranslations) window.applyTranslations();
}
window.startNewChat = startNewChat;
window.restartChat = startNewChat;
