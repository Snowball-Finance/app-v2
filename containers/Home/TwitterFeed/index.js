import { memo, useEffect } from "react";
import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  twitterFeed: {
    width: "100%",
    backgroundColor: theme.palette.background.primary,
    minHeight: "30vh",

    "& a": {
      textDecoration: "none",
      color: theme.palette.primary.main,
      fontSize: 20,
      marginTop: 40,
      marginLeft: 20
    },
  },
}));

const TwitterFeed = () => {
  const classes = useStyles();

  useEffect(() => {
    const anchor = document.createElement("a");
    anchor.setAttribute("class", "twitter-timeline");
    anchor.setAttribute("data-theme", "dark");
    anchor.setAttribute("data-chrome", "transparent");
    anchor.setAttribute("href", "https://twitter.com/snowballdefi");
    anchor.innerHTML = "Loading...";
    document.getElementsByClassName("twitter-embed")[0].appendChild(anchor);

    const script = document.createElement("script");
    script.setAttribute("src", "https://platform.twitter.com/widgets.js");
    document.getElementsByClassName("twitter-embed")[0].appendChild(script);
  }, []);

  return (
    <Card className={classes.twitterFeed}>
      <div className="twitter-embed"></div>
    </Card>
  );
};

export default memo(TwitterFeed);
