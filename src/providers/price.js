import React from "react";
import _ from "lodash";

const PriceContext = React.createContext({});

export const PriceProvider = PriceContext.Provider;

export const getBulletproofPrice = (
  category,
  collection,
  model,
  item,
  prices
) => {
  if (!item || _.isEmpty(item) || !category || !collection) {
    return Number(0);
  }
  const basePrice =
    prices?.basePrices?.[category]?.[collection]?.[item.id]?.price?.[model];
  const markup =
    prices?.markup?.[category]?.[collection]?.[item.id]?.price?.[model];
  const itemPrice = item.price[model];

  if (markup && basePrice) {
    return Number(markup) + Number(basePrice);
  }

  if (markup) {
    return Number(markup) + Number(itemPrice);
  }

  if (basePrice) {
    return Number(basePrice);
  }

  return Number(itemPrice);
};

export const getPrice = (
  category,
  collection,
  item,
  prices,
  alt_price = false
) => {
  if (!item || _.isEmpty(item) || !category || !collection) {
    return Number(0);
  }
  const basePrice =
    prices?.basePrices?.[category]?.[collection]?.[item.id]?.price;
  const markup = prices?.markup?.[category]?.[collection]?.[item.id]?.price;
  const itemPrice = alt_price ? item.alt_price : item.price;

  if (markup && basePrice) {
    return Number(markup) + Number(basePrice);
  }

  if (markup) {
    return Number(markup) + Number(itemPrice);
  }

  if (basePrice) {
    return Number(basePrice);
  }

  return Number(itemPrice);
};

export const getPriceByDoorModel = (
  category,
  collection,
  item,
  prices,
  doorModel
) => {
  if (!item || _.isEmpty(item) || !category || !collection) {
    return Number(0);
  }
  const basePrice =
    prices?.basePrices?.[category]?.[collection]?.[item.id]?.price?.[
      doorModel
    ];
  const markup =
    prices?.markup?.[category]?.[collection]?.[item.id]?.price?.[doorModel];
  const itemPrice = item.price[doorModel] || 0;

  if (markup && basePrice) {
    return Number(markup) + Number(basePrice);
  }

  if (markup) {
    return Number(markup) + Number(itemPrice);
  }

  if (basePrice) {
    return Number(basePrice);
  }

  return Number(itemPrice);
};

export const getMillingPrice = (
  category,
  collection,
  millingsId,
  milling,
  prices
) => {
  if (!milling || _.isEmpty(milling) || !category || !collection) {
    return Number(0);
  }
  const basePrice =
    prices?.basePrices?.[category]?.[collection]?.[millingsId]?.[milling.name]
      ?.price;
  const markup =
    prices?.markup?.[category]?.[collection]?.[millingsId]?.[milling.name]
      ?.price;

  if (markup && basePrice) {
    return Number(markup) + Number(basePrice);
  }

  if (markup) {
    return Number(markup) + Number(milling.price);
  }

  if (basePrice) {
    return Number(basePrice);
  }

  return Number(milling.price);
};

export const getBasePrice = (
  category,
  collection,
  item,
  prices,
  alt_price = false
) => {
  if (!item || _.isEmpty(item) || !category || !collection) {
    return Number(0);
  }
  const basePrice =
    prices?.basePrices?.[category]?.[collection]?.[item.id]?.price;
  if (basePrice) {
    return Number(basePrice);
  }

  return alt_price ? Number(item.alt_price) : Number(item.price);
};

export const getBaseMillingPrice = (
  category,
  collection,
  millingId,
  milling,
  prices
) => {
  if (!milling || _.isEmpty(milling) || !category || !collection) {
    return Number(0);
  }
  const basePrice =
    prices?.basePrices?.[category]?.[collection]?.[millingId]?.[milling.name]
      ?.price;
  if (basePrice) {
    return Number(basePrice);
  }

  return Number(milling.price);
};

export default PriceContext;
