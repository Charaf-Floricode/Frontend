import { motion } from "framer-motion";
import { Button } from "@mui/material";

/**
 * Een MUI Button die:
 *  – zelf geanimeerd is (geen extra wrapper nodig)
 *  – altijd z’n ronde vorm behoudt
 *  – duidelijke focus-ring toont (a11y)
 */
export default function BrandButton({ children, sx = {}, ...rest }) {
  return (
    <motion.div
      whileHover={{ boxShadow: "2px 6px 5px rgba(0,0,0,.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      style={{
        display: "inline-block",
        borderRadius: 50,
        overflow: "hidden",          // <── masker voorkomt rechthoek-flash
      }}
    >
      <Button
        disableElevation
        {...rest}
        sx={{
          borderRadius: 15,
          px: 4,
          py: 1.5,
          fontWeight: 600,
          background: "linear-gradient(90deg, #ff3862, #ffa1af)",
          color: "#fff",
          transition: "background 0.3s",
          "&:hover": {
            background: "linear-gradient(90deg, #ff3862, #ffa1af)",
          },
          // nette focus-ring die óók rond is
          "&:focus-visible": {
            outline: "1px solid rgba(0,207,255,.65)",
            outlineOffset: 0.5,
          },
          // plus eventuele extra sx-prop die je meegeeft
          ...sx,
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
}