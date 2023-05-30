import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const GradientHeader: React.FC = () => {
  return (
    <LinearGradient
      colors={['#7f3ef3', '#3e21c4']}
      style={{ height: '100%', width: '100%' }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  );
};

export default GradientHeader;
