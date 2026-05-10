import React from 'react';
import { createRoot } from 'react-dom/client';
import Toast from '../components/Toast';

export function initUI() {
  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Fade-in on scroll
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  faders.forEach(el => observer.observe(el));
}

let toastRoot = null;

export function showToast(message, type = 'info') {
  if (!toastRoot) {
    const container = document.createElement('div');
    container.id = 'toast-root';
    document.body.appendChild(container);
    toastRoot = createRoot(container);
  }
  
  // Create a unique container for this toast to allow multiple toasts
  const toastContainer = document.createElement('div');
  document.getElementById('toast-root').appendChild(toastContainer);
  const root = createRoot(toastContainer);

  root.render(<Toast message={message} type={type} />);

  setTimeout(() => {
    // Add hiding class for animation
    if (toastContainer.firstChild) {
      toastContainer.firstChild.classList.add('hiding');
    }
    setTimeout(() => {
      root.unmount();
      toastContainer.remove();
    }, 300); // Wait for animation to finish
  }, 3000);
}
