const fs = require('fs');
const path = require('path');

const settingsFilePath = path.join(__dirname, '../data/settings.json');

// Default settings
const defaultSettings = {
  theme: 'light',
  notifications: true,
  language: 'en',
  timezone: 'UTC',
  account: {
    email: '',
    name: '',
    avatar: '',
    connectedAccounts: []
  },
  dataStorage: {
    backupEnabled: true,
    backupFrequency: 'daily',
    lastBackup: null,
    cloudSync: false,
    cloudProvider: null
  },
  taskManagement: {
    categories: ['Work', 'Personal', 'Shopping', 'Health'],
    defaultView: 'list',
    sortBy: 'dueDate',
    showCompleted: true
  },
  updatedAt: new Date().toISOString()
};

class SettingsModel {
  static async getSettings() {
    try {
      if (!fs.existsSync(settingsFilePath)) {
        await this.updateSettings(defaultSettings);
        return defaultSettings;
      }
      const data = await fs.promises.readFile(settingsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading settings:', error);
      return defaultSettings;
    }
  }

  static async updateSettings(newSettings) {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ...newSettings,
        updatedAt: new Date().toISOString()
      };
      
      // Ensure data directory exists
      const dataDir = path.dirname(settingsFilePath);
      if (!fs.existsSync(dataDir)) {
        await fs.promises.mkdir(dataDir, { recursive: true });
      }
      
      await fs.promises.writeFile(
        settingsFilePath,
        JSON.stringify(updatedSettings, null, 2)
      );
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  static async updateAccountSettings(accountSettings) {
    const settings = await this.getSettings();
    return this.updateSettings({
      account: { ...settings.account, ...accountSettings }
    });
  }

  static async updateDataStorageSettings(storageSettings) {
    const settings = await this.getSettings();
    return this.updateSettings({
      dataStorage: { ...settings.dataStorage, ...storageSettings }
    });
  }

  static async updateTaskManagementSettings(taskSettings) {
    const settings = await this.getSettings();
    return this.updateSettings({
      taskManagement: { ...settings.taskManagement, ...taskSettings }
    });
  }
}

module.exports = SettingsModel; 