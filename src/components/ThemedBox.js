import { Box, useColorMode } from '@chakra-ui/react';

const ThemedBox = ({
  light = 'RGB(17, 66, 189)',
  dark = 'RGB(17, 66, 189)',
  children,
  ...rest
}) => {
  const { colorMode } = useColorMode();
  return (
    <Box backgroundColor={colorMode === 'light' ? light : dark} {...rest}>
      {children}
    </Box>
  );
};

export default ThemedBox;
