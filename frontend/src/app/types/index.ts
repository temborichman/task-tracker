export interface AccountSettings {
  email: string;
  name: string;
  avatar: string;
  connectedAccounts: {
    provider: string;
    email: string;
    name: string;
  }[];
}

export interface DataStorageSettings {
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackup: string | null;
  cloudSync: boolean;
  cloudProvider: 'google' | 'dropbox' | 'onedrive' | null;
}

export interface TaskManagementSettings {
  defaultPriority: 'low' | 'medium' | 'high';
  defaultCategory: string;
  autoArchive: boolean;
  archiveAfterDays: number;
  categories: string[];
  taskPreferences: {
    showCompleted: boolean;
    sortBy: 'dueDate' | 'priority' | 'createdAt';
    groupBy: 'category' | 'priority' | 'none';
  };
}

export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  timezone: string;
  account: AccountSettings;
  dataStorage: DataStorageSettings;
  taskManagement: TaskManagementSettings;
  updatedAt: string;
} 