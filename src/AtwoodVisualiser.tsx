import React, { useState } from "react";

const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      border: "3px solid #facc15",
      backgroundColor: "#0f172a",
      color: "#f8fafc",
      borderRadius: "16px",
      padding: "16px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
    }}
  >
    {children}
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 12 }}>{children}</div>
);

const Button = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 14px",
      borderRadius: "12px",
      background: "#020617",
      color: "#fff",
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

const Slider = ({ min, max, step, value, onValueChange }: any) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={e => onValueChange([Number(e.target.value)])}
    style={{ width: "100%" }}
  />
);

const Arrow = ({
  x,
  y,
  direction,
}: {
  x: number;
  y: number;
  direction: "up" | "down";
}) => {
  const dy = direction === "down" ? 30 : -30;
  return (
    <>
      <line x1={x} y1={y} x2={x} y2={y + dy} stroke="#22c55e" strokeWidth="4" />
      <polygon
        points={
          direction === "down"
            ? `${x - 6},${y + dy} ${x + 6},${y + dy} ${x},${y + dy + 12}`
            : `${x - 6},${y + dy} ${x + 6},${y + dy} ${x},${y + dy - 12}`
        }
        fill="#22c55e"
      />
    </>
  );
};

const AtwoodVisualiser: React.FC = () => {
  const [m1, setM1] = useState(0.6); // P
  const [m2, setM2] = useState(0.2); // Q
  const [h, setH] = useState(1.0);
  const [time, setTime] = useState(0.4);
  const [showCD, setShowCD] = useState(false);

  const g = 9.8;
  const a = ((m1 - m2) * g) / (m1 + m2);
  const T = m1 * (g - a);

  const s = 0.5 * Math.abs(a) * time * time;
  const v = Math.abs(a) * time;
  const remaining = Math.max(h - s, 0);

  let tAfter = null;
  if (showCD) {
    const A = 0.5 * g;
    const B = v;
    const C = -remaining;
    const disc = B * B - 4 * A * C;
    if (disc >= 0) {
      tAfter = (-B + Math.sqrt(disc)) / (2 * A);
    }
  }

  const pDown = m1 > m2;
  const qDown = m2 > m1;

  const baseY = 170;      // starting height
  const scale = 60;      // pixels per metre (visual scaling)
  const displacementPx = Math.min(s * scale, 80); // cap to avoid floor overlap

    const pY = !showCD
    ? baseY + (pDown ? displacementPx : -displacementPx)
    : baseY;

    const qY = !showCD
    ? baseY + (qDown ? displacementPx : -displacementPx)
    : baseY;

    const stringEndOffset = 0; // top of block

  return (
    <div className="p-6 grid gap-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Atwood Machine: Mechanics Visualiser</h1>

      {/* Canvas */}
      <Card>
        <svg width="100%" height="320" viewBox="0 0 600 320">
          {/* Pulley */}
          <circle cx="300" cy="60" r="40" fill="#ddd" stroke="#333" />

          {/* Strings */}
            {/* Left string (P) */}
            <line
            x1="260"
            y1="60"
            x2="260"
            y2={pY + stringEndOffset}
            stroke={showCD ? "#94a3b8" : "#333"}
            strokeWidth="2"
            strokeDasharray={showCD ? "6 4" : "0"}
            />

            {/* Right string (Q) */}
            <line
            x1="340"
            y1="60"
            x2="340"
            y2={qY + stringEndOffset}
            stroke={showCD ? "#94a3b8" : "#333"}
            strokeWidth="2"
            strokeDasharray={showCD ? "6 4" : "0"}
            />

            {/* Mass P */}
            <rect x="240" y={pY} width="40" height="40" fill="#60a5fa" rx="6" />
            <text x="252" y={pY + 26} fill="#000">P</text>

            {/* Mass Q */}
            <rect x="320" y={qY} width="40" height="40" fill="#f87171" rx="6" />
            <text x="332" y={qY + 26} fill="#000">Q</text>


          {/* Acceleration arrows (only while string intact) */}
          {!showCD && (
            <>
              <Arrow x={220} y={190} direction={pDown ? "down" : "up"} />
              <Arrow x={380} y={190} direction={qDown ? "down" : "up"} />
            </>
          )}

          {/* Floor (lowered) */}
          <line x1="0" y1="280" x2="600" y2="280" stroke="#000" strokeWidth="3" />
        </svg>

        <Button onClick={() => setShowCD(!showCD)}>
          {showCD ? "🔁 String intact" : "✂️ Break the string"}
        </Button>
      </Card>

      {/* Sliders */}
      <Card>
        <CardContent>
          <label>Mass of P: {m1.toFixed(2)} kg</label>
          <Slider min={0.1} max={1} step={0.01} value={[m1]} onValueChange={(v: number[]) => setM1(v[0])} />
        </CardContent>
        <CardContent>
          <label>Mass of Q: {m2.toFixed(2)} kg</label>
          <Slider min={0.1} max={1} step={0.01} value={[m2]} onValueChange={(v: number[]) => setM2(v[0])} />
        </CardContent>
        <CardContent>
          <label>Height: {h.toFixed(2)} m</label>
          <Slider min={0.1} max={2} step={0.01} value={[h]} onValueChange={(v: number[]) => setH(v[0])} />
        </CardContent>
        <CardContent>
          <label>Time before break: {time.toFixed(2)} s</label>
          <Slider min={0.1} max={1} step={0.01} value={[time]} onValueChange={(v: number[]) => setTime(v[0])} />
        </CardContent>
      </Card>

      {/* Section a & b */}
      {!showCD && (
      <Card>
        <CardContent>
          <p><strong>The acceleration of P immediately after the particles are released:</strong> a = {a.toFixed(2)} m s⁻²</p>
          <p className="mt-2"><strong>The tension in the string immediately after the particles are released:</strong> T = {T.toFixed(2)} N</p>
        </CardContent>
        <CardContent>
          <h2 className="font-semibold">Equations of Motion</h2>
          <p className="text-sm text-gray-600">Step 1: Draw forces</p>
          <p className="text-sm">For P (mass m₁, moving downward):</p>
          <ul className="list-disc list-inside text-sm">
            <li>Weight = m₁g (downward)</li>
            <li>Tension = T (upward)</li>
          </ul>
          <p className="text-sm">For Q (mass m₂, moving upward):</p>
          <ul className="list-disc list-inside text-sm">
            <li>Weight = m₂g (downward)</li>
            <li>Tension = T (upward)</li>
          </ul>
          <p className="text-sm text-gray-600 mt-2">Step 2: Apply Newton’s Second Law</p>
          <p>For P: m₁g − T = m₁a</p>
          <p>For Q: T − m₂g = m₂a</p>
        </CardContent>
      </Card>
        )}
      {/* Section c & d */}
    {showCD && (
      <Card>
        <CardContent>
              <div>
                <p><strong>The further time that elapses until P hits the floor:</strong></p>
                <p>{tAfter ? tAfter.toFixed(2) : "–"} s (2 s.f.)</p>

                <h3 className="font-semibold">State how in your calculations you have used the information that the string is inextensible: </h3>
                <p><strong>Answer:</strong> The string being inextensible means that P and Q have the same acceleration while the string is taut.
                This allows a single acceleration to be used when applying Newton’s second law to both particles.</p>
              </div>
        </CardContent>
        <CardContent>
              <div>
                <h3 className="font-semibold">Further time after the string breaks until P hits the floor</h3>
                <p className="text-sm">Distance fallen in {time.toFixed(2)} s:</p>
                <p className="text-sm">s = ½at² = {s.toFixed(3)} m</p>
                <p className="text-sm">Height remaining above the floor:</p>
                <p className="text-sm">{remaining.toFixed(3)} m</p>
                <p className="text-sm">Speed of P when the string breaks:</p>
                <p className="text-sm">v = at = {v.toFixed(2)} m s⁻¹</p>
                <p className="text-sm mt-2">Motion after the string breaks:</p>
                <p className="text-sm">s = ut + ½gt²</p>
              </div>
        </CardContent>
      </Card>
          )}
    </div>
  );
}

export default AtwoodVisualiser;
