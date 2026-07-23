import _ from "lodash";
import {
  getPrice,
  getBulletproofPrice,
  getMillingPrice,
} from "../providers/price";

export const getDimensionsPrice = (doorModel, height, width, p) => {
  if (doorModel?.key === "max" || doorModel?.key === "fe15") {
    return getGerlockMaxPrice(height, width, p);
  }

  return getGerlockClassicPrice(height, width, p);
};

const iterateDimensionPrices = (sortedDimensions, width, height) => {
  for (let i = 0; i < sortedDimensions.length; i++) {
    if (Number(sortedDimensions[i].id) >= width) {
      if (
        (sortedDimensions.length > i + 1 &&
          Number(sortedDimensions[i + 1].id) < width) ||
        sortedDimensions.length === i + 1
      ) {
        for (let j = 0; j < sortedDimensions[i].heights.length; j++) {
          if (Number(sortedDimensions[i].heights[j].id) >= height) {
            if (
              (sortedDimensions[i].heights.length > j + 1 &&
                Number(sortedDimensions[i].heights[j + 1].id) < height) ||
              sortedDimensions[i].heights.length === j + 1
            ) {
              return sortedDimensions[i].heights[j].price;
            }
          }
        }
      }
    } else if (
      Number(sortedDimensions[i].id) < width &&
      sortedDimensions.length === i + 1
    ) {
      for (let j = 0; j < sortedDimensions[i].heights.length; j++) {
        if (Number(sortedDimensions[i].heights[j].id) >= height) {
          if (
            (sortedDimensions[i].heights.length > j + 1 &&
              Number(sortedDimensions[i].heights[j + 1].id) < height) ||
            sortedDimensions[i].heights.length === j + 1
          ) {
            return sortedDimensions[i].heights[j].price;
          }
        }
      }
    }
  }

  return 0;
};

export const getGerlockMaxPrice = (height, width, p) => {
  if (!height || !width) {
    return "Wrong dimensions";
  }

  let basePrice = p?.basePrices?.dimensions?.dimensionsMax;
  let markup = p?.markup?.dimensions?.dimensionsMax;

  if (basePrice) {
    basePrice = iterateDimensionPrices(
      _.orderBy(basePrice, "id", "desc"),
      width,
      height
    );
  }

  if (markup) {
    markup = iterateDimensionPrices(
      _.orderBy(markup, "id", "desc"),
      width,
      height
    );
  }

  const sortedDimensions = _.orderBy(p.dimensionsMax, "id", "desc");
  const itemPrice = iterateDimensionPrices(sortedDimensions, width, height);

  if (markup && basePrice) {
    return Number(markup) + Number(basePrice);
  }

  if (markup) {
    return Number(markup) + Number(itemPrice);
  }

  if (basePrice) {
    return Number(basePrice);
  }

  return itemPrice;
};

const getGerlockClassicPrice = (height, width, p) => {
  if (!height || !width) {
    return 0;
  }

  let basePrice = p?.basePrices?.dimensions?.dimensionsClassic;
  let markup = p?.markup?.dimensions?.dimensionsClassic;

  if (basePrice) {
    basePrice = iterateDimensionPrices(
      _.orderBy(basePrice, "id", "desc"),
      width,
      height
    );
  }

  if (markup) {
    markup = iterateDimensionPrices(
      _.orderBy(markup, "id", "desc"),
      width,
      height
    );
  }

  const sortedDimensions = _.orderBy(p.dimensionsClassic, "id", "desc");
  const itemPrice = iterateDimensionPrices(sortedDimensions, width, height);

  if (markup && basePrice) {
    return Number(markup) + Number(basePrice);
  }

  if (markup) {
    return Number(markup) + Number(itemPrice);
  }

  if (basePrice) {
    return Number(basePrice);
  }

  return itemPrice;
};

