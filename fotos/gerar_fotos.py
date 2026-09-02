# -*- coding: utf-8 -*-
"""Gera as 7 fotos do form-demo via Graydient (mesmo fluxo do guiatransformadora)."""
import json, os, re, sys, time, urllib.request, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
HERE = os.path.dirname(os.path.abspath(__file__))
NF = r"C:\Users\paulo\CANAIS\new-flow"
def load_env(p):
    for l in open(p, encoding="utf-8"):
        m = re.match(r"([A-Z_]+)=(.+)", l.strip())
        if m: os.environ.setdefault(m.group(1), m.group(2).strip())
load_env(os.path.join(NF, ".env"))
TOKEN = os.environ["GRAYDIENT_API_TOKEN"]
BASE = os.environ.get("GRAYDIENT_BASE_URL", "https://my.graydient.ai/api/v3").rstrip("/")

def submit(p, sid):
    body = {"prompt": p, "callback_url": "https://example.com/w", "session_id": sid}
    req = urllib.request.Request(BASE + "/render/", data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/vnd.api+json",
                 "Accept": "application/vnd.api+json"}, method="POST")
    return json.loads(urllib.request.urlopen(req, timeout=60).read().decode())["data"]["attributes"]["render_hash"]

def check(h):
    req = urllib.request.Request(BASE + f"/render/{h}",
        headers={"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.api+json"})
    d = json.loads(urllib.request.urlopen(req, timeout=60).read().decode())["data"]["attributes"]
    if d.get("has_been_rendered"):
        u = []
        for img in d.get("images", []):
            if img.get("url"): u.append(img["url"])
            for m in img.get("media", []):
                if m.get("url"): u.append(m["url"])
        return u or None
    return None

S = (" photorealistic, cinematic, warm golden hour light, Brazilian Cerrado savanna, "
     "earthy green and amber palette, soft haze, gentle film grain, high detail, no text")
SC = {
 "hero":     "Wide landscape of the Brazilian Cerrado at golden hour, a lone yellow ipe tree in full bloom, tall golden grass, twisted trees, dramatic warm sky." + S,
 "casa":     "A modern single-story bioarchitecture house with warm wood, rammed earth walls and large glass openings, nestled in Cerrado vegetation, golden dusk light, cozy warm interior glow." + S,
 "casal":    "A healthy active couple in their late fifties seen from behind, walking together on a nature trail among Cerrado trees at sunset, relaxed, holding hands." + S,
 "mesa":     "A beautiful long wooden dinner table set with fresh healthy Brazilian food in an open-air gourmet terrace at dusk, warm string lights, natural wood and stone, inviting." + S,
 "treino":   "A small group of fit people around sixty doing morning functional training outdoors on a wooden deck surrounded by Cerrado nature, soft golden morning light, energetic and joyful." + S,
 "comunidade":"Four mature friends laughing together around an outdoor fire pit lounge at dusk, warm blankets, Cerrado landscape behind, deep warm tones, connection and belonging." + S,
 "interior": "A serene home interior with natural wood, linen, clay tones and indoor plants, large window framing Cerrado trees, warm afternoon light across the floor, calm and timeless." + S,
}
SEEDS = {k: 771200 + i for i, k in enumerate(SC)}

def main():
    print(f"=== FOTOS FORM · {time.strftime('%H:%M:%S')} ===", flush=True)
    jobs = {k: submit(f"/wf /run:flux {p} /size:1280x720 /seed:{SEEDS[k]}", f"form-{k}") for k, p in SC.items()}
    for k, h in jobs.items(): print(f"  submit {k}: {h}", flush=True)
    res = {k: None for k in jobs}
    def pull(k):
        try: r = check(jobs[k])
        except Exception as e: print(f"  [{k}] err {e}", flush=True); return
        if r:
            res[k] = r; out = f"{HERE}/{k}.png"
            urllib.request.urlretrieve(r[0], out)
            print(f"  [{k}] PRONTO {os.path.getsize(out)//1024}KB", flush=True)
    for t in range(90):
        time.sleep(10)
        pend = [k for k, v in res.items() if v is None]
        if not pend: break
        for k in pend: pull(k)
        if (t + 1) % 6 == 0: print(f"  ...{(t+1)*10}s pend {[k for k,v in res.items() if v is None]}", flush=True)
    for rnd in range(2):
        stuck = [k for k, v in res.items() if v is None]
        if not stuck: break
        for k in stuck:
            jobs[k] = submit(f"/wf /run:flux {SC[k]} /size:1280x720 /seed:{SEEDS[k]+rnd+7}", f"form-{k}-r{rnd}")
            print(f"  [{k}] retry{rnd}", flush=True)
        for t in range(60):
            time.sleep(10)
            pend = [k for k in stuck if res[k] is None]
            if not pend: break
            for k in pend: pull(k)
    print(f"=== FIM · ok={sorted([k for k,v in res.items() if v])} ===", flush=True)
if __name__ == "__main__": main()
