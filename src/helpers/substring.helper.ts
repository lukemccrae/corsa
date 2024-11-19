export const shortenName = (name: string) => {
    if(name.length > 45) return name.substring(0, 45) + '...';
    return name;
  }