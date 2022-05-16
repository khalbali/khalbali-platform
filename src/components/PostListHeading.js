import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Thead, Tr, Th, TableContainer } from '@chakra-ui/react';
import '.././styles/postHeader.module.css';
function PostListHeading() {
  return (
    <div>
      <TableContainer>
        <Table variant="unstyled" size="lg">
          <Thead>
            <Tr>
              <Th width={4000}>Topic</Th>
              <Th width={500}>Category</Th>
              <Th>Likes</Th>
              <Th>Replies</Th>
              <Th>Views</Th>
              <Th>Activity</Th>
            </Tr>
          </Thead>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PostListHeading;
