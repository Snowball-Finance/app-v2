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

const AccordionSummary = withStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  expandIcon: {
    transform: 'none !important',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
}))(MuiAccordionSummary);

const CustomAccordion = ({
  className,
  style,
  summary,
  details,
  expandMoreIcon,
  onChanged
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} style={style}>
      <Accordion defaultExpanded={false} onChange={onChanged}>
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
