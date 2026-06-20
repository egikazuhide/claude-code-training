/* 収録コンパニオン（テレプロンプター） — pure JS, ビルド不要 */
(function () {
  "use strict";

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  function buildRubyRegex(dict) {
    const sorted = dict.slice().sort((a, b) => b[0].length - a[0].length);
    const escaped = sorted.map(([w]) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    return { re: new RegExp(escaped.join("|"), "g"), map: new Map(sorted) };
  }

  function applyRuby(text, rubyIndex) {
    const escaped = escapeHtml(text);
    if (!rubyIndex) return escaped;
    return escaped.replace(rubyIndex.re, (m) => {
      const reading = rubyIndex.map.get(m);
      return `<ruby>${m}<rt>${reading}</rt></ruby>`;
    });
  }

  function fmtTime(totalSec) {
    totalSec = Math.max(0, Math.floor(totalSec));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  class TeleprompterApp {
    constructor(episodeData, rubyIndex) {
      this.data = episodeData;
      this.rubyIndex = rubyIndex;
      this.flatLines = [];
      this.allSilences = [];
      this.flattenData();

      this.elapsedSec = 0;
      this.isRecording = false;
      this.isPlaying = false;
      this.speed = 32; // px/sec
      this.fontSize = 38;
      this.furiganaOn = true;
      this.ngList = [];
      this.stopList = [];
      this.pendingStopStart = null;
      this.scrollY = 0;
      this.activeSilenceFreeze = null; // { hit, enteredAtMs, duration }
      this.completedSilences = new Set();
      this.recTimer = null;
      this.lastTickMs = 0;
      this.isPreRolling = false;
      this.preRollTimer = null;
      this.rafId = null;

      this.root = null;
      this.lineEls = [];
      this.boundKeydown = this.onKeydown.bind(this);
    }

    flattenData() {
      let idx = 0;
      this.data.blocks.forEach((block, bIdx) => {
        block.silences.forEach((s) => this.allSilences.push({ start: s[0], end: s[1], label: s[2] || "間（無音）" }));
        block.lines.forEach((line) => {
          this.flatLines.push({
            globalIdx: idx++,
            blockIdx: bIdx,
            blockName: block.name,
            text: line.text,
            cue: line.cue,
            timeSec: line.timeSec,
          });
        });
      });
      this.allSilences.sort((a, b) => a.start - b.start);
    }

    open() {
      this.buildDom();
      document.body.appendChild(this.root);
      document.addEventListener("keydown", this.boundKeydown);
      requestAnimationFrame(() => this.tickFrame());
    }

    close() {
      document.removeEventListener("keydown", this.boundKeydown);
      this.stopRecordingTimer();
      if (this.preRollTimer) clearInterval(this.preRollTimer);
      cancelAnimationFrame(this.rafId);
      if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
    }

    buildDom() {
      const root = document.createElement("div");
      root.id = "tp-overlay";
      root.className = "tp-furigana-on";

      root.innerHTML = `
        <div class="tp-topbar">
          <div class="tp-rec-indicator" id="tpRecIndicator"><span class="tp-rec-dot"></span><span id="tpTimecode">00:00</span></div>
          <button class="tp-btn tp-btn-rec" id="tpRecBtn" title="R">⏺ 録画 (R)</button>
          <button class="tp-btn tp-btn-play" id="tpPlayBtn" title="Space">▶ 流す (Space)</button>
          <button class="tp-btn tp-btn-ng" id="tpNgBtn" title="N">⚠ NG (N)</button>
          <div class="tp-slider-group">速さ<input type="range" id="tpSpeed" min="10" max="80" value="${this.speed}"></div>
          <div class="tp-slider-group">文字<input type="range" id="tpFontSize" min="20" max="64" value="${this.fontSize}"></div>
          <label class="tp-toggle"><input type="checkbox" id="tpFurigana" checked> ふりがな (F)</label>
          <button class="tp-btn tp-btn-close" id="tpCloseBtn" title="Esc">✕ 終了</button>
        </div>
        <div class="tp-body">
          <div class="tp-sidebar">
            <div>
              <h4>ブロック進行</h4>
              <ul class="tp-block-list" id="tpBlockList"></ul>
            </div>
            <div>
              <h4>整合性チェック</h4>
              <div id="tpChecklist"></div>
            </div>
            <div>
              <h4>NGマーカー</h4>
              <ul class="tp-ng-list" id="tpNgList"><li class="tp-ng-empty">まだありません</li></ul>
            </div>
            <div>
              <h4>停止履歴</h4>
              <ul class="tp-ng-list tp-stop-list" id="tpStopList"><li class="tp-ng-empty">まだありません</li></ul>
            </div>
          </div>
          <div class="tp-prompter-wrap">
            <div class="tp-blocktimer" id="tpBlockTimer">
              <div class="tp-bt-name" id="tpBtName">-</div>
              <div id="tpBtTime">00:00 / 00:00</div>
              <div class="tp-bt-delta" id="tpBtDelta"></div>
            </div>
            <div class="tp-readline"></div>
            <div class="tp-scroll" id="tpScroll">
              <div class="tp-lines" id="tpLines"></div>
            </div>
            <div class="tp-nextcue-bar">
              <span class="tp-nextcue-label">次の操作</span>
              <span class="tp-nextcue-text tp-empty" id="tpNextCue">—</span>
            </div>
            <div class="tp-silence-overlay" id="tpSilenceOverlay" hidden>
              <div class="tp-silence-num" id="tpSilenceNum">5</div>
              <div class="tp-silence-label" id="tpSilenceLabel">間（無音）</div>
            </div>
          </div>
        </div>
      `;
      this.root = root;
      this.cacheEls();
      this.renderBlockList();
      this.renderChecklist();
      this.renderLines();
      this.wireEvents();
      this.applyFontSize();
    }

    cacheEls() {
      const r = this.root;
      this.el = {
        recIndicator: r.querySelector("#tpRecIndicator"),
        timecode: r.querySelector("#tpTimecode"),
        recBtn: r.querySelector("#tpRecBtn"),
        playBtn: r.querySelector("#tpPlayBtn"),
        ngBtn: r.querySelector("#tpNgBtn"),
        speed: r.querySelector("#tpSpeed"),
        fontSize: r.querySelector("#tpFontSize"),
        furigana: r.querySelector("#tpFurigana"),
        closeBtn: r.querySelector("#tpCloseBtn"),
        blockList: r.querySelector("#tpBlockList"),
        checklist: r.querySelector("#tpChecklist"),
        ngList: r.querySelector("#tpNgList"),
        stopList: r.querySelector("#tpStopList"),
        blockTimer: r.querySelector("#tpBlockTimer"),
        btName: r.querySelector("#tpBtName"),
        btTime: r.querySelector("#tpBtTime"),
        btDelta: r.querySelector("#tpBtDelta"),
        scroll: r.querySelector("#tpScroll"),
        lines: r.querySelector("#tpLines"),
        nextCue: r.querySelector("#tpNextCue"),
        silenceOverlay: r.querySelector("#tpSilenceOverlay"),
        silenceNum: r.querySelector("#tpSilenceNum"),
        silenceLabel: r.querySelector("#tpSilenceLabel"),
      };
    }

    renderBlockList() {
      this.el.blockList.innerHTML = this.data.blocks
        .map(
          (b, i) => `
        <li class="tp-block-item" data-block="${i}">
          ${escapeHtml(b.name)}
          <span class="tp-block-time">${fmtTime(b.startSec)}〜${fmtTime(b.endSec)}</span>
        </li>`
        )
        .join("");
    }

    renderChecklist() {
      const warnings = this.data.warnings || [];
      if (!warnings.length) {
        this.el.checklist.innerHTML = `<div class="tp-checklist ok">✅ 問題は見つかりませんでした</div>`;
      } else {
        this.el.checklist.innerHTML = warnings
          .map((w) => `<div class="tp-warn-item">⚠ ${escapeHtml(w)}</div>`)
          .join("");
      }
    }

    renderLines() {
      this.el.lines.innerHTML = this.flatLines
        .map(
          (l) =>
            `<div class="tp-line tp-upcoming" data-idx="${l.globalIdx}">${applyRuby(l.text, this.rubyIndex)}</div>`
        )
        .join("");
      this.lineEls = Array.from(this.el.lines.querySelectorAll(".tp-line"));
    }

    wireEvents() {
      this.el.recBtn.addEventListener("click", () => this.toggleRecording());
      this.el.playBtn.addEventListener("click", () => this.togglePlay());
      this.el.ngBtn.addEventListener("click", () => this.markNg());
      this.el.closeBtn.addEventListener("click", () => Teleprompter.close());
      this.el.speed.addEventListener("input", (e) => (this.speed = Number(e.target.value)));
      this.el.fontSize.addEventListener("input", (e) => {
        this.fontSize = Number(e.target.value);
        this.applyFontSize();
      });
      this.el.furigana.addEventListener("change", (e) => {
        this.furiganaOn = e.target.checked;
        this.root.classList.toggle("tp-furigana-off", !this.furiganaOn);
      });
      this.el.scroll.addEventListener("wheel", (e) => {
        this.scrollY += e.deltaY;
        this.scrollY = Math.max(0, this.scrollY);
        this.applyScroll();
      });
    }

    applyFontSize() {
      this.root.style.setProperty("--tp-font-size", this.fontSize + "px");
    }

    toggleRecording() {
      if (this.isRecording) {
        this.isRecording = false;
        this.el.recIndicator.classList.remove("is-rec");
        this.el.recBtn.classList.remove("is-rec");
        this.el.recBtn.textContent = "⏺ 録画 (R)";
        this.stopRecordingTimer();
        return;
      }
      if (this.isPreRolling) return;
      this.startPreRoll();
    }

    startPreRoll() {
      this.isPreRolling = true;
      this.el.recBtn.disabled = true;
      let remaining = 5;
      this.el.silenceOverlay.hidden = false;
      this.el.silenceLabel.textContent = "録画開始まで";
      this.el.silenceNum.textContent = remaining;
      this.preRollTimer = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(this.preRollTimer);
          this.preRollTimer = null;
          this.el.silenceOverlay.hidden = true;
          this.isPreRolling = false;
          this.el.recBtn.disabled = false;
          this.beginRecording();
        } else {
          this.el.silenceNum.textContent = remaining;
        }
      }, 1000);
    }

    beginRecording() {
      this.isRecording = true;
      this.elapsedSec = 0;
      this.completedSilences = new Set();
      this.activeSilenceFreeze = null;
      this.pendingStopStart = null;
      this.el.recIndicator.classList.add("is-rec");
      this.el.recBtn.classList.add("is-rec");
      this.el.recBtn.textContent = "⏹ 停止 (R)";
      this.el.timecode.textContent = fmtTime(0);
      this.startRecordingTimer();
      if (!this.isPlaying) this.togglePlay();
    }

    startRecordingTimer() {
      this.lastTickMs = performance.now();
      this.recTimer = setInterval(() => this.tickRecording(), 200);
    }

    stopRecordingTimer() {
      if (this.recTimer) clearInterval(this.recTimer);
      this.recTimer = null;
    }

    tickRecording() {
      const now = performance.now();

      if (this.activeSilenceFreeze) {
        // カウントダウン中はタイムコードを進めない。残り時間は壁時計時間で計算する
        const elapsedInSilence = (now - this.activeSilenceFreeze.enteredAtMs) / 1000;
        const remaining = this.activeSilenceFreeze.duration - elapsedInSilence;
        if (remaining <= 0) {
          this.elapsedSec = this.activeSilenceFreeze.hit.end;
          this.completedSilences.add(this.activeSilenceFreeze.hit);
          this.activeSilenceFreeze = null;
          this.el.silenceOverlay.hidden = true;
        } else {
          this.el.silenceNum.textContent = Math.ceil(remaining);
          this.el.silenceLabel.textContent = this.activeSilenceFreeze.hit.label;
        }
      } else {
        const delta = (now - this.lastTickMs) / 1000;
        this.elapsedSec += delta;
        const hit = this.allSilences.find(
          (s) => !this.completedSilences.has(s) && this.elapsedSec >= s.start && this.elapsedSec < s.end
        );
        if (hit) {
          this.elapsedSec = hit.start;
          this.activeSilenceFreeze = { hit, enteredAtMs: now, duration: hit.end - hit.start };
          this.el.silenceOverlay.hidden = false;
          this.el.silenceNum.textContent = Math.ceil(hit.end - hit.start);
          this.el.silenceLabel.textContent = hit.label;
        }
      }

      this.lastTickMs = now;
      this.el.timecode.textContent = fmtTime(this.elapsedSec);
    }

    togglePlay() {
      this.isPlaying = !this.isPlaying;
      this.el.playBtn.classList.toggle("is-playing", this.isPlaying);
      this.el.playBtn.textContent = this.isPlaying ? "⏸ 止める (Space)" : "▶ 流す (Space)";
      if (!this.isPlaying) {
        // 流すを止めた瞬間＝停止区間の開始
        this.pendingStopStart = this.elapsedSec;
      } else if (this.pendingStopStart != null) {
        // 再度流した瞬間＝停止区間の終了
        this.stopList.push({ start: this.pendingStopStart, end: this.elapsedSec });
        this.pendingStopStart = null;
        this.renderStopList();
      }
    }

    pausePlay() {
      if (this.isPlaying) this.togglePlay();
    }

    markNg() {
      this.pausePlay();
      const current = this.getCurrentLine();
      const entry = { time: this.elapsedSec, blockName: current ? current.blockName : this.data.blocks[0].name };
      this.ngList.push(entry);
      this.renderNgList();
      this.flash();
    }

    renderStopList() {
      if (!this.stopList.length) {
        this.el.stopList.innerHTML = `<li class="tp-ng-empty">まだありません</li>`;
        return;
      }
      this.el.stopList.innerHTML = this.stopList
        .map((s) => {
          const dur = Math.max(0, Math.round(s.end - s.start));
          return `<li>${fmtTime(s.start)} 〜 ${fmtTime(s.end)}（${dur}秒）</li>`;
        })
        .join("");
    }

    renderNgList() {
      if (!this.ngList.length) {
        this.el.ngList.innerHTML = `<li class="tp-ng-empty">まだありません</li>`;
        return;
      }
      this.el.ngList.innerHTML = this.ngList
        .map((n) => `<li>${fmtTime(n.time)} - ${escapeHtml(n.blockName)}</li>`)
        .join("");
    }

    flash() {
      this.root.classList.remove("tp-flash");
      // reflow trick to restart animation
      void this.root.offsetWidth;
      this.root.classList.add("tp-flash");
    }

    jumpToBlock(delta) {
      const current = this.getCurrentLine();
      const curBlockIdx = current ? current.blockIdx : 0;
      const targetIdx = Math.min(Math.max(curBlockIdx + delta, 0), this.data.blocks.length - 1);
      const targetLine = this.flatLines.find((l) => l.blockIdx === targetIdx);
      if (targetLine) this.scrollToLine(targetLine.globalIdx);
    }

    scrollToLine(globalIdx) {
      const el = this.lineEls[globalIdx];
      if (!el) return;
      const containerH = this.el.scroll.clientHeight;
      const readlineY = containerH * 0.38;
      const elCenter = el.offsetTop + el.offsetHeight / 2;
      this.scrollY = Math.max(0, elCenter - readlineY);
      this.applyScroll();
    }

    applyScroll() {
      this.el.lines.style.transform = `translateY(${-this.scrollY}px)`;
    }

    getCurrentLine() {
      if (!this.lineEls.length) return null;
      const containerH = this.el.scroll.clientHeight;
      const readlineY = this.scrollY + containerH * 0.38;
      let best = null;
      let bestDist = Infinity;
      this.lineEls.forEach((el, i) => {
        const center = el.offsetTop + el.offsetHeight / 2;
        const dist = Math.abs(center - readlineY);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best != null ? this.flatLines[best] : null;
    }

    tickFrame() {
      if (this.isPlaying) {
        this.scrollY += this.speed / 60;
        this.applyScroll();
      }
      this.updateHighlight();
      this.updateNextCue();
      this.updateBlockTimer();
      this.rafId = requestAnimationFrame(() => this.tickFrame());
    }

    updateHighlight() {
      const current = this.getCurrentLine();
      if (!current) return;
      this.lineEls.forEach((el, i) => {
        el.classList.remove("tp-current", "tp-upcoming");
        if (i < current.globalIdx) {
          // 通過済み：暗いまま（デフォルトの tp-line 色）
        } else if (i === current.globalIdx) {
          el.classList.add("tp-current");
        } else {
          el.classList.add("tp-upcoming");
        }
      });
      this.el.blockList.querySelectorAll(".tp-block-item").forEach((el) => {
        el.classList.toggle("is-current", Number(el.dataset.block) === current.blockIdx);
      });
    }

    updateNextCue() {
      const current = this.getCurrentLine();
      if (!current) return;
      let cueText = null;
      for (let i = current.globalIdx; i < this.flatLines.length; i++) {
        if (this.flatLines[i].cue) {
          cueText = this.flatLines[i].cue;
          break;
        }
      }
      if (cueText) {
        this.el.nextCue.textContent = cueText;
        this.el.nextCue.classList.remove("tp-empty");
      } else {
        this.el.nextCue.textContent = "—";
        this.el.nextCue.classList.add("tp-empty");
      }
    }

    updateBlockTimer() {
      const current = this.getCurrentLine();
      const block = current ? this.data.blocks[current.blockIdx] : this.data.blocks[0];
      this.el.btName.textContent = block.name;
      this.el.btTime.textContent = `${fmtTime(this.elapsedSec)} / 目標${fmtTime(block.endSec)}`;
      const delta = this.elapsedSec - block.endSec;
      if (this.isRecording && current && current.blockIdx === this.data.blocks.length - 1 && delta > 0) {
        this.el.btDelta.textContent = `+${Math.round(delta)}秒 押している`;
        this.el.btDelta.className = "tp-bt-delta behind";
      } else if (this.isRecording) {
        const remain = block.endSec - this.elapsedSec;
        if (remain < 0) {
          this.el.btDelta.textContent = `+${Math.round(-remain)}秒 押している`;
          this.el.btDelta.className = "tp-bt-delta behind";
        } else {
          this.el.btDelta.textContent = `残り${Math.round(remain)}秒`;
          this.el.btDelta.className = "tp-bt-delta ahead";
        }
      } else {
        this.el.btDelta.textContent = "";
      }
    }

    onKeydown(e) {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          this.togglePlay();
          break;
        case "r":
        case "R":
          this.toggleRecording();
          break;
        case "n":
        case "N":
          this.markNg();
          break;
        case "Enter":
        case "ArrowDown":
          e.preventDefault();
          this.jumpToBlock(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          this.jumpToBlock(-1);
          break;
        case "[":
          this.speed = Math.max(10, this.speed - 4);
          this.el.speed.value = this.speed;
          break;
        case "]":
          this.speed = Math.min(80, this.speed + 4);
          this.el.speed.value = this.speed;
          break;
        case "f":
        case "F":
          this.furiganaOn = !this.furiganaOn;
          this.el.furigana.checked = this.furiganaOn;
          this.root.classList.toggle("tp-furigana-off", !this.furiganaOn);
          break;
        case "Escape":
          Teleprompter.close();
          break;
      }
    }
  }

  let currentApp = null;
  let rubyIndex = null;

  window.Teleprompter = {
    open(episodeNum) {
      const num = episodeNum || window.TP_EPISODE;
      const data = window.TELEPROMPTER_DATA && window.TELEPROMPTER_DATA[num];
      if (!data) {
        alert("収録モード用のデータが見つかりませんでした（第" + num + "回）。");
        return;
      }
      if (!rubyIndex && window.TELEPROMPTER_READING_DICT) {
        rubyIndex = buildRubyRegex(window.TELEPROMPTER_READING_DICT);
      }
      if (currentApp) currentApp.close();
      currentApp = new TeleprompterApp(data, rubyIndex);
      currentApp.open();
    },
    close() {
      if (currentApp) {
        currentApp.close();
        currentApp = null;
      }
    },
  };
})();