export const calculateFinishingDoorTypePrice = (
  doorTypePrice,
  doorTypePrices,
  doorModel,
  height,
  width
) => {
  if (doorTypePrice.type === "none") {
    return 0;
  }

  const { dimensions } = _.find(
    doorTypePrices,
    (item) => item.id === doorTypePrice.id
  );

  if (doorTypePrice.type === "percentage_size") {
    for (const price of doorTypePrice.prices) {
      if (dimensions >= price.size_from && dimensions < price.size_to) {
        return ((Number(doorModel.price) / 100) * price.price).toFixed(2);
      }
    }

    return 0;
  }

  if (doorTypePrice.type === "fixed") {
    if (dimensions >= 500) {
      return doorTypePrice.price;
    }

    return doorTypePrice.price / 2;
  }

  if (doorTypePrice.type === "percentage_size_fixed") {
    let finalPrice = 0;

    for (const price of doorTypePrice.prices) {
      if (dimensions >= price.size_from && dimensions < price.size_to) {
        finalPrice = ((Number(doorModel.price) / 100) * price.price).toFixed(2);
      }
    }

    return finalPrice + doorTypePrice.fixed;
  }

  return 0;
};

export const calculateDoorTypePrice = (
  doorTypePrices,
  doorModelPrice,
  doorType,
  doorModel,
  totalWidth,
  totalHeight,
  p
) => {
  return [...doorTypePrices].reduce((accumulator, doorTypePrice) => {
    if (doorTypePrice.type === "none") {
      return Number(accumulator);
    }

    const { dimensions } = _.find(
      doorTypePrices,
      (item) => item.id === doorTypePrice.id
    );

    if (!dimensions || dimensions <= 0) {
      return Number(accumulator);
    }

    let nonStandardPrice = 0;

    if (doorTypePrice.position === "side") {
      nonStandardPrice = getDimensionsPrice(
        doorModel,
        totalHeight,
        doorTypePrice.dimensions,
        p
      );
    } else if (doorTypePrice.position === "top") {
      nonStandardPrice = getDimensionsPrice(
        doorModel,
        doorTypePrice.dimensions,
        totalWidth,
        p
      );
    }

    if (doorTypePrice.type === "percentage_size") {
      const actualPrice =
        doorTypePrice.position === "top" &&
        doorType.wider &&
        doorTypePrice.alt_prices
          ? doorTypePrice.alt_prices
          : doorTypePrice.prices;

      for (const [index, price] of actualPrice.entries()) {
        if (
          (dimensions >= price.size_from && dimensions < price.size_to) ||
          doorTypePrice.prices.length === index + 1
        ) {
          return Number(
            Number(nonStandardPrice) +
              Number(accumulator) +
              Number(((Number(doorModelPrice) / 100) * price.price).toFixed(2))
          );
        }
      }

      return Number(accumulator);
    }

    if (doorTypePrice.type === "fixed") {
      if (dimensions >= 500) {
        return Number(
          Number(accumulator) +
            Number(nonStandardPrice) +
            Number(doorTypePrice.price)
        );
      }

      return Number(
        Number(accumulator) +
          Number(nonStandardPrice) +
          Number(Number(doorTypePrice.price / 2).toFixed(2))
      );
    }

    if (doorTypePrice.type === "percentage_size_fixed") {
      let finalPrice = 0;
      const actualPrice =
        doorTypePrice.position === "top" &&
        doorType.wider &&
        doorTypePrice.alt_prices
          ? doorTypePrice.alt_prices
          : doorTypePrice.prices;

      for (const [index, price] of actualPrice.entries()) {
        if (
          (dimensions >= price.size_from && dimensions < price.size_to) ||
          doorTypePrice.prices.length === index + 1
        ) {
          finalPrice = Number(
            Number(nonStandardPrice) +
              ((Number(doorModelPrice) / 100) * price.price).toFixed(2)
          );
        }
      }

      return Number(
        Number(accumulator) + Number(finalPrice) + Number(doorTypePrice.fixed)
      );
    }

    return Number(accumulator);
  }, 0);
};

