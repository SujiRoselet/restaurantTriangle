const mTokm = (meterValue) => {
  let kmValue = meterValue / 1000;
  return Math.ceil(kmValue);
};

module.exports = mTokm;
