const formatIndianCurrency = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-IN')}/-`;
};

const formatterExports = {
  formatIndianCurrency,
};

export default formatterExports;
