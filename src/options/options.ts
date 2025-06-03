import type { ExtensionOptions } from '../types';
import { loadOptions, saveOptions } from '../utils/userOptions';
import { mount } from 'svelte';
import App from './App.svelte';

// Update UI based on current options
const updateUI = (options: ExtensionOptions): void => {
  const portInput = document.getElementById('ankiConnectPort') as HTMLInputElement;
  portInput.value = options.ankiConnectPort.toString();
};

// Show save status message
const showSaveStatus = (): void => {
  const saveStatus = document.getElementById('saveStatus');
  if (saveStatus) {
    saveStatus.classList.add('visible');
    setTimeout(() => {
      saveStatus.classList.remove('visible');
    }, 2000);
  }
};

// Initialize options page
const initializeOptions = async (): Promise<void> => {
  // Load and display current options
  updateUI(await loadOptions());

  // Add event listeners
  const saveButton = document.getElementById('save');
  const portInput = document.getElementById('ankiConnectPort') as HTMLInputElement;

  if (saveButton) {
    saveButton.addEventListener('click', async () => {
      const port = parseInt(portInput.value, 10);
      if (port >= 1 && port <= 65535) {
        await saveOptions({ ankiConnectPort: port });
        showSaveStatus();
      } else {
        alert('Please enter a valid port number between 1 and 65535');
      }
    });
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeOptions);

mount(App, {
  target: document.getElementById('app') as HTMLElement,
});
