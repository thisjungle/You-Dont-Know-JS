import { useState } from 'react';

const LOAD_OPTIONS = [
  {
    id: 'light',
    icon: '📦',
    label: 'Light use',
    desc: 'Electronics, 3D printing, hobby projects — under 25kg',
    kg: 25,
  },
  {
    id: 'standard',
    icon: '🔧',
    label: 'General workshop',
    desc: 'Power tools, parts, general repair work — up to 50kg',
    kg: 50,
  },
  {
    id: 'heavy',
    icon: '⚙️',
    label: 'Heavy duty',
    desc: 'Engine blocks, welding, vice work — up to 100kg',
    kg: 100,
  },
  {
    id: 'extreme',
    icon: '🏗️',
    label: 'Industrial',
    desc: 'Serious fabrication, anvil, heavy machinery — 150kg+',
    kg: 150,
  },
];

const HEIGHT_OPTIONS = [
  { id: 'low', label: 'Seated height', desc: '750mm — working while seated', heightMm: 750 },
  { id: 'standard', label: 'Standard bench', desc: '900mm — most comfortable for standing work', heightMm: 900 },
  { id: 'tall', label: 'Tall bench', desc: '1000mm — for tall people or precision work', heightMm: 1000 },
];

export function TemplateWizard({ template, onApply, onClose }) {
  const [loadOption, setLoadOption] = useState('standard');
  const [heightOption, setHeightOption] = useState('standard');

  function handleApply() {
    const load = LOAD_OPTIONS.find((o) => o.id === loadOption);
    const height = HEIGHT_OPTIONS.find((o) => o.id === heightOption);
    onApply(template, load.kg, height.heightMm);
  }

  return (
    <div className="wizard-overlay" onClick={onClose}>
      <div className="wizard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wizard-header">
          <span className="wizard-icon">{template.icon}</span>
          <div>
            <h3 className="wizard-title">{template.name}</h3>
            <p className="wizard-desc">{template.description}</p>
          </div>
        </div>

        <div className="wizard-question">
          <label className="wizard-label">What kind of work will you do?</label>
          <div className="wizard-options">
            {LOAD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className={`wizard-option ${loadOption === opt.id ? 'active' : ''}`}
                onClick={() => setLoadOption(opt.id)}
              >
                <span className="wizard-opt-icon">{opt.icon}</span>
                <div>
                  <strong>{opt.label}</strong>
                  <span>{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-question">
          <label className="wizard-label">What height works for you?</label>
          <div className="wizard-options">
            {HEIGHT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className={`wizard-option ${heightOption === opt.id ? 'active' : ''}`}
                onClick={() => setHeightOption(opt.id)}
              >
                <div>
                  <strong>{opt.label}</strong>
                  <span>{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-footer">
          <button className="wizard-cancel" onClick={onClose}>Cancel</button>
          <button className="wizard-apply" onClick={handleApply}>
            Build this bench →
          </button>
        </div>
      </div>
    </div>
  );
}
