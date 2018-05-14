const threshold = value => {
  // return white or black
  return value > 0x15 ? 0xff : 0;
};

export default threshold;
