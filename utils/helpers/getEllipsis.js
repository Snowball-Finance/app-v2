const getEllipsis = str => {
  return `${str.slice(0, 6)}...${str.slice(-4)}`;
};

export default getEllipsis