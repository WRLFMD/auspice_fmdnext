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
        // Paths come without leading ./ from webpack config
        // Add ./ here for the require
        const componentPath = extensions[key];
        const requirePath = componentPath.startsWith('./') || componentPath.startsWith('../') 
          ? componentPath 
          : './' + componentPath;
        
        console.log(`Loading component ${key} from: @extensions/${requirePath}`);
        extensions[key] = require(`@extensions/${requirePath}`).default;
      } catch (err) {
        console.error(`Failed to load extension component ${key}:`, err.message);
        // Log more details
        console.error('Extension data:', extensions[key]);
        console.error('Full error:', err);
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