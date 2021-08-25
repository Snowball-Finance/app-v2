import { memo } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { AccordionDetails } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%'
  },
}));

const Accordion = withStyles({
  root: {
    boxShadow: '0 4px 24px 0 rgb(34 41 47 / 10%)',
    borderRadius: '10px !important',
  },
})(MuiAccordion);

const AccordionSummary = withStyles({
  expandIcon: {
    transform: 'none !important',
  },
})(MuiAccordionSummary);

const CustomAccordion = ({
  className,
  style,
  summary,
  details,
  expandMoreIcon,
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} style={style}>
      <Accordion defaultExpanded={false}>
        <AccordionSummary
          expandIcon={expandMoreIcon || <ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          {summary}
        </AccordionSummary>
        <AccordionDetails>{details}</AccordionDetails>
      </Accordion>
    </div>
  );
};

export default memo(CustomAccordion);