export const getHingesCapsPrice = (hingeCaps, hinges, hingeCapFinishing, p) => {
  if (!hingeCaps || !hingeCaps.caps) {
    return 0;
  }
  const hingesCount = hinges.reduce((accumulator, item) => {
    return Number(accumulator) + Number(item.hinge.quantity);
  }, 0);

  return (
    hingesCount *
    hingeCapFinishing.reduce((accumulator, hinge) => {
      return Number(
        Number(accumulator) +
          getPrice("hinges", "hinge_cap_finishings", hinge, p)
      );
    }, 0)
  );
};

export const getExploitationPrice = (exploitation, doorTypePrices) => {
  if (!exploitation) {
    return 0;
  }

  if (exploitation.id === "exterior") {
    if (doorTypePrices.length > 0) {
      return Number(exploitation.prices.double_leaf.price);
    }
    // if (doorTypePrices.some((price) => price.isPassive)) {
    //   return Number(exploitation.prices.double_leaf.price);
    // }
    return Number(exploitation.prices.single_leaf.price);
  }

  return 0;
};

export const getHingesPrice = (hinges, p) => {
  return hinges.reduce((accumulator, hinge) => {
    return Number(
      Number(accumulator) + Number(getPrice("hinges", "hinges", hinge.hinge, p))
    );
  }, 0);
};

export const getPanelFinishingPrice = (finishing, doorType, p) => {
  const price = getPrice("finishing", "finishings", finishing, p);

  if (
    price &&
    finishing.doorTypePrice &&
    (finishing.doorTypePrice.type === "percentage_size" ||
      finishing.doorTypePrice.type === "fixed" ||
      finishing.doorTypePrice.type === "percentage_size_fixed")
  ) {
    if (
      finishing.doorTypePrice.position === "top" &&
      doorType?.wider &&
      finishing.doorTypePrice.dimensions < 500
    ) {
      return Number(price / 2);
    }

    return Number(price);
  }
  return Number(price);
};

export const getFinishingsPrice = (finishings, doorType, p) => {
  if (
    !_.get(finishings, "internal", false) ||
    !_.get(finishings, "external", false)
  ) {
    return 0;
  }

  const internal = finishings.internal.reduce((accumulator, finishing) => {
    let price = 0;
    price += getPanelFinishingPrice(finishing, doorType, p);
    price += getMillingPrice(
      "finishing",
      "millings",
      finishing.millings,
      finishing.milling,
      p
    );
    price += Number(finishing.customColorPrice || 0);

    return Number(Number(price) + Number(accumulator));
  }, 0);

  const external = finishings.external.reduce((accumulator, finishing) => {
    let price = 0;
    price += getPanelFinishingPrice(finishing, doorType, p);
    price += getMillingPrice(
      "finishing",
      "millings",
      finishing.millings,
      finishing.milling,
      p
    );
    price += Number(finishing.customColorPrice || 0);

    return Number(Number(price) + Number(accumulator));
  }, 0);

  return internal + external;
};

export const getArchitravesPrice = (
  architraves,
  hingeMultiplier,
  oppositeMultiplier,
  doorType,
  p
) => {
  let price = 0;

  const hingeSide = getPrice(
    "architraves",
    "architraves",
    architraves?.hingeSide,
    p,
    architraves?.hingeSide?.double && doorType.double
  );
  const oppositeSide = getPrice(
    "architraves",
    "architraves",
    architraves?.oppositeSide,
    p,
    architraves?.oppositeSide?.double && doorType.double
  );

  price += hingeMultiplier ? Number(hingeSide * 2) : Number(hingeSide);

  if (oppositeMultiplier && _.get(architraves, "oppositeSide.alt_price", 0)) {
    price += getPrice(
      "architraves",
      "architraves",
      architraves.oppositeSide,
      p,
      true
    );
  } else {
    price += Number(oppositeSide);
  }

  return price;
};

