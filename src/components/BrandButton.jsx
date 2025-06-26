import React from "react";
import Button from "@mui/material/Button";

/** Floricode-roze primair (`#ff0238`) + wit tekst  */
const FLORICODE = {
  main:  "#ff0238",
  dark:  "#c3002b",
  light: "#ff4d70",
  contrastText: "#ffffff",
};

/** Reusable button that picks up MUI’s `sx` prop  */
export default function BrandButton({ children, ...props }) {
  return (
    <Button
      variant="contained"
      disableElevation
      sx={{
        textTransform: "none",
        fontWeight: 500,
        bgcolor: FLORICODE.main,
        "&:hover": { bgcolor: FLORICODE.dark },
        "&:disabled": { bgcolor: FLORICODE.light },
        ...props.sx        // allow overrides
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
