import {
  Box,
  Flex,
  HStack,
  IconButton,
  Tag,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiHeart } from 'react-icons/fi';
import React from 'react';
import catgBox from '.././styles/catgBox.module.css';

function CategoriesBox() {
  return (
    <div>
      <div className={catgBox.box}>
        <Box>
          <HStack spacing="170px">
            <Tag>Sample Tag</Tag>
            <p className={catgBox.threads}>Threads - 1,234 </p>
          </HStack>
          <Box mt={10}>
            <p>Lets disucss what's happening around the world of politics.</p>
          </Box>
          <Box mt={4}>
            <p className={catgBox.tags}>Similar TAGS</p>
            <Wrap spacing={3} mt={1}>
              <WrapItem>
                <Tag colorScheme="purple">world politics</Tag>
              </WrapItem>
              <WrapItem>
                <Tag colorScheme="blue">human rights</Tag>
              </WrapItem>
              <WrapItem>
                <Tag colorScheme="green">trump</Tag>
              </WrapItem>
              <WrapItem>
                <Tag colorScheme="yellow">climate change</Tag>
              </WrapItem>
              <WrapItem>
                <Tag colorScheme="red">foreign policy</Tag>
              </WrapItem>
            </Wrap>
          </Box>
          <Box as="p" mt={5}>
            <IconButton>
              <FiHeart />
            </IconButton>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default CategoriesBox;
