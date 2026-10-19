"use client";
import { useState } from "react";
import type { Lesson } from "@/lib/types";

export function Simulation({
  type,
  interest,
}: {
  type: Lesson["simulation"];
  interest: string;
}) {
  const [value, setValue] = useState(
    type === "projectile" ? 35 : type === "ratio" ? 6 : 3,
  );
  const [oxygen, setOxygen] = useState(2);
  if (type === "ratio") {
    const design = interest === "Design";
    const business = interest === "Business";
    const result = design ? value * 0.75 : value * 75;
    return (
      <div className="simulation">
        <div className="simulation-heading">
          <span className="mini-label">INTERACTIVE MODEL</span>
          <span>Direct proportion</span>
        </div>
        <div className="ratio-visual">
          <div>
            <div className="ratio-bar" style={{ height: 64 }} />
            <span>Reference</span>
            <strong>
              {design
                ? "4 × 3 cm"
                : business
                  ? "4 items · ₹300"
                  : "4 servings · 300 g"}
            </strong>
          </div>
          <div className="ratio-equals">× {(value / 4).toFixed(2)}</div>
          <div>
            <div className="ratio-bar target" style={{ height: value * 16 }} />
            <span>Your model</span>
            <strong>
              {design
                ? `${value} × ${result} cm`
                : business
                  ? `${value} items · ₹${result}`
                  : `${value} servings · ${result} g`}
            </strong>
          </div>
        </div>
        <label className="range-label">
          {design
            ? "Width"
            : business
              ? "Number of items"
              : "Number of servings"}
          <output>
            {value}
            {design ? " cm" : ""}
          </output>
          <input
            aria-label={
              design
                ? "Width"
                : business
                  ? "Number of items"
                  : "Number of servings"
            }
            type="range"
            min="2"
            max="12"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </label>
        <p className="simulation-prompt">
          Predict first: if you double the input, what happens to the output?
          Explain what stays constant.
        </p>
      </div>
    );
  }
  if (type === "projectile") {
    const angle = (value * Math.PI) / 180;
    const u = 20;
    const g = 10;
    const time = (2 * u * Math.sin(angle)) / g;
    const range = u * Math.cos(angle) * time;
    const height = (u * u * Math.sin(angle) ** 2) / (2 * g);
    const points = Array.from({ length: 61 }, (_, i) => {
      const t = (time * i) / 60;
      return `${40 + u * Math.cos(angle) * t * 9},${220 - (u * Math.sin(angle) * t - (g * t * t) / 2) * 8}`;
    }).join(" ");
    return (
      <div className="simulation">
        <div className="simulation-heading">
          <span className="mini-label">INTERACTIVE MODEL</span>
          <span>u = 20 m/s · g = 10 m/s²</span>
        </div>
        <svg
          viewBox="0 0 450 250"
          role="img"
          aria-label={`Ideal projectile at ${value} degrees, range ${range.toFixed(1)} metres`}
          className="trajectory-chart"
        >
          {[0, 10, 20, 30, 40].map((x) => (
            <g key={x}>
              <line
                x1={40 + x * 9}
                y1="30"
                x2={40 + x * 9}
                y2="220"
                stroke="#dce5df"
              />
              <text x={40 + x * 9} y="240" textAnchor="middle">
                {x} m
              </text>
            </g>
          ))}
          {[0, 10, 20].map((y) => (
            <g key={y}>
              <line
                x1="40"
                y1={220 - y * 8}
                x2="410"
                y2={220 - y * 8}
                stroke="#dce5df"
              />
              <text x="29" y={224 - y * 8} textAnchor="end">
                {y}
              </text>
            </g>
          ))}
          <polyline
            points={points}
            fill="none"
            stroke="#245d4b"
            strokeWidth="3"
          />
          <circle cx="40" cy="220" r="5" fill="#c88d48" />
          <circle cx={40 + range * 9} cy="220" r="5" fill="#245d4b" />
        </svg>
        <label className="range-label">
          Launch angle<output>{value}°</output>
          <input
            aria-label="Launch angle"
            type="range"
            min="10"
            max="80"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </label>
        <div className="model-results">
          <div>
            <strong>{range.toFixed(1)} m</strong>
            <span>Range</span>
          </div>
          <div>
            <strong>{height.toFixed(1)} m</strong>
            <span>Peak height</span>
          </div>
          <div>
            <strong>{time.toFixed(2)} s</strong>
            <span>Flight time</span>
          </div>
        </div>
        <p className="simulation-prompt">
          Compare 30° with 60°. What stays the same, and what changes? Assumes
          no drag and equal launch and landing heights.
        </p>
      </div>
    );
  }
  if (type === "inheritance") {
    const second = value === 1 ? ["t", "t"] : ["T", "t"];
    const combinations = ["T", "t"].flatMap((a) => second.map((b) => a + b));
    const recessive = combinations.filter((c) => c === "tt").length;
    return (
      <div className="simulation">
        <div className="simulation-heading">
          <span className="mini-label">INTERACTIVE MODEL</span>
          <span>One gene · complete dominance</span>
        </div>
        <label className="range-label">
          Cross
          <select
            aria-label="Parent cross"
            value={value === 1 ? "1" : "2"}
            onChange={(e) => setValue(Number(e.target.value))}
          >
            <option value="2">Tt × Tt</option>
            <option value="1">Tt × tt</option>
          </select>
        </label>
        <div
          className="punnett"
          role="img"
          aria-label={`Punnett square. Offspring combinations ${combinations.join(", ")}. Recessive probability ${recessive}/4.`}
        >
          <span className="gamete" />
          {second.map((a, i) => (
            <span className="gamete" key={`head-${i}`}>
              {a}
            </span>
          ))}
          {["T", "t"].map((a) => (
            <div key={a} style={{ display: "contents" }}>
              <span className="gamete">{a}</span>
              {second.map((b, i) => (
                <span key={i}>{a + b === "tT" ? "Tt" : a + b}</span>
              ))}
            </div>
          ))}
        </div>
        <div className="model-results">
          <div>
            <strong>{4 - recessive}/4</strong>
            <span>Dominant phenotype</span>
          </div>
          <div>
            <strong>{recessive}/4</strong>
            <span>Recessive phenotype</span>
          </div>
          <div>
            <strong>
              {combinations.filter((c) => c === "Tt" || c === "tT").length}/4
            </strong>
            <span>Heterozygous</span>
          </div>
        </div>
        <p className="simulation-prompt">
          Each box is equally likely in this model. It is not a schedule of four
          births. Compare the crosses and explain why the probabilities change.
        </p>
      </div>
    );
  }
  const cooking = interest === "Cooking";
  const extent = Math.min(value / (cooking ? 1 : 2), oxygen);
  const product = extent * (cooking ? 1 : 2);
  return (
    <div className="simulation">
      <div className="simulation-heading">
        <span className="mini-label">INTERACTIVE MODEL</span>
        <span>Complete conversion · ideal reaction</span>
      </div>
      <div className="reaction-display">
        {cooking ? "HCO₃⁻ + H⁺ → CO₂ + H₂O" : "2H₂ + O₂ → 2H₂O"}
      </div>
      <label className="range-label">
        {cooking ? "Hydrogen carbonate" : "Hydrogen"}
        <output>{value} mol</output>
        <input
          aria-label={cooking ? "Hydrogen carbonate" : "Hydrogen"}
          type="range"
          min="0.5"
          max="6"
          step="0.5"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </label>
      <label className="range-label">
        {cooking ? "Hydrogen ions" : "Oxygen"}
        <output>{oxygen} mol</output>
        <input
          aria-label={cooking ? "Hydrogen ions" : "Oxygen"}
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={oxygen}
          onChange={(e) => setOxygen(Number(e.target.value))}
        />
      </label>
      <div className="model-results">
        <div>
          <strong>{product} mol</strong>
          <span>{cooking ? "CO₂ formed" : "H₂O formed"}</span>
        </div>
        <div>
          <strong>{value - extent * (cooking ? 1 : 2)} mol</strong>
          <span>{cooking ? "HCO₃⁻ remaining" : "H₂ remaining"}</span>
        </div>
        <div>
          <strong>{oxygen - extent} mol</strong>
          <span>{cooking ? "H⁺ remaining" : "O₂ remaining"}</span>
        </div>
      </div>
      <p className="simulation-prompt">
        Add more of the excess reactant. Why does the product stop increasing?
        This models mole ratios, not mass ratios.
      </p>
    </div>
  );
}
