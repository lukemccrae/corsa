export const shortenName = (name: string) => {
    if(name.length > 20) return name.substring(0, 20) + '...';
    return name;
  }