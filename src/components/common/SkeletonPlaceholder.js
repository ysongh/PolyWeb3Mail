import React from 'react';
import { Paper, Skeleton } from '@mui/material';

function SkeletonPlaceholder() {
  return (
    <div>
      {Array(11).fill(1).map((el, i) => (
        <Paper key={i} style={{ padding: '.5rem 1rem', marginBottom: '1rem'}}>
          <Skeleton variant="text" />
        </Paper>
      ))}
    </div>
  )
}

export default SkeletonPlaceholder;