import { memo, Children } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
// import ExpandMoreIcon as ExpandMoreIconDefault  from '@material-ui/icons/ExpandMore';
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
}));

const Accordion = withStyles({
  root: {
    boxShadow: "0 4px 24px 0 rgb(34 41 47 / 10%)",
    borderRadius: "10px !important",
  },
})(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    backgroundColor: theme.palette.background.primary,
  },
  expandIcon: {
    transform: "none !important",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.primary,
  },
}))(MuiAccordionDetails);

const CustomAccordion = memo(({ className, style, onChanged, children }) => {
  const classes = useStyles();
  const expandMoreIcon = Children.map(children, (child) => {
    return child?.type?.type.displayName === "ExpandMoreIcon" ? child : null;
  });
  const summary = Children.map(children, (child) => {
    return child?.type?.type.displayName === "Summary" ? child : null;
  });

  const details = Children.map(children, (child) => {
    return child?.type?.type.displayName === "Details" ? child : null;
  });

  return (
    <div className={clsx(classes.root, className)} style={style}>
      <Accordion
        TransitionProps={{ mountOnEnter: true }}
        defaultExpanded={false}
        onChange={onChanged}
      >
        <AccordionSummary
          expandIcon={expandMoreIcon}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          {summary}
        </AccordionSummary>
        <AccordionDetails>{details}</AccordionDetails>
      </Accordion>
    </div>
  );
});

const ExpandMoreIcon = ({ children }) => children;
ExpandMoreIcon.displayName = "ExpandMoreIcon";
CustomAccordion.ExpandMoreIcon = memo(ExpandMoreIcon);

const Details = ({ children }) => children;
Details.displayName = "Details";
CustomAccordion.Details = memo(Details);

const Summary = ({ children }) => children;
Summary.displayName = "Summary";
CustomAccordion.Summary = memo(Summary);

export default CustomAccordion;
