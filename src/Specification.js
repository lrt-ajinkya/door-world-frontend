import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as mySpecActions from "./actions/mySpecificationsActions";
import * as appActions from "./actions/appActions";
import { useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import PrintIcon from "@material-ui/icons/Print";
import GridIcon from "@material-ui/icons/GridOn";

import specificationService from "./services/specificationService";

import { useSelector, useDispatch } from "react-redux";
import PriceTable from "./components/PriceTable";
import TotalPrice from "./components/TotalPrice";

import {
  calculateDoorTypePrice,
  getDimensionsPrice,
  getPanelFinishingPrice,
} from "./common/totalPriceUtil";

import apiCalls from "./common/apiCalls";

import _ from "lodash";
import PriceContext, { getPrice, getMillingPrice } from "./providers/price";
import TranslationsContext from "./providers/translation";

const useStyles = makeStyles((theme) => ({
  nonPrintable: {
    "@media print": {
      display: "none",
    },
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: "700",
  },
  title: {
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650,
    marginTop: 50,
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    marginTop: 48,
    marginBottom: 48,
  },
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    },
    "@media print": {
      height: "auto",
      overflow: "visible",
      display: "block",
      "page-break-after": "auto",
      marginTop: 0,
      padding: 0,
      "box-shadow": "none",
    },
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    "@media print": {
      height: "auto",
      overflow: "visible",
      display: "block",
      "page-break-after": "auto",
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

export default function Specification(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  const [toggleMargins, setToggleMargins] = useState(false);
  const [productionPrinting, setProductionPrinting] = useState(null);
  const [excelLoading, setExcelLoading] = useState(false);

  const spec = useSelector((state) => state.mySpecs.specification);

  const { id } = useParams();
  const [specification, setSpecification] = useState(null);
  const [specificationLoading, setSpecificationLoading] = useState(true);

  const [selectedLogo, setSelectedLogo] = useState(null);

  useEffect(() => {
    const loadSpecification = async () => {
      try {
        setSpecificationLoading(true);
        const data = await specificationService.getById(id);
        const remappedData = {...data.specification, id: data.id, createdBy: data.createdBy};
        setSpecification(remappedData);
      } catch (error) {
        console.error('Failed to load specification:', error);
      } finally {
        setSpecificationLoading(false);
      }
    };

    if (id) {
      loadSpecification();
    }
  }, [id]);

  useEffect(() => {
    if (!specificationLoading && specification) {
      dispatch(mySpecActions.setSpecification(specification));

      if (specification?.selectedPrice?.id) {
        dispatch(appActions.setSelectedUser(specification.selectedPrice.id));
      }

      if (props.user?.selected_logo) {
        setSelectedLogo(props.user.selected_logo);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specificationLoading, specification, props.user?.selected_logo]);

  const renderPanelDimensionsText = (doorTypePrice) => {
    const { height, totalWidth } = specification;
    if (doorTypePrice.position === "side") {
      return `${doorTypePrice.name} ${doorTypePrice.dimensions} x ${height} MM`;
    } else if (doorTypePrice.position === "top") {
      return `${doorTypePrice.name} ${totalWidth} x ${doorTypePrice.dimensions} MM`;
    }
  };

  const getExploitaitionConditionsName = () => {
    const { exploitation, doorTypePrices } = specification;

    if (exploitation.id === "exterior") {
      if (doorTypePrices.length > 0) {
        return `${exploitation.name}: ${exploitation.prices.double_leaf.name}`;
      }
      // if (doorTypePrices.some((price) => price.isPassive)) {
      //   return `${exploitation.name}: ${exploitation.prices.double_leaf.name}`;
      // }
      return `${exploitation.name}: ${exploitation.prices.single_leaf.name}`;
    }
    return exploitation.name;
  };

  const getExploitationConditionsPrice = () => {
    const { exploitation, doorTypePrices } = specification;

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

  const getDoorModelBody = () => {
    const {
      doorModel,
      bulletproofModel,
      doorType,
      width,
      height,
      doorTypePrices,
      doorColor,
      modelNote,
      typeNote,
      dimensionNote,
      colorNote,
    } = specification;

    let doorModelRows = [];

    const doorModelType =
      doorType.name === "1"
        ? ""
        : ` with ${doorType.description.toLowerCase()} (No. ${doorType.name})`;

    const doorModelRow = {
      name: `${doorModel.name}${doorModelType}`,
      quantity: 0,
      price: 0,
      bold: true,
    };

    doorModelRows.push(doorModelRow);

    if (bulletproofModel && bulletproofModel?.id !== "None") {
      const bulletproofRow = {
        name: `${bulletproofModel.name}`,
        quantity: 0,
        price: bulletproofModel?.price?.[doorModel?.key] || 0,
        bold: true,
      };

      doorModelRows.push(bulletproofRow);
    }

    if (modelNote?.note) {
      const noteRow = {
        name: `${modelNote.note}`,
        quantity: 0,
        price: modelNote?.price || 0,
        bold: true,
      };

      doorModelRows.push(noteRow);
    }

    if (typeNote?.note) {
      const noteRow = {
        name: `${typeNote.note}`,
        quantity: 0,
        price: typeNote?.price || 0,
        bold: true,
      };

      doorModelRows.push(noteRow);
    }

    const dimensionsPrice =
      getDimensionsPrice(doorModel, height, width, p) +
      getPrice("model", "door_types", doorModel, p);

    const doorSizeRow = {
      name: `Main door ${width} x ${height} MM`,
      quantity: 0,
      price: dimensionsPrice,
    };

    doorModelRows.push(doorSizeRow);

    if (dimensionNote?.note) {
      const noteRow = {
        name: `${dimensionNote.note}`,
        quantity: 0,
        price: dimensionNote?.price || 0,
        bold: true,
      };

      doorModelRows.push(noteRow);
    }

    const doorPanelRows = doorTypePrices.map((doorTypePrice) => {
      const price = calculateDoorTypePrice(
        [doorTypePrice],
        getPrice("model", "door_types", doorModel, p),
        doorType,
        doorModel,
        width,
        height,
        p
      );
      return {
        name: renderPanelDimensionsText(doorTypePrice),
        quantity: 0,
        price,
      };
    });

    doorPanelRows.forEach((row) => doorModelRows.push(row));

    const exploitationConditionsRow = {
      name: `${getExploitaitionConditionsName()} ${t[
        "exploitation"
      ].toLowerCase()}`,
      quantity: 0,
      price: getExploitationConditionsPrice(),
    };

    doorModelRows.push(exploitationConditionsRow);

    const doorColorRow = {
      name: `${t["metal_construction_color"]} ${doorColor.ral}`,
      quantity: 0,
      price: doorColor?.price || 0,
    };

    doorModelRows.push(doorColorRow);

    if (colorNote?.note) {
      const noteRow = {
        name: `${colorNote.note}`,
        quantity: 0,
        price: colorNote?.price || 0,
        bold: true,
      };

      doorModelRows.push(noteRow);
    }

    return {
      name: "Door",
      rows: [...doorModelRows],
    };
  };

  const getHingePrice = (hinge) => {
    return Number(getPrice("hinges", "hinges", hinge, p));
  };

  const getHingesCapsPrice = () => {
    const { hingeCaps, hingeCapFinishing, hinges } = specification;

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
            Number(getPrice("hinges", "hinge_caps", hinge, p))
        );
      }, 0)
    );
  };

  const getHingesBody = () => {
    const {
      hinges,
      hingeCaps,
      hingeCapFinishing,
      hingeNote,
      hingeAccessories,
    } = specification;

    let hingeRows = hinges.map((hinge) => {
      return {
        name: `${hinge.name} ${hinge?.hinge?.name} hinges`,
        quantity: hinge?.hinge?.quantity,
        price: getHingePrice(hinge.hinge),
      };
    });

    let hingeCapsRow = [];

    if (hingeCaps.caps) {
      hingeCapsRow.push({
        name: `With ${hingeCapFinishing[0].name} caps`,
        quantity: 0,
        price: getHingesCapsPrice(),
      });
    }

    let hingeAccessoriesRows =
      hingeAccessories?.map((hinge) => {
        return {
          name: hinge.name,
          quantity: Number(hinge?.quantity) || 1,
          price: getPrice("hinges", "hinge_accessories", hinge, p),
        };
      }) || [];

    if (hingeNote?.note) {
      const noteRow = {
        name: `${hingeNote.note}`,
        quantity: 0,
        price: hingeNote?.price || 0,
        bold: true,
      };

      hingeRows.push(noteRow);
    }

    return {
      name: "Hinges",
      rows: [...hingeRows, ...hingeCapsRow, ...hingeAccessoriesRows],
    };
  };

  const getColorName = (colorType, color) => {
    if (!colorType || !color) return null;

    if (colorType === "ral") {
      return `${color.English} ${color.RAL}`;
    }

    if (colorType === "pvc") {
      return `${color.name}`;
    }

    if (colorType === "ral_all") {
      return `${color.English} ${color.RAL}`;
    }

    if (colorType === "ral_and_stained") {
      return `${color.name}`;
    }
  };

  const getFinishingRows = (finishing, doorType) => {
    let finishingRow = [];
    if (finishing) {
      finishingRow = [
        {
          name: `${finishing.name} ${t["finishing"].toLowerCase()}`,
          quantity: 0,
          price: Number(getPanelFinishingPrice(finishing, doorType, p)),
          bold: true,
        },
      ];
    }

    let millingRow = [];
    if (finishing.milling && finishing.milling.name !== "None") {
      millingRow = [
        {
          name: `${finishing.milling.name}`,
          quantity: 1,
          price: getMillingPrice(
            "finishing",
            "millings",
            finishing.millings,
            finishing.milling,
            p
          ),
        },
      ];
    }

    let carvingRow = [];
    if (finishing.carving && finishing.carving.name !== "None") {
      carvingRow = [
        {
          name: `${finishing.carving.name}`,
          quantity: 1,
          price: 0,
        },
      ];
    }

    let colorRow = [];
    if (finishing.color) {
      colorRow = [
        {
          name: `${getColorName(finishing?.colors, finishing?.color)}`,
          quantity: 0,
          price: 0,
        },
      ];
    }

    if (finishing.customColorRadio) {
      colorRow = [
        {
          name: `${finishing.name} ${t["custom"].toLowerCase()} ${t[
            "color"
          ].toLowerCase()}: ${finishing.customColor}`,
          quantity: 0,
          price: finishing.customColorPrice || 0,
        },
      ];
    }

    return [...finishingRow, ...colorRow, ...carvingRow, ...millingRow];
  };

  const getFinishingsExteriorBody = () => {
    const { finishings, doorType } = specification;

    const externalFinishingRow = finishings.external.map((finishing, index) =>
      getFinishingRows(finishing, doorType, index)
    );

    return {
      name: "Finishing exterior",
      rows: [...externalFinishingRow.flat()],
    };
  };

  const getFinishingsInteriorBody = () => {
    const { finishings, finishingNote, doorType } = specification;

    let internalFinishingRow = finishings.internal.map((finishing, index) =>
      getFinishingRows(finishing, doorType, index)
    );

    if (finishingNote?.note) {
      const noteRow = {
        name: `${finishingNote.note}`,
        quantity: 0,
        price: finishingNote?.price || 0,
        bold: true,
      };

      internalFinishingRow.push(noteRow);
    }

    return {
      name: "Finishing interior",
      rows: [...internalFinishingRow.flat()],
    };
  };

  const getArchitravesColorName = (colorType, color) => {
    if (!colorType || !color) return "";

    if (colorType.toLowerCase() === "ral") {
      return `${color.English} ${color.RAL}`;
    }

    if (colorType.toLowerCase() === "pvc") {
      return `${color.name}`;
    }

    if (colorType.toLowerCase() === "ral_all") {
      return `${color.English} ${color.RAL}`;
    }

    if (colorType.toLowerCase() === "ral_and_stained") {
      return `${color.name}`;
    }

    if (colorType.toLowerCase() === "wrb") {
      return `${color.name}`;
    }
  };

  const getArchitravesBody = () => {
    const { architraves, architraveNote, doorType } = specification;

    let architraveRows = [];

    if (architraves.hingeSide && architraves?.hingeSide?.name !== "None") {
      architraveRows.push({
        name: `${t["hinge_side"]}: ${
          architraves.hingeSide.name
        } ${getArchitravesColorName(
          architraves?.hingeSide?.colors,
          architraves?.hingeSide?.color
        )}`,
        quantity: 0,
        price: getPrice(
          "architraves",
          "architraves",
          architraves.hingeSide,
          p,
          architraves?.hingeSide?.double && doorType.double
        ),
      });
    }

    if (
      architraves.oppositeSide &&
      architraves?.oppositeSide?.name !== "None"
    ) {
      architraveRows.push({
        name: `${t["opposite_side"]}: ${
          architraves.oppositeSide.name
        } ${getArchitravesColorName(
          architraves?.oppositeSide?.colors,
          architraves?.oppositeSide?.color
        )}`,
        quantity: 0,
        price: getPrice(
          "architraves",
          "architraves",
          architraves.oppositeSide,
          p,
          architraves?.oppositeSide?.double && doorType.double
        ),
      });
    }

    if (architraveNote?.note) {
      const noteRow = {
        name: `${architraveNote.note}`,
        quantity: 0,
        price: architraveNote?.price || 0,
        bold: true,
      };

      architraveRows.push(noteRow);
    }

    return {
      name: "Architraves",
      rows: [...architraveRows],
    };
  };

  const getThresholdBody = () => {
    const { threshold, thresholdMultiplier, thresholdNote } = specification;

    let thresholdRows = [];

    if (threshold?.selected_options?.length) {
      const rows = threshold.selected_options.map((option, index) => {
        const price = Number(
          thresholdMultiplier > 1 && option.alt_price
            ? getPrice("thresholds", "thresholds", option, p, true)
            : getPrice("thresholds", "thresholds", option, p)
        );
        return {
          name:
            thresholdMultiplier > 1 && option.double_leaf_name
              ? option.double_leaf_name
              : option.name,
          quantity: 1,
          price: option.alt_price ? price : Number(price * thresholdMultiplier),
        };
      });

      thresholdRows = [...rows];
    }

    if (threshold.option) {
      const price = Number(
        thresholdMultiplier > 1 && threshold.option.alt_price
          ? getPrice("thresholds", "thresholds", threshold.option, p, true)
          : getPrice("thresholds", "thresholds", threshold.option, p)
      );
      thresholdRows.push({
        name: `${threshold.name}, ${threshold.option.name}`,
        quantity: 1,
        price: threshold.option.alt_price
          ? price
          : Number(price * thresholdMultiplier),
      });
    }

    if (threshold.name !== "None") {
      thresholdRows.push({
        name: threshold.name,
        quantity: 1,
        price: Number(
          getPrice("thresholds", "thresholds", threshold, p) *
            thresholdMultiplier
        ),
      });
    }

    if (thresholdNote?.note) {
      const noteRow = {
        name: `${thresholdNote.note}`,
        quantity: 0,
        price: thresholdNote?.price || 0,
        bold: true,
      };

      thresholdRows.push(noteRow);
    }

    return {
      name: "Thresholds",
      rows: [...thresholdRows],
    };
  };

  const getQuantity = (accessory) => {
    if (accessory.quantifiable) {
      return accessory?.quantity || 1;
    }
    return 0;
  };

  const getMainLockBody = () => {
    const {
      mainLock,
      mainLockAccessories,
      electricStrike,
      cylinder,
      extraLock,
      lockNote,
      extraLockNote,
      extraCylinder,
    } = specification;

    let mainLockRows = [];

    mainLockRows.push({
      name: mainLock.set
        ? `${mainLock.maker} ${mainLock.set} ${mainLock.name}`
        : `${mainLock.maker} ${mainLock.name}`,
      quantity: 1,
      price: getPrice("locks", mainLock.collection, mainLock, p),
    });

    if (mainLockAccessories.length > 0) {
      const rows = mainLockAccessories
        .filter((accessory) => accessory?.umbrella !== "packing")
        .map((accessory) => {
          return {
            name: `${t["lock_accessory"]}: ${accessory.name}`,
            quantity: getQuantity(accessory),
            price: accessory.quantifiable
              ? (accessory?.quantity || 1) *
                getPrice("locks", accessory.collection, accessory, p)
              : getPrice("locks", accessory.collection, accessory, p),
          };
        });

      mainLockRows = [...mainLockRows, ...rows];
    }

    if (electricStrike) {
      mainLockRows.push({
        name: `${t["electric_strike"]}: ${electricStrike.name}`,
        quantity: 0,
        price: getPrice("locks", "electric_strikes", electricStrike, p),
      });
    }

    if (cylinder.name !== "None") {
      mainLockRows.push({
        name: `${t["cylinder"]}: ${cylinder.name}`,
        quantity: 0,
        price: getPrice("locks", "cylinders", cylinder, p),
      });
    }

    if (extraLock?.name !== "None") {
      mainLockRows.push({
        name: extraLock?.name || "",
        quantity: 0,
        price: getPrice("extra_locks", "extra_locks", extraLock, p),
      });
    }

    if (extraCylinder && extraCylinder?.name !== "None") {
      mainLockRows.push({
        name: `${t["extra_cylinder"]}: ${extraCylinder?.name}`,
        quantity: 0,
        price: getPrice("extra_locks", "extra_cylinders", extraCylinder, p),
      });
    }

    if (lockNote?.note) {
      const noteRow = {
        name: `${lockNote.note}`,
        quantity: 0,
        price: lockNote?.price || 0,
        bold: true,
      };

      mainLockRows.push(noteRow);
    }

    if (extraLockNote?.note) {
      const noteRow = {
        name: `${extraLockNote.note}`,
        quantity: 0,
        price: extraLockNote?.price || 0,
        bold: true,
      };

      mainLockRows.push(noteRow);
    }

    return {
      name: "Locks",
      rows: [...mainLockRows],
    };
  };

  const getHandleBody = () => {
    const { handle, handleNote } = specification;

    let handleRows = [];
    let dividePriceBy = 1;

    if (
      handle?.interior?.set &&
      handle?.exterior?.set &&
      handle?.interior?.id === handle?.exterior?.id
    ) {
      dividePriceBy = 2;
    }

    if (handle?.interior?.name !== "None") {
      handleRows.push({
        name: `${t["interior_handle"]} ${handle.interior.name}`,
        quantity: 1,
        price: Number(
          getPrice("handles", "handles", handle.interior, p) / dividePriceBy
        ),
      });
    }

    if (handle?.exterior?.name !== "None") {
      handleRows.push({
        name: `${t["exterior_handle"]} ${handle.exterior.name}`,
        quantity: 1,
        price:
          getPrice("handles", "handles", handle.exterior, p) / dividePriceBy,
      });
    }

    if (handleNote?.note) {
      handleRows.push({
        name: `${handleNote.note}`,
        quantity: 0,
        price: Number(handleNote?.price) || 0,
        bold: true,
      });
    }

    return {
      name: "Handles",
      rows: [...handleRows],
    };
  };

  const getAccessoriesBody = () => {
    const { accessories, accessoryNote } = specification;

    let accessoriesRows = [];

    if (accessories.length) {
      const rows = accessories
        .filter((accessory) => accessory?.umbrella !== "packing")
        .map((accessory) => {
          return {
            name: `${
              accessory.group === "eyespot"
                ? `Eyespot ${accessory.name}`
                : accessory.name
            }`,
            quantity: Number(accessory?.quantity || 1),
            price:
              Number(accessory?.quantity || 1) *
              getPrice("accessories", "other_accessories", accessory, p),
          };
        });

      accessoriesRows = [...rows];
    }

    if (accessoryNote?.note) {
      const noteRow = {
        name: `${accessoryNote.note}`,
        quantity: 0,
        price: accessoryNote?.price || 0,
        bold: true,
      };

      accessoriesRows.push(noteRow);
    }

    return {
      name: "Accessories",
      rows: [...accessoriesRows],
    };
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

  const getGlassBody = () => {
    const { glass, doorModel, glassNote } = specification;

    let glassRows = [];

    if (glass.some((item) => item.glass.length > 0)) {
      const rows = glass.map((item, index) => {
        let rows = [
          {
            name: item.isPanel
              ? `${t["glass"]} ${item.name}`
              : `${t["glass"]} ${item.name} (Carving ${item.carving.name})`,
            quantity: 0,
            price: 0,
          },
        ];
        if (item.glass.length) {
          item.glass.map((thing, indexA) => {
            rows.push({
              name: `GLASS ${indexA + 1}`,
              quantity: 0,
              price: 0,
            });

            if (thing.glassPack.id === "GLASS_ADDON_TYPE_2") {
              rows.push({
                name: thing.glassShape.name,
                quantity: 0,
                price: Number(
                  thing.glassShape.price[getDoorModelKey(doorModel.key)]
                ),
              });

              if (thing.glassFilm.id !== "FILM0") {
                rows.push({
                  name: thing.glassFilm.name,
                  quantity: 0,
                  price: Number(thing.glassFilm.price[thing.glassShape.id]),
                });
              }

              if (thing.glassAddon.id !== "ADDON0") {
                rows.push({
                  name: thing.glassAddon.name,
                  quantity: 0,
                  price: Number(thing.glassAddon.price[thing.glassShape.id]),
                });
              }
            } else if (thing.glassPack.id === "GLASS_ADDON_TYPE_3") {
              rows.push({
                name: `${thing.glassBulletproofSize.name} ${thing.glassBulletproofType.name}`,
                quantity: 0,
                price: Number(
                  thing.glassBulletproofType.price[
                    getDoorModelKey(doorModel.key)
                  ]
                ),
              });

              if (
                thing?.glassBulletproofAddon &&
                thing?.glassBulletproofAddon?.id !== "ADDON0"
              ) {
                rows.push({
                  name: `${thing?.glassBulletproofAddon?.name}`,
                  quantity: 0,
                  price: Number(
                    thing.glassBulletproofAddon.price[
                      thing.glassBulletproofSize.id
                    ]
                  ),
                });
              }
            } else if (thing.glassPack.id === "GLASS_ADDON_TYPE_4") {
              rows.push({
                name: thing.glassShape.name,
                quantity: 0,
                price: Number(
                  thing.glassShape.price[
                    `${getDoorModelKey(doorModel.key)}_thick`
                  ]
                ),
              });

              if (thing.glassFilm.id !== "FILM0") {
                rows.push({
                  name: thing.glassFilm.name,
                  quantity: 0,
                  price: Number(thing.glassFilm.price[thing.glassShape.id]),
                });
              }

              if (thing.glassAddon.id !== "ADDON0") {
                rows.push({
                  name: thing.glassAddon.name,
                  quantity: 0,
                  price: Number(thing.glassAddon.price[thing.glassShape.id]),
                });
              }
            }
          });
        }
        return rows;
      });
      glassRows = rows.flat();
    }

    if (glassNote?.note) {
      const noteRow = {
        name: `${glassNote.note}`,
        quantity: 0,
        price: glassNote?.price || 0,
        bold: true,
      };

      glassRows.push(noteRow);
    }

    return {
      name: "Glass",
      rows: [...glassRows],
    };
  };

  const getPackingBody = () => {
    const { accessories } = specification;

    let packingRows = accessories
      .filter((accessory) => accessory?.umbrella === "packing")
      .map((accessory) => {
        return {
          name: accessory.name,
          quantity: 0,
          price: getPrice("accessories", "other_accessories", accessory, p),
        };
      });

    return {
      name: "Packing",
      rows: [...packingRows],
    };
  };

  const getNotesBody = () => {
    const { note } = specification;

    let noteRows = [];

    if (note) {
      noteRows.push({
        name: note,
        quantity: 0,
        price: 0,
      });
    }

    return {
      name: "Note",
      rows: [...noteRows],
    };
  };

  const getHeightAndWidthText = () => {
    const { totalHeight, totalWidth } = specification;
    return `${t["height_of_frame"]}: ${totalHeight}mm, ${t[
      "width_of_frame"
    ].toLowerCase()}: ${totalWidth}mm`;
  };

  const getHingeType = () => {
    const { hingeType } = specification;
    return hingeType.key;
  };

  const downloadExcel = () => {
    setExcelLoading(true);

    const doorCategory = getDoorModelBody();
    const hingesCategory = getHingesBody();
    const exteriorFinishingsCategory = getFinishingsExteriorBody();
    const interiorFinishingsCategory = getFinishingsInteriorBody();
    const architravesCategory = getArchitravesBody();
    const thresholdCategory = getThresholdBody();
    const mainLockCategory = getMainLockBody();
    const handleCategory = getHandleBody();
    const accessoriesCategory = getAccessoriesBody();
    const glassCategory = getGlassBody();
    const packingCategory = getPackingBody();
    const notesCategory = getNotesBody();

    const categories = [
      doorCategory,
      hingesCategory,
      exteriorFinishingsCategory,
      interiorFinishingsCategory,
      architravesCategory,
      thresholdCategory,
      mainLockCategory,
      handleCategory,
      accessoriesCategory,
      glassCategory,
      packingCategory,
      notesCategory,
    ];

    const filteredCategories = categories.filter(
      (category) => category.rows.length > 0
    );

    const body = {
      name: specification.name,
      heightAndWidth: getHeightAndWidthText(),
      hingeType: getHingeType(),
      categories: filteredCategories,
    };

    console.log(body);

    apiCalls
      .downloadExcel(body)
      .then((data) => {
        console.log(data);
      })
      .finally(() => {
        setExcelLoading(false);
      });
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        <a id="hiddenDownload" />
        <PriceTable
          state={spec}
          canEditNote={false}
          toggleMargins={toggleMargins}
          selectedLogo={selectedLogo}
          productionPrinting={productionPrinting}
        />
        <TotalPrice spec={spec} toggleMargins={toggleMargins} />

        {/* <Button
          className={classes.nonPrintable}
          variant="contained"
          color="primary"
          onClick={() => setToggleMargins(!toggleMargins)}
        >
          {toggleMargins ? t['margins_on'] : t['margins_off']}
        </Button> */}

        <Button
          className={classes.nonPrintable}
          variant="contained"
          color={!productionPrinting ? "primary" : "secondary"}
          onClick={() => {
            setProductionPrinting(true);
            window.print();
          }}
          style={{ marginLeft: 8 }}
        >
          <PrintIcon fontSize="small" style={{ marginRight: 5 }} />{" "}
          {t["print_for_production"]}
        </Button>

        <Button
          className={classes.nonPrintable}
          variant="contained"
          color={productionPrinting ? "primary" : "secondary"}
          onClick={() => {
            setProductionPrinting(false);
            window.print();
          }}
          style={{ marginLeft: 8 }}
        >
          <PrintIcon fontSize="small" style={{ marginRight: 5 }} /> {t["print"]}
        </Button>

        <Button
          className={classes.nonPrintable}
          variant="contained"
          color={productionPrinting ? "primary" : "secondary"}
          onClick={() => {
            downloadExcel();
          }}
          style={{ marginLeft: 8 }}
        >
          <GridIcon fontSize="small" style={{ marginRight: 5 }} /> {t["excel"]}
        </Button>
      </React.Fragment>
    );
  };

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          {specificationLoading || _.isEmpty(spec)
            ? renderSpinner()
            : renderContent()}
        </Paper>
      </main>
    </React.Fragment>
  );
}
