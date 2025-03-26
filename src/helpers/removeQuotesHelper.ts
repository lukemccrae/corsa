export const removeQuotesFromContent = (arr: any[]): any[] => {
    return arr.map((item) => {
      if (Array.isArray(item)) {
        // If the item is an array, process it recursively
        return removeQuotesFromContent(item);
      }
  
      if (item && typeof item === "object") {
        const result: any = {};
        for (const [key, value] of Object.entries(item)) {
          if (key === "content" && typeof value === "string") {
            // If the field is `content`, remove leading/trailing quotes
            result[key] = value.replace(/^"(.+)"$/, "$1");  // Removes only the outermost quotes if present
          } else {
            // Otherwise, process the value recursively
            result[key] = removeQuotesFromContent([value])[0]; // Wrap value in array to reuse the map logic
          }
        }
        return result;
      }
  
      // If it's a primitive (not an object or array), return the value directly
      return item;
    });
  };