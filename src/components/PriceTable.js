import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";

import doorComponentsService from "../services/doorComponentsService";

import Grid from "@material-ui/core/Grid";
import {
  calculateDoorTypePrice,
  getDimensionsPrice,
  getPanelFinishingPrice,
} from "../common/totalPriceUtil";

import * as newSpecActions from "../actions/newSpecificationActions";

import TranslationsContext from "../providers/translation";
import PriceContext, { getPrice, getMillingPrice } from "../providers/price";

import "../Table.css";
import { getImageUrl } from "../utils/imageUtils";

import _ from "lodash";
import hex from "ral-to-hex";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  priceCell: {
    width: 110,
  },
  hingeText: {
    textAlign: "center",
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
    "page-break-after": "auto",
  },
  tableContainer: {
    "@media print": {
      height: "100%",
      overflow: "visible",
      "page-break-after": "auto",
    },
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.tableHoverColor,
    },
    "@media print": {
      "page-break-inside": "avoid",
      "page-break-after": "auto",
    },
  },
  basicHeaderText: {
    color: "#e31e24",
    "@media print": {
      color: "#000000",
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
  basicSubHeaderText: {
    color: "#e31e24",
    "@media print": {
      color: "#000000",
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
  marginRightPrint: {
    "@media print": {
      marginRight: "8px",
    },
  },
  quantityCell: {
    width: 110,
    textAlign: "center",
  },
  noDisplay: {
    display: "none",
  },
  colorSquare: {
    width: 20,
    height: 20,
    marginLeft: 8,
    "@media print": {
      width: 10,
      height: 10,
    },
  },
  imageSquare: {
    height: 20,
    marginLeft: 8,
    "@media print": {
      height: 10,
    },
  },
}));

const useProductionStyles = makeStyles((theme) => ({
  noPrint: {
    "@media print": {
      display: "none",
    },
  },
  noPrintPrice: {
    "@media print": {
      display: "none",
    },
    width: 110,
  },
  onlyPrint: {
    "@media print": {
      display: "flex",
    },
    display: "none",
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
    "&:hover": {
      backgroundColor: theme.palette.tableHoverColor,
    },
    "& th": {
      "@media print": {
        borderBottom: "1px solid black",
      },
    },
    "& td": {
      "@media print": {
        borderBottom: "1px solid black",
      },
    },
    "& tr": {
      "@media print": {
        borderBottom: "1px solid black",
      },
    },
    padding: "4px",
  },
}))(TableRow);

export default function Price(props) {
  const dispatch = useDispatch();
  const {
    doorModel,
    bulletproofModel,
    exploitation,
    hingeType,
    height,
    width,
    totalHeight,
    totalWidth,
    finishings,
    mainLock,
    extraLock,
    accessories,
    doorType,
    doorTypePrices,
    doorColor,
    hinges,
    hingeCaps,
    hingeCapFinishing,
    hingeAccessories,
    architraves,
    handle,
    threshold,
    thresholdMultiplier,
    cylinder,
    extraCylinder,
    glass,
    electricStrike,
    mainLockAccessories,
    note,
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
    handleNote,
    accessoryNote,
    glassNote,
  } = props.state;

  const { canEditNote, selectedLogo, productionPrinting } = props;

  const language = useSelector((state) => state.navigation.language);
  const spec = useSelector((state) => state.mySpecs.specification);

  const [hingeTypes, setHingeTypes] = useState([]);
  const [hingeTypesLoading, setHingeTypesLoading] = useState(true);

  const getPvcColors = (finishings) => {
    const internal = finishings.internal
      .filter((finishing) => finishing?.color?.color_type === "pvc")
      .map((finishing) => ({
        id: finishing.color.id,
        image: finishing?.color?.image,
      }));

    const external = finishings.external
      .filter((finishing) => finishing?.color?.color_type === "pvc")
      .map((finishing) => ({
        id: finishing.color.id,
        image: finishing?.color?.image,
      }));

    return _.uniqBy([...internal, ...external], "id");
  };

  const getStainedColors = (finishings) => {
    const internal = finishings.internal
      .filter((finishing) => finishing?.color?.color_type === "wrb")
      .map((finishing) => ({
        id: finishing.color.id,
        image: finishing.color.image,
      }));

    const external = finishings.external
      .filter((finishing) => finishing?.color?.color_type === "wrb")
      .map((finishing) => ({
        id: finishing.color.id,
        image: finishing.color.image,
      }));

    return _.uniqBy([...internal, ...external], "id");
  };

  useEffect(() => {
    const loadHingeTypes = async () => {
      try {
        setHingeTypesLoading(true);
        const data = await doorComponentsService.getDoorOpenings();
        setHingeTypes(data);
      } catch (error) {
        console.error('Failed to load hinge types:', error);
      } finally {
        setHingeTypesLoading(false);
      }
    };
    
    loadHingeTypes();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  const classes = useStyles();
  const productionClasses = useProductionStyles();


  const renderRal = (color) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <span>
          {color.English} {color.RAL}
        </span>
        <div
          className={classes.colorSquare}
          style={{ boxShadow: `inset 0 0 0 1000px ${color.HEX}` }}
        />
      </div>
    );
  };

  const renderPvc = (color) => {
    return (
      <React.Fragment>
        {color.name}{" "}
        {color.image ? (
          <img
            alt="PVC"
            src={getImageUrl(color.image)}
            width="auto"
            className={classes.imageSquare}
          />
        ) : null}
      </React.Fragment>
    );
  };

  const renderRalAndStained = (color) => {
    if (color.image) {
      return (
        <React.Fragment>
          {color.name}{" "}
          <img
            alt="Stained"
            src={getImageUrl(color.image)}
            width="auto"
            className={classes.imageSquare}
          />
        </React.Fragment>
      );
    }

    if (!color.HEX) return null;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <span>
          {` ${color.English}`} {color.RAL}
        </span>
        <div
          className={classes.colorSquare}
          style={{ boxShadow: `inset 0 0 0 1000px ${color.HEX}` }}
        />
      </div>
    );
  };

  const renderColor = (colorType, color) => {
    if (!colorType || !color) return null;

    if (colorType === "ral") {
      return renderRal(color);
    }

    if (colorType === "pvc") {
      return renderPvc(color);
    }

    if (colorType === "ral_all") {
      return renderRal(color);
    }

    if (colorType === "ral_and_stained") {
      return renderRalAndStained(color);
    }
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

  const renderFinishing = (finishing, index) => {
    let millingRow = () => null;
    let carvingRow = () => null;
    let finishingRow = () => null;
    let colorRow = () => null;

    if (finishing) {
      finishingRow = () => (
        <StyledTableRow>
          <TableCell component="th" scope="row">
            <b>
              {finishing.doorTypePrice[language] ||
                finishing.doorTypePrice.name}
            </b>{" "}
            {finishing[language] || finishing.name}{" "}
            {t["finishing"].toLowerCase()}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}>
            {1}
          </TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {getPanelFinishingPrice(finishing, doorType, p)} EUR
          </TableCell>
        </StyledTableRow>
      );
    }

    if (finishing.milling && finishing.milling.name !== "None") {
      millingRow = () => (
        <StyledTableRow>
          <TableCell component="th" scope="row">
            {finishing.milling.name}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}>
            {1}
          </TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {getMillingPrice(
              "finishing",
              "millings",
              finishing.millings,
              finishing.milling,
              p
            )}{" "}
            EUR
          </TableCell>
        </StyledTableRow>
      );
    }

    if (finishing.carving && finishing.carving.name !== "None") {
      carvingRow = () => (
        <StyledTableRow>
          <TableCell component="th" scope="row">
            {finishing.carving.name}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}>
            {1}
          </TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          ></TableCell>
        </StyledTableRow>
      );
    }

    if (finishing.color) {
      colorRow = () => (
        <StyledTableRow>
          <TableCell component="th" scope="row" style={{ display: "flex" }}>
            {renderColor(finishing?.colors, finishing?.color)}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}></TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          ></TableCell>
        </StyledTableRow>
      );
    }

    if (finishing.customColorRadio) {
      colorRow = () => (
        <StyledTableRow>
          <TableCell component="th" scope="row">
            {finishing.name} {t["custom"].toLowerCase()}{" "}
            {t["color"].toLowerCase()}: {` ${finishing.customColor}`}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}></TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {finishing.customColorPrice || "0"} EUR
          </TableCell>
        </StyledTableRow>
      );
    }

    return (
      <React.Fragment key={`${finishing.key}${index}`}>
        {finishingRow()}
        {colorRow()}
        {carvingRow()}
        {millingRow()}
      </React.Fragment>
    );
  };

  const renderDoorTypeForProduction = () => {
    return (
      <Grid
        item
        xs={2}
        // className={
        //   productionPrinting ? productionClasses.onlyPrint : classes.noDisplay
        // }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {doorType.image ? (
            <img
              alt="Door type"
              src={getImageUrl(doorType.image)}
              style={{
                marginRight: "5px",
                objectFit: "cover",
                maxHeight: "80px",
              }}
            />
          ) : null}
          {`${doorType.description} (No. ${doorType.name})`}
        </div>
      </Grid>
    );
  };

  const renderLogo = () => {
    if (selectedLogo && selectedLogo.id !== "none") {
      return (
        <Grid item xs={2}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
              height: "80px",
            }}
          >
            <img
              alt="Logo"
              align="right"
              src={selectedLogo.image}
              style={{
                float: "right",
                marginRight: "5px",
                marginBottom: "4px",
                objectFit: "cover",
                width: "100%",
                maxWidth: "250px",
              }}
            />
          </div>
        </Grid>
      );
    }
  };

  const renderHingeType = () => {
    return (
      <Grid
        item
        xs={1}
        className={productionPrinting ? productionClasses.noPrint : ""}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className={classes.marginRightPrint}
        >
          {hingeType.image ? (
            <img
              alt="Hinge type"
              src={getImageUrl(hingeType.image)}
              width="60px"
              height="auto"
              style={{ marginRight: "5px", marginBottom: "4px" }}
            />
          ) : null}
        </div>
      </Grid>
    );
  };

  const renderName = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="h6" align="left">
          {_.isEmpty(spec)
            ? `${t["specification"]}`
            : `${t["specification"]} ${spec.name} ${moment(
                spec.createdAt.seconds * 1000
              ).format("DD-MM-YYYY")}`}
        </Typography>
      </Grid>
    );
  };

  const renderDimensions = () => {
    return (
      <Grid item xs={12}>
        {t["height_of_frame"]}: <b>{totalHeight}mm</b>,{" "}
        {t["width_of_frame"].toLowerCase()}: <b>{totalWidth}mm</b>
      </Grid>
    );
  };

  const renderHingeTypeText = () => {
    return (
      <Grid
        item
        xs={12}
        className={productionPrinting ? productionClasses.noPrint : ""}
      >
        {hingeType.name}
      </Grid>
    );
  };

  const getHingePrice = (hinge) => {
    return Number(getPrice("hinges", "hinges", hinge, p));
  };

  const renderHinge = (hinge) => {
    return (
      <StyledTableRow key={hinge.id}>
        <TableCell component="th" scope="row">
          {hinge.name} {hinge?.hinge?.name} hinges
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {getHingePrice(hinge.hinge)} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderHingeCaps = () => {
    const hingeCapPrice = getHingesCapsPrice();
    if (!hingeCaps.caps) {
      return null;
    }

    return (
      <StyledTableRow key={hingeCaps.id}>
        <TableCell component="th" scope="row">
          {hingeCaps.caps
            ? `With ${hingeCapFinishing[0].name} caps`
            : "Without caps"}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {hingeCapPrice} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const getHingesCapsPrice = () => {
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

  const getColorName = (colorType, color) => {
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

  const getColorHex = (colorType, color) => {
    if (!colorType || !color) return null;

    if (colorType.toLowerCase() === "ral") {
      return color.HEX;
    }

    if (colorType.toLowerCase() === "pvc") {
      return null;
    }

    if (colorType.toLowerCase() === "ral_all") {
      console.log(color);
      return color.HEX;
    }

    if (colorType.toLowerCase() === "ral_and_stained") {
      return null;
    }

    if (colorType.toLowerCase() === "wrb") {
      return null;
    }
  };

  const getArchitravesRow = (text, actualHex) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <span>{text}</span>
        {actualHex ? (
          <div
            className={classes.colorSquare}
            style={{
              boxShadow: `inset 0 0 0 1000px ${actualHex}`,
              marginRight: 8,
            }}
          />
        ) : null}
      </div>
    );
  };

  const renderArchitraves = () => {
    let fragments = [];

    if (architraves.hingeSide && architraves?.hingeSide?.name !== "None") {
      fragments.push(
        <React.Fragment key="hingeSideArchitrave">
          <StyledTableRow key={architraves.hingeSide.id}>
            <TableCell component="th" scope="row">
              {getArchitravesRow(
                `${t["hinge_side"]}: ${architraves.hingeSide.name}${" "}
            ${getColorName(
              architraves?.hingeSide?.colors,
              architraves?.hingeSide?.color
            )}
              `,
                getColorHex(
                  architraves?.hingeSide?.colors,
                  architraves?.hingeSide?.color
                )
              )}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell
              align="right"
              className={classes.quantityCell}
            ></TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {getPrice("architraves", "architraves", architraves.hingeSide, p)}{" "}
              EUR
            </TableCell>
          </StyledTableRow>
        </React.Fragment>
      );
    }

    if (
      architraves.oppositeSide &&
      architraves?.oppositeSide?.name !== "None"
    ) {
      fragments.push(
        <React.Fragment key="oppositeSideArchitrave">
          <StyledTableRow key={architraves.oppositeSide.id}>
            <TableCell component="th" scope="row">
              {getArchitravesRow(
                `${t["opposite_side"]}: ${architraves.oppositeSide.name}${" "}
            ${getColorName(
              architraves?.oppositeSide?.colors,
              architraves?.oppositeSide?.color
            )}
              `,
                getColorHex(
                  architraves?.oppositeSide?.colors,
                  architraves?.oppositeSide?.color
                )
              )}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell
              align="right"
              className={classes.quantityCell}
            ></TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {getPrice(
                "architraves",
                "architraves",
                architraves.oppositeSide,
                p
              )}{" "}
              EUR
            </TableCell>
          </StyledTableRow>
        </React.Fragment>
      );
    }

    return fragments;
  };

  const renderHandles = () => {
    let dividePriceBy = 1;
    if (
      handle?.interior?.set &&
      handle?.exterior?.set &&
      handle?.interior?.id === handle?.exterior?.id
    ) {
      dividePriceBy = 2;
    }

    const interior =
      handle?.interior?.name === "None" ? null : (
        <StyledTableRow key="handleInterior">
          <TableCell component="th" scope="row">
            {`${t["interior_handle"]} ${handle.interior.name}`}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}>
            {1}
          </TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {getPrice("handles", "handles", handle.interior, p) / dividePriceBy}{" "}
            EUR
          </TableCell>
        </StyledTableRow>
      );

    const exterior =
      handle?.exterior?.name === "None" ? null : (
        <StyledTableRow key="handleExterior">
          <TableCell component="th" scope="row">
            {`${t["exterior_handle"]} ${handle.exterior.name}`}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}>
            {1}
          </TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {getPrice("handles", "handles", handle.exterior, p) / dividePriceBy}{" "}
            EUR
          </TableCell>
        </StyledTableRow>
      );

    return (
      <React.Fragment>
        {interior}
        {exterior}
      </React.Fragment>
    );
  };

  const renderThresholds = () => {
    let threshRows = [];

    if (threshold?.selected_options) {
      threshold.selected_options.forEach((option, index) => {
        const price = Number(
          thresholdMultiplier > 1 && option.alt_price
            ? getPrice("thresholds", "thresholds", option, p, true)
            : getPrice("thresholds", "thresholds", option, p)
        );
        threshRows.push(
          <React.Fragment key="thresholdOptions" key={`${option.id}${index}`}>
            <StyledTableRow>
              <TableCell>
                {thresholdMultiplier > 1 && option.double_leaf_name
                  ? option.double_leaf_name
                  : option.name}
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right" className={classes.quantityCell}>
                {1}
              </TableCell>
              <TableCell
                align="right"
                className={
                  productionPrinting
                    ? productionClasses.noPrintPrice
                    : classes.priceCell
                }
              >
                {price} EUR
              </TableCell>
            </StyledTableRow>
          </React.Fragment>
        );
      });
    }

    if (threshold.option) {
      const price = Number(
        thresholdMultiplier > 1 && threshold.option.alt_price
          ? getPrice("thresholds", "thresholds", threshold.option, p, true)
          : getPrice("thresholds", "thresholds", threshold.option, p)
      );
      threshRows.push(
        <React.Fragment>
          <StyledTableRow key="thresholdOption">
            <TableCell>{`${threshold.name}, ${threshold.option.name}`}</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right" className={classes.quantityCell}>
              {1}
            </TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {price} EUR
            </TableCell>
          </StyledTableRow>
        </React.Fragment>
      );
    }

    threshRows.push(
      <React.Fragment>
        <StyledTableRow key="thresholds">
          <TableCell>{threshold.name}</TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}></TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {getPrice("thresholds", "thresholds", threshold, p) *
              thresholdMultiplier}{" "}
            EUR
          </TableCell>
        </StyledTableRow>
      </React.Fragment>
    );

    return threshRows;
  };

  const renderHinges = () => {
    return hinges.map((hinge) => renderHinge(hinge));
  };

  const renderGlass = () => {
    if (glass.some((item) => item.glass.length > 0)) {
      return (
        <React.Fragment>
          {glass.map((item, index) => renderGlassRow(item, index))}
          {renderSectionNote(glassNote)}
        </React.Fragment>
      );
    }
    if (glassNote?.note) {
      return (
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {renderBasicHeader(t["glass"])}
              {renderSectionNote(glassNote)}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      return (
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <StyledTableRow>
                <TableCell component="th" scope="row">
                  {t["glass"]} {t["none"]}
                </TableCell>
                <TableCell align="right"></TableCell>
                <TableCell
                  align="right"
                  className={classes.quantityCell}
                ></TableCell>
                <TableCell
                  align="right"
                  className={
                    productionPrinting
                      ? productionClasses.noPrintPrice
                      : classes.priceCell
                  }
                >
                  0 EUR
                </TableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  const renderGlazing = (thing) => {
    return (
      <React.Fragment>
        <StyledTableRow>
          <TableCell component="th" scope="row">
            {thing.glassShape.name}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}></TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {Number(thing.glassShape.price[getDoorModelKey(doorModel.key)])} EUR
          </TableCell>
        </StyledTableRow>

        {thing.glassFilm.id !== "FILM0" ? (
          <StyledTableRow>
            <TableCell component="th" scope="row">
              {thing.glassFilm.name}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell
              align="right"
              className={classes.quantityCell}
            ></TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {Number(thing.glassFilm.price[thing.glassShape.id])} EUR
            </TableCell>
          </StyledTableRow>
        ) : null}

        {thing.glassAddon.id !== "ADDON0" ? (
          <StyledTableRow>
            <TableCell component="th" scope="row">
              {thing.glassAddon.name}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell
              align="right"
              className={classes.quantityCell}
            ></TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {Number(thing.glassAddon.price[thing.glassShape.id])} EUR
            </TableCell>
          </StyledTableRow>
        ) : null}
      </React.Fragment>
    );
  };

  const renderBulletproof = (thing) => {
    return (
      <React.Fragment>
        <StyledTableRow>
          <TableCell component="th" scope="row">
            {thing.glassBulletproofSize.name} {thing.glassBulletproofType.name}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}></TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {Number(
              thing.glassBulletproofType.price[getDoorModelKey(doorModel.key)]
            )}{" "}
            EUR
          </TableCell>
        </StyledTableRow>

        {thing?.glassBulletproofAddon &&
        thing?.glassBulletproofAddon?.id !== "ADDON0" ? (
          <StyledTableRow>
            <TableCell component="th" scope="row">
              {thing?.glassBulletproofAddon?.name}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell
              align="right"
              className={classes.quantityCell}
            ></TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {Number(
                thing.glassBulletproofAddon.price[
                  thing.glassBulletproofSize.id
                ]
              )}{" "}
              EUR
            </TableCell>
          </StyledTableRow>
        ) : null}
      </React.Fragment>
    );
  };

  const renderThick = (thing) => {
    return (
      <React.Fragment>
        <StyledTableRow>
          <TableCell component="th" scope="row">
            {thing.glassShape.name}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}></TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {Number(
              thing.glassShape.price[`${getDoorModelKey(doorModel.key)}_thick`]
            )}{" "}
            EUR
          </TableCell>
        </StyledTableRow>

        {thing.glassFilm.id !== "FILM0" ? (
          <StyledTableRow>
            <TableCell component="th" scope="row">
              {thing.glassFilm.name}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell
              align="right"
              className={classes.quantityCell}
            ></TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {Number(thing.glassFilm.price[thing.glassShape.id])} EUR
            </TableCell>
          </StyledTableRow>
        ) : null}

        {thing.glassAddon.id !== "ADDON0" ? (
          <StyledTableRow>
            <TableCell component="th" scope="row">
              {thing.glassAddon.name}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell
              align="right"
              className={classes.quantityCell}
            ></TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {Number(thing.glassAddon.price[thing.glassShape.id])} EUR
            </TableCell>
          </StyledTableRow>
        ) : null}
      </React.Fragment>
    );
  };

  const renderGlassRow = (item, index) => {
    if (item.glass.length) {
      const glassRows = item.glass.map((thing, indexA) => (
        <React.Fragment key={`${thing.id}${indexA}`}>
          {renderGlassHeader(`GLASS ${indexA + 1}`)}

          {thing.glassPack.id === "GLASS_ADDON_TYPE_2"
            ? renderGlazing(thing)
            : null}

          {thing.glassPack.id === "GLASS_ADDON_TYPE_3"
            ? renderBulletproof(thing)
            : null}

          {thing.glassPack.id === "GLASS_ADDON_TYPE_4"
            ? renderThick(thing)
            : null}
        </React.Fragment>
      ));
      const subHeaderName = item.isPanel
        ? `${t["glass"]} ${item.name}`
        : `${t["glass"]} ${item.name} (Carving ${item.carving.name})`;
      return (
        <React.Fragment key={`${item.id}${index}`}>
          <TableContainer className={classes.tableContainer}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                {renderSubHeader(subHeaderName)}
                {glassRows}
              </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>
      );
    }
  };

  const getDoorColor = (doorColor) => {
    let hexVal = "";

    try {
      hexVal = hex(doorColor.ral);
    } catch (e) {
      hexVal = "#ffffff";
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <span>{t["metal_construction_color"]}</span>
        <div
          className={classes.colorSquare}
          style={{ boxShadow: `inset 0 0 0 1000px ${hexVal}`, marginRight: 8 }}
        />
        <span>{doorColor.ral}</span>
      </div>
    );
  };

  const renderDoorColor = () => {
    return (
      <StyledTableRow key={doorColor.id}>
        <TableCell component="th" scope="row">
          {getDoorColor(doorColor)}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {Number(doorColor.price)} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderExtraLock = () => {
    if (extraLock.name === "None") return null;
    return (
      <StyledTableRow key={extraLock.id}>
        <TableCell component="th" scope="row">
          {extraLock.name}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {getPrice("extra_locks", "extra_locks", extraLock, p)} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderMainLock = () => {
    return (
      <StyledTableRow key={mainLock.id}>
        <TableCell component="th" scope="row">
          {mainLock.maker} <b>{mainLock.set}</b> {mainLock.name}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}>
          {1}
        </TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {getPrice("locks", mainLock.collection, mainLock, p)} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const getQuantity = (accessory) => {
    if (accessory.quantifiable) {
      return accessory?.quantity || 1;
    }
    return null;
  };

  const renderMainLockAccessories = () => {
    return mainLockAccessories.length > 0
      ? mainLockAccessories.map((accessory, index) => {
          if (accessory?.umbrella !== "packing") {
            return (
              <StyledTableRow key={`${accessory.id}${index}`}>
                <TableCell component="th" scope="row">
                  {t["lock_accessory"]}: {accessory.name}
                </TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right" className={classes.quantityCell}>
                  {getQuantity(accessory)}
                </TableCell>
                <TableCell
                  align="right"
                  className={
                    productionPrinting
                      ? productionClasses.noPrintPrice
                      : classes.priceCell
                  }
                >
                  {(accessory?.quantity || 1) *
                    getPrice("locks", accessory.collection, accessory, p)}{" "}
                  EUR
                </TableCell>
              </StyledTableRow>
            );
          } else {
            return null;
          }
        })
      : null;
  };

  const renderElectricStrike = () => {
    if (!electricStrike) return null;
    return (
      <StyledTableRow key={electricStrike.id}>
        <TableCell component="th" scope="row">
          {t["electric_strike"]}: {electricStrike.name}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {getPrice("locks", "electric_strikes", electricStrike, p)} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderCylinder = () => {
    if (cylinder.name === "None") return null;
    return (
      <StyledTableRow key={`cylinder${cylinder.id}`}>
        <TableCell component="th" scope="row">
          {t["cylinder"]}: {cylinder.name}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {getPrice("locks", "cylinders", cylinder, p)} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderExtraCylinder = () => {
    if (extraCylinder && extraCylinder?.name === "None") return null;
    return (
      <StyledTableRow key={`extraCylinder${extraCylinder?.id}`}>
        <TableCell component="th" scope="row">
          {t["extra_cylinder"]}: {extraCylinder?.name}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {getPrice("extra_locks", "extra_cylinders", extraCylinder, p)} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderDoorModelType = () => {
    return doorType.name === "1"
      ? ""
      : ` with ${doorType.description.toLowerCase()} (No. ${doorType.name})`;
  };

  const renderDoorModel = () => {
    return (
      <React.Fragment>
        <StyledTableRow key={doorModel.id}>
          <TableCell component="th" scope="row">
            <b>{doorModel.name}</b>
            {renderDoorModelType()}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}></TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          ></TableCell>
        </StyledTableRow>
      </React.Fragment>
    );
  };

  const renderBulletproofModel = () => {
    if (!bulletproofModel || !bulletproofModel?.price?.[doorModel.key]) {
      return null;
    }

    return (
      <React.Fragment>
        <StyledTableRow key={bulletproofModel.id}>
          <TableCell component="th" scope="row">
            <b>{bulletproofModel.name}</b>
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}></TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {bulletproofModel?.price?.[doorModel.key]} EUR
          </TableCell>
        </StyledTableRow>
      </React.Fragment>
    );
  };

  const renderGlassHeader = (text) => {
    return (
      <StyledTableRow key={doorModel.id}>
        <TableCell component="th" scope="row">
          <b>{text}</b>
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        ></TableCell>
      </StyledTableRow>
    );
  };

  const getExploitationConditionsPrice = () => {
    if (exploitation?.id === "exterior") {
      if (doorTypePrices.length > 0) {
        return exploitation?.prices?.double_leaf?.price || 0;
      }
      // if (doorTypePrices.some((price) => price.isPassive)) {
      //   return exploitation.prices.double_leaf.price;
      // }
      return exploitation?.prices?.single_leaf?.price || 0;
    }
    return 0;
  };

  const getExploitaitionConditionsName = () => {
    if (exploitation?.id === "exterior") {
      if (doorTypePrices.length > 0) {
        return `${exploitation?.name}: ${exploitation?.prices?.double_leaf?.name}`;
      }
      // if (doorTypePrices.some((price) => price.isPassive)) {
      //   return `${exploitation.name}: ${exploitation.prices.double_leaf.name}`;
      // }
      return `${exploitation?.name}: ${exploitation?.prices?.single_leaf?.name}`;
    }
    return exploitation?.name;
  };

  const renderExploitationConditions = () => {
    return (
      <StyledTableRow key={exploitation?.id || "exploitation"}>
        <TableCell
          component="th"
          scope="row"
        >{`${getExploitaitionConditionsName()} ${t[
          "exploitation"
        ].toLowerCase()}`}</TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {getExploitationConditionsPrice()} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderPanelDimensionsText = (doorTypePrice) => {
    if (doorTypePrice.position === "side") {
      return `${doorTypePrice.name} ${doorTypePrice.dimensions} x ${height} MM`;
    } else if (doorTypePrice.position === "top") {
      return `${doorTypePrice.name} ${totalWidth} x ${doorTypePrice.dimensions} MM`;
    }
  };

  const renderPanelDimensions = () => {
    return doorTypePrices.map((doorTypePrice, index) => {
      const price = calculateDoorTypePrice(
        [doorTypePrice],
        getPrice("model", "door_types", doorModel, p),
        doorType,
        doorModel,
        width,
        height,
        p
      );

      return (
        <StyledTableRow key={`${doorTypePrice.id}${index}`}>
          <TableCell component="th" scope="row">
            {renderPanelDimensionsText(doorTypePrice)}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right" className={classes.quantityCell}></TableCell>
          <TableCell
            align="right"
            className={
              productionPrinting
                ? productionClasses.noPrintPrice
                : classes.priceCell
            }
          >
            {price ? `${price} EUR` : ""}
          </TableCell>
        </StyledTableRow>
      );
    });
  };

  const renderDoorDimensions = (label = false) => {
    const dimensionsPrice =
      getDimensionsPrice(doorModel, height, width, p) +
      getPrice("model", "door_types", doorModel, p);
    return (
      <StyledTableRow>
        <TableCell component="th" scope="row">
          {label ? "Main door " : ""} {width} x {height} MM
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {dimensionsPrice} EUR
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderBasicHeader = (text) => {
    return (
      <StyledTableRow style={{ height: 70 }}>
        <TableCell component="th" scope="row" colSpan={4}>
          <Typography className={classes.basicHeaderText} variant="h6">
            {text}
          </Typography>
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderSubHeader = (text) => {
    return (
      <StyledTableRow style={{ height: 70 }}>
        <TableCell component="th" scope="row" colSpan={4}>
          <Typography className={classes.basicSubHeaderText} variant="h6">
            {text}
          </Typography>
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderAccessories = () => {
    return accessories.map((accessory) => {
      if (accessory?.umbrella !== "packing") {
        return (
          <StyledTableRow key={accessory.id}>
            <TableCell component="th" scope="row">
              {accessory.group === "eyespot"
                ? `Eyespot ${accessory.name}`
                : accessory.name}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right" className={classes.quantityCell}>
              {accessory.quantity || 1}
            </TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {Number(accessory?.quantity || 1) *
                getPrice("accessories", "other_accessories", accessory, p)}{" "}
              EUR
            </TableCell>
          </StyledTableRow>
        );
      } else {
        return null;
      }
    });
  };

  const renderHingeAccessories = () => {
    return (
      hingeAccessories?.map((accessory) => {
        return (
          <StyledTableRow key={accessory.id}>
            <TableCell component="th" scope="row">
              {accessory.name}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right" className={classes.quantityCell}>
              {accessory.quantity || 1}
            </TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {getPrice("hinges", "hinge_accessories", accessory, p)} EUR
            </TableCell>
          </StyledTableRow>
        );
      }) || null
    );
  };

  const renderPacking = () => {
    return accessories.map((accessory) => {
      if (accessory?.umbrella === "packing") {
        return (
          <StyledTableRow key={accessory.id}>
            <TableCell component="th" scope="row">
              {accessory.name}
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right" className={classes.quantityCell}>
              {1}
            </TableCell>
            <TableCell
              align="right"
              className={
                productionPrinting
                  ? productionClasses.noPrintPrice
                  : classes.priceCell
              }
            >
              {getPrice("accessories", "other_accessories", accessory, p)} EUR
            </TableCell>
          </StyledTableRow>
        );
      } else {
        return null;
      }
    });
  };

  const renderNote = () => {
    if (canEditNote) {
      return (
        <StyledTableRow>
          <TableCell component="th" scope="row">
            <TextField
              onClick={(e) => e.stopPropagation()}
              value={note}
              style={{ display: "flex" }}
              id="note"
              name="note"
              placeholder={t["note_placeholder"]}
              variant="outlined"
              multiline
              onChange={(e) => dispatch(newSpecActions.setNote(e.target.value))}
            />
          </TableCell>
        </StyledTableRow>
      );
    }

    if (note) {
      return (
        <StyledTableRow>
          <TableCell component="th" scope="row">
            {note}
          </TableCell>
        </StyledTableRow>
      );
    }
  };

  const renderSectionNote = (_note) => {
    return _note?.note ? (
      <StyledTableRow key={_note.note.replace(/ /g, "")}>
        <TableCell component="th" scope="row">
          {`${t["note"]}: ${_note?.note}`}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right" className={classes.quantityCell}></TableCell>
        <TableCell
          align="right"
          className={
            productionPrinting
              ? productionClasses.noPrintPrice
              : classes.priceCell
          }
        >
          {_note?.price || "0"} EUR
        </TableCell>
      </StyledTableRow>
    ) : null;
  };

  const renderHingeTypeForProduction = (hinge) => {
    return (
      <Grid
        key={hinge.id}
        item
        xs={3}
        className={
          productionPrinting ? productionClasses.onlyPrint : classes.noDisplay
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          {hinge.image ? (
            <img
              alt="Hinge"
              src={getImageUrl(hinge.image)}
              width="auto"
              height="120px"
              style={{ marginRight: "5px", marginBottom: "4px" }}
            />
          ) : null}
          <div style={{ textAlign: "center", fontSize: 14 }}>
            {t[hinge.key]}
          </div>
          {hingeType?.id === hinge.id ? (
            <div style={{ textAlign: "center" }}>
              <b>[X]</b>
            </div>
          ) : null}
        </div>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        style={{ marginBottom: 8 }}
      >
        {renderHingeType()}
        <Grid item xs={7}>
          {renderName()}
          {renderDimensions()}
          {renderHingeTypeText()}
        </Grid>
        {renderDoorTypeForProduction()}
        {renderLogo()}
      </Grid>

      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        style={{ marginBottom: 8 }}
      >
        {hingeTypes &&
          hingeTypes.map((hinge) => renderHingeTypeForProduction(hinge))}
      </Grid>

      {/* <TableContainer className={classes.tableContainer}>
                <Table className={classes.table} aria-label="simple table">
                <TableBody>
                    {renderBasicHeader(t['dimensions'])}

                </TableBody>
                </Table>
            </TableContainer> */}

      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {renderBasicHeader(t["door"])}
            {renderDoorModel()}
            {renderBulletproofModel()}
            {renderSectionNote(modelNote)}
            {renderSectionNote(typeNote)}
            {renderDoorDimensions(true)}
            {renderPanelDimensions()}
            {renderSectionNote(dimensionNote)}
            {renderExploitationConditions()}
            {renderDoorColor()}
            {renderSectionNote(colorNote)}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {renderBasicHeader(t["hinges"])}
            {renderHinges()}
            {renderHingeCaps()}
            {renderHingeAccessories()}
            {renderSectionNote(hingeNote)}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {renderBasicHeader(
              `${t["finishing"]} ${t["exterior"].toLowerCase()}`
            )}
            {finishings
              ? finishings.external.map((finishing, index) =>
                  renderFinishing(finishing, index)
                )
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {renderBasicHeader(
              `${t["finishing"]} ${t["interior"].toLowerCase()}`
            )}
            {finishings
              ? finishings.internal.map((finishing, index) =>
                  renderFinishing(finishing, index)
                )
              : null}
            {renderSectionNote(finishingNote)}
          </TableBody>
        </Table>
      </TableContainer>

      {architraves?.oppositeSide?.name === "None" &&
      architraves?.hingeSide?.name === "None" &&
      !architraveNote?.note ? null : (
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {renderBasicHeader(t["architraves"])}
              {renderArchitraves()}
              {renderSectionNote(architraveNote)}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {threshold.name === "None" &&
      !threshold?.selected_options?.length &&
      !thresholdNote?.note ? null : (
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {renderBasicHeader(t["thresholds"])}
              {renderThresholds()}
              {renderSectionNote(thresholdNote)}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {renderBasicHeader(t["locks"])}
            {renderMainLock()}
            {renderMainLockAccessories()}
            {renderSectionNote(lockNote)}
            {renderElectricStrike()}
            {renderCylinder()}
            {renderExtraLock()}
            {renderExtraCylinder()}
            {renderSectionNote(extraLockNote)}
          </TableBody>
        </Table>
      </TableContainer>

      {handle?.interior?.name === "None" &&
      handle?.exterior?.name === "None" &&
      !handleNote?.note ? null : (
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {renderBasicHeader(t["handles"])}
              {renderHandles()}
              {renderSectionNote(handleNote)}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!accessories?.length && !accessoryNote?.note ? null : (
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {renderBasicHeader(t["accessories"])}
              {renderAccessories()}
              {renderSectionNote(accessoryNote)}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {glass.some((item) => item.glass.length > 0) || glassNote?.note
        ? renderGlass()
        : null}

      {!accessories?.length ||
      !accessories.some(
        (accessory) => accessory?.umbrella === "packing"
      ) ? null : (
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {renderBasicHeader(t["packing"])}
              {renderPacking()}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {note || canEditNote ? (
        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {renderBasicHeader(t["note"])}
              {renderNote()}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </React.Fragment>
  );
}
