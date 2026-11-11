// src/utils/currency.js
// সাইটের মুদ্রা এক জায়গায়। বদলাতে চাইলে শুধু এই ফাইল।
export const CURRENCY_CODE = "USD";
export const CURRENCY_NAME = "US Dollars";

export const formatMoney = (
  value,
  { minimumFractionDigits = 2, maximumFractionDigits = 2 } = {}
) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Number(value) || 0);