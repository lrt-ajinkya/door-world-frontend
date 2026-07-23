import React, { useEffect, useRef, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Stepper from "@material-ui/core/Stepper";
import StepButton from "@material-ui/core/StepButton";
import Step from "@material-ui/core/Step";
import Typography from "@material-ui/core/Typography";
import Dimensions from "./Dimensions";
import Price from "./Price";
import DoorModel from "./DoorModel";
import DoorType from "./DoorType";
import Accessories from "./Accessories";
import Locks from "./Locks";
import ExtraLocks from "./ExtraLocks";
import Finishing from "./Finishing";
import Handles from "./Handles";
import Glass from "./Glass";
import DoorColor from "./DoorColor";
import Hinges from "./Hinges";
import Architraves from "./Architraves";
import Thresholds from "./Thresholds";
import CircularProgress from "@material-ui/core/CircularProgress";
import userService from "./services/userService";
import { setActiveStep, setMargins } from "./actions/newSpecificationActions";
import TranslationsContext from "./providers/translation";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1, 0, 2),
      flexWrap: "nowrap",
      overflowX: "scroll",
      marginBottom: 12,
    },
  },
  stepperBackgroundColor: {
    backgroundColor: "transparent",
  },
  step: {
    padding: theme.spacing(1, 1, 1, 1),
  },
  contentWrapper: {},
}));

function getStepContent(step, user, isAdmin, users) {
  switch (step) {
    case 0:
      return <DoorModel isAdmin={isAdmin} users={users} />;
    case 1:
      return <DoorType isAdmin={isAdmin} users={users} />;
    case 2:
      return <Dimensions isAdmin={isAdmin} users={users} />;
    case 3:
      return <DoorColor isAdmin={isAdmin} users={users} />;
    case 4:
      return <Hinges isAdmin={isAdmin} users={users} />;
    case 5:
      return <Finishing isAdmin={isAdmin} users={users} />;
    case 6:
      return <Architraves isAdmin={isAdmin} users={users} />;
    case 7:
      return <Thresholds isAdmin={isAdmin} users={users} />;
    case 8:
      return <Locks isAdmin={isAdmin} users={users} />;
    case 9:
      return <ExtraLocks isAdmin={isAdmin} users={users} />;
    case 10:
      return <Handles isAdmin={isAdmin} users={users} />;
    case 11:
      return <Accessories isAdmin={isAdmin} users={users} />;
    case 12:
      return <Glass isAdmin={isAdmin} users={users} />;
    case 13:
      return <Price user={user} isAdmin={isAdmin} users={users} />;
    default:
      throw new Error("Unknown step");
  }
}

export default function NewSpecification(props) {
  const { user, isAdmin } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const createdAt = useSelector((state) => state.newSpec.createdAt);
  const name = useSelector((state) => state.newSpec.name);
  const editMode = useSelector((state) => state.newSpec.editMode);
  const steps = useSelector((state) => state.newSpec.steps);
  const activeStep = useSelector((state) => state.newSpec.activeStep);
  const completed = useSelector((state) => state.newSpec.completed);
  const doorType = useSelector((state) => state.newSpec.doorType);

  const t = useContext(TranslationsContext);

  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setUserDataLoading(true);
        const data = await userService.getDetails(user.id);
        setUserData(data);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setUserDataLoading(false);
      }
    };

    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        const data = await userService.getAll();
        setUsers(data.users || data);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, []);

  const stepper = useRef(null);
  useEffect(() => {
    if (stepper.current) {
      const children = stepper.current.children;
      const doUntil = activeStep * 2 - 1;
      let totalWidth = 0;

      for (let i = 0; i < doUntil; i++) {
        totalWidth += children[i].offsetWidth;
      }
      stepper.current.scrollLeft = totalWidth;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  useEffect(() => {
    if (!userDataLoading && userData) {
      dispatch(setMargins(userData.price || {}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDataLoading]);

  const isAllCompleted = () => {
    return completed
      .filter((item) => item.name !== "Price")
      .every((item) => item.completed);
  };

  const handleStep = (index) => {
    if (index === 13 && isAllCompleted()) {
      dispatch(setActiveStep(index));
    } else {
      if (
        index === 2 ||
        index === 4 ||
        index === 5 ||
        index === 7 ||
        index === 6 ||
        index === 12
      ) {
        if (doorType) {
          dispatch(setActiveStep(index));
        }
      } else if (index !== 13) {
        dispatch(setActiveStep(index));
      }
    }
  };

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <main className={classes.layout}>
        {editMode ? (
          <Typography
            variant="h4"
            align="left"
            gutterBottom
            style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
          >
            {name ? `${name}` : `${t["editing"]}`}{" "}
            {createdAt?.seconds
              ? `${moment(createdAt.seconds * 1000).format("DD-MM-YYYY")}`
              : ""}
          </Typography>
        ) : null}

        <Typography
          variant="h4"
          align="left"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          {t[steps[activeStep]]}
        </Typography>

        <Stepper
          ref={stepper}
          nonLinear
          activeStep={activeStep}
          className={classes.stepper}
          classes={{
            root: classes.stepperBackgroundColor,
          }}
        >
          {steps.map((label, index) => (
            <Step key={label} className={classes.step}>
              <StepButton
                onClick={() => handleStep(index)}
                completed={completed[index].completed}
              >
                {t[label]}
              </StepButton>
            </Step>
          ))}
        </Stepper>

        <div className={classes.contentWrapper}>
          {getStepContent(activeStep, user, isAdmin, users)}
        </div>
      </main>
    );
  };

  return (
    <React.Fragment>
      {userDataLoading || usersLoading ? renderSpinner() : renderContent()}
    </React.Fragment>
  );
}
