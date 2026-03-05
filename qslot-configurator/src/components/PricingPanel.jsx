import { useMemo, useState } from 'react';
import { calculateBOM } from '../utils/engineering';
import { FINISHES, ACCESSORIES, SHIPPING_TIERS } from '../data/catalog';

export function PricingPanel({ dimensions, profile, finish, accessories, extraSupports, onToggleAccessory }) {
  const [shipping, setShipping] = useState('pickup');

  const bom = useMemo(
    () => calculateBOM(dimensions, profile, FINISHES[finish].multiplier, extraSupports),
    [dimensions, profile, finish, extraSupports]
  );

  const accessoryTotal = useMemo(
    () =>
      accessories.reduce((sum, id) => sum + (ACCESSORIES[id]?.price || 0), 0),
    [accessories]
  );

  const shippingCost = SHIPPING_TIERS[shipping]?.price || 0;
  const grandTotal = bom.pricing.total + accessoryTotal + shippingCost;

  return (
    <div className="pricing-panel">
      <h2 className="panel-title">Your Build</h2>

      {/* Live Price */}
      <div className="price-hero">
        <span className="price-label">Total Price (inc. GST)</span>
        <span className="price-value">${grandTotal.toFixed(2)}</span>
        <span className="price-aud">AUD</span>
      </div>

      {/* Cut List */}
      <div className="bom-section">
        <h3 className="bom-heading">Cut List</h3>
        <table className="bom-table">
          <thead>
            <tr>
              <th>Part</th>
              <th>Length</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {bom.cutList.cuts.map((cut, i) => (
              <tr key={i}>
                <td>{cut.label}</td>
                <td>{cut.length}mm</td>
                <td>×{cut.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bom-summary">
          Total: {bom.cutList.totalCuts} pieces |{' '}
          {(bom.cutList.totalLength / 1000).toFixed(2)}m of {bom.profile}
        </div>
      </div>

      {/* Hardware */}
      <div className="bom-section">
        <h3 className="bom-heading">Hardware Kit</h3>
        <div className="hardware-list">
          <div className="hardware-item">
            <span>L-Brackets</span>
            <span>×{bom.hardware.brackets.quantity}</span>
          </div>
          <div className="hardware-item">
            <span>T-Nuts (inc. 10% spares)</span>
            <span>×{bom.hardware.tNuts.quantity}</span>
          </div>
          <div className="hardware-item">
            <span>Bolts (inc. 10% spares)</span>
            <span>×{bom.hardware.bolts.quantity}</span>
          </div>
          <div className="hardware-item">
            <span>End Caps</span>
            <span>×{bom.hardware.endCaps.quantity}</span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bom-section">
        <h3 className="bom-heading">Price Breakdown</h3>
        <div className="price-breakdown">
          <div className="price-row">
            <span>Aluminum ({FINISHES[finish].name})</span>
            <span>${bom.pricing.aluminum.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Precision Cutting ({bom.cutList.totalCuts} cuts)</span>
            <span>${bom.pricing.cutting.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Hardware Kit</span>
            <span>${bom.pricing.hardware.toFixed(2)}</span>
          </div>
          {accessoryTotal > 0 && (
            <div className="price-row">
              <span>Accessories</span>
              <span>${accessoryTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="price-row">
            <span>Shipping</span>
            <span>
              {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="price-row subtotal">
            <span>Subtotal</span>
            <span>
              ${(bom.pricing.subtotal + accessoryTotal + shippingCost).toFixed(2)}
            </span>
          </div>
          <div className="price-row">
            <span>GST (10%)</span>
            <span>${bom.pricing.gst.toFixed(2)}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Accessories */}
      <div className="bom-section">
        <h3 className="bom-heading">Add Accessories</h3>
        <div className="accessory-grid">
          {Object.entries(ACCESSORIES).map(([id, acc]) => (
            <button
              key={id}
              className={`accessory-btn ${accessories.includes(id) ? 'selected' : ''}`}
              onClick={() => onToggleAccessory(id)}
            >
              <span className="accessory-name">{acc.name}</span>
              <span className="accessory-price">+${acc.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="bom-section">
        <h3 className="bom-heading">Shipping / Pickup</h3>
        <div className="shipping-options">
          {Object.entries(SHIPPING_TIERS).map(([id, tier]) => (
            <label
              key={id}
              className={`shipping-option ${shipping === id ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="shipping"
                value={id}
                checked={shipping === id}
                onChange={() => setShipping(id)}
              />
              <span className="shipping-name">{tier.name}</span>
              <span className="shipping-price">
                {tier.price === 0 ? 'FREE' : `$${tier.price.toFixed(2)}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="cta-button">
        Generate My Custom Build Kit
      </button>
      <p className="cta-note">
        Includes cut-to-length aluminum, complete hardware kit, and
        step-by-step assembly instructions.
      </p>
    </div>
  );
}