export const getLockPrice = (mainLock, p) => {
  return mainLock ? getPrice("locks", mainLock.collection, mainLock, p) : 0;
};

export const getCylinderPrice = (cylinder, p) => {
  return cylinder ? getPrice("locks", "cylinders", cylinder, p) : 0;
};

export const getExtraCylinderPrice = (cylinder, p) => {
  return cylinder ? getPrice("extra_locks", "extra_cylinders", cylinder, p) : 0;
};

export const getExtraLockPrice = (extraLock, p) => {
  return extraLock ? getPrice("extra_locks", "extra_locks", extraLock, p) : 0;
};

export const getHandlePrice = (handle, p) => {
  let interior = 0;
  let exterior = 0;

  if (
    handle?.interior?.set &&
    handle?.exterior?.set &&
    handle?.interior?.id === handle?.exterior?.id
  ) {
    interior = getPrice("handles", "handles", handle?.interior, p);
  } else {
    interior = getPrice("handles", "handles", handle?.interior, p);
    exterior = getPrice("handles", "handles", handle?.exterior, p);
  }

  return Number(interior) + Number(exterior);
};

export const getAccessoriesPrice = (accessories, p) => {
  return accessories.reduce((accumulator, item) => {
    if (item?.quantity && Number(item?.quantity)) {
      return (
        Number(accumulator) +
        Number(getPrice("accessories", "other_accessories", item, p)) *
          Number(item.quantity)
      );
    }
    return (
      Number(accumulator) +
      Number(getPrice("accessories", "other_accessories", item, p))
    );
  }, 0);
};

const getDoorModelKey = (key) => {
  if (key === "fe15") {
    return "max";
  }

  if (key === "fe5") {
    return "classic";
  }

  return key;
};

export const getGlassPrice = (glass, doorModel) => {
  const price = glass.reduce((accumulator, item) => {
    return (
      Number(accumulator) +
      item.glass.reduce((accumulator, thing) => {
        if (
          thing.glassPack.id === "GLASS_ADDON_TYPE_2" ||
          thing.glassPack.id === "GLASS_ADDON_TYPE_4"
        ) {
          const glassShape = thing.glassShape;
          return (
            Number(accumulator) +
            Number(
              glassShape.price[
                thing.glassPack.id === "GLASS_ADDON_TYPE_2"
                  ? getDoorModelKey(doorModel.key)
                  : `${getDoorModelKey(doorModel.key)}_thick`
              ]
            ) +
            Number(thing.glassFilm.price[glassShape.id]) +
            Number(thing.glassAddon.price[glassShape.id])
          );
        } else if (thing.glassPack.id === "GLASS_ADDON_TYPE_3") {
          return (
            Number(accumulator) +
            Number(
              thing.glassBulletproofType.price[getDoorModelKey(doorModel.key)]
            ) +
            Number(
              thing?.glassBulletproofAddon?.price[
                thing?.glassBulletproofSize?.id
              ] || 0
            )
          );
        }
        return Number(accumulator);
      }, 0)
    );
  }, 0);

  return Number(price);
};

export const getThresholdPrice = (threshold, thresholdMultiplier, p) => {
  if (threshold && threshold.price) {
    if (threshold.selected_options) {
      return threshold.selected_options.reduce((accumulator, option) => {
        return (
          Number(accumulator) +
          Number(
            thresholdMultiplier > 1
              ? getPrice("thresholds", "thresholds", option, p, true)
              : getPrice("thresholds", "thresholds", option, p)
          )
        );
      }, 0);
    } else {
      return Number(
        getPrice("thresholds", "thresholds", threshold, p) * thresholdMultiplier
      );
    }
  }

  return 0;
};

export const getLockAccessoryPrice = (mainLockAccessories, p) => {
  return mainLockAccessories.reduce((accumulator, item) => {
    if (item.quantifiable && item.quantity) {
      return (
        Number(accumulator) +
        Number(getPrice("thresholds", "thresholds", item, p)) * item.quantity
      );
    }
    return (
      Number(accumulator) +
      Number(getPrice("thresholds", "thresholds", item, p))
    );
  }, 0);
};

