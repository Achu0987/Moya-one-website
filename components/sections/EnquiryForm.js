'use client';

import { useState } from 'react';
import { CONTACT } from '@/lib/content';

// PLACEHOLDER: phase 1 has no backend. The form only shows a confirmation.
export default function EnquiryForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card form reveal in" style={{ textAlign: 'center' }}>
        <h3 className="h-md">Thank you.</h3>
        <p style={{ color: 'var(--muted)' }}>
          This is a demo form, so nothing was sent. For now, write to {CONTACT.builderEmail}.
        </p>
        <span>
          <span className="flag">Placeholder: form not connected</span>
        </span>
      </div>
    );
  }

  return (
    <form
      className="card form reveal"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="company">Company</label>
          <input id="company" required autoComplete="organization" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input id="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="city">Project city</label>
          <input id="city" />
        </div>
        <div className="field">
          <label htmlFor="stage">Project stage</label>
          <select id="stage" defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            <option>Planning / design</option>
            <option>Under construction</option>
            <option>Near completion</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="msg">Number of flats and anything else</label>
        <textarea id="msg" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="flag">Placeholder: form not connected</span>
        <button className="btn btn-primary" type="submit">
          Send enquiry
        </button>
      </div>
    </form>
  );
}
