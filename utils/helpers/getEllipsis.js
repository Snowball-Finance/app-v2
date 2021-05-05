const getEllipsis = str => {
  return `${str.slice(0, 5)}...${str.slice(-12)}`;
};

export default getEllipsis