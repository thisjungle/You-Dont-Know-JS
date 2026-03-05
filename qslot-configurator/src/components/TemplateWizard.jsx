import { useState } from 'react';

const LOAD_OPTIONS = [
  {
    id: 'light',
    icon: '💻',
    label: 'Light use',
    desc: 'Laptop, keyboard, small monitor — everyday office or hobby setup',
    kg: 25,
  },
  {
    id: 'standard',
    icon: '🖥️',
    label: 'Standard setup',
    desc: 'Dual monitors, PC tower, peripherals — typical workstation',
    kg: 50,
  },
  {
    id: 'heavy',
    icon: '🔧',
    label: 'Heavy duty',
    desc: 'Tools, test equipment, heavy gear — workshop or industrial use',
    kg: 100,
  },
];

const HEIGHT_OPTIONS = [
  { id: 'sitting', label: 'Sitting height', desc: '680–750mm — standard desk', heightMm: 720 },
  { id: 'standing', label: 'Standing height', desc: '900–1100mm — standing desk', heightMm: 1000 },
  { id: 'bench', label: 'Workbench', desc: '850–950mm — garage/lab bench', heightMm: 900 },
];

export function TemplateWizard({ template, onApply, onClose }) {
  const [loadOption, setLoadOption] = useState('standard');
  const [heightOption, setHeightOption] = useState('sitting');

  function handleApply() {
    const load = LOAD_OPTIONS.find((o) => o.id === loadOption);
    const height = HEIGHT_OPTIONS.find((o) => o.id === heightOption);
    onApply(template, load.kg, height.heightMm);
  }

  const showHeightQuestion = ['executiveDesk', 'garageWorkbench', 'labBench', 'compactDesk'].includes(template.id);

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
          <label className="wizard-label">What will you be loading it with?</label>
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

        {showHeightQuestion && (
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
        )}

        <div className="wizard-footer">
          <button className="wizard-cancel" onClick={onClose}>Cancel</button>
          <button className="wizard-apply" onClick={handleApply}>
            Build this frame →
          </button>
        </div>
      </div>
    </div>
  );
}