export const getElectricStrikePrice = (electricStrike, p) => {
  return Number(getPrice("locks", "electric_strikes", electricStrike, p));
};

export const getHingeAccessoryPrice = (hingeAccessories = [], p) => {
  return hingeAccessories.reduce((accumulator, item) => {
    if (item.quantifiable && item.quantity) {
      return (
        Number(accumulator) +
        Number(getPrice("hinges", "hinge_accessories", item, p)) * item.quantity
      );
    }
    return (
      Number(accumulator) +
      Number(getPrice("hinges", "hinge_accessories", item, p))
    );
  }, 0);
};

export default (spec, p) => {
  const {
    doorModel,
    bulletproofModel,
    doorColor,
    width,
    height,
    exploitation,
    doorTypePrices,
    hinges,
    hingeCaps,
    hingeCapFinishing,
    hingeAccessories,
    finishings,
    architraves,
    hingeMultiplier,
    oppositeMultiplier,
    threshold,
    thresholdMultiplier,
    mainLock,
    electricStrike,
    extraLock,
    handle,
    accessories,
    cylinder,
    extraCylinder,
    glass,
    mainLockAccessories,
    doorType,
    handleNote,
    modelNote,
    typeNote,
    dimensionNote,
    colorNote,
    hingeNote,
    finishingNote,
    architraveNote,
    thresholdNote,
    lockNote,
    extraLockNote,
    accessoryNote,
    glassNote,
  } = spec;
  let price = 0;

  const doorModelPrice =
    doorModel && doorModel.price
      ? Number(getPrice("model", "door_types", doorModel, p))
      : 0;

  const bulletproofModelPrice =
    bulletproofModel && bulletproofModel.price
      ? Number(
          getBulletproofPrice(
            "model",
            "bulletproofModel",
            getDoorModelKey(doorModel.key),
            bulletproofModel,
            p
          )
        )
      : 0;

  const dimensionsPrice = Number(
    getDimensionsPrice(doorModel, height, width, p)
  );
  const exploitationPrice = Number(
    getExploitationPrice(exploitation, doorTypePrices)
  );
  const doorTypePrice = Number(
    calculateDoorTypePrice(
      doorTypePrices,
      doorModelPrice,
      doorType,
      doorModel,
      width,
      height,
      p
    )
  );
  const doorColorPrice = Number(_.get(doorColor, "price", 0));
  const hingesPrice = Number(getHingesPrice(hinges, p));
  const hingesCapsPrice = Number(
    getHingesCapsPrice(hingeCaps, hinges, hingeCapFinishing, p)
  );
  const finishingsPrice = Number(getFinishingsPrice(finishings, doorType, p));
  const architravesPrice = Number(
    getArchitravesPrice(
      architraves,
      hingeMultiplier,
      oppositeMultiplier,
      doorType,
      p
    )
  );
  const hingeAccessoriesPrice = Number(
    getHingeAccessoryPrice(hingeAccessories, p)
  );
  const thresholdPrice = Number(
    getThresholdPrice(threshold, thresholdMultiplier, p)
  );
  const lockPrice = Number(getLockPrice(mainLock, p));
  const extraLockPrice = Number(getExtraLockPrice(extraLock, p));
  const handlePrice = Number(getHandlePrice(handle, p));
  const accessoriesPrice = Number(getAccessoriesPrice(accessories, p));
  const glassPrice = Number(getGlassPrice(glass, doorModel));
  const cylinderPrice = Number(getCylinderPrice(cylinder, p));
  const extraCylinderPrice = Number(getExtraCylinderPrice(extraCylinder, p));
  const lockAccessoryPrice = Number(
    getLockAccessoryPrice(mainLockAccessories, p)
  );
  const electricStrikePrice = Number(getElectricStrikePrice(electricStrike, p));

  const handleNotePrice = Number(handleNote?.price) || 0;
  const modelNotePrice = Number(modelNote?.price) || 0;
  const typeNotePrice = Number(typeNote?.price) || 0;
  const dimensionNotePrice = Number(dimensionNote?.price) || 0;
  const colorNotePrice = Number(colorNote?.price) || 0;
  const hingeNotePrice = Number(hingeNote?.price) || 0;
  const finishingNotePrice = Number(finishingNote?.price) || 0;
  const architraveNotePrice = Number(architraveNote?.price) || 0;
  const thresholdNotePrice = Number(thresholdNote?.price) || 0;
  const lockNotePrice = Number(lockNote?.price) || 0;
  const extraLockNotePrice = Number(extraLockNote?.price) || 0;
  const accessoryNotePrice = Number(accessoryNote?.price) || 0;
  const glassNotePrice = Number(glassNote?.price) || 0;

  // console.log("doorModelPrice", doorModelPrice);
  // console.log("bulletproofModelPrice", bulletproofModelPrice);
  // console.log("dimensionsPrice", dimensionsPrice);
  // console.log("exploitationPrice", exploitationPrice);
  // console.log("doorTypePrice", doorTypePrice);
  // console.log("doorColorPrice", doorColorPrice);
  // console.log("hingesPrice", hingesPrice);
  // console.log("hingesCapsPrice", hingesCapsPrice);
  // console.log("hingeAccessoriesPrice", hingeAccessoriesPrice);
  // console.log("electricStrikePrice", electricStrikePrice);
  // console.log("finishingsPrice", finishingsPrice);
  // console.log("architravesPrice", architravesPrice);
  // console.log("thresholdPrice", thresholdPrice);
  // console.log("lockPrice", lockPrice);
  // console.log("extraLockPrice", extraLockPrice);
  // console.log("handlePrice", handlePrice);
  // console.log("accessoriesPrice", accessoriesPrice);
  // console.log("glassPrice", glassPrice);
  // console.log("cylinderPrice ", cylinderPrice);
  // console.log("extraCylinderPrice", extraCylinderPrice);
  // console.log("lockAccessoryPrice ", lockAccessoryPrice);
  // console.log("handleNotePrice", handleNotePrice);
  // console.log("modelNotePrice", modelNotePrice);
  // console.log("typeNotePrice", typeNotePrice);
  // console.log("dimensionNotePrice ", dimensionNotePrice);
  // console.log("colorNotePrice", colorNotePrice);
  // console.log("hingeNotePrice", hingeNotePrice);
  // console.log("finishingNotePrice ", finishingNotePrice);
  // console.log("architraveNotePrice", architraveNotePrice);
  // console.log("thresholdNotePrice", thresholdNotePrice);
  // console.log("lockNotePrice", lockNotePrice);
  // console.log("extraLockNotePrice ", extraLockNotePrice);
  // console.log("accessoryNotePrice", accessoryNotePrice);
  // console.log("glassNotePrice", glassNotePrice);

  price =
    doorModelPrice +
    bulletproofModelPrice +
    dimensionsPrice +
    exploitationPrice +
    doorTypePrice +
    doorColorPrice +
    hingesPrice +
    hingesCapsPrice +
    hingeAccessoriesPrice +
    electricStrikePrice +
    finishingsPrice +
    architravesPrice +
    thresholdPrice +
    lockPrice +
    extraLockPrice +
    handlePrice +
    accessoriesPrice +
    glassPrice +
    cylinderPrice +
    extraCylinderPrice +
    lockAccessoryPrice +
    handleNotePrice +
    modelNotePrice +
    typeNotePrice +
    dimensionNotePrice +
    colorNotePrice +
    hingeNotePrice +
    finishingNotePrice +
    architraveNotePrice +
    thresholdNotePrice +
    lockNotePrice +
    extraLockNotePrice +
    accessoryNotePrice +
    glassNotePrice;

  return price.toFixed(2);
};
