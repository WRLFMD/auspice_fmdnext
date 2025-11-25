type Extensions = {
  [key: string]: any
}

const registry: Extensions = ((): Extensions => {
  if (!process.env.EXTENSION_DATA) {
    return {};
  }

  const extensions: Extensions = typeof process.env.EXTENSION_DATA === "string" ?
    JSON.parse(process.env.EXTENSION_DATA) : process.env.EXTENSION_DATA;

  Object.keys(extensions).forEach((key: string) => {
    if (key.endsWith("Component")) {
      try {
        // Paths are already normalized by webpack config (no leading ./)
        // @extensions alias already points to the correct directory
        const componentPath = extensions[key];
        extensions[key] = require(`@extensions/${componentPath}`).default;
      } catch (err) {
        console.error(`Failed to load extension component ${key}:`, err.message);
      }
    }
  });

  return extensions;
})();

export const getExtension = (what: string): any | false => {
  if (registry[what]) {
    return registry[what];
  }
  console.error("Requested non-existing extension", what);
  return false;
};

export const hasExtension = (what: string): boolean => {
  return Object.keys(registry).includes(what);
};

export const getBasePath = (): string => {
  return registry.basePath || '/';
};

export const shouldSkipSplashToFirstDataset = (): boolean => {
  return registry.skipSplashToFirstDataset === true;
};