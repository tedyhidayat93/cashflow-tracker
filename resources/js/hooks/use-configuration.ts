import { useState, useEffect, useCallback } from 'react';

export interface ConfigurationItem {
  value: string;
  type: string;
  label: string;
  description: string;
  group?: string;
}

export interface ConfigurationData {
  [key: string]: ConfigurationItem;
}

export interface GroupedConfigurations {
  [group: string]: ConfigurationData;
}

export interface ConfigurationResponse {
  configurations: ConfigurationData;
  grouped: GroupedConfigurations;
  group?: string;
}

// Cache for configurations
let configurationCache: ConfigurationData | null = null;
let groupedCache: GroupedConfigurations | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch configurations from API
 */
const fetchConfigurations = async (group?: string): Promise<ConfigurationResponse> => {
  const url = group ? `/api/configurations/${group}` : '/api/configurations';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch configurations');
  }
  
  return response.json();
};

/**
 * Hook to get all configurations
 */
export function useConfigurations(group?: string) {
  const [configurations, setConfigurations] = useState<ConfigurationData>({});
  const [grouped, setGrouped] = useState<GroupedConfigurations>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchConfigurations(group);
      
      setConfigurations(data.configurations);
      setGrouped(data.grouped);
      
      // Update cache
      if (!group) {
        configurationCache = data.configurations;
        groupedCache = data.grouped;
        cacheTimestamp = Date.now();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [group]);

  useEffect(() => {
    // Check cache first for all configurations
    if (!group && configurationCache && groupedCache && 
        Date.now() - cacheTimestamp < CACHE_DURATION) {
      setConfigurations(configurationCache);
      setGrouped(groupedCache);
      setLoading(false);
      return;
    }

    loadConfigurations();
  }, [group, loadConfigurations]);

  const refetch = useCallback(() => {
    // Clear cache for refetch
    if (!group) {
      configurationCache = null;
      groupedCache = null;
      cacheTimestamp = 0;
    }
    loadConfigurations();
  }, [group, loadConfigurations]);

  return {
    configurations,
    grouped,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get a single configuration value
 */
export function useConfiguration(key: string, defaultValue: string = '') {
  const [value, setValue] = useState<string>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchConfigurations();
      const configValue = data.configurations[key]?.value || defaultValue;
      
      setValue(configValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setValue(defaultValue);
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue]);

  useEffect(() => {
    // Check cache first
    if (configurationCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      const cachedValue = configurationCache[key]?.value || defaultValue;
      setValue(cachedValue);
      setLoading(false);
      return;
    }

    loadConfiguration();
  }, [key, defaultValue, loadConfiguration]);

  const refetch = useCallback(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  return {
    value,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to get configurations from a specific group
 */
export function useGroupConfigurations(groupName: string) {
  const [configurations, setConfigurations] = useState<ConfigurationData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroupConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchConfigurations(groupName);
      setConfigurations(data.configurations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [groupName]);

  useEffect(() => {
    // Check cache first
    if (groupedCache && groupedCache[groupName] && 
        Date.now() - cacheTimestamp < CACHE_DURATION) {
      setConfigurations(groupedCache[groupName]);
      setLoading(false);
      return;
    }

    loadGroupConfigurations();
  }, [groupName, loadGroupConfigurations]);

  const refetch = useCallback(() => {
    loadGroupConfigurations();
  }, [loadGroupConfigurations]);

  return {
    configurations,
    loading,
    error,
    refetch,
  };
}

/**
 * Utility function to get configuration value synchronously (from cache)
 * Note: This should only be used when you're sure configurations are already loaded
 */
export function getConfig(key: string, defaultValue: string = ''): string {
  if (configurationCache && configurationCache[key]) {
    return configurationCache[key].value;
  }
  return defaultValue;
}

/**
 * Utility function to get group configurations synchronously (from cache)
 */
export function getGroupConfig(groupName: string): ConfigurationData {
  if (groupedCache && groupedCache[groupName]) {
    return groupedCache[groupName];
  }
  return {};
}

/**
 * Preload configurations for better performance
 */
export function preloadConfigurations() {
  if (!configurationCache || Date.now() - cacheTimestamp >= CACHE_DURATION) {
    fetchConfigurations().then(data => {
      configurationCache = data.configurations;
      groupedCache = data.grouped;
      cacheTimestamp = Date.now();
    }).catch(() => {
      // Silently fail for preloading
    });
  }
}
