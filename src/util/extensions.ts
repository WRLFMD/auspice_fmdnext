// TODO: Add typing for individual extensions.
// See docs/customise-client/api.rst.
type Extensions = {
  [key: string]: any
}

const registry: Extensions = ((): Extensions => {
  if (!process.env.EXTENSION_DATA) {
    // console.log("no EXTENSION_DATA found");
    return {};
  }

  const extensions: Extensions = typeof process.env.EXTENSION_DATA === "string" ?
    JSON.parse(process.env.EXTENSION_DATA) : process.env.EXTENSION_DATA;

  Object.keys(extensions).forEach((key: string) => {
    if (key.endsWith("Component")) {
      // console.log("loading component", key);
      /* "@extensions" is a webpack alias - normalize the path */
      const componentPath = extensions[key].startsWith('./') || extensions[key].startsWith('../')
        ? extensions[key]
        : `./${extensions[key]}`;
      
      extensions[key] = require(`@extensions/${componentPath}`).default;
    }
  });
  // console.log("extensions", extensions);

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

/**
 * Get the base path for the application
 * This is used for client-side routing and navigation
 */
export const getBasePath = (): string => {
  return registry.basePath || '/';
};

export const shouldSkipSplashToFirstDataset = (): boolean => {
  return registry.skipSplashToFirstDataset === true;
};