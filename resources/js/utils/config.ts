import { usePage } from '@inertiajs/react';

/**
 * Helper function to get configuration value from siteconfig
 * This can be used in any component that has access to usePage()
 */
export function useConfig() {
  const { siteconfig } = usePage().props as any;
  
  const getConfig = (key: string, defaultValue: string = '') => {
    if (Array.isArray(siteconfig)) {
      const config = siteconfig.find((c: any) => c.key === key);
      return config && config.value !== '' ? config.value : defaultValue;
    }
    return defaultValue;
  };

  const getGroup = (group: string) => {
    if (Array.isArray(siteconfig)) {
      const groupConfigs = siteconfig.filter((c: any) => c.group === group);
      const result: Record<string, any> = {};
      groupConfigs.forEach((config: any) => {
        result[config.key] = {
          value: config.value,
          type: config.type,
          label: config.label,
          description: config.description,
        };
      });
      return result;
    }
    return {};
  };

  const getAll = () => {
    if (Array.isArray(siteconfig)) {
      const result: Record<string, any> = {};
      siteconfig.forEach((config: any) => {
        result[config.key] = {
          value: config.value,
          type: config.type,
          label: config.label,
          description: config.description,
          group: config.group,
        };
      });
      return result;
    }
    return {};
  };

  return {
    getConfig,
    getGroup,
    getAll,
    siteconfig,
  };
}

/**
 * Simple hook for getting a single configuration value
 */
export function useConfiguration(key: string, defaultValue: string = '') {
  const { getConfig } = useConfig();
  return getConfig(key, defaultValue);
}

/**
 * Hook for getting configurations from a specific group
 */
export function useGroupConfigurations(group: string) {
  const { getGroup } = useConfig();
  return getGroup(group);
}
