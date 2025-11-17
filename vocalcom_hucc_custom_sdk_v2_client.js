export class IframeVocalcomBridge {
  #iframe;
  #origin;            
  #pending = new Map(); 
  #subs = new Map();   
  #msgId = 0;
  #boundOnMessage;

  constructor(iframeEl, iframeOrigin) {
    this.#iframe = iframeEl;
    this.#origin = iframeOrigin;
    this.#boundOnMessage = this.#onMessage.bind(this);
    window.addEventListener("message", this.#boundOnMessage);
  }

  destroy() {
    window.removeEventListener("message", this.#boundOnMessage);
    this.#pending.clear();
    this.#subs.clear();
  }

  dialManualCall(phoneNumber, campaignId = null) {
    return this.#cmd("dialManualCall", { phoneNumber, campaignId });
  }
  
  callAgain(phoneNumber) {
    return this.#cmd("callAgain", { phoneNumber });
  }
  
  hangUpCall() {
    return this.#cmd("hangUpCall", {});
  }
  
  setDispositionCode(dispositionCode) {
    return this.#cmd("setDispositionCode", { dispositionCode });
  }
  
  getPhoneCallData() {
    return this.#cmd("getPhoneCallData", {});
  }

  on(eventName, handler) {
    if (!this.#subs.has(eventName)) this.#subs.set(eventName, new Set());
    this.#subs.get(eventName).add(handler);
    return () => this.off(eventName, handler);
  }
  off(eventName, handler) {
    this.#subs.get(eventName)?.delete(handler);
  }

  #post(msg) {
    this.#iframe.contentWindow.postMessage(msg, this.#origin);
  }

  #cmd(name, args) {
    const id = "m" + (++this.#msgId);
    const payload = { scope: "vc-bridge", type: "cmd", id, name, args };

    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject, t: setTimeout(() => {
        this.#pending.delete(id);
        reject(new Error(`Timeout waiting response for ${name}`));
      }, 15000)});

      this.#post(payload);
    });
  }

  #onMessage(event) {
    if (event.origin !== this.#origin) return;
    const msg = event.data;
    if (!msg || msg.scope !== "vc-bridge") return;

    if (msg.type === "resp") {
      const pending = this.#pending.get(msg.id);
      if (!pending) return;
      clearTimeout(pending.t);
      this.#pending.delete(msg.id);
      msg.ok ? pending.resolve(msg.data ?? true) : pending.reject(new Error(msg.error || "Unknown error"));
    }
    else if (msg.type === "evt") {
      const set = this.#subs.get(msg.name);
      if (set && set.size) {
        for (const h of set) {
          try { h(msg.payload); } catch {}
        }
      }
    }
  }
}
