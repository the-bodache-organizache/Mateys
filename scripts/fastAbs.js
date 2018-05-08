const fastAbs = value => {
  // funky bitwise, equal Math.abs
  return (value ^ (value >> 31)) - (value >> 31);
};

export default fastAbs;
